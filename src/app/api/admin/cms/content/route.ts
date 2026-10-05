import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { patchCmsStore } from "@/lib/content/cms-store";
import { clearContentCache } from "@/lib/content/source";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertSameOrigin } from "@/lib/security/origin";

const faqPatch = z.object({
  type: z.literal("faq"),
  id: z.string(),
  questionTr: z.string().min(1),
  questionEn: z.string().min(1),
  answerTr: z.string().min(1),
  answerEn: z.string().min(1),
});

const legalPatch = z.object({
  type: z.literal("legal"),
  id: z.enum(["kvkk", "privacy", "cookies", "disclosure"]),
  titleTr: z.string().min(1),
  titleEn: z.string().min(1),
  h1Tr: z.string().min(1),
  h1En: z.string().min(1),
  bodyTr: z.string().min(1),
  bodyEn: z.string().min(1),
});

const ctaPatch = z.object({
  type: z.literal("cta"),
  designRequestTr: z.string().min(1),
  designRequestEn: z.string().min(1),
  browseProductsTr: z.string().min(1),
  browseProductsEn: z.string().min(1),
  otherProductsTr: z.string().min(1),
  otherProductsEn: z.string().min(1),
});

const successPatch = z.object({
  type: z.literal("successText"),
  textTr: z.string().min(1),
  textEn: z.string().min(1),
});

const formOptionPatch = z.object({
  type: z.literal("formOption"),
  id: z.string().uuid().optional(),
  optionType: z.enum(["quantity", "country"]),
  value: z.string().min(1),
  labelTr: z.string().min(1),
  labelEn: z.string().min(1),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

const referencePatch = z.object({
  type: z.literal("reference"),
  id: z.string().min(1),
  name: z.string().min(1),
  permissionConfirmed: z.boolean(),
  sortOrder: z.number().int(),
});

const caseStudyPatch = z.object({
  type: z.literal("caseStudy"),
  id: z.string().min(1),
  titleTr: z.string().min(1),
  titleEn: z.string().min(1),
  summaryTr: z.string().min(1),
  summaryEn: z.string().min(1),
});

export async function PATCH(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);

  try {
    if (json?.type === "formOption") {
      const parsed = formOptionPatch.parse(json);
      const admin = createAdminClient();
      if (parsed.id) {
        const { error } = await admin
          .from("form_options")
          .update({
            type: parsed.optionType,
            value: parsed.value,
            label_tr: parsed.labelTr,
            label_en: parsed.labelEn,
            sort_order: parsed.sortOrder,
            is_active: parsed.isActive,
          })
          .eq("id", parsed.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await admin.from("form_options").insert({
          type: parsed.optionType,
          value: parsed.value,
          label_tr: parsed.labelTr,
          label_en: parsed.labelEn,
          sort_order: parsed.sortOrder,
          is_active: parsed.isActive,
        });
        if (error) throw new Error(error.message);
      }
      return NextResponse.json({ ok: true });
    }

    if (json?.type === "faq") {
      const parsed = faqPatch.parse(json);
      await patchCmsStore((store) => {
        const faqs = store.faqs.map((faq) =>
          faq.id === parsed.id
            ? {
                ...faq,
                question: { tr: parsed.questionTr, en: parsed.questionEn },
                answer: { tr: parsed.answerTr, en: parsed.answerEn },
              }
            : faq,
        );
        return { ...store, faqs };
      }, session.user.id);
    } else if (json?.type === "legal") {
      const parsed = legalPatch.parse(json);
      await patchCmsStore((store) => {
        const legalPages = store.legalPages.map((page) => {
          if (page.id !== parsed.id) return page;
          return {
            ...page,
            seo: {
              ...page.seo,
              tr: { ...page.seo.tr, title: parsed.titleTr, h1: parsed.h1Tr },
              en: { ...page.seo.en, title: parsed.titleEn, h1: parsed.h1En },
            },
            intro: { tr: parsed.bodyTr.slice(0, 280), en: parsed.bodyEn.slice(0, 280) },
            sections: {
              tr: [{ heading: parsed.h1Tr, paragraphs: [parsed.bodyTr] }],
              en: [{ heading: parsed.h1En, paragraphs: [parsed.bodyEn] }],
            },
            updatedAt: new Date().toISOString().slice(0, 10),
          };
        });
        return { ...store, legalPages };
      }, session.user.id);
    } else if (json?.type === "cta") {
      const parsed = ctaPatch.parse(json);
      await patchCmsStore((store) => ({
        ...store,
        siteSettings: {
          ...store.siteSettings,
          ctas: {
            ...store.siteSettings.ctas,
            designRequest: { tr: parsed.designRequestTr, en: parsed.designRequestEn },
            browseProducts: { tr: parsed.browseProductsTr, en: parsed.browseProductsEn },
            otherProducts: { tr: parsed.otherProductsTr, en: parsed.otherProductsEn },
          },
        },
      }), session.user.id);
    } else if (json?.type === "successText") {
      const parsed = successPatch.parse(json);
      await patchCmsStore((store) => ({
        ...store,
        pages: {
          ...store.pages,
          requestComplete: {
            ...store.pages.requestComplete,
            content: {
              tr: { ...store.pages.requestComplete.content.tr, text: parsed.textTr },
              en: { ...store.pages.requestComplete.content.en, text: parsed.textEn },
            },
          },
        },
      }), session.user.id);
    } else if (json?.type === "reference") {
      const parsed = referencePatch.parse(json);
      await patchCmsStore((store) => ({
        ...store,
        references: store.references.map((ref) =>
          ref.id === parsed.id
            ? {
                ...ref,
                name: parsed.name,
                permissionConfirmed: parsed.permissionConfirmed,
                sortOrder: parsed.sortOrder,
              }
            : ref,
        ),
      }), session.user.id);
    } else if (json?.type === "caseStudy") {
      const parsed = caseStudyPatch.parse(json);
      await patchCmsStore((store) => ({
        ...store,
        caseStudies: store.caseStudies.map((cs) =>
          cs.id === parsed.id
            ? {
                ...cs,
                title: { tr: parsed.titleTr, en: parsed.titleEn },
                summary: { tr: parsed.summaryTr, en: parsed.summaryEn },
              }
            : cs,
        ),
      }), session.user.id);
    } else {
      return NextResponse.json({ error: "unknown_type" }, { status: 400 });
    }

    clearContentCache();
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "patch_failed" },
      { status: 500 },
    );
  }
}
