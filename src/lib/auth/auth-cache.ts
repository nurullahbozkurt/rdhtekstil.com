import { createHash } from "node:crypto";

type CachedAuth = {
  userId: string;
  isAdmin: boolean;
  exp: number;
  at: number;
};

const TTL_MS = 60_000;
const REFRESH_WINDOW_MS = 60_000;
const cache = new Map<string, CachedAuth>();

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** Doğrulanmış oturumu kısa süre tutar; süresi dolmak üzere olan token'ı yenilemeye bırakır. */
export function readCachedAuth(token: string, now = Date.now()) {
  const key = hashToken(token);
  const hit = cache.get(key);
  if (!hit) return null;
  if (now - hit.at > TTL_MS || hit.exp * 1000 < now + REFRESH_WINDOW_MS) {
    cache.delete(key);
    return null;
  }
  return { userId: hit.userId, isAdmin: hit.isAdmin };
}

export function rememberAuth(
  token: string,
  value: { userId: string; isAdmin: boolean; exp: number },
  now = Date.now(),
) {
  if (!Number.isFinite(value.exp)) return;
  if (cache.size > 100) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(hashToken(token), { ...value, at: now });
}
