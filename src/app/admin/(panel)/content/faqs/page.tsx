import Link from "next/link";
import { FaqEditor } from "@/components/admin/faq-editor";
import { getContentStore } from "@/lib/content";

export const metadata = { title: "SSS" };

export default async function AdminFaqsPage() {
  const store = await getContentStore();
  const items = store.faqs.map((faq) => ({
    id: faq.id,
    questionTr: faq.question.tr,
    questionEn: faq.question.en,
    answerTr: faq.answer.tr,
    answerEn: faq.answer.en,
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-sm font-semibold text-ink-600">
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">SSS</h1>
      </div>
      <FaqEditor items={items} />
    </div>
  );
}
