import "server-only";

import type { Metadata } from "next";
import { defaultLocale, localeSettings, locales, type Locale } from "@/i18n/config";
import { getSiteSettings } from "@/lib/content";
import { getAlternates, getSeo, type RouteKey } from "@/lib/routing";
import { absoluteUrl, allowIndexing } from "@/lib/site";

/** İçerik katmanındaki SEO alanlarından sayfa metadata'sı üretir. */
export async function buildMetadata(locale: Locale, key: RouteKey): Promise<Metadata> {
  const [seo, alternates, settings] = await Promise.all([
    getSeo(key, locale),
    getAlternates(key),
    getSiteSettings(locale),
  ]);

  const url = absoluteUrl(alternates[locale]);
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [localeSettings[l].hreflang, absoluteUrl(alternates[l])]),
  );
  languages["x-default"] = absoluteUrl(alternates[defaultLocale]);

  const ogTitle = seo.ogTitle ?? seo.title;
  const ogDescription = seo.ogDescription ?? seo.description;
  const ogImage = absoluteUrl(seo.ogImage ?? settings.defaultOgImage);
  const index = allowIndexing && !seo.noindex;

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: seo.canonical ?? url,
      languages: seo.noindex ? undefined : languages,
    },
    openGraph: {
      type: "website",
      siteName: settings.brandName,
      title: ogTitle,
      description: ogDescription,
      url,
      locale: localeSettings[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeSettings[l].ogLocale),
      images: [{ url: ogImage, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    robots: index ? { index: true, follow: true } : { index: false, follow: !seo.noindex },
  };
}
