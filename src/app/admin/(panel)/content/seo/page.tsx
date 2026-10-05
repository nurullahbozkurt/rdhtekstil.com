import Link from "next/link";
import { SeoEditor, type SeoRow } from "@/components/admin/seo-editor";
import { getContentStore } from "@/lib/content";

export const metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  const store = await getContentStore();

  const pageKeys = [
    "home",
    "products",
    "industries",
    "customProduction",
    "references",
    "about",
    "contact",
    "faq",
  ] as const;

  const items: SeoRow[] = [
    ...pageKeys.map((key) => {
      const page = store.pages[key];
      return {
        key,
        kind: "page" as const,
        label: `Sayfa: ${key}`,
        slugTr: page.seo.tr.slug,
        slugEn: page.seo.en.slug,
        titleTr: page.seo.tr.title,
        titleEn: page.seo.en.title,
        descriptionTr: page.seo.tr.description,
        descriptionEn: page.seo.en.description,
        h1Tr: page.seo.tr.h1,
        h1En: page.seo.en.h1,
      };
    }),
    ...store.categories.map((c) => ({
      key: c.id,
      kind: "category" as const,
      label: `Kategori: ${c.name.tr}`,
      slugTr: c.seo.tr.slug,
      slugEn: c.seo.en.slug,
      titleTr: c.seo.tr.title,
      titleEn: c.seo.en.title,
      descriptionTr: c.seo.tr.description,
      descriptionEn: c.seo.en.description,
      h1Tr: c.seo.tr.h1,
      h1En: c.seo.en.h1,
    })),
    ...store.products.map((p) => ({
      key: p.id,
      kind: "product" as const,
      label: `Ürün: ${p.name.tr}`,
      slugTr: p.seo.tr.slug,
      slugEn: p.seo.en.slug,
      titleTr: p.seo.tr.title,
      titleEn: p.seo.en.title,
      descriptionTr: p.seo.tr.description,
      descriptionEn: p.seo.en.description,
      h1Tr: p.seo.tr.h1,
      h1En: p.seo.en.h1,
    })),
    ...store.industries.map((i) => ({
      key: i.id,
      kind: "industry" as const,
      label: `Alan: ${i.name.tr}`,
      slugTr: i.seo.tr.slug,
      slugEn: i.seo.en.slug,
      titleTr: i.seo.tr.title,
      titleEn: i.seo.en.title,
      descriptionTr: i.seo.tr.description,
      descriptionEn: i.seo.en.description,
      h1Tr: i.seo.tr.h1,
      h1En: i.seo.en.h1,
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-sm font-semibold text-ink-600">
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">SEO alanları</h1>
        <p className="mt-1 text-sm text-ink-600">
          Slug, title, meta description ve H1 — dil bazlı.
        </p>
      </div>
      <SeoEditor items={items} />
    </div>
  );
}
