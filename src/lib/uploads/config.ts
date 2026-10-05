export const MAX_FILE_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 10 * 1024 * 1024);
export const MAX_FILES_PER_REQUEST = Number(process.env.UPLOAD_MAX_FILES || 10);

export const ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
] as const;

export type AllowedMime = (typeof ALLOWED_MIME)[number];

export const EXT_BY_MIME: Record<AllowedMime, string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/webp": ["webp"],
  "image/svg+xml": ["svg"],
  "application/pdf": ["pdf"],
};

export const REQUEST_FILES_BUCKET = "request-files";
