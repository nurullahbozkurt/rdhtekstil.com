import Link from "next/link";
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
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">Katalog özeti</h1>
        <p className="mt-1 text-sm text-ink-600">
          Ürün/kategori/kullanım alanı verisi CMS seed’i ile yönetilir. Detaylı alan düzenleme sonraki
          iterasyonda genişletilebilir; seed sonrası site bu kaynaktan okur.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-cream-300 bg-white p-5">
          <p className="text-sm text-ink-500">Kategoriler</p>
          <p className="mt-1 font-heading text-3xl font-medium">{store.categories.length}</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-white p-5">
          <p className="text-sm text-ink-500">Ürünler</p>
          <p className="mt-1 font-heading text-3xl font-medium">{store.products.length}</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-white p-5">
          <p className="text-sm text-ink-500">Kullanım alanları</p>
          <p className="mt-1 font-heading text-3xl font-medium">{store.industries.length}</p>
        </div>
      </div>

      <ul className="space-y-2 rounded-2xl border border-cream-300 bg-white p-5 text-sm">
        {store.products.map((product) => (
          <li key={product.id} className="flex justify-between gap-3 border-b border-cream-100 py-2 last:border-0">
            <span className="font-medium text-navy-900">{product.name.tr}</span>
            <span className="text-ink-500">{product.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
