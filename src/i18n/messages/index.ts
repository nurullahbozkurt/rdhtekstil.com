import type { Locale } from "../config";
import en from "./en";
import tr, { type Messages } from "./tr";

const dictionaries: Record<Locale, Messages> = { tr, en };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

/** `{name}` biçimindeki yer tutucuları doldurur. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Messages };
