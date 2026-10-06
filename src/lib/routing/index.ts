import "server-only";

import { cache } from "react";
import { locales, type Locale } from "@/i18n/config";
import { getContentStore } from "@/lib/content";
import { localize } from "@/lib/content/localize";
import type { CategoryId, IndustryId, LegalPageId, PageId, SeoFields } from "@/lib/content/schema";
import {
  buildHref,
  buildRouteTable,
  pathKey,
  routeKeyId,
  type RouteEntry,
  type RouteKey,
} from "./table";

export type { RouteKey } from "./table";

export const getRouteTable = cache(async () => buildRouteTable(await getContentStore()));

export async function resolveRoute(
  locale: Locale,
  segments: readonly string[],
): Promise<RouteEntry | undefined> {
  const table = await getRouteTable();
  return table.byPath.get(
    pathKey(
      locale,
      segments.map((s) => decodeURIComponent(s)),
    ),
  );
}

/** Tüm dillerdeki tüm yollar (generateStaticParams ve sitemap için). */
export async function getAllRoutes(): Promise<RouteEntry[]> {
  return (await getRouteTable()).entries;
}

export async function getSeo(key: RouteKey, locale: Locale): Promise<SeoFields> {
  const entry = (await getRouteTable()).byKey.get(routeKeyId(key));
  if (!entry) throw new Error(`Rota bulunamadı: ${routeKeyId(key)}`);
  return localize(entry.seo, locale);
}

export type RequestQuery = { urun?: string; alan?: string; kalip?: string };

/** Bir dil için bağlantı üreticisi. */
export async function getLinks(locale: Locale) {
  const table = await getRouteTable();
  const to = (key: RouteKey, query?: Record<string, string | undefined>) => {
    const entry = table.byKey.get(routeKeyId(key));
    if (!entry) throw new Error(`Rota bulunamadı: ${routeKeyId(key)}`);
    return buildHref(locale, entry.segments[locale], query);
  };
  return {
    to,
    home: () => to({ type: "home" }),
    page: (id: Exclude<PageId, "home">) => to({ type: "page", id }),
    legal: (id: LegalPageId) => to({ type: "legal", id }),
    category: (id: CategoryId) => to({ type: "category", id }),
    product: (id: string) => to({ type: "product", id }),
    industry: (id: IndustryId) => to({ type: "industry", id }),
    caseStudy: (id: string) => to({ type: "caseStudy", id }),
    request: (query: RequestQuery = {}) => to({ type: "page", id: "request" }, query),
  };
}

export type Links = Awaited<ReturnType<typeof getLinks>>;

/** Bir sayfanın tüm dillerdeki adresleri (hreflang ve dil seçici için). */
export async function getAlternates(key: RouteKey): Promise<Record<Locale, string>> {
  const entry = (await getRouteTable()).byKey.get(routeKeyId(key));
  if (!entry) throw new Error(`Rota bulunamadı: ${routeKeyId(key)}`);
  return Object.fromEntries(locales.map((l) => [l, buildHref(l, entry.segments[l])])) as Record<
    Locale,
    string
  >;
}

/** Dil seçici için: her yolun diğer dillerdeki karşılığı. */
export async function getLanguageMap(): Promise<Record<string, Record<Locale, string>>> {
  const table = await getRouteTable();
  const map: Record<string, Record<Locale, string>> = {};
  for (const entry of table.entries) {
    const hrefs = Object.fromEntries(
      locales.map((l) => [l, buildHref(l, entry.segments[l])]),
    ) as Record<Locale, string>;
    for (const l of locales) map[hrefs[l]] = hrefs;
  }
  return map;
}
