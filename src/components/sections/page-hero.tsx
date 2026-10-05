import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/lib/seo/jsonld";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../site/breadcrumbs";
import { ContentImage } from "../site/content-image";

export function PageHero({
  breadcrumbs,
  breadcrumbLabel,
  eyebrow,
  title,
  text,
  actions,
  image,
  placeholderLabel,
  children,
}: {
  breadcrumbs: BreadcrumbItem[];
  breadcrumbLabel: string;
  eyebrow?: string;
  title: string;
  text?: string;
  actions?: ReactNode;
  image?: { src: string | null; alt: string };
  placeholderLabel?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-cream-300 bg-cream-100">
      <div
        aria-hidden
        className="bg-weave pointer-events-none absolute -top-10 -right-20 h-80 w-80 [mask-image:radial-gradient(closest-side,black,transparent)] opacity-[0.12]"
      />
      <div
        className={cn(
          "container-site relative grid gap-10 py-12 sm:py-16 lg:py-20",
          image && "lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16",
        )}
      >
        <div>
          <Breadcrumbs items={breadcrumbs} label={breadcrumbLabel} />
          {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
          <h1 className="text-display font-medium tracking-tight text-navy-900">{title}</h1>
          {text ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">{text}</p>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          {children}
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-cream-200 lg:aspect-[5/4]">
            <ContentImage
              image={image}
              sizes="(min-width: 1024px) 45vw, 100vw"
              placeholderLabel={placeholderLabel ?? ""}
              preload
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
