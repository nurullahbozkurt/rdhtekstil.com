"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeSettings, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export type LanguageMap = Record<string, Record<Locale, string>>;

export function LanguageSwitcher({
  locale,
  map,
  label,
  tone = "dark",
  className,
}: {
  locale: Locale;
  map: LanguageMap;
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const pathname = usePathname();
  const alternates = map[pathname] ?? map[`/${locale}`];

  return (
    <nav
      aria-label={label}
      className={cn("flex items-center gap-1 text-sm font-semibold", className)}
    >
      {locales.map((l, index) => {
        const active = l === locale;
        const href = alternates?.[l] ?? `/${l}`;
        return (
          <span key={l} className="flex items-center gap-1">
            {index > 0 ? (
              <span
                aria-hidden
                className={tone === "light" ? "text-cream-50/40" : "text-navy-900/30"}
              >
                /
              </span>
            ) : null}
            <Link
              href={href}
              hrefLang={localeSettings[l].hreflang}
              lang={l}
              aria-current={active ? "true" : undefined}
              onClick={() => {
                document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
              }}
              className={cn(
                "rounded-md px-1.5 py-1 tracking-wider transition-colors",
                tone === "light"
                  ? active
                    ? "text-gold-400"
                    : "text-cream-50/75 hover:text-cream-50"
                  : active
                    ? "text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-[6px]"
                    : "text-ink-600 hover:text-navy-900",
              )}
            >
              {localeSettings[l].short}
              <span className="sr-only"> {localeSettings[l].label}</span>
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
