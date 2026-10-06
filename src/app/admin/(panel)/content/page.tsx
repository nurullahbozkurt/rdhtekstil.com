import Link from "next/link";

export const metadata = { title: "İçerik" };

const sections = [
  {
    href: "/admin/content/faqs",
    label: "SSS",
    text: "Sıkça sorulan sorular ve anasayfa görünürlüğü",
  },
  {
    href: "/admin/content/legal",
    label: "Yasal sayfalar",
    text: "KVKK, gizlilik, çerez ve aydınlatma metinleri",
  },
] as const;

export default function AdminContentPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900 sm:text-3xl">
          İçerik yönetimi
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          SSS ve yasal metinleri paneldan düzenleyin. Diğer site içerikleri kod üzerinden yönetilir.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border border-cream-300 bg-white p-4 transition-colors hover:border-navy-700/30 active:bg-cream-50 sm:p-5"
          >
            <h2 className="font-heading text-xl font-medium text-navy-900">{section.label}</h2>
            <p className="mt-2 text-sm text-ink-600">{section.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
