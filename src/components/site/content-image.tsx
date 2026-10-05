import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  image: { src: string | null; alt: string };
  /** Görselin sayfadaki genişliği (next/image `sizes`) */
  sizes: string;
  /** Görsel yokken gösterilen etiket */
  placeholderLabel: string;
  className?: string;
  preload?: boolean;
  quality?: number;
};

/**
 * İçerik katmanından gelen görseli `fill` modunda çizer; ebeveyn `relative` ve oran sınıfına sahip olmalıdır.
 * Görsel yoksa (`src: null`) net işaretli placeholder gösterir — TODO(content).
 */
export function ContentImage({
  image,
  sizes,
  placeholderLabel,
  className,
  preload,
  quality,
}: Props) {
  if (!image.src) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        data-placeholder="TODO(content)"
        className={cn(
          "bg-weave absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream-200 text-ink-600",
          className,
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-cream-50 shadow-sm">
          <ImageIcon aria-hidden className="size-5" />
        </span>
        <span className="rounded-full bg-cream-50/95 px-3 py-1 text-xs font-semibold tracking-wide">
          {placeholderLabel}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      preload={preload}
      quality={quality ?? 75}
      className={cn("object-cover", className)}
    />
  );
}
