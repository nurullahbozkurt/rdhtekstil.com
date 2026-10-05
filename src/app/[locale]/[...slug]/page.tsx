import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getAllRoutes, resolveRoute, type RouteKey } from "@/lib/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { CategoryView, ProductsIndexView, ProductView } from "@/views/catalog-views";
import {
  AboutView,
  ContactView,
  CustomProductionView,
  FaqView,
  LegalView,
  RequestCompleteView,
  RequestView,
} from "@/views/company-views";
import { IndustriesIndexView, IndustryView } from "@/views/industry-views";
import { CaseStudyView, ReferencesView } from "@/views/reference-views";

/** İçerik katmanındaki dil bazlı slug'lardan üretilen tüm sayfalar. */
export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const routes = await getAllRoutes();
  const targetLocales = isLocale(params.locale) ? [params.locale] : locales;
  return routes.flatMap((route) =>
    targetLocales
      .map((locale) => route.segments[locale])
      .filter((segments) => segments.length > 0)
      .map((slug) => ({ slug })),
  );
}

async function resolve(params: PageProps<"/[locale]/[...slug]">["params"]) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return null;
  const route = await resolveRoute(locale, slug);
  return route ? { locale, key: route.key } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[...slug]">): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};
  return buildMetadata(resolved.locale, resolved.key);
}

function render(locale: Locale, key: RouteKey): ReactNode {
  switch (key.type) {
    case "home":
      return null;
    case "category":
      return <CategoryView locale={locale} id={key.id} />;
    case "product":
      return <ProductView locale={locale} id={key.id} />;
    case "industry":
      return <IndustryView locale={locale} id={key.id} />;
    case "caseStudy":
      return <CaseStudyView locale={locale} id={key.id} />;
    case "legal":
      return <LegalView locale={locale} id={key.id} />;
    case "page":
      switch (key.id) {
        case "products":
          return <ProductsIndexView locale={locale} />;
        case "industries":
          return <IndustriesIndexView locale={locale} />;
        case "customProduction":
          return <CustomProductionView locale={locale} />;
        case "references":
          return <ReferencesView locale={locale} />;
        case "about":
          return <AboutView locale={locale} />;
        case "contact":
          return <ContactView locale={locale} />;
        case "faq":
          return <FaqView locale={locale} />;
        case "request":
          return <RequestView locale={locale} />;
        case "requestComplete":
          return <RequestCompleteView locale={locale} />;
      }
  }
}

export default async function ContentPage({ params }: PageProps<"/[locale]/[...slug]">) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  const content = render(resolved.locale, resolved.key);
  if (!content) notFound();
  return content;
}
