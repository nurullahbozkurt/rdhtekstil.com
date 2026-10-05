import { z } from "zod";
import { locales, type Locale } from "@/i18n/config";

/**
 * İçerik katmanının veri modeli. Faz 3'te Supabase şeması bu tanımlardan türetilecek.
 * Çok dilli her alan `localized(...)` ile tanımlanır: her dil için ayrı değer zorunludur.
 */
export function localized<T extends z.ZodType>(schema: T) {
  const shape = Object.fromEntries(locales.map((locale) => [locale, schema])) as {
    [K in Locale]: T;
  };
  return z.object(shape);
}

const text = z.string().trim().min(1);
const slugSegment = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .refine((value) => value === "" || value.split("/").every((part) => slugSegment.test(part)), {
    error: "Slug yalnızca küçük harf, rakam, tire ve '/' içerebilir.",
  });

export const seoSchema = z.object({
  slug: slugSchema,
  title: z.string().min(10).max(70),
  description: z.string().min(50).max(170),
  h1: text,
  ogTitle: text.optional(),
  ogDescription: text.optional(),
  /** Site köküne göre yol (ör. /product-images/...) */
  ogImage: z.string().startsWith("/").optional(),
  /** Boşsa sayfanın kendi URL'si kanonik kabul edilir. */
  canonical: z.url().optional(),
  noindex: z.boolean().default(false),
});

export const contentStatusSchema = z.enum(["final", "placeholder"]);

