import { z } from "zod";

/**
 * İletişim formu şeması — istemci ve (Faz 2'de) sunucu aynı şemayı kullanır.
 * Hata mesajları dil bağımsız kodlardır (`required`, `tooShort:2` …);
 * arayüz bunları `form.errors` sözlüğüyle çevirir.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s().-]{7,20}$/;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `tooLong:${max}` })
    .optional()
    .transform((value) => (value ? value : undefined));

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .min(2, { error: "tooShort:2" })
    .max(120, { error: "tooLong:120" }),
  company: optionalText(160),
  email: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .max(254, { error: "tooLong:254" })
    .regex(EMAIL, { error: "invalidEmail" }),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || PHONE.test(value), { error: "invalidPhone" })
    .transform((value) => (value ? value : undefined)),
  country: optionalText(40),
  productInterest: optionalText(40),
  quantityRange: optionalText(40),
  message: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .min(10, { error: "tooShort:10" })
    .max(3000, { error: "tooLong:3000" }),
  privacyConsent: z.literal(true, { error: "consentRequired" }),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormData = z.output<typeof contactFormSchema>;
export type ContactField = keyof ContactFormInput;

/** Zod hata kodunu `{ code, params }` biçimine ayırır (ör. "tooShort:2"). */
export function parseErrorCode(message: string): { code: string; params: Record<string, string> } {
  const [code = "required", value] = message.split(":");
  if (code === "tooShort") return { code, params: { min: value ?? "" } };
  if (code === "tooLong") return { code, params: { max: value ?? "" } };
  return { code, params: {} };
}
