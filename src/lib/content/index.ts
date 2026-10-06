import "server-only";

import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { localize, type Resolved } from "./localize";
import type {
  CaseStudy,
  Category,
  CategoryId,
  Faq,
  FaqTopic,
  FormOption,
  Industry,
  IndustryId,
  LegalPage,
  LegalPageId,
  PageId,
  Pages,
  Product,
  Reference,
  ReferenceCategory,
  SiteSettings,
} from "./schema";
import { loadContent } from "./source";

/*
 * İçerik katmanı — UI bileşenleri veriye YALNIZCA bu modül üzerinden erişir.
 * Tüm fonksiyonlar async'tir; Faz 3'te Supabase'e geçişte imzalar değişmez.
 */

export type CategoryView = Resolved<Category>;
export type ProductView = Resolved<Product>;
export type IndustryView = Resolved<Industry>;
export type ReferenceView = Resolved<Reference>;
export type CaseStudyView = Resolved<CaseStudy>;
export type FaqView = Resolved<Faq>;
export type FormOptionView = Resolved<FormOption>;
export type LegalPageView = Resolved<LegalPage>;
export type SiteSettingsView = Resolved<SiteSettings>;
export type PageView<K extends PageId> = Resolved<Pages[K]>;

const bySort = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder;

export const getContentStore = cache(loadContent);

export async function getSiteSettings(locale: Locale): Promise<SiteSettingsView> {
  const { siteSettings } = await getContentStore();
  return localize(siteSettings, locale);
}

export async function getPage<K extends PageId>(id: K, locale: Locale): Promise<PageView<K>> {
  const { pages } = await getContentStore();
  return localize(pages[id], locale);
}

export async function getCategories(locale: Locale): Promise<CategoryView[]> {
  const { categories } = await getContentStore();
  return [...categories].sort(bySort).map((c) => localize(c, locale));
}

export async function getCategory(
  id: CategoryId,
  locale: Locale,
): Promise<CategoryView | undefined> {
  return (await getCategories(locale)).find((c) => c.id === id);
}

export async function getCategoryBySlug(locale: Locale, slug: string) {
  return (await getCategories(locale)).find((c) => c.seo.slug === slug);
}

export type ProductFilters = {
  categoryId?: CategoryId;
  typeId?: string;
  industryId?: IndustryId;
  featured?: boolean;
  ids?: readonly string[];
  excludeId?: string;
  limit?: number;
};

export async function getProducts(
  locale: Locale,
  filters: ProductFilters = {},
): Promise<ProductView[]> {
  const { products } = await getContentStore();
  const result = [...products]
    .sort(bySort)
    .filter((p) => !filters.categoryId || p.categoryId === filters.categoryId)
    .filter((p) => !filters.typeId || p.typeIds.includes(filters.typeId))
    .filter((p) => !filters.industryId || p.industryIds.includes(filters.industryId))
    .filter((p) => filters.featured === undefined || p.featured === filters.featured)
    .filter((p) => !filters.ids || filters.ids.includes(p.id))
    .filter((p) => !filters.excludeId || p.id !== filters.excludeId)
    .map((p) => localize(p, locale));
  return filters.limit ? result.slice(0, filters.limit) : result;
}

export async function getProduct(id: string, locale: Locale): Promise<ProductView | undefined> {
  return (await getProducts(locale)).find((p) => p.id === id);
}

export async function getProductBySlug(
  locale: Locale,
  slug: string,
): Promise<ProductView | undefined> {
  return (await getProducts(locale)).find((p) => p.seo.slug === slug);
}

export async function getIndustries(locale: Locale): Promise<IndustryView[]> {
  const { industries } = await getContentStore();
  return [...industries].sort(bySort).map((i) => localize(i, locale));
}

export async function getIndustry(
  id: IndustryId,
  locale: Locale,
): Promise<IndustryView | undefined> {
  return (await getIndustries(locale)).find((i) => i.id === id);
}

export async function getReferences(
  locale: Locale,
  filters: { categories?: readonly ReferenceCategory[] } = {},
): Promise<ReferenceView[]> {
  const { references } = await getContentStore();
  return [...references]
    .sort(bySort)
    .filter((r) => !filters.categories || r.categories.some((c) => filters.categories?.includes(c)))
    .map((r) => localize(r, locale));
}

export async function getCaseStudies(
  locale: Locale,
  filters: {
    categories?: readonly ReferenceCategory[];
    productId?: string;
    ids?: readonly string[];
  } = {},
): Promise<CaseStudyView[]> {
  const { caseStudies } = await getContentStore();
  return [...caseStudies]
    .sort(bySort)
    .filter(
      (c) => !filters.categories || c.categories.some((cat) => filters.categories?.includes(cat)),
    )
    .filter((c) => !filters.productId || c.productIds.includes(filters.productId))
    .filter((c) => !filters.ids || filters.ids.includes(c.id))
    .map((c) => localize(c, locale));
}

export async function getCaseStudy(id: string, locale: Locale): Promise<CaseStudyView | undefined> {
  return (await getCaseStudies(locale)).find((c) => c.id === id);
}

function faqShowsOnHome(faq: Faq): boolean {
  return faq.showOnHome ?? faq.topics.includes("general");
}

export async function getFaqs(
  locale: Locale,
  filters: { topic?: FaqTopic; ids?: readonly string[]; showOnHome?: boolean } = {},
): Promise<FaqView[]> {
  const { faqs } = await getContentStore();
  const list = [...faqs].sort(bySort);
  if (filters.ids) {
    const ids = filters.ids;
    return ids
      .map((id) => list.find((f) => f.id === id))
      .filter((f): f is Faq => Boolean(f))
      .map((f) => localize(f, locale));
  }
  return list
    .filter((f) => !filters.topic || f.topics.includes(filters.topic))
    .filter((f) => filters.showOnHome === undefined || faqShowsOnHome(f) === filters.showOnHome)
    .map((f) => localize(f, locale));
}

export async function getFormOptions(
  type: FormOption["type"],
  locale: Locale,
): Promise<FormOptionView[]> {
  const { formOptions } = await getContentStore();
  return formOptions
    .filter((o) => o.type === type && o.isActive)
    .sort(bySort)
    .map((o) => localize(o, locale));
}

export async function getLegalPages(locale: Locale): Promise<LegalPageView[]> {
  const { legalPages } = await getContentStore();
  return legalPages.map((p) => localize(p, locale));
}

export async function getLegalPage(id: LegalPageId, locale: Locale) {
  return (await getLegalPages(locale)).find((p) => p.id === id);
}
