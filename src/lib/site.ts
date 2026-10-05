export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

export const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
