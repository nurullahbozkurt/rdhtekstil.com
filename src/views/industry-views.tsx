import { ArrowRight, Check } from "lucide-react";
import { TrackEvent } from "@/components/analytics/track-event";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { FeatureCard } from "@/components/cards/feature-card";
import { ProductCard } from "@/components/cards/product-card";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqSection } from "@/components/sections/faq-section";
import { PageHero } from "@/components/sections/page-hero";
import { ReferenceGrid } from "@/components/sections/reference-strip";
import { ButtonLink } from "@/components/site/button-link";
import { JsonLd } from "@/components/site/json-ld";
import { Section, SectionHeading } from "@/components/site/section";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import {
  getCaseStudies,
  getFaqs,
  getIndustries,
  getIndustry,
  getPage,
  getProducts,
  getReferences,
  getSiteSettings,
} from "@/lib/content";
import type { IndustryId } from "@/lib/content/schema";
import { getLinks, getSeo } from "@/lib/routing";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { toCaseStudyCard, toProductCard } from "./helpers";

export async function IndustriesIndexView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, settings, industries, links] = await Promise.all([
    getPage("industries", locale),
    getSeo({ type: "page", id: "industries" }, locale),
    getSiteSettings(locale),
    getIndustries(locale),
    getLinks(locale),
  ]);
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.industries, href: links.page("industries") },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={messages.a11y.breadcrumb}
        title={seo.h1}
        text={page.content.intro}
      />
      <Section tone="cream" className="pt-12 sm:pt-16 lg:pt-20">
        <ul className="container-site grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {industries.map((industry) => (
            <li key={industry.id}>
              <FeatureCard
                title={industry.name}
                text={industry.cardText}
                ctaLabel={messages.common.learnMore}
                href={links.industry(industry.id)}
                image={industry.image}
                placeholderLabel={messages.common.placeholderImage}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                headingLevel="h2"
              />
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand
        title={settings.ctas.designRequest}
        text={(await getPage("home", locale)).content.requestText}
        cta={{ label: settings.ctas.designRequest, href: links.request() }}
      />
      <JsonLd
        data={itemListJsonLd(
          seo.h1,
          industries.map((i) => ({ name: i.name, href: links.industry(i.id), image: i.image.src })),
        )}
      />
    </>
  );
}

export async function IndustryView({ locale, id }: { locale: Locale; id: IndustryId }) {
  const messages = getMessages(locale);
  const [industry, seo, settings, links] = await Promise.all([
    getIndustry(id, locale),
    getSeo({ type: "industry", id }, locale),
    getSiteSettings(locale),
    getLinks(locale),
  ]);
  if (!industry) return null;

  const [products, references, caseStudies, faqs] = await Promise.all([
    getProducts(locale, { industryId: id, limit: 8 }),
    getReferences(locale, { categories: industry.referenceCategories }),
    getCaseStudies(locale, { categories: industry.referenceCategories }),
    getFaqs(locale, { topic: id }),
  ]);
  const requestHref = links.request({ alan: industry.id });
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.industries, href: links.page("industries") },
    { name: industry.shortName, href: links.industry(id) },
  ];
  const clientName = (referenceId: string) =>
    references.find((r) => r.id === referenceId)?.name ?? "";

  return (
    <>
      <TrackEvent event="view_industry" params={{ industry_id: industry.id }} />
      <PageHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={messages.a11y.breadcrumb}
        eyebrow={industry.name}
        title={seo.h1}
        text={industry.intro}
        image={industry.image}
        placeholderLabel={messages.common.placeholderImage}
        actions={
          <ButtonLink
            href={requestHref}
            variant="primary"
            size="lg"
            data-testid="industry-request-cta"
          >
            {industry.cta}
            <ArrowRight aria-hidden />
          </ButtonLink>
        }
      />

      <Section tone="ivory" labelledBy="industry-make">
        <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 id="industry-make" className="text-h2 font-medium tracking-tight">
            {messages.industry.whatWeMake}
          </h2>
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {industry.highlights.map((item) => (
              <li
                key={item}
                className="flex gap-3 border-b border-cream-300 pb-5 text-lg text-navy-900"
              >
                <Check aria-hidden className="mt-1.5 size-4 shrink-0 text-gold-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {products.length ? (
        <Section tone="cream" labelledBy="industry-products">
          <div className="container-site">
            <SectionHeading
              id="industry-products"
              title={messages.industry.relatedProducts}
              action={
                <ButtonLink href={links.page("products")} variant="outline" size="md">
                  {messages.nav.allProducts}
                </ButtonLink>
              }
            />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
              {products.map((p) => (
                <li key={p.id}>
                  <ProductCard
                    product={toProductCard(p, links)}
                    placeholderLabel={messages.common.placeholderImage}
                    placeholderBadge={messages.common.placeholderBadge}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      <Section tone="ivory" labelledBy="industry-references">
        <div className="container-site">
          <SectionHeading id="industry-references" title={messages.industry.references} />
          {references.length || caseStudies.length ? (
            <div className="space-y-12">
              {references.length ? <ReferenceGrid references={references} /> : null}
              {caseStudies.length ? (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {caseStudies.map((cs) => (
                    <li key={cs.id}>
                      <CaseStudyCard
                        caseStudy={toCaseStudyCard(cs, links, messages, clientName(cs.referenceId))}
                        ctaLabel={messages.common.viewProject}
                        placeholderLabel={messages.common.placeholderImage}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-cream-400 p-10 text-center text-ink-600">
              {messages.industry.noReferences}
            </p>
          )}
        </div>
      </Section>

      <FaqSection faqs={faqs} title={messages.faq.title} tone="cream" />
      <CtaBand
        title={seo.h1}
        text={industry.cardText}
        cta={{ label: industry.cta, href: requestHref }}
      />
    </>
  );
}
