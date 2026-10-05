import Link from "next/link";
import { CatalogEditor } from "@/components/admin/catalog-editor";
import { getContentStore } from "@/lib/content";

export const metadata = { title: "Katalog" };

export default async function AdminCatalogPage() {
  const store = await getContentStore();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-sm font-semibold text-ink-600">
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">Katalog</h1>
        <p className="mt-1 text-sm text-ink-600">
          Ürün, kategori ve kullanım alanı metinlerini düzenleyin. SEO için{" "}
          <Link href="/admin/content/seo" className="underline">
            SEO sayfasına
          </Link>{" "}
          gidin.
        </p>
      </div>

      <CatalogEditor
        products={store.products.map((p) => ({
          id: p.id,
          nameTr: p.name.tr,
          nameEn: p.name.en,
          summaryTr: p.summary.tr,
          summaryEn: p.summary.en,
        }))}
        categories={store.categories.map((c) => ({
          id: c.id,
          nameTr: c.name.tr,
          nameEn: c.name.en,
        }))}
        industries={store.industries.map((i) => ({
          id: i.id,
          nameTr: i.name.tr,
          nameEn: i.name.en,
          ctaTr: i.cta.tr,
          ctaEn: i.cta.en,
        }))}
      />
    </div>
  );
}
