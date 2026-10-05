import Link from "next/link";
import { CtaEditor } from "@/components/admin/cta-editor";
import { getContentStore } from "@/lib/content";

export const metadata = { title: "CTA & başarı metni" };

export default async function AdminCtasPage() {
  const store = await getContentStore();
  const ctas = store.siteSettings.ctas;
  const success = store.pages.requestComplete.content;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-sm font-semibold text-ink-600">
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">CTA & başarı metni</h1>
      </div>
      <CtaEditor
        initial={{
          designRequestTr: ctas.designRequest.tr,
          designRequestEn: ctas.designRequest.en,
          browseProductsTr: ctas.browseProducts.tr,
          browseProductsEn: ctas.browseProducts.en,
          otherProductsTr: ctas.otherProducts.tr,
          otherProductsEn: ctas.otherProducts.en,
          textTr: success.tr.text,
          textEn: success.en.text,
        }}
      />
    </div>
  );
}
