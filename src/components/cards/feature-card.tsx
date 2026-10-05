import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ContentImage } from "../site/content-image";

/** Görsel üzerine yazılı büyük kart (kategori ve kullanım alanı kartları). */
export function FeatureCard({
  title,
  text,
  href,
  ctaLabel,
  image,
  placeholderLabel,
  aspect = "aspect-[4/5]",
  sizes,
  className,
  headingLevel = "h3",
}: {
  title: string;
  text?: string;
  href: string;
  ctaLabel?: string;
  image: { src: string | null; alt: string };
  placeholderLabel: string;
  aspect?: string;
  sizes: string;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "group relative isolate overflow-hidden rounded-[1.75rem] bg-navy-900 text-cream-50",
        aspect,
        className,
      )}
    >
      <ContentImage
        image={image}
        sizes={sizes}
        placeholderLabel={placeholderLabel}
        className="-z-10 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/90 via-navy-950/35 to-transparent"
      />
      <div className="flex h-full flex-col justify-end p-6 sm:p-8">
        <Heading className="font-heading text-2xl font-medium sm:text-3xl">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {title}
          </Link>
        </Heading>
        {text ? (
          <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-cream-50/85">{text}</p>
        ) : null}
        {ctaLabel ? (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
            {ctaLabel}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        ) : null}
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-2 ring-transparent ring-inset group-has-[:focus-visible]:ring-gold-400"
      />
    </article>
  );
}