export const imageSchema = z.object({
  /** null → görsel henüz yok, işaretli placeholder gösterilir (TODO(content)). */
  src: z.string().startsWith("/").nullable(),
  alt: localized(text),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const categoryIdSchema = z.enum(["beanies", "scarves", "sets"]);
export const industryIdSchema = z.enum([
  "football-clubs",
  "fans",
  "corporate",
  "schools",
  "private-label",
]);
export const referenceCategorySchema = z.enum([
  "football",
  "fan",
  "corporate",
  "school",
  "private-label",
  "other",
]);
export const customizationSchema = z.enum(["color", "pattern", "logo", "label"]);

export const productTypeSchema = z.object({
  id: z.string().regex(slugSegment),
  label: localized(text),
});

export const categorySchema = z.object({
  id: categoryIdSchema,
  name: localized(text),
  /** Menü ve footer'da kullanılan kısa ad */
  shortName: localized(text),
  cardText: localized(text),
  cardCta: localized(text),
  intro: localized(text),
  image: imageSchema,
  types: z.array(productTypeSchema).min(1),
  faqIds: z.array(z.string()),
  seo: localized(seoSchema),
  sortOrder: z.number().int(),
});

export const productSchema = z.object({
  /** Dilden bağımsız kalıcı anahtar; talep ekranında `?urun=<id>` olarak taşınır. */
  id: z.string().regex(slugSegment),
  categoryId: categoryIdSchema,
  typeIds: z.array(z.string()).min(1),
  industryIds: z.array(industryIdSchema),
  name: localized(text),
  summary: localized(text),
  description: localized(text),
  features: localized(z.array(text).min(1)),
  customizations: z.array(customizationSchema).min(1),
  images: z.array(imageSchema).min(1),
  caseStudyIds: z.array(z.string()),
  faqIds: z.array(z.string()),
  seo: localized(seoSchema),
  featured: z.boolean().default(false),
  sortOrder: z.number().int(),
  contentStatus: contentStatusSchema,
});

export const industrySchema = z.object({
  id: industryIdSchema,
  name: localized(text),
  /** Footer'da kullanılan kısa ad */
  shortName: localized(text),
  cardText: localized(text),
  intro: localized(text),
  highlights: localized(z.array(text).min(1)),
  cta: localized(text),
  image: imageSchema,
  referenceCategories: z.array(referenceCategorySchema).min(1),
  faqIds: z.array(z.string()),
  seo: localized(seoSchema),
  sortOrder: z.number().int(),
});

export const referenceSchema = z.object({
  id: z.string().regex(slugSegment),
  name: text,
  /** null → logo dosyası henüz yok; marka adı yazı olarak gösterilir. */
  logo: imageSchema.nullable(),
  categories: z.array(referenceCategorySchema).min(1),
  /** Logonun sitede kullanım izni RDH tarafından teyit edildi mi? */
  permissionConfirmed: z.boolean(),
  sortOrder: z.number().int(),
});

export const caseStudySchema = z.object({
  id: z.string().regex(slugSegment),
  referenceId: z.string(),
  categories: z.array(referenceCategorySchema).min(1),
  title: localized(text),
  summary: localized(text),
  sector: localized(text),
  productLabel: localized(text),
  productIds: z.array(z.string()).min(1),
  country: localized(text),
  quantity: localized(text).optional(),
  need: localized(text),
  solution: localized(text),
  features: localized(z.array(text).min(1)),
  images: z.array(imageSchema).min(1),
  finalImage: imageSchema,
  seo: localized(seoSchema),
  sortOrder: z.number().int(),
  contentStatus: contentStatusSchema,
});

export const faqTopicSchema = z.union([
  z.literal("general"),
  categoryIdSchema,
  industryIdSchema,
  z.literal("custom-production"),
]);

export const faqSchema = z.object({
  id: z.string().regex(slugSegment),
  question: localized(text),
  answer: localized(text),
  topics: z.array(faqTopicSchema).min(1),
  sortOrder: z.number().int(),
});

export const formOptionSchema = z.object({
  type: z.enum(["quantity", "country", "productInterest"]),
  value: z.string().min(1),
  label: localized(text),
  sortOrder: z.number().int(),
  isActive: z.boolean().default(true),
});

const legalSectionSchema = z.object({ heading: text, paragraphs: z.array(text).min(1) });

export const legalPageIdSchema = z.enum(["kvkk", "privacy", "cookies", "disclosure"]);

export const legalPageSchema = z.object({
  id: legalPageIdSchema,
  /** Footer bağlantı metni */
  navLabel: localized(text),
  seo: localized(seoSchema),
  intro: localized(text),
  sections: localized(z.array(legalSectionSchema).min(1)),
  /** Metin sürümü; Faz 2'de KVKK onay kaydıyla birlikte saklanacak. */
  version: z.string().min(1),
  updatedAt: z.iso.date(),
  contentStatus: contentStatusSchema,
});

const iconSchema = z.enum([
  "target",
  "palette",
  "layers",
  "tag",
  "zap",
  "truck",
  "upload",
  "mail",
  "message",
  "factory",
  "check",
  "pen",
  "shirt",
  "sparkles",
]);

const valuePropSchema = z.object({
  id: z.string(),
  icon: iconSchema,
  title: localized(text),
  short: localized(text),
  long: localized(text),
});

const stepSchema = z.object({
  title: localized(text),
  text: localized(text),
});

export const siteSettingsSchema = z.object({
  brandName: text,
  legalName: text,
  tagline: text,
  slogan: localized(text),
  logo: z.object({ light: z.string(), dark: z.string() }),
  defaultOgImage: z.string().startsWith("/"),
  contact: z.object({
    phone: text,
    phoneDisplay: text,
    whatsapp: text,
    email: z.email(),
    address: localized(text),
    mapUrl: z.url(),
    country: z.string().length(2),
    contentStatus: contentStatusSchema,
  }),
  social: z.array(
    z.object({
      platform: z.enum(["instagram", "linkedin", "facebook", "youtube"]),
      label: text,
      url: z.url(),
    }),
  ),
  /** Header ve footer menü etiketleri */
  navigation: localized(
    z.object({
      products: text,
      industries: text,
      customProduction: text,
      references: text,
      about: text,
      contact: text,
      faq: text,
      footerProducts: text,
      footerIndustries: text,
      footerCompany: text,
      footerLegal: text,
    }),
  ),
  ctas: z.object({
    designRequest: localized(text),
    browseProducts: localized(text),
    productRequest: localized(text),
    customRequest: localized(text),
    startProject: localized(text),
    otherProducts: localized(text),
  }),
  trustLine: localized(z.array(text).min(1)),
  valueProps: z.array(valuePropSchema).length(6),
  processSteps: z.array(stepSchema).min(1),
});

const pageBase = { seo: localized(seoSchema) };

export const pagesSchema = z.object({
  home: z.object({
    ...pageBase,
    heroImages: z.array(imageSchema).min(1),
    storyImage: imageSchema,
    requestImage: imageSchema,
    content: localized(
      z.object({
        eyebrow: text,
        heroText: text,
        referencesTitle: text,
        storyTitle: text,
        storyText: text,
        productsTitle: text,
        productsText: text,
        requestTitle: text,
        requestText: text,
        requestPoints: z.array(text).min(1),
        industriesTitle: text,
        whyTitle: text,
        processTitle: text,
        faqTitle: text,
      }),
    ),
  }),
  products: z.object({
    ...pageBase,
    content: localized(z.object({ intro: text })),
  }),
  industries: z.object({
    ...pageBase,
    content: localized(z.object({ intro: text })),
  }),
  customProduction: z.object({
    ...pageBase,
    image: imageSchema,
    content: localized(
      z.object({
        intro: text,
        features: z.array(z.object({ title: text, text: text })).min(1),
      }),
    ),
    featureImages: z.array(imageSchema).min(1),
  }),
  references: z.object({
    ...pageBase,
    content: localized(z.object({ intro: text })),
  }),
  about: z.object({
    ...pageBase,
    images: z.array(imageSchema).min(1),
    content: localized(z.object({ text: text, subheading: text, subtext: text })),
  }),
  contact: z.object({
    ...pageBase,
    content: localized(z.object({ text: text })),
  }),
  faq: z.object({
    ...pageBase,
    content: localized(z.object({ intro: text })),
  }),
  request: z.object({
    ...pageBase,
    content: localized(z.object({ text: text, submitLabel: text })),
  }),
  requestComplete: z.object({
    ...pageBase,
    content: localized(z.object({ text: text })),
  }),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryId = z.infer<typeof categoryIdSchema>;
export type Product = z.infer<typeof productSchema>;
export type Industry = z.infer<typeof industrySchema>;
export type IndustryId = z.infer<typeof industryIdSchema>;
export type Reference = z.infer<typeof referenceSchema>;
export type ReferenceCategory = z.infer<typeof referenceCategorySchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Faq = z.infer<typeof faqSchema>;
export type FaqTopic = z.infer<typeof faqTopicSchema>;
export type FormOption = z.infer<typeof formOptionSchema>;
export type LegalPage = z.infer<typeof legalPageSchema>;
export type LegalPageId = z.infer<typeof legalPageIdSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type Pages = z.infer<typeof pagesSchema>;
export type PageId = keyof Pages;
export type SeoFields = z.infer<typeof seoSchema>;
export type ContentImage = z.infer<typeof imageSchema>;
export type Customization = z.infer<typeof customizationSchema>;
export type IconName = z.infer<typeof iconSchema>;

export const contentStoreSchema = z.object({
  siteSettings: siteSettingsSchema,
  pages: pagesSchema,
  categories: z.array(categorySchema),
  products: z.array(productSchema),
  industries: z.array(industrySchema),
  references: z.array(referenceSchema),
  caseStudies: z.array(caseStudySchema),
  faqs: z.array(faqSchema),
  formOptions: z.array(formOptionSchema),
  legalPages: z.array(legalPageSchema),
});

export type ContentStore = z.infer<typeof contentStoreSchema>;
/** Seed dosyaları için giriş tipi (varsayılan değerli alanlar opsiyonel). */
export type ContentStoreInput = z.input<typeof contentStoreSchema>;
