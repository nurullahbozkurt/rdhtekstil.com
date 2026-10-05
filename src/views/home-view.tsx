import { ArrowRight, Check } from "lucide-react";
import { FeatureCard } from "@/components/cards/feature-card";
import { FaqSection } from "@/components/sections/faq-section";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ReferenceStrip } from "@/components/sections/reference-strip";
import { ValueProps } from "@/components/sections/value-props";
import { ButtonLink } from "@/components/site/button-link";
import { ContentImage } from "@/components/site/content-image";
import { Icon } from "@/components/site/icon";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import {
  getCategories,
  getFaqs,
  getIndustries,
  getPage,
  getReferences,
  getSiteSettings,
} from "@/lib/content";
import type { IconName } from "@/lib/content/schema";
import { getLinks, getSeo } from "@/lib/routing";

const REQUEST_ICONS: IconName[] = ["shirt", "upload", "mail"];

export async function HomeView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, settings, categories, industries, references, faqs, links] = await Promise.all([
    getPage("home", locale),
    getSeo({ type: "home" }, locale),
    getSiteSettings(locale),
    getCategories(locale),
    getIndustries(locale),
    getReferences(locale),
    getFaqs(locale, { topic: "general" }),
    getLinks(locale),
  ]);
  const { content } = page;
  const [heroMain, heroSecond, heroThird] = page.heroImages;
  const [beanies, scarves, ...restCategories] = categories;
  const placeholder = messages.common.placeholderImage;
  const missingLogos = references.some((r) => !r.logo?.src);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-100">
        <div
          aria-hidden
          className="bg-weave pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] [mask-image:radial-gradient(closest-side,black,transparent)] opacity-[0.1]"
        />
        <div className="container-site relative grid gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14 lg:pt-16 lg:pb-24">
          <div>
            <p className="eyebrow mb-6">{content.eyebrow}</p>
            <h1 className="text-display font-medium tracking-tight text-navy-900">{seo.h1}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 sm:text-xl">
              {content.heroText}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={links.request()} variant="primary" size="lg">
                {settings.ctas.designRequest}
                <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href={links.page("products")} variant="outline" size="lg">
                {settings.ctas.browseProducts}
              </ButtonLink>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-cream-300 pt-6 text-sm font-semibold text-navy-800">
              {settings.trustLine.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check aria-hidden className="size-4 text-gold-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-[1.35fr_1fr] gap-3 sm:gap-4">
            {heroMain ? (
              <div className="relative row-span-2 aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-cream-200">
                <ContentImage
                  image={heroMain}
                  sizes="(min-width: 1024px) 30vw, 58vw"
                  placeholderLabel={placeholder}
                  preload
                  quality={85}
                />
              </div>
            ) : null}
            {heroSecond ? (
              <div className="relative overflow-hidden rounded-[1.5rem] bg-cream-200">
                <ContentImage
                  image={heroSecond}
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  placeholderLabel={placeholder}
                  preload
                />
              </div>
            ) : null}
            {heroThird ? (
              <div className="relative overflow-hidden rounded-[1.5rem] bg-navy-800">
                <ContentImage
                  image={heroThird}
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  placeholderLabel={placeholder}
                  preload
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Referanslar */}
      {references.length ? (
        <section
          aria-labelledby="home-references"
          className="border-y border-cream-300 bg-cream-50 py-14 sm:py-16"
        >
          <div className="container-site">
            <h2
              id="home-references"
              className="mb-8 text-center font-heading text-xl font-medium text-navy-900 sm:text-2xl"
            >
              {content.referencesTitle}
            </h2>
            <ReferenceStrip
              references={references}
              label={messages.a11y.referencesStrip}
              notice={missingLogos ? messages.references.logoNotice : undefined}
            />
          </div>
        </section>
      ) : null}

      {/* Marka anlatısı */}
      <Section tone="navy" labelledBy="home-story" className="overflow-hidden">
        <div aria-hidden className="bg-weave pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="container-site relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-5">{settings.slogan}</p>
            <h2 id="home-story" className="text-h2 font-medium tracking-tight">
              {content.storyTitle}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream-50/80">{content.storyText}</p>
            <ButtonLink href={links.page("about")} variant="light" size="md" className="mt-9">
              {messages.common.learnMore}
              <ArrowRight aria-hidden />
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] ring-1 ring-gold-400/40">
              <ContentImage
                image={page.storyImage}
                sizes="(min-width: 1024px) 45vw, 100vw"
                placeholderLabel={placeholder}
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Ürünler */}
      <Section tone="cream" labelledBy="home-products">
        <div className="container-site">
          <SectionHeading
            id="home-products"
            title={content.productsTitle}
            text={content.productsText}
            action={
              <ButtonLink href={links.page("products")} variant="outline" size="md">
                {messages.nav.allProducts}
              </ButtonLink>
            }
          />
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[beanies, scarves].map((category, index) =>
              category ? (
                <Reveal key={category.id} delay={index * 0.08}>
                  <FeatureCard
                    title={category.name}
                    text={category.cardText}
                    ctaLabel={category.cardCta}
                    href={links.category(category.id)}
                    image={category.image}
                    placeholderLabel={placeholder}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    aspect="aspect-[4/5] sm:aspect-[5/6]"
                  />
                </Reveal>
              ) : null,
            )}
            {restCategories.map((category) => (
              <Reveal key={category.id} className="md:col-span-2">
                <FeatureCard
                  title={category.name}
                  text={category.cardText}
                  ctaLabel={category.cardCta}
                  href={links.category(category.id)}
                  image={category.image}
                  placeholderLabel={placeholder}
                  sizes="100vw"
                  aspect="aspect-[4/3] sm:aspect-[21/9]"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Talep bölümü */}
      <section aria-labelledby="home-request" className="bg-cream-100 pb-20 sm:pb-24 lg:pb-28">
        <div className="container-site">
          <div className="grid overflow-hidden rounded-[2rem] border border-gold-500/30 bg-cream-200 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <h2 id="home-request" className="text-h2 font-medium tracking-tight text-navy-900">
                {content.requestTitle}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
                {content.requestText}
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {content.requestPoints.map((point, index) => (
                  <li key={point} className="rounded-2xl bg-cream-50 p-5">
                    <Icon
                      name={REQUEST_ICONS[index % REQUEST_ICONS.length] ?? "check"}
                      className="size-5 text-gold-700"
                    />
                    <p className="mt-3 text-[0.95rem] leading-snug font-semibold text-navy-900">
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
              <ButtonLink href={links.request()} variant="primary" size="lg" className="mt-10">
                {settings.ctas.designRequest}
                <ArrowRight aria-hidden />
              </ButtonLink>
            </div>
            <div className="relative min-h-72 bg-navy-800">
              <ContentImage
                image={page.requestImage}
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholderLabel={placeholder}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kimler için */}
      <Section tone="ivory" labelledBy="home-industries">
        <div className="container-site">
          <SectionHeading
            id="home-industries"
            title={content.industriesTitle}
            action={
              <ButtonLink href={links.page("industries")} variant="outline" size="md">
                {messages.nav.allIndustries}
              </ButtonLink>
            }
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {industries.map((industry, index) => (
              <li key={industry.id} className={index < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
                <Reveal delay={(index % 3) * 0.06} className="h-full">
                  <FeatureCard
                    title={industry.shortName}
                    text={industry.cardText}
                    href={links.industry(industry.id)}
                    image={industry.image}
                    placeholderLabel={placeholder}
                    sizes={
                      index < 2
                        ? "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    }
                    aspect={index < 2 ? "aspect-[4/3]" : "aspect-[4/3] lg:aspect-[4/5]"}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Neden RDH */}
      <Section tone="cream" labelledBy="home-why">
        <div className="container-site">
          <SectionHeading id="home-why" title={content.whyTitle} />
          <ValueProps items={settings.valueProps} />
        </div>
      </Section>

      {/* Nasıl çalışıyoruz */}
      <Section tone="navy" labelledBy="home-process" className="overflow-hidden">
        <div
          aria-hidden
          className="bg-weave pointer-events-none absolute -right-40 -bottom-40 h-[36rem] w-[36rem] [mask-image:radial-gradient(closest-side,black,transparent)] opacity-[0.1]"
        />
        <div className="container-site relative">
          <SectionHeading
            id="home-process"
            title={content.processTitle}
            action={
              <ButtonLink href={links.request()} variant="gold" size="lg">
                {settings.ctas.startProject}
                <ArrowRight aria-hidden />
              </ButtonLink>
            }
          />
          <ProcessSteps steps={settings.processSteps} />
        </div>
      </Section>

      <FaqSection faqs={faqs} title={content.faqTitle} tone="ivory" />
    </>
  );
}
