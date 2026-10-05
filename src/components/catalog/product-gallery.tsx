"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ContentImage } from "../site/content-image";

export function ProductGallery({
  images,
  labels,
}: {
  images: { src: string | null; alt: string }[];
  labels: { previous: string; next: string; show: string; placeholder: string };
}) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  const multiple = images.length > 1;
  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  if (!current) return null;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-cream-200"
        onKeyDown={(event) => {
          if (!multiple) return;
          if (event.key === "ArrowRight") go(1);
          if (event.key === "ArrowLeft") go(-1);
        }}
      >
        <ContentImage
          key={current.src ?? index}
          image={current}
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholderLabel={labels.placeholder}
          preload={index === 0}
          quality={85}
        />
        {multiple ? (
          <div className="absolute inset-x-3 bottom-3 flex justify-between">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={labels.previous}
              className="flex size-11 items-center justify-center rounded-full bg-cream-50/95 text-navy-900 shadow-sm hover:bg-cream-50"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={labels.next}
              className="flex size-11 items-center justify-center rounded-full bg-cream-50/95 text-navy-900 shadow-sm hover:bg-cream-50"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
        ) : null}
      </div>
      {multiple ? (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, i) => (
            <li key={`${image.src}-${i}`}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${labels.show} ${i + 1}: ${image.alt}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-xl bg-cream-200 ring-2 ring-offset-2 ring-offset-cream-100 transition",
                  i === index ? "ring-navy-800" : "ring-transparent hover:ring-cream-400",
                )}
              >
                {image.src ? (
                  <Image src={image.src} alt="" fill sizes="120px" className="object-cover" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
