import { ArrowRight, Check } from "lucide-react";
import { TrackEvent } from "@/components/analytics/track-event";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { FeatureCard } from "@/components/cards/feature-card";
import { ProductCard } from "@/components/cards/product-card";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqSection } from "@/components/sections/faq-section";
import { PageHero } from "@/components/sections/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ButtonLink } from "@/components/site/button-link";
import { JsonLd } from "@/components/site/json-ld";
import { Section, SectionHeading } from "@/components/site/section";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import {
  getCaseStudies,
  getCategories,
  getCategory,
  getFaqs,
  getPage,
  getProduct,
  getProducts,
  getReferences,
  getSiteSettings,
} from "@/lib/content";
import type { CategoryId } from "@/lib/content/schema";
import { getLinks, getSeo } from "@/lib/routing";
import { itemListJsonLd, productJsonLd } from "@/lib/seo/jsonld";
import { gridLabels, toCaseStudyCard, toProductCard } from "./helpers";

export async function ProductsIndexView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, settings, categories, products, links] = await Promise.all([
    getPage("products", locale),
    getSeo({ type: "page", id: "products" }, locale),
    getSiteSettings(locale),
    getCategories(locale),
    getProducts(locale),
    getLinks(locale),
  ]);
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.products, href: links.page("products") },
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
        <div className="container-site space-y-20 lg:space-y-28">
          <ul className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <li key={category.id}>
                <FeatureCard
                  title={category.name}
                  text={category.cardText}
                  ctaLabel={category.cardCta}
                  href={links.category(category.id)}
                  image={category.image}
                  placeholderLabel={messages.common.placeholderImage}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  headingLevel="h2"
                />
              </li>
            ))}
          </ul>
          {categories.map((category) => {
            const items = products.filter((p) => p.categoryId === category.id).slice(0, 4);
            if (!items.length) return null;
            return (
              <section key={category.id} aria-labelledby={`cat-${category.id}`}>
                <SectionHeading
                  id={`cat-${category.id}`}
                  title={category.name}
                  className="mb-8 lg:mb-10"
                  action={
                    <ButtonLink href={links.category(category.id)} variant="outline" size="md">
                      {category.cardCta}
                      <ArrowRight aria-hidden />
                    </ButtonLink>
                  }
                />
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
                  {items.map((product) => (
                    <li key={product.id}>
                      <ProductCard
                        product={toProductCard(product, links)}
                        placeholderLabel={messages.common.placeholderImage}
                        placeholderBadge={messages.common.placeholderBadge}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Section>
      <CtaBand
        title={settings.ctas.designRequest}
        text={(await getPage("home", locale)).content.requestText}
        cta={{ label: settings.ctas.designRequest, href: links.request() }}
      />
      <JsonLd
        data={itemListJsonLd(
          seo.h1,
          categories.map((c) => ({ name: c.name, href: links.category(c.id), image: c.image.src })),
        )}
      />
    </>
  );
}

export async function CategoryView({ locale, id }: { locale: Locale; id: CategoryId }) {
  const messages = getMessages(locale);
  const [category, seo, settings, products, faqs, links] = await Promise.all([
    getCategory(id, locale),
    getSeo({ type: "category", id }, locale),
    getSiteSettings(locale),
    getProducts(locale, { categoryId: id }),
    getFaqs(locale, { topic: id }),
    getLinks(locale),
  ]);
  if (!category) return null;

  const cards = products.map((p) => toProductCard(p, links));
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.products, href: links.page("products") },
    { name: category.shortName, href: links.category(id) },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={messages.a11y.breadcrumb}
        title={seo.h1}
        text={category.intro}
        image={category.image}
        placeholderLabel={messages.common.placeholderImage}
        actions={
          <ButtonLink href={links.request()} variant="primary" size="lg">
            {settings.ctas.designRequest}
            <ArrowRight aria-hidden />
          </ButtonLink>
        }
      />
      <Section tone="cream" className="pt-12 sm:pt-16 lg:pt-20">
        <div className="container-site">
          <h2 className="mb-8 font-heading text-2xl font-medium text-navy-900 sm:text-3xl">
            {messages.catalog.modelsTitle}
          </h2>
          <ProductGrid products={cards} labels={gridLabels(messages)} />
          <p className="mt-12 text-sm text-ink-600">{messages.catalog.noPrice}</p>
        </div>
      </Section>
      <FaqSection faqs={faqs} title={messages.faq.title} />
      <CtaBand
        title={settings.ctas.designRequest}
        text={(await getPage("home", locale)).content.requestText}
        cta={{ label: settings.ctas.designRequest, href: links.request() }}
        secondary={{ label: settings.ctas.otherProducts, href: links.page("products") }}
      />
      <JsonLd
        data={itemListJsonLd(
          category.name,
          cards.map((c) => ({ name: c.name, href: c.href, image: c.image.src })),
        )}
      />
    </>
  );
}

export async function ProductView({ locale, id }: { locale: Locale; id: string }) {
  const messages = getMessages(locale);
  const product = await getProduct(id, locale);
  if (!product) return null;

  const [settings, category, links, references, related] = await Promise.all([
    getSiteSettings(locale),
    getCategory(product.categoryId, locale),
    getLinks(locale),
    getReferences(locale),
    getProducts(locale, { categoryId: product.categoryId, excludeId: product.id, limit: 4 }),
  ]);
  const [caseStudies, ownFaqs] = await Promise.all([
    getCaseStudies(locale, { productId: product.id }),
    getFaqs(locale, { ids: product.faqIds }),
  ]);
  const faqs = ownFaqs.length ? ownFaqs : await getFaqs(locale, { ids: category?.faqIds ?? [] });

  const href = links.product(product.id);
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.products, href: links.page("products") },
    ...(category ? [{ name: category.shortName, href: links.category(category.id) }] : []),
    { name: product.name, href },
  ];
  const clientName = (referenceId: string) =>
    references.find((r) => r.id === referenceId)?.name ?? "";

  return (
    <>
      <TrackEvent
        event="view_product"
        params={{ product_id: product.id, category_id: product.categoryId }}
      />
      <section className="bg-cream-100">
        <div className="container-site pt-8 pb-16 sm:pt-10 lg:pb-24">
          <Breadcrumbs items={breadcrumbs} label={messages.a11y.breadcrumb} />
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery
              images={product.images}
              labels={{
                previous: messages.a11y.previousImage,
                next: messages.a11y.nextImage,
                show: messages.a11y.showImage,
                placeholder: messages.common.placeholderImage,
              }}
            />
            <div className="lg:sticky lg:top-28 lg:self-start">
              {category ? <p className="eyebrow mb-4">{category.shortName}</p> : null}
              <h1 className="text-h2 font-medium tracking-tight text-navy-900">{product.name}</h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">{product.summary}</p>
              {product.contentStatus === "placeholder" ? (
                <p
                  className="mt-4 inline-flex rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-ink-600"
                  data-placeholder="TODO(content)"
                >
                  {messages.common.placeholderBadge}
                </p>
              ) : null}

              <ButtonLink
                href={links.request({ urun: product.id })}
                variant="primary"
                size="lg"
                className="mt-8"
                data-testid="product-request-cta"
              >
                {settings.ctas.productRequest}
                <ArrowRight aria-hidden />
              </ButtonLink>
              <p className="mt-3 text-sm text-ink-600">{messages.catalog.noPrice}</p>

              <dl className="mt-10 grid gap-6 border-t border-cream-300 pt-8 sm:grid-cols-2">
                <div>
                  <dt className="eyebrow">{messages.catalog.customizations}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {product.customizations.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-cream-400 bg-cream-50 px-3 py-1 text-sm font-semibold text-navy-900"
                      >
                        {messages.catalog.customizationLabels[c]}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-8">
                <h2 className="eyebrow">{messages.catalog.features}</h2>
                <ul className="mt-4 space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-navy-900">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-gold-700" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-8 leading-relaxed text-ink-600">{product.description}</p>
            </div>
          </div>
        </div>
      </section>

      {caseStudies.length ? (
        <Section tone="ivory" labelledBy="product-projects">
          <div className="container-site">
            <SectionHeading id="product-projects" title={messages.catalog.relatedProjects} />
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
          </div>
        </Section>
      ) : null}

      <FaqSection faqs={faqs} title={messages.catalog.productFaq} tone="cream" />

      {related.length ? (
        <Section tone="ivory" labelledBy="product-related">
          <div className="container-site">
            <SectionHeading id="product-related" title={messages.catalog.relatedProducts} />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
              {related.map((p) => (
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

      <JsonLd data={productJsonLd(product, href, category?.name ?? "", settings.brandName)} />
    </>
  );
}
