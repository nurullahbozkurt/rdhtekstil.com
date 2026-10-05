import { z } from "zod";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s().-]{7,20}$/;
const HEX = /^#?[0-9A-Fa-f]{3,8}$/;
const COLOR = z
  .string()
  .trim()
  .min(1, { error: "required" })
  .max(64, { error: "tooLong:64" })
  .refine((v) => HEX.test(v) || v.length >= 2, { error: "invalidColor" });

const optionalColor = z
  .string()
  .trim()
  .max(64, { error: "tooLong:64" })
  .optional()
  .transform((v) => (v ? v : undefined));

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `tooLong:${max}` })
    .optional()
    .transform((v) => (v ? v : undefined));

export const productTypeSchema = z.enum(["BEANIE", "SCARF", "SET"]);

export const requestFileMetaSchema = z.object({
  kind: z.enum(["LOGO", "REFERENCE", "OTHER"]),
  originalName: z.string().min(1).max(200),
  storageKey: z.string().min(8).max(300),
  mimeType: z.string().min(3).max(100),
  sizeBytes: z
    .number()
    .int()
    .positive()
    .max(20 * 1024 * 1024),
});

export const requestFormSchema = z.object({
  locale: z.enum(["tr", "en"]),
  productType: productTypeSchema,
  productSlug: optionalText(120),
  modelSlug: optionalText(120),
  industry: optionalText(80),
  color1: COLOR,
  color2: optionalColor,
  color3: optionalColor,
  slogan: optionalText(200),
  quantityRange: z.string().trim().min(1, { error: "required" }).max(40),
  desiredDate: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), { error: "invalidDate" }),
  note: optionalText(3000),
  fullName: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .min(2, { error: "tooShort:2" })
    .max(120, { error: "tooLong:120" }),
  company: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .min(2, { error: "tooShort:2" })
    .max(160, { error: "tooLong:160" }),
  email: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .max(254, { error: "tooLong:254" })
    .regex(EMAIL, { error: "invalidEmail" }),
  phone: z.string().trim().min(1, { error: "required" }).regex(PHONE, { error: "invalidPhone" }),
  country: z.string().trim().min(1, { error: "required" }).max(40),
  privacyConsent: z.literal(true, { error: "consentRequired" }),
  marketingConsent: z.boolean().optional().default(false),
  files: z.array(requestFileMetaSchema).max(10).default([]),
  idempotencyKey: z.string().uuid(),
  /** Honeypot — doluysa spam. */
  website: z.string().max(0).optional(),
  turnstileToken: z.string().optional(),
});

export type RequestFormInput = z.input<typeof requestFormSchema>;
export type RequestFormData = z.output<typeof requestFormSchema>;
