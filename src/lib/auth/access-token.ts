export const ADMIN_USER_HEADER = "x-rdh-uid";

type Cookie = { name: string; value: string };

/** Supabase oturum çerezinden access token okur. İmza doğrulamaz. */
export function readAccessToken(cookies: Cookie[], supabaseUrl: string | undefined): string | null {
  if (!supabaseUrl) return null;

  let projectRef = "";
  try {
    projectRef = new URL(supabaseUrl).hostname.split(".")[0] ?? "";
  } catch {
    return null;
  }
  if (!projectRef) return null;

  const key = `sb-${projectRef}-auth-token`;
  const byName = new Map(cookies.map((cookie) => [cookie.name, cookie.value]));
  let raw = byName.get(key) ?? "";
  if (!raw) {
    const parts: string[] = [];
    for (let index = 0; ; index += 1) {
      const chunk = byName.get(`${key}.${index}`);
      if (!chunk) break;
      parts.push(chunk);
    }
    raw = parts.join("");
  }
  if (!raw) return null;

  let payload = raw;
  if (payload.startsWith("base64-")) {
    try {
      payload = Buffer.from(payload.slice("base64-".length), "base64url").toString("utf8");
    } catch {
      return null;
    }
  }

  try {
    const parsed = JSON.parse(payload) as { access_token?: unknown };
    return typeof parsed.access_token === "string" ? parsed.access_token : null;
  } catch {
    return null;
  }
}
