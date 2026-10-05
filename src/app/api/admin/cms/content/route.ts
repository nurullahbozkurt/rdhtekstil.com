import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { patchCmsStore } from "@/lib/content/cms-store";
import { clearContentCache } from "@/lib/content/source";
import type { SeoFields } from "@/lib/content/schema";
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

const productPatch = z.object({
  type: z.literal("product"),
  id: z.string().min(1),
  nameTr: z.string().min(1),
  nameEn: z.string().min(1),
  summaryTr: z.string().min(1),
  summaryEn: z.string().min(1),
});

const categoryPatch = z.object({
  type: z.literal("category"),
  id: z.string().min(1),
  nameTr: z.string().min(1),
  nameEn: z.string().min(1),
});

const industryPatch = z.object({
  type: z.literal("industry"),
  id: z.string().min(1),
  nameTr: z.string().min(1),
  nameEn: z.string().min(1),
  ctaTr: z.string().min(1),
  ctaEn: z.string().min(1),
});

const seoPatch = z.object({
  type: z.literal("seo"),
  kind: z.enum(["page", "category", "product", "industry"]),
  key: z.string().min(1),
  slugTr: z.string(),
  slugEn: z.string(),
  titleTr: z.string().min(10).max(70),
  titleEn: z.string().min(10).max(70),
  descriptionTr: z.string().min(50).max(170),
  descriptionEn: z.string().min(50).max(170),
  h1Tr: z.string().min(1),
  h1En: z.string().min(1),
});

function applySeo(
  existing: { tr: SeoFields; en: SeoFields },
  parsed: z.infer<typeof seoPatch>,
): { tr: SeoFields; en: SeoFields } {
  return {
    tr: {
      ...existing.tr,
      slug: parsed.slugTr,
      title: parsed.titleTr,
      description: parsed.descriptionTr,
      h1: parsed.h1Tr,
    },
    en: {
      ...existing.en,
      slug: parsed.slugEn,
      title: parsed.titleEn,
      description: parsed.descriptionEn,
      h1: parsed.h1En,
    },
  };
}

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
    } else if (json?.type === "product") {
      const parsed = productPatch.parse(json);
      await patchCmsStore((store) => ({
        ...store,
        products: store.products.map((p) =>
          p.id === parsed.id
            ? {
                ...p,
                name: { tr: parsed.nameTr, en: parsed.nameEn },
                summary: { tr: parsed.summaryTr, en: parsed.summaryEn },
              }
            : p,
        ),
      }), session.user.id);
    } else if (json?.type === "category") {
      const parsed = categoryPatch.parse(json);
      await patchCmsStore((store) => ({
        ...store,
        categories: store.categories.map((c) =>
          c.id === parsed.id
            ? { ...c, name: { tr: parsed.nameTr, en: parsed.nameEn } }
            : c,
        ),
      }), session.user.id);
    } else if (json?.type === "industry") {
      const parsed = industryPatch.parse(json);
      await patchCmsStore((store) => ({
        ...store,
        industries: store.industries.map((i) =>
          i.id === parsed.id
            ? {
                ...i,
                name: { tr: parsed.nameTr, en: parsed.nameEn },
                cta: { tr: parsed.ctaTr, en: parsed.ctaEn },
              }
            : i,
        ),
      }), session.user.id);
    } else if (json?.type === "seo") {
      const parsed = seoPatch.parse(json);
      await patchCmsStore((store) => {
        if (parsed.kind === "page") {
          const pageKey = parsed.key as keyof typeof store.pages;
          const page = store.pages[pageKey];
          if (!page) throw new Error("unknown_page");
          return {
            ...store,
            pages: {
              ...store.pages,
              [pageKey]: {
                ...page,
                seo: applySeo(page.seo, parsed),
              },
            },
          };
        }
        if (parsed.kind === "category") {
          return {
            ...store,
            categories: store.categories.map((c) =>
              c.id === parsed.key ? { ...c, seo: applySeo(c.seo, parsed) } : c,
            ),
          };
        }
        if (parsed.kind === "product") {
          return {
            ...store,
            products: store.products.map((p) =>
              p.id === parsed.key ? { ...p, seo: applySeo(p.seo, parsed) } : p,
            ),
          };
        }
        return {
          ...store,
          industries: store.industries.map((i) =>
            i.id === parsed.key ? { ...i, seo: applySeo(i.seo, parsed) } : i,
          ),
        };
      }, session.user.id);
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
