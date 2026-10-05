import type { AllowedMime } from "./config";

function startsWith(bytes: Uint8Array, sig: number[]): boolean {
  if (bytes.length < sig.length) return false;
  return sig.every((b, i) => bytes[i] === b);
}

/** Magic bytes + basit SVG/PDF başlık kontrolü. */
export function detectMimeFromBytes(bytes: Uint8Array): AllowedMime | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46])) return "application/pdf";

  const head = new TextDecoder("utf-8", { fatal: false })
    .decode(bytes.slice(0, 256))
    .trimStart()
    .toLowerCase();
  if (head.startsWith("<?xml") || head.startsWith("<svg")) return "image/svg+xml";

  return null;
}
