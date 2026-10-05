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
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-sm font-semibold text-ink-600">
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">Yasal sayfalar</h1>
      </div>
      <LegalEditor items={items} />
    </div>
  );
}
