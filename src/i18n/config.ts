/**
 * Desteklenen diller. Yeni bir dil (ör. "de") eklemek için:
 * 1. Bu listeye ekleyin ve `localeSettings` girdisini tanımlayın.
 * 2. `src/i18n/messages/<locale>.ts` sözlüğünü oluşturup `messages/index.ts`'e kaydedin.
 * 3. İçerik katmanındaki her çok dilli alana yeni dilin metnini girin
 *    (TypeScript ve Zod eksik alanları derleme/test sırasında gösterir).
 */
export const locales = ["tr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

type LocaleSettings = {
  /** Dil seçicide gösterilen ad */
  label: string;
  /** Kısa etiket (TR / EN) */
  short: string;
  /** hreflang değeri */
  hreflang: string;
  /** Open Graph locale değeri */
  ogLocale: string;
  /** Intl biçimlendirme için BCP 47 etiketi */
  intl: string;
};

export const localeSettings: Record<Locale, LocaleSettings> = {
  tr: { label: "Türkçe", short: "TR", hreflang: "tr", ogLocale: "tr_TR", intl: "tr-TR" },
  en: { label: "English", short: "EN", hreflang: "en", ogLocale: "en_US", intl: "en-GB" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export const LOCALE_COOKIE = "NEXT_LOCALE";
