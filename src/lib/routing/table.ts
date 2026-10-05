import { locales, type Locale } from "@/i18n/config";
import type {
  CategoryId,
  ContentStore,
  IndustryId,
  LegalPageId,
  PageId,
  SeoFields,
} from "@/lib/content/schema";

/** Sitedeki her sayfanın dilden bağımsız kimliği. */
export type RouteKey =
  | { type: "home" }
  | { type: "page"; id: Exclude<PageId, "home"> }
  | { type: "legal"; id: LegalPageId }
  | { type: "category"; id: CategoryId }
  | { type: "product"; id: string }
  | { type: "industry"; id: IndustryId }
  | { type: "caseStudy"; id: string };

export type RouteEntry = {
  key: RouteKey;
  /** Dil önekisiz yol parçaları (ör. ["bere-uretimi", "troisdorf-jets-ponponlu-bere"]). */
  segments: Record<Locale, string[]>;
  seo: Record<Locale, SeoFields>;
};

export type RouteTable = {
  entries: RouteEntry[];
  byKey: Map<string, RouteEntry>;
  byPath: Map<string, RouteEntry>;
};

export function routeKeyId(key: RouteKey): string {
  return key.type === "home" ? "home" : `${key.type}:${key.id}`;
}

const split = (slug: string) => (slug === "" ? [] : slug.split("/"));

function perLocale<T>(fn: (locale: Locale) => T): Record<Locale, T> {
  return Object.fromEntries(locales.map((locale) => [locale, fn(locale)])) as Record<Locale, T>;
}

export function buildRouteTable(store: ContentStore): RouteTable {
  const entries: RouteEntry[] = [];
  const { pages } = store;

  entries.push({
    key: { type: "home" },
    segments: perLocale(() => []),
    seo: pages.home.seo,
  });

  for (const id of Object.keys(pages) as PageId[]) {
    if (id === "home") continue;
    const page = pages[id];
    entries.push({
      key: { type: "page", id },
      segments: perLocale((l) => split(page.seo[l].slug)),
      seo: page.seo,
    });
  }

  for (const legal of store.legalPages) {
    entries.push({
      key: { type: "legal", id: legal.id },
      segments: perLocale((l) => split(legal.seo[l].slug)),
      seo: legal.seo,
    });
  }

  for (const category of store.categories) {
    entries.push({
      key: { type: "category", id: category.id },
      segments: perLocale((l) => split(category.seo[l].slug)),
      seo: category.seo,
    });
  }

  for (const product of store.products) {
    const category = store.categories.find((c) => c.id === product.categoryId);
    if (!category) throw new Error(`Ürün kategorisi bulunamadı: ${product.id}`);
    entries.push({
      key: { type: "product", id: product.id },
      segments: perLocale((l) => [...split(category.seo[l].slug), product.seo[l].slug]),
      seo: product.seo,
    });
  }

  for (const industry of store.industries) {
    entries.push({
      key: { type: "industry", id: industry.id },
      segments: perLocale((l) => split(industry.seo[l].slug)),
      seo: industry.seo,
    });
  }

  for (const caseStudy of store.caseStudies) {
    entries.push({
      key: { type: "caseStudy", id: caseStudy.id },
      segments: perLocale((l) => [...split(pages.references.seo[l].slug), caseStudy.seo[l].slug]),
      seo: caseStudy.seo,
    });
  }

  const byKey = new Map<string, RouteEntry>();
  const byPath = new Map<string, RouteEntry>();
  for (const entry of entries) {
    byKey.set(routeKeyId(entry.key), entry);
    for (const locale of locales) {
      const path = pathKey(locale, entry.segments[locale]);
      const existing = byPath.get(path);
      if (existing) {
        throw new Error(
          `URL çakışması: /${path} hem ${routeKeyId(existing.key)} hem ${routeKeyId(entry.key)} için tanımlı.`,
        );
      }
      byPath.set(path, entry);
    }
  }

  return { entries, byKey, byPath };
}

export function pathKey(locale: Locale, segments: readonly string[]): string {
  return [locale, ...segments].join("/");
}

export function buildHref(
  locale: Locale,
  segments: readonly string[],
  query?: Record<string, string | undefined>,
): string {
  const path = `/${pathKey(locale, segments)}`;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
