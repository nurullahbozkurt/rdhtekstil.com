import { locales, type Locale } from "@/i18n/config";

export type Localized<T> = { [L in Locale]: T };

/** Çok dilli alanları (`{ tr, en }`) seçilen dilin değerine indirger. */
export type Resolved<T> =
  T extends Localized<infer U>
    ? Resolved<U>
    : T extends readonly (infer E)[]
      ? Resolved<E>[]
      : T extends object
        ? { [K in keyof T]: Resolved<T[K]> }
        : T;

const localeSet = new Set<string>(locales);

function isLocalizedValue(value: unknown): value is Record<Locale, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length === locales.length && keys.every((key) => localeSet.has(key));
}

export function localize<T>(value: T, locale: Locale): Resolved<T> {
  return resolve(value, locale) as Resolved<T>;
}

function resolve(value: unknown, locale: Locale): unknown {
  if (isLocalizedValue(value)) return resolve(value[locale], locale);
  if (Array.isArray(value)) return value.map((item) => resolve(item, locale));
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolve(item, locale)]),
    );
  }
  return value;
}
