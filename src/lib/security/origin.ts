import "server-only";

import { siteUrl } from "@/lib/site";

/** CSRF: Origin / Referer site köküne ait olmalı. */
export function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const allowed = new URL(siteUrl).origin;

  if (origin) return origin === allowed;

  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return new URL(referer).origin === allowed;
  } catch {
    return false;
  }
}
