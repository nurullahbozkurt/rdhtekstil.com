import type { MetadataRoute } from "next";
import { localeSettings, locales } from "@/i18n/config";
import { localize } from "@/lib/content/localize";
import { getAllRoutes } from "@/lib/routing";
import { buildHref } from "@/lib/routing/table";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getAllRoutes();
  return routes.flatMap((route) => {
    const languages = Object.fromEntries(
      locales.map((l) => [
        localeSettings[l].hreflang,
        absoluteUrl(buildHref(l, route.segments[l])),
      ]),
    );
    return locales
      .filter((l) => !localize(route.seo, l).noindex)
      .map((l) => ({
        url: absoluteUrl(buildHref(l, route.segments[l])),
        changeFrequency: route.key.type === "home" ? "weekly" : "monthly",
        priority: route.key.type === "home" ? 1 : route.key.type === "legal" ? 0.3 : 0.7,
        alternates: { languages },
      }));
  });
}
