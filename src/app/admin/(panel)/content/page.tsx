import Link from "next/link";
import { CmsSeedButton } from "@/components/admin/cms-seed-button";
import { readCmsStore } from "@/lib/content/cms-store";

export const metadata = { title: "İçerik" };

const sections = [
  { href: "/admin/content/faqs", label: "SSS (FAQ)", text: "Sıkça sorulan sorular" },
  { href: "/admin/content/legal", label: "Yasal sayfalar", text: "KVKK, gizlilik, çerez, aydınlatma" },
  { href: "/admin/content/ctas", label: "CTA & başarı metni", text: "Buton metinleri ve talep başarı metni" },
  { href: "/admin/content/form-options", label: "Form seçenekleri", text: "Adet aralıkları ve ülkeler" },
  { href: "/admin/content/references", label: "Referanslar", text: "Marka logoları ve izin durumu" },
  { href: "/admin/content/case-studies", label: "Projeler", text: "Case study başlık ve özetleri" },
  { href: "/admin/content/catalog", label: "Katalog özeti", text: "Ürün / kategori / kullanım alanı (seed üzerinden)" },
] as const;

export default async function AdminContentPage() {
  const store = await readCmsStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight">İçerik yönetimi</h1>
        <p className="mt-1 text-sm text-ink-600">
          Site içeriğini paneldan düzenleyin. Değişiklikler anında yeniden doğrulanır.
        </p>
      </div>

      <CmsSeedButton seeded={Boolean(store)} />

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border border-cream-300 bg-white p-5 transition-colors hover:border-navy-700/30"
          >
            <h2 className="font-heading text-xl font-medium text-navy-900">{section.label}</h2>
            <p className="mt-2 text-sm text-ink-600">{section.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
