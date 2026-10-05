import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Suspense } from "react";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { TrackEvent } from "@/components/analytics/track-event";
import { ContactForm } from "@/components/forms/contact-form";
import { RequestForm } from "@/components/forms/request-form";
import { RequestPrefill } from "@/components/forms/request-prefill";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqList, FaqSection } from "@/components/sections/faq-section";
import { PageHero } from "@/components/sections/page-hero";
import { ValueProps } from "@/components/sections/value-props";
import { ButtonLink } from "@/components/site/button-link";
import { ContentImage } from "@/components/site/content-image";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import type { Locale } from "@/i18n/config";
import { redirect } from "next/navigation";
import { format, getMessages } from "@/i18n/messages";
import {
  getFaqs,
  getFormOptions,
  getIndustries,
  getLegalPage,
  getPage,
  getProducts,
  getSiteSettings,
} from "@/lib/content";
import type { LegalPageId } from "@/lib/content/schema";
import { getDbFormOptions } from "@/lib/form-options";
import { consumeRequestSuccessEmail } from "@/lib/requests/success-cookie";
import { getLinks, getSeo } from "@/lib/routing";
import { faqJsonLd } from "@/lib/seo/jsonld";

export async function CustomProductionView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, settings, faqs, links] = await Promise.all([
    getPage("customProduction", locale),
    getSeo({ type: "page", id: "customProduction" }, locale),
    getSiteSettings(locale),
    getFaqs(locale, { topic: "custom-production" }),
    getLinks(locale),
  ]);
  const requestHref = links.request();
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.customProduction, href: links.page("customProduction") },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={messages.a11y.breadcrumb}
        title={seo.h1}
        text={page.content.intro}
        image={page.image}
        placeholderLabel={messages.common.placeholderImage}
        actions={
          <ButtonLink href={requestHref} variant="primary" size="lg">
            {settings.ctas.customRequest}
            <ArrowRight aria-hidden />
          </ButtonLink>
        }
      />
      <Section tone="ivory">
        <ol className="container-site space-y-16 lg:space-y-24">
          {page.content.features.map((feature, index) => {
            const image = page.featureImages[index % page.featureImages.length];
            return (
              <li
                key={feature.title}
                className="grid gap-8 md:grid-cols-2 md:items-center lg:gap-20"
              >
                <Reveal className={index % 2 ? "md:order-2" : undefined}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-cream-200">
                    {image ? (
                      <ContentImage
                        image={image}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        placeholderLabel={messages.common.placeholderImage}
                      />
                    ) : null}
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <span className="font-heading text-sm tracking-[0.2em] text-gold-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-h2 font-medium tracking-tight">{feature.title}</h2>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-600">
                    {feature.text}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Section>
      <FaqSection faqs={faqs} title={messages.faq.title} tone="cream" />
      <CtaBand
        title={seo.h1}
        text={page.content.intro}
        cta={{ label: settings.ctas.customRequest, href: requestHref }}
      />
    </>
  );
}

export async function AboutView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, settings, links] = await Promise.all([
    getPage("about", locale),
    getSeo({ type: "page", id: "about" }, locale),
    getSiteSettings(locale),
    getLinks(locale),
  ]);
  const [first, ...rest] = page.images;
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.about, href: links.page("about") },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={messages.a11y.breadcrumb}
        eyebrow={settings.brandName}
        title={seo.h1}
        text={page.content.text}
        image={first}
        placeholderLabel={messages.common.placeholderImage}
      />
      <Section tone="navy" labelledBy="about-sub" className="overflow-hidden">
        <div aria-hidden className="bg-weave pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="container-site relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <p className="eyebrow mb-5">{settings.tagline}</p>
            <h2 id="about-sub" className="text-h2 font-medium tracking-tight">
              {page.content.subheading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream-50/80">{page.content.subtext}</p>
          </div>
          {rest.length ? (
            <div className="grid grid-cols-2 gap-4">
              {rest.slice(0, 2).map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-navy-900"
                >
                  <ContentImage
                    image={image}
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    placeholderLabel={messages.common.placeholderImage}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Section>
      <Section tone="cream" labelledBy="about-why">
        <div className="container-site">
          <SectionHeading id="about-why" title={(await getPage("home", locale)).content.whyTitle} />
          <ValueProps items={settings.valueProps} variant="long" />
        </div>
      </Section>
      <CtaBand
        title={settings.ctas.startProject}
        cta={{ label: settings.ctas.designRequest, href: links.request() }}
        secondary={{ label: settings.navigation.contact, href: links.page("contact") }}
      />
    </>
  );
}

export async function ContactView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, settings, countries, products, quantities, links] = await Promise.all([
    getPage("contact", locale),
    getSeo({ type: "page", id: "contact" }, locale),
    getSiteSettings(locale),
    getDbFormOptions("country", locale),
    getFormOptions("productInterest", locale),
    getDbFormOptions("quantity", locale),
    getLinks(locale),
  ]);
  const { contact } = settings;
  const toOptions = (items: { value: string; label: string }[]) =>
    items.map(({ value, label }) => ({ value, label }));
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.contact, href: links.page("contact") },
  ];
  const c = messages.contact;

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={messages.a11y.breadcrumb}
        title={seo.h1}
        text={page.content.text}
      />
      <Section tone="cream" className="pt-12 sm:pt-16 lg:pt-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div className="rounded-[1.75rem] border border-cream-300 bg-cream-50 p-6 sm:p-10">
            <ContactForm
              locale={locale}
              messages={messages.form}
              options={{
                countries: toOptions(countries),
                products: toOptions(products),
                quantities: toOptions(quantities),
              }}
              privacyHref={links.legal("disclosure")}
              submitLabel={messages.form.submit}
            />
          </div>
          <aside className="space-y-6">
            <div className="on-dark relative overflow-hidden rounded-[1.75rem] bg-navy-800 p-7 text-cream-50 sm:p-8">
              <div
                aria-hidden
                className="bg-weave pointer-events-none absolute inset-0 opacity-[0.08]"
              />
              <div className="relative">
                <h2 className="font-heading text-2xl font-medium">{c.designRequestTitle}</h2>
                <p className="mt-3 leading-relaxed text-cream-50/80">{c.designRequestText}</p>
                <ButtonLink href={links.request()} variant="gold" size="md" className="mt-6">
                  {settings.ctas.designRequest}
                  <ArrowRight aria-hidden />
                </ButtonLink>
              </div>
            </div>
            <div
              className="rounded-[1.75rem] border border-cream-300 bg-cream-50 p-7 sm:p-8"
              data-placeholder={
                contact.contentStatus === "placeholder" ? "TODO(content)" : undefined
              }
            >
              <h2 className="font-heading text-2xl font-medium text-navy-900">{c.infoTitle}</h2>
              <ul className="mt-6 space-y-5">
                <li className="flex gap-4">
                  <Phone aria-hidden className="mt-1 size-5 shrink-0 text-gold-700" />
                  <div>
                    <p className="text-sm text-ink-600">{c.phone}</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-semibold text-navy-900 hover:underline"
                    >
                      {contact.phoneDisplay}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MessageCircle aria-hidden className="mt-1 size-5 shrink-0 text-gold-700" />
                  <div>
                    <p className="text-sm text-ink-600">{c.whatsapp}</p>
                    <TrackedLink
                      event="whatsapp_click"
                      location="contact_page"
                      href={`https://wa.me/${contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-navy-900 hover:underline"
                    >
                      {contact.phoneDisplay}
                      <span className="sr-only"> ({messages.a11y.external})</span>
                    </TrackedLink>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail aria-hidden className="mt-1 size-5 shrink-0 text-gold-700" />
                  <div>
                    <p className="text-sm text-ink-600">{c.email}</p>
                    <TrackedLink
                      event="email_click"
                      location="contact_page"
                      href={`mailto:${contact.email}`}
                      className="font-semibold break-all text-navy-900 hover:underline"
                    >
                      {contact.email}
                    </TrackedLink>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-gold-700" />
                  <div>
                    <p className="text-sm text-ink-600">{c.address}</p>
                    <p className="font-semibold text-navy-900">{contact.address}</p>
                    <a
                      href={contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-sm font-semibold text-navy-800 underline underline-offset-4"
                    >
                      {c.openMap}
                      <span className="sr-only"> ({messages.a11y.external})</span>
                    </a>
                    <p className="mt-1 text-xs text-ink-600">{c.mapNotice}</p>
                  </div>
                </li>
              </ul>
              {settings.social.length ? (
                <div className="mt-8 border-t border-cream-300 pt-6">
                  <p className="text-sm text-ink-600">{c.social}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {settings.social.map((s) => (
                      <li key={s.platform}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center rounded-full border border-cream-400 px-4 text-sm font-semibold text-navy-900 hover:border-navy-800"
                        >
                          {s.label}
                          <span className="sr-only"> ({messages.a11y.external})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

export async function FaqView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, settings, faqs, links] = await Promise.all([
    getPage("faq", locale),
    getSeo({ type: "page", id: "faq" }, locale),
    getSiteSettings(locale),
    getFaqs(locale),
    getLinks(locale),
  ]);
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: settings.navigation.faq, href: links.page("faq") },
  ];
  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={messages.a11y.breadcrumb}
        title={seo.h1}
        text={page.content.intro}
      />
      <Section tone="ivory" className="pt-12 sm:pt-16 lg:pt-20">
        <div className="container-site max-w-4xl">
          <FaqList faqs={faqs} />
        </div>
        <JsonLd data={faqJsonLd(faqs)} />
      </Section>
      <CtaBand
        title={settings.ctas.startProject}
        cta={{ label: settings.ctas.designRequest, href: links.request() }}
        secondary={{ label: settings.navigation.contact, href: links.page("contact") }}
      />
    </>
  );
}

export async function LegalView({ locale, id }: { locale: Locale; id: LegalPageId }) {
  const messages = getMessages(locale);
  const [legal, seo, links] = await Promise.all([
    getLegalPage(id, locale),
    getSeo({ type: "legal", id }, locale),
    getLinks(locale),
  ]);
  if (!legal) return null;
  const breadcrumbs = [
    { name: messages.nav.home, href: links.home() },
    { name: legal.navLabel, href: links.legal(id) },
  ];
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(legal.updatedAt),
  );

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={messages.a11y.breadcrumb}
        title={seo.h1}
        text={legal.intro}
      >
        <p
          className="mt-6 text-sm text-ink-600"
          data-placeholder={legal.contentStatus === "placeholder" ? "TODO(content)" : undefined}
        >
          {messages.legal.version}: {legal.version} · {messages.legal.updated}:{" "}
          <time dateTime={legal.updatedAt}>{updated}</time>
        </p>
      </PageHero>
      <Section tone="ivory" className="pt-12 sm:pt-16 lg:pt-20">
        <article className="container-site prose-legal max-w-3xl">
          {legal.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
        </article>
      </Section>
    </>
  );
}

export async function RequestView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, products, industries, quantities, countries, links] = await Promise.all([
    getPage("request", locale),
    getSeo({ type: "page", id: "request" }, locale),
    getProducts(locale),
    getIndustries(locale),
    getDbFormOptions("quantity", locale),
    getDbFormOptions("country", locale),
    getLinks(locale),
  ]);

  return (
    <section className="relative overflow-hidden bg-cream-100 py-16 sm:py-24">
      <div
        aria-hidden
        className="bg-weave pointer-events-none absolute -top-10 -right-20 h-80 w-80 [mask-image:radial-gradient(closest-side,black,transparent)] opacity-[0.12]"
      />
      <div className="container-site relative max-w-3xl">
        <TrackEvent event="start_request" />
        <h1 className="text-display font-medium tracking-tight text-navy-900">{seo.h1}</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-600">{page.content.text}</p>
        <Suspense fallback={null}>
          <RequestPrefill
            products={Object.fromEntries(products.map((p) => [p.id, p.name]))}
            industries={Object.fromEntries(industries.map((i) => [i.id, i.name]))}
            labels={{
              product: messages.request.prefilledProduct,
              industry: messages.request.prefilledIndustry,
            }}
          />
          <RequestForm
            locale={locale}
            messages={messages.request}
            formMessages={messages.form}
            privacyHref={links.legal("disclosure")}
            completeHref={links.page("requestComplete")}
            products={products.map((p) => ({
              id: p.id,
              name: p.name,
              categoryId: p.categoryId,
            }))}
            quantities={quantities}
            countries={countries}
            submitLabel={
              "submitLabel" in page.content
                ? String(page.content.submitLabel)
                : messages.request.submit
            }
          />
        </Suspense>
      </div>
    </section>
  );
}

export async function RequestCompleteView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const [page, seo, settings, links, email] = await Promise.all([
    getPage("requestComplete", locale),
    getSeo({ type: "page", id: "requestComplete" }, locale),
    getSiteSettings(locale),
    getLinks(locale),
    consumeRequestSuccessEmail(),
  ]);
  if (!email) redirect(links.home());

  return (
    <section className="bg-cream-100 py-20 sm:py-28">
      <div className="container-site max-w-3xl text-center">
        <h1 className="text-display font-medium tracking-tight text-navy-900">{seo.h1}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
          {page.content.text}
        </p>
        <p className="mx-auto mt-8 max-w-xl rounded-2xl border border-gold-500/40 bg-cream-50 p-5 text-sm text-navy-900">
          {format(messages.request.emailShown, { email })}
        </p>
        <ButtonLink href={links.page("products")} variant="primary" size="lg" className="mt-10">
          {settings.ctas.otherProducts}
          <ArrowRight aria-hidden />
        </ButtonLink>
      </div>
    </section>
  );
}
