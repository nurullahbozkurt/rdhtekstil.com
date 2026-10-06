import Link from "next/link";
import { LegalEditor } from "@/components/admin/legal-editor";
import { getContentStore } from "@/lib/content";

export const metadata = { title: "Yasal sayfalar" };

export default async function AdminLegalPage() {
  const store = await getContentStore();
  const items = store.legalPages.map((page) => ({
    id: page.id,
    titleTr: page.seo.tr.title,
    titleEn: page.seo.en.title,
    h1Tr: page.seo.tr.h1,
    h1En: page.seo.en.h1,
    bodyTr: page.sections.tr.map((s) => `${s.heading}\n${s.paragraphs.join("\n")}`).join("\n\n"),
    bodyEn: page.sections.en.map((s) => `${s.heading}\n${s.paragraphs.join("\n")}`).join("\n\n"),
  }));

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <Link
          href="/admin/content"
          className="inline-flex min-h-10 items-center text-sm font-semibold text-ink-600 hover:text-navy-900"
        >
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-medium tracking-tight text-navy-900 sm:text-3xl">
          Yasal sayfalar
        </h1>
      </div>
      <LegalEditor items={items} />
    </div>
  );
}
