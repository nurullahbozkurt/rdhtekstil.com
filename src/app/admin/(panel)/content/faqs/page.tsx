import Link from "next/link";
import { FaqEditor } from "@/components/admin/faq-editor";
import { getContentStore } from "@/lib/content";

export const metadata = { title: "SSS" };

export default async function AdminFaqsPage() {
  const store = await getContentStore();
  const items = [...store.faqs]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((faq) => ({
      id: faq.id,
      questionTr: faq.question.tr,
      questionEn: faq.question.en,
      answerTr: faq.answer.tr,
      answerEn: faq.answer.en,
      topics: [...faq.topics],
      sortOrder: faq.sortOrder,
      showOnHome: faq.showOnHome ?? faq.topics.includes("general"),
    }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/content"
          className="inline-flex min-h-10 items-center text-sm font-semibold text-ink-600 hover:text-navy-900"
        >
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-medium tracking-tight text-navy-900 sm:text-3xl">
          SSS
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Soruları açarak düzenleyin. Ev ikonu ile anasayfada gösterimi seçin; ardından Kaydet’e
          basın.
        </p>
      </div>
      <FaqEditor items={items} />
    </div>
  );
}
