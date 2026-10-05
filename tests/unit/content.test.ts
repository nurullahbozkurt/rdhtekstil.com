import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/config";
import {
  getCaseStudies,
  getCategories,
  getFaqs,
  getFormOptions,
  getIndustries,
  getProductBySlug,
  getProducts,
  getReferences,
  getSiteSettings,
} from "@/lib/content";
import { seed } from "@/lib/content/data";
import { localize } from "@/lib/content/localize";
import { contentStoreSchema } from "@/lib/content/schema";

const store = contentStoreSchema.parse(seed);

describe("seed verisi", () => {
  it("içerik şemasından geçer", () => {
    const result = contentStoreSchema.safeParse(seed);
    if (!result.success) console.error(JSON.stringify(result.error.issues, null, 2));
    expect(result.success).toBe(true);
  });

  it("benzersiz kimliklere sahiptir", () => {
    for (const list of [
      store.products,
      store.categories,
      store.industries,
      store.caseStudies,
      store.faqs,
      store.references,
    ]) {
      const ids = list.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("tüm çapraz referanslar mevcut kayıtları gösterir", () => {
    const productIds = new Set(store.products.map((p) => p.id));
    const caseIds = new Set(store.caseStudies.map((c) => c.id));
    const faqIds = new Set(store.faqs.map((f) => f.id));
    const referenceIds = new Set(store.references.map((r) => r.id));

    for (const product of store.products) {
      const category = store.categories.find((c) => c.id === product.categoryId);
      expect(category, product.id).toBeDefined();
      for (const typeId of product.typeIds) {
        expect(
          category?.types.some((t) => t.id === typeId),
          `${product.id} → ${typeId}`,
        ).toBe(true);
      }
      for (const id of product.caseStudyIds)
        expect(caseIds.has(id), `${product.id} → ${id}`).toBe(true);
      for (const id of product.faqIds) expect(faqIds.has(id)).toBe(true);
    }
    for (const caseStudy of store.caseStudies) {
      expect(referenceIds.has(caseStudy.referenceId)).toBe(true);
      for (const id of caseStudy.productIds)
        expect(productIds.has(id), `${caseStudy.id} → ${id}`).toBe(true);
    }
    for (const list of [store.categories, store.industries]) {
      for (const item of list) {
        for (const id of item.faqIds) expect(faqIds.has(id), `${item.id} → ${id}`).toBe(true);
      }
    }
  });

  it("her kategori tipinde en az bir ürün vardır", () => {
    for (const category of store.categories) {
      for (const type of category.types) {
        const count = store.products.filter(
          (p) => p.categoryId === category.id && p.typeIds.includes(type.id),
        ).length;
        expect(count, `${category.id}/${type.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("referans verilen tüm görseller public/ altında bulunur", () => {
    const sources = new Set<string>();
    const collect = (value: unknown) => {
      if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === "object") {
        for (const [key, item] of Object.entries(value)) {
          if (
            (key === "src" || key === "ogImage" || key === "defaultOgImage") &&
            typeof item === "string"
          ) {
            sources.add(item);
          } else collect(item);
        }
      }
    };
    collect(store);
    expect(sources.size).toBeGreaterThan(20);
    for (const src of sources) {
      expect(existsSync(path.join(process.cwd(), "public", src)), src).toBe(true);
    }
  });

  it("aynı dilde iki sayfa aynı slug'ı kullanmaz", () => {
    for (const locale of locales) {
      const topLevel = [
        ...Object.values(store.pages).map((p) => p.seo[locale].slug),
        ...store.categories.map((c) => c.seo[locale].slug),
        ...store.industries.map((i) => i.seo[locale].slug),
        ...store.legalPages.map((l) => l.seo[locale].slug),
      ];
      expect(new Set(topLevel).size).toBe(topLevel.length);
    }
  });
});

describe("localize", () => {
  it("çok dilli alanları seçilen dile indirger", () => {
    const value = {
      a: { tr: "Merhaba", en: "Hello" },
      list: [{ x: { tr: "1", en: "one" } }],
      n: 3,
    };
    expect(localize(value, "en")).toEqual({ a: "Hello", list: [{ x: "one" }], n: 3 });
    expect(localize(value, "tr")).toEqual({ a: "Merhaba", list: [{ x: "1" }], n: 3 });
  });
});

describe("içerik erişim arayüzü", () => {
  it("kategorileri sıralı ve yerelleştirilmiş döndürür", async () => {
    const tr = await getCategories("tr");
    const en = await getCategories("en");
    expect(tr.map((c) => c.id)).toEqual(["beanies", "scarves", "sets"]);
    expect(tr[0]?.name).toBe("Bereler");
    expect(en[0]?.name).toBe("Beanies");
    expect(en[0]?.seo.slug).toBe("beanie-manufacturing");
  });

  it("ürünleri filtreler", async () => {
    const beanies = await getProducts("tr", { categoryId: "beanies" });
    expect(beanies.length).toBeGreaterThan(0);
    expect(beanies.every((p) => p.categoryId === "beanies")).toBe(true);

    const pompom = await getProducts("tr", { categoryId: "beanies", typeId: "pompom" });
    expect(pompom.every((p) => p.typeIds.includes("pompom"))).toBe(true);

    const corporate = await getProducts("en", { industryId: "corporate", limit: 2 });
    expect(corporate).toHaveLength(2);
  });

  it("ürünü dile göre slug ile bulur", async () => {
    const tr = await getProductBySlug("tr", "troisdorf-jets-ponponlu-bere");
    const en = await getProductBySlug("en", "troisdorf-jets-pompom-beanie");
    expect(tr?.id).toBe("troisdorf-jets-bere");
    expect(en?.id).toBe("troisdorf-jets-bere");
    expect(await getProductBySlug("en", "troisdorf-jets-ponponlu-bere")).toBeUndefined();
  });

  it("kullanım alanı referanslarını kategoriye göre listeler", async () => {
    const references = await getReferences("tr", { categories: ["corporate"] });
    expect(references.map((r) => r.id)).toContain("tinder");
    const cases = await getCaseStudies("tr", { categories: ["private-label"] });
    expect(cases.every((c) => c.categories.includes("private-label"))).toBe(true);
  });

  it("SSS'leri konuya göre ve id sırasıyla döndürür", async () => {
    const general = await getFaqs("tr", { topic: "general" });
    expect(general).toHaveLength(6);
    const ordered = await getFaqs("en", { ids: ["own-logo", "min-order"] });
    expect(ordered.map((f) => f.id)).toEqual(["own-logo", "min-order"]);
  });

  it("form seçeneklerini döndürür", async () => {
    const quantities = await getFormOptions("quantity", "tr");
    expect(quantities.map((o) => o.label)).toEqual([
      "50–99",
      "100–249",
      "250–499",
      "500–999",
      "1.000–2.499",
      "2.500+",
    ]);
  });

  it("site ayarlarını iki dilde sağlar", async () => {
    const tr = await getSiteSettings("tr");
    const en = await getSiteSettings("en");
    expect(tr.tagline).toBe("CUSTOM SCARVES & BEANIES");
    expect(tr.ctas.designRequest).toBe("Tasarım Talebi Oluştur");
    expect(en.ctas.designRequest).toBe("Create Design Request");
    expect(tr.valueProps).toHaveLength(6);
  });

  it("tüm dillerde kullanım alanı sayfası vardır", async () => {
    for (const locale of locales) {
      expect(await getIndustries(locale)).toHaveLength(5);
    }
  });
});
