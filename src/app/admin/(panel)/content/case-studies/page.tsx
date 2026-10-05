import Link from "next/link";
import { CaseStudiesEditor } from "@/components/admin/case-studies-editor";
import { getContentStore } from "@/lib/content";

export const metadata = { title: "Projeler" };

export default async function AdminCaseStudiesPage() {
  const store = await getContentStore();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-sm font-semibold text-ink-600">
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">Projeler / Case study</h1>
      </div>
      <CaseStudiesEditor
        items={store.caseStudies.map((cs) => ({
          id: cs.id,
          titleTr: cs.title.tr,
          titleEn: cs.title.en,
          summaryTr: cs.summary.tr,
          summaryEn: cs.summary.en,
        }))}
      />
    </div>
  );
}
