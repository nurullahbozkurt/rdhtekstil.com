import "server-only";

import sharp from "sharp";
import type { AllowedMime } from "./config";
import type { ValidatedUpload } from "./validate";

export type UploadKind = "logo" | "reference" | "other";

const RASTER_MIME = new Set<AllowedMime>(["image/png", "image/jpeg", "image/webp"]);

type OptimizeProfile = {
  maxEdge: number;
  quality: number;
  alphaQuality: number;
};

function profileFor(kind: UploadKind): OptimizeProfile {
  // Logo: daha yüksek kalite / daha geniş kenar — üretim için kenar netliği önemli.
  // Referans/diğer: biraz daha agresif boyut düşürme.
  if (kind === "logo") {
    return { maxEdge: 3200, quality: 90, alphaQuality: 92 };
  }
  return { maxEdge: 2560, quality: 82, alphaQuality: 85 };
}

/**
 * Raster görselleri (PNG/JPEG/WebP) WebP'ye çevirir ve aşırı büyük boyutları küçültür.
 * PDF / SVG dokunulmaz. Çıktı daha büyükse orijinal korunur.
 */
export async function optimizeValidatedUpload(
  upload: ValidatedUpload,
  kind: UploadKind,
): Promise<ValidatedUpload> {
  if (!RASTER_MIME.has(upload.mime)) return upload;
  if (process.env.UPLOAD_OPTIMIZE === "false") return upload;

  const { maxEdge, quality, alphaQuality } = profileFor(kind);

  try {
    const input = Buffer.from(upload.bytes);
    const image = sharp(input, { failOn: "none", animated: false }).rotate();

    const optimized = await image
      .resize({
        width: maxEdge,
        height: maxEdge,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality,
        alphaQuality,
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer();

    if (optimized.byteLength >= upload.sizeBytes) {
      return upload;
    }

    return {
      bytes: new Uint8Array(optimized),
      mime: "image/webp",
      originalName: upload.originalName,
      sizeBytes: optimized.byteLength,
    };
  } catch {
    // Optimizasyon başarısız olursa talebi bozma; orijinali sakla.
    return upload;
  }
}
