import { ArrowRight } from "lucide-react";
import { TrackEvent } from "@/components/analytics/track-event";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { CaseStudyGrid } from "@/components/catalog/case-study-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ReferenceGrid } from "@/components/sections/reference-strip";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ButtonLink } from "@/components/site/button-link";
import { ContentImage } from "@/components/site/content-image";
import { Section, SectionHeading } from "@/components/site/section";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import {
  getCaseStudies,
  getCaseStudy,
  getPage,
  getProducts,
  getReferences,
  getSiteSettings,
} from "@/lib/content";
import { referenceCategorySchema } from "@/lib/content/schema";
import { getLinks, getSeo } from "@/lib/routing";
import { toCaseStudyCard } from "./helpers";

export async function ReferencesView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, settings, references, caseStudies, links] = await Promise.all([
    getPage("references", locale),
    getSeo({ type: "page", id: "references" }, locale),
    getSiteSettings(locale),
    getReferences(locale),
    getCaseStudies(locale),
    getLinks(locale),
  ]);
  const clientName = (referenceId: string) =>
    references.find((r) => r.id === referenceId)?.name ?? "";
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.references, href: links.page("references") },
  ];
  const categories = referenceCategorySchema.options.map((id) => ({
    id,
    label: messages.references.categories[id],
  }));

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={messages.a11y.breadcrumb}
        title={seo.h1}
        text={page.content.intro}
      />
      <Section tone="ivory" labelledBy="references-brands">
        <div className="container-site">
          <SectionHeading id="references-brands" title={messages.references.brands} />
          <ReferenceGrid references={references} />
          {references.some((r) => !r.logo?.src) ? (
            <p className="mt-6 text-sm text-ink-600">{messages.references.logoNotice}</p>
          ) : null}
        </div>
      </Section>
      <Section tone="cream" labelledBy="references-projects">
        <div className="container-site">
          <SectionHeading id="references-projects" title={messages.references.projects} />
          <CaseStudyGrid
            caseStudies={caseStudies.map((cs) =>
              toCaseStudyCard(cs, links, messages, clientName(cs.referenceId)),
            )}
            categories={categories}
            labels={{
              all: messages.common.all,
              filter: messages.references.filterLabel,
              empty: messages.references.noProjects,
              cta: messages.common.viewProject,
              placeholderImage: messages.common.placeholderImage,
            }}
          />
        </div>
      </Section>
      <CtaBand
        title={settings.ctas.startProject}
        text={(await getPage("home", locale)).content.requestText}
        cta={{ label: settings.ctas.designRequest, href: links.request() }}
      />
    </>
  );
}

export async function CaseStudyView({ locale, id }: { locale: Locale; id: string }) {
  const messages = getMessages(locale);
  const caseStudy = await getCaseStudy(id, locale);
  if (!caseStudy) return null;
  const [seo, settings, references, products, others, links] = await Promise.all([
    getSeo({ type: "caseStudy", id }, locale),
    getSiteSettings(locale),
    getReferences(locale),
    getProducts(locale, { ids: caseStudy.productIds }),
    getCaseStudies(locale),
    getLinks(locale),
  ]);
  const client = references.find((r) => r.id === caseStudy.referenceId);
  const f = messages.references.fields;
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.references, href: links.page("references") },
    { name: caseStudy.title, href: links.caseStudy(id) },
  ];
  const facts = [
    { label: f.client, value: client?.name },
    { label: f.sector, value: caseStudy.sector },
    { label: f.product, value: caseStudy.productLabel },
    { label: f.country, value: caseStudy.country },
    { label: f.quantity, value: caseStudy.quantity },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));
  const more = others.filter((c) => c.id !== id).slice(0, 3);
  const firstProduct = products[0];

  return (
    <>
      <TrackEvent event="view_case_study" params={{ case_study_id: caseStudy.id }} />
      <section className="bg-cream-100">
        <div className="container-site pt-8 pb-16 sm:pt-10 lg:pb-20">
          <Breadcrumbs items={breadcrumbs} label={messages.a11y.breadcrumb} />
          <p className="eyebrow mb-4">
            {caseStudy.categories.map((c) => messages.references.categories[c]).join(" · ")}
          </p>
          <h1 className="max-w-4xl text-display font-medium tracking-tight text-navy-900">
            {seo.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">{caseStudy.summary}</p>
          {caseStudy.contentStatus === "placeholder" ? (
            <p
              className="mt-4 inline-flex rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-ink-600"
              data-placeholder="TODO(content)"
            >
              {messages.common.placeholderBadge}
            </p>
          ) : null}
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-cream-300 py-8 md:grid-cols-5">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-2 font-semibold text-navy-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section tone="ivory" className="pt-0 sm:pt-0 lg:pt-0">
        <div className="container-site grid gap-12 pt-16 lg:grid-cols-2 lg:gap-20 lg:pt-20">
          <div className="space-y-10">
            <div>
              <h2 className="font-heading text-2xl font-medium">{f.need}</h2>
              <p className="mt-3 text-lg leading-relaxed text-ink-600">{caseStudy.need}</p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-medium">{f.solution}</h2>
              <p className="mt-3 text-lg leading-relaxed text-ink-600">{caseStudy.solution}</p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-medium">{f.features}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {caseStudy.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full border border-cream-400 bg-cream-100 px-4 py-1.5 text-sm font-semibold"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            {firstProduct ? (
              <ButtonLink
                href={links.request({ urun: firstProduct.id })}
                variant="primary"
                size="lg"
              >
                {settings.ctas.productRequest}
                <ArrowRight aria-hidden />
              </ButtonLink>
            ) : null}
          </div>
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream-200">
              <ContentImage
                image={caseStudy.finalImage}
                sizes="(min-width: 1024px) 45vw, 100vw"
                placeholderLabel={messages.common.placeholderImage}
                quality={85}
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-600">{f.finalProduct}</figcaption>
          </figure>
        </div>
      </Section>

      {caseStudy.images.length ? (
        <Section tone="cream" labelledBy="case-gallery">
          <div className="container-site">
            <SectionHeading id="case-gallery" title={f.gallery} />
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {caseStudy.images.map((image, index) => (
                <li
                  key={`${image.src}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-cream-200"
                >
                  <ContentImage
                    image={image}
                    sizes="(min-width: 768px) 33vw, 50vw"
                    placeholderLabel={messages.common.placeholderImage}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {more.length ? (
        <Section tone="ivory" labelledBy="case-more">
          <div className="container-site">
            <SectionHeading id="case-more" title={messages.references.otherCaseStudies} />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((cs) => (
                <li key={cs.id}>
                  <CaseStudyCard
                    caseStudy={toCaseStudyCard(
                      cs,
                      links,
                      messages,
                      references.find((r) => r.id === cs.referenceId)?.name ?? "",
                    )}
                    ctaLabel={messages.common.viewProject}
                    placeholderLabel={messages.common.placeholderImage}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}
      <CtaBand
        title={settings.ctas.startProject}
        cta={{ label: settings.ctas.designRequest, href: links.request() }}
      />
    </>
  );
}
