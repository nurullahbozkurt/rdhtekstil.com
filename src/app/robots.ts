import type { MetadataRoute } from "next";
import { absoluteUrl, allowIndexing } from "@/lib/site";

/**
 * `/talep` gibi sayfalar robots.txt ile engellenmez; `noindex` etiketinin okunabilmesi için
 * taranabilir kalmaları gerekir.
 */
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
