import { z } from "zod";
import { localTodayISO } from "@/lib/validation/request";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s().-]{7,20}$/;

export const FAIR_PRODUCT_GROUPS = ["BEANIE", "SCARF", "SATIN_SHAWL", "SET", "OTHER"] as const;
export type FairProductGroup = (typeof FAIR_PRODUCT_GROUPS)[number];

export const FAIR_VISITOR_SOURCES = ["STAFF", "QR"] as const;
export type FairVisitorSource = (typeof FAIR_VISITOR_SOURCES)[number];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `tooLong:${max}` })
    .optional()
    .transform((value) => (value ? value : undefined));

export const fairVisitorFormSchema = z.object({
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
  jobTitle: optionalText(120),
  country: optionalText(40),
  email: z
    .string()
    .trim()
    .max(254, { error: "tooLong:254" })
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || EMAIL.test(value), { error: "invalidEmail" }),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || PHONE.test(value), { error: "invalidPhone" }),
  productGroup: z.enum(FAIR_PRODUCT_GROUPS, { error: "selectOption" }),
  quantityRange: optionalText(40),
  desiredDate: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), { error: "invalidDate" })
    .refine((value) => !value || value >= localTodayISO(), { error: "pastDate" }),
  notes: optionalText(3000),
  privacyConsent: z.literal(true, { error: "consentRequired" }),
});

export type FairVisitorFormInput = z.input<typeof fairVisitorFormSchema>;
export type FairVisitorFormData = z.output<typeof fairVisitorFormSchema>;
export type FairVisitorField = keyof FairVisitorFormInput;
