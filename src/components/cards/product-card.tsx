import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContentImage } from "../site/content-image";

export type ProductCardData = {
  id: string;
  name: string;
  summary: string;
  href: string;
  image: { src: string | null; alt: string };
  typeIds: string[];
  typeLabels: string[];
  isPlaceholder: boolean;
};

export function ProductCard({
  product,
  placeholderLabel,
  placeholderBadge,
}: {
  product: ProductCardData;
  placeholderLabel: string;
  placeholderBadge: string;
}) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-200">
        <ContentImage
          image={product.image}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          placeholderLabel={placeholderLabel}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.isPlaceholder ? (
          <span className="absolute top-3 left-3 rounded-full bg-cream-50/95 px-2.5 py-1 text-[0.7rem] font-semibold text-ink-600">
            {placeholderBadge}
          </span>
        ) : null}
        <span
          aria-hidden
          className="absolute right-3 bottom-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-cream-50 text-navy-900 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        {product.typeLabels.length ? (
          <p className="text-[0.8rem] font-semibold tracking-wide text-gold-700">
            {product.typeLabels.join(" · ")}
          </p>
        ) : null}
        <h3 className="mt-1.5 font-sans text-base font-bold text-navy-900 sm:text-lg">
          <Link
            href={product.href}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-600">
          {product.summary}
        </p>
      </div>
    </article>
  );
}
