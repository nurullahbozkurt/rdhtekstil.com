import "server-only";

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

/**
 * Basit bellek içi rate limit (tek instance).
 * Üretimde birden fazla instance için Redis vb. adaptörle değiştirilebilir.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
} {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSec: Math.ceil(windowMs / 1000) };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    ok: true,
    remaining: limit - current.count,
    retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip")?.trim() || "unknown";
}
