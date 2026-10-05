import { ALLOWED_MIME, EXT_BY_MIME, MAX_FILE_BYTES, type AllowedMime } from "./config";
import { detectMimeFromBytes } from "./magic";
import { sanitizeSvg } from "./sanitize-svg";
import { scanFile } from "./scan";

export type ValidatedUpload = {
  bytes: Uint8Array;
  mime: AllowedMime;
  originalName: string;
  sizeBytes: number;
};

export type UploadValidationError =
  | "too_large"
  | "type_not_allowed"
  | "extension_mismatch"
  | "magic_mismatch"
  | "scan_failed"
  | "empty";

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export async function validateUpload(
  file: File,
): Promise<{ ok: true; data: ValidatedUpload } | { ok: false; error: UploadValidationError }> {
  if (file.size <= 0) return { ok: false, error: "empty" };
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: "too_large" };

  const declared = file.type as AllowedMime;
  if (!(ALLOWED_MIME as readonly string[]).includes(declared)) {
    return { ok: false, error: "type_not_allowed" };
  }

  const ext = extensionOf(file.name);
  if (!EXT_BY_MIME[declared].includes(ext)) {
    return { ok: false, error: "extension_mismatch" };
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const detected = detectMimeFromBytes(buffer);
  if (!detected || detected !== declared) {
    return { ok: false, error: "magic_mismatch" };
  }

  let bytes = buffer;
  if (declared === "image/svg+xml") {
    const text = new TextDecoder("utf-8").decode(buffer);
    bytes = new TextEncoder().encode(sanitizeSvg(text));
  }

  const scan = await scanFile(bytes, declared);
  if (!scan.clean) return { ok: false, error: "scan_failed" };

  return {
    ok: true,
    data: {
      bytes,
      mime: declared,
      originalName: file.name.slice(0, 200),
      sizeBytes: bytes.byteLength,
    },
  };
}
