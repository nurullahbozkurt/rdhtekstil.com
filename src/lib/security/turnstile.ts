import "server-only";

type TurnstileResult = { ok: true } | { ok: false; reason: string };

/**
 * Cloudflare Turnstile doğrulaması.
 * `TURNSTILE_SECRET_KEY` yoksa geliştirme ortamında geçilir (README'de belgelenir).
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, reason: "turnstile_not_configured" };
    }
    return { ok: true };
  }

  if (!token) return { ok: false, reason: "turnstile_missing" };

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) return { ok: false, reason: "turnstile_http" };

  const data = (await res.json()) as { success?: boolean };
  return data.success ? { ok: true } : { ok: false, reason: "turnstile_failed" };
}

export function getTurnstileSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined;
}
