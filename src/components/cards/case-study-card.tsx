import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContentImage } from "../site/content-image";

export type CaseStudyCardData = {
  id: string;
  title: string;
  summary: string;
  href: string;
  client: string;
  categories: string[];
  categoryLabels: string[];
  image: { src: string | null; alt: string };
};

export function CaseStudyCard({
  caseStudy,
  ctaLabel,
  placeholderLabel,
}: {
  caseStudy: CaseStudyCardData;
  ctaLabel: string;
  placeholderLabel: string;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-cream-300 bg-cream-50">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        <ContentImage
          image={caseStudy.image}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          placeholderLabel={placeholderLabel}
          className="transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.8rem] font-semibold tracking-wide text-gold-700">
          {caseStudy.categoryLabels.join(" · ")}
        </p>
        <h3 className="mt-2 font-heading text-xl font-medium text-navy-900">
          <Link
            href={caseStudy.href}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {caseStudy.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{caseStudy.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800">
          {ctaLabel}
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-2 ring-transparent ring-inset group-has-[:focus-visible]:ring-navy-700"
      />
    </article>
  );
}
