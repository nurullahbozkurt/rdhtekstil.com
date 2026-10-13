import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";
import { ADMIN_USER_HEADER, readAccessToken } from "@/lib/auth/access-token";
import { readCachedAuth, rememberAuth } from "@/lib/auth/auth-cache";

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag = "", q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0] ?? "", q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .find((entry) => (locales as readonly string[]).includes(entry.lang));

  return preferred && isLocale(preferred.lang) ? preferred.lang : defaultLocale;
}

type PendingCookie = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

type SessionGate = {
  userId: string | null;
  isAdmin: boolean;
  cookies: PendingCookie[];
};

function applyCookies(response: NextResponse, cookies: PendingCookie[]) {
  for (const cookie of cookies) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }
  return response;
}

function forward(request: NextRequest, userId: string | null, cookies: PendingCookie[]) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(ADMIN_USER_HEADER);
  if (userId) requestHeaders.set(ADMIN_USER_HEADER, userId);
  return applyCookies(NextResponse.next({ request: { headers: requestHeaders } }), cookies);
}

function redirectTo(request: NextRequest, pathname: string, cookies: PendingCookie[]) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return applyCookies(NextResponse.redirect(url), cookies);
}

function isAdminClaim(appMetadata: unknown) {
  if (!appMetadata || typeof appMetadata !== "object" || !("role" in appMetadata)) return false;
  return appMetadata.role === "admin";
}

async function resolveSession(request: NextRequest): Promise<SessionGate> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { userId: null, isAdmin: false, cookies: [] };

  const token = readAccessToken(request.cookies.getAll(), url);
  if (!token) return { userId: null, isAdmin: false, cookies: [] };

  const cached = readCachedAuth(token);
  if (cached) return { userId: cached.userId, isAdmin: cached.isAdmin, cookies: [] };

  const cookies: PendingCookie[] = [];
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookies.splice(0, cookies.length, ...cookiesToSet);
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = claims?.sub ?? null;
  if (error || !claims || !userId) return { userId: null, isAdmin: false, cookies };

  const isAdmin = isAdminClaim(claims.app_metadata);
  if (typeof claims.exp === "number") {
    rememberAuth(token, { userId, isAdmin, exp: claims.exp });
  }
  return { userId, isAdmin, cookies };
}

/** Dil yönlendirme + admin koruması + Supabase oturum yenileme. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") && !pathname.startsWith("/api/admin")) {
    return forward(request, null, []);
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const session = await resolveSession(request);
    const isApi = pathname.startsWith("/api/admin");
    const isLogin = pathname === "/admin/login" || pathname === "/admin/login/";
    const allowed = Boolean(session.userId && session.isAdmin);

    if (!isApi && !allowed && !isLogin) return redirectTo(request, "/admin/login", session.cookies);
    if (!isApi && allowed && isLogin) return redirectTo(request, "/admin", session.cookies);

    return forward(request, allowed ? session.userId : null, session.cookies);
  }

  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) {
    const session = await resolveSession(request);
    return forward(request, null, session.cookies);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
