import type { z } from "zod";
import type { imageSchema } from "../schema";

type ImageInput = z.input<typeof imageSchema>;

/** Gerçek görsel. */
export function img(src: string, tr: string, en: string): ImageInput {
  return { src, alt: { tr, en } };
}

/** Görsel henüz yok — arayüzde net işaretli placeholder gösterilir. TODO(content) */
export function placeholderImg(tr: string, en: string): ImageInput {
  return { src: null, alt: { tr, en } };
}

export const P = "/product-images";
