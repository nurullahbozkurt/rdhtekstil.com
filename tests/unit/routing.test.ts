import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/config";
import { seed } from "@/lib/content/data";
import { contentStoreSchema } from "@/lib/content/schema";
import { getAlternates, getLinks, resolveRoute } from "@/lib/routing";
import { buildHref, buildRouteTable } from "@/lib/routing/table";

const store = contentStoreSchema.parse(seed);

describe("rota tablosu", () => {
  const table = buildRouteTable(store);

  it("her dil için her içeriğe tek bir yol üretir", () => {
    const expected =
      1 +
      9 +
      store.legalPages.length +
      store.categories.length +
      store.products.length +
      store.industries.length +
      store.caseStudies.length;
    expect(table.entries).toHaveLength(expected);
    for (const locale of locales) {
      const paths = table.entries.map((e) => e.segments[locale].join("/"));
      expect(new Set(paths).size).toBe(paths.length);
    }
  });

  it("örnek SEO adresleri spesifikasyonla uyumludur", () => {
    const tr = new Set(table.entries.map((e) => e.segments.tr.join("/")));
    for (const slug of [
      "bere-uretimi",
      "atki-uretimi",
      "taraftar-atkisi",
      "futbol-kulubu-atkisi",
      "kurumsal-bere-atki",
      "okul-bere-atki",
      "private-label-bere-atki",
      "talep",
      "talep/tamamlandi",
    ]) {
      expect(tr.has(slug), slug).toBe(true);
    }
    const en = new Set(table.entries.map((e) => e.segments.en.join("/")));
    expect(en.has("beanie-manufacturing")).toBe(true);
    expect(en.has("scarf-manufacturing")).toBe(true);
  });

  it("çakışan slug'ları reddeder", () => {
    const broken = structuredClone(store);
    const [first, second] = broken.categories;
    if (!first || !second) throw new Error("seed");
    second.seo.tr.slug = first.seo.tr.slug;
    expect(() => buildRouteTable(broken)).toThrow();
  });

  it("buildHref boş sorgu parametrelerini atlar", () => {
    expect(buildHref("tr", ["talep"], { urun: "x", alan: undefined })).toBe("/tr/talep?urun=x");
    expect(buildHref("en", [])).toBe("/en");
  });
});

describe("rota çözümleme", () => {
  it("dil bazlı slug'ları aynı içeriğe çözer", async () => {
    const tr = await resolveRoute("tr", ["bere-uretimi"]);
    const en = await resolveRoute("en", ["beanie-manufacturing"]);
    expect(tr?.key).toEqual({ type: "category", id: "beanies" });
    expect(en?.key).toEqual(tr?.key);
    expect(await resolveRoute("en", ["bere-uretimi"])).toBeUndefined();
  });

  it("talep bağlantıları ürün ve kullanım alanını taşır", async () => {
    const links = await getLinks("tr");
    expect(links.request({ urun: "troisdorf-jets-bere" })).toBe(
      "/tr/talep?urun=troisdorf-jets-bere",
    );
    expect(links.request({ alan: "fans" })).toBe("/tr/talep?alan=fans");
    const en = await getLinks("en");
    expect(en.request({ urun: "a", alan: "b" })).toBe("/en/request?urun=a&alan=b");
  });

  it("hreflang karşılıkları her dili içerir", async () => {
    const alternates = await getAlternates({ type: "industry", id: "fans" });
    expect(alternates).toEqual({ tr: "/tr/taraftar-atkisi", en: "/en/fan-scarves" });
  });
});
