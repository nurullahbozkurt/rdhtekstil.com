"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Messages } from "@/i18n/messages";
import { LOCALE_COOKIE, localeSettings, locales, type Locale } from "@/i18n/config";
import { Logo } from "@/components/layout/logo";
import type { LanguageMap } from "@/components/layout/language-switcher";
import { cn } from "@/lib/utils";

/** Fuar standında yansıtmak için tam ekran QR gösterimi. */
export function FairQrDisplay({
  locale,
  languageMap,
  languageLabel,
  qrDataUrl,
  qrUrl,
  brandName,
  tagline,
  homeHref,
  homeLabel,
  messages,
}: {
  locale: Locale;
  languageMap: LanguageMap;
  languageLabel: string;
  qrDataUrl: string;
  qrUrl: string;
  brandName: string;
  tagline: string;
  homeHref: string;
  homeLabel: string;
  messages: Messages["fair"]["qr"];
}) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const alternates = languageMap[pathname] ?? languageMap[`/${locale}`];

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden bg-cream-100 text-navy-900">
      <div
        aria-hidden
        className="bg-weave pointer-events-none absolute inset-0 opacity-[0.08]"
      />

      <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col items-center px-5 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
        <div className="flex shrink-0 flex-col items-center gap-2 pt-2 text-center sm:gap-3 sm:pt-4">
          <Logo href={homeHref} label={brandName} className="h-9 sm:h-11" preload />
          <div className="space-y-1">
            <p className="text-[0.65rem] font-bold tracking-[0.28em] text-gold-600 uppercase sm:text-xs">
              {brandName}
            </p>
            <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-ink-500 uppercase sm:text-[0.65rem]">
              {tagline}
            </p>
          </div>
        </div>

        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 py-3 sm:gap-4 sm:py-4">
          <div className="flex shrink-0 flex-col items-center gap-3 sm:gap-4">
            <nav
              aria-label={languageLabel}
              className="inline-flex rounded-full border border-cream-300 bg-white/90 p-1 shadow-sm"
            >
              {locales.map((l) => {
                const active = l === locale;
                const href = alternates?.[l] ?? `/${l}`;
                return (
                  <Link
                    key={l}
                    href={href}
                    hrefLang={localeSettings[l].hreflang}
                    lang={l}
                    aria-current={active ? "true" : undefined}
                    onClick={() => {
                      document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
                    }}
                    className={cn(
                      "min-w-14 rounded-full px-4 py-2 text-center text-sm font-bold tracking-wider transition-colors",
                      active
                        ? "bg-navy-800 text-cream-50"
                        : "text-ink-600 hover:bg-cream-100 hover:text-navy-900",
                    )}
                  >
                    {localeSettings[l].short}
                    <span className="sr-only"> {localeSettings[l].label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-2 text-center">
              <h1 className="max-w-3xl text-balance font-heading text-[clamp(1.5rem,4.5vh,3.25rem)] font-medium tracking-tight">
                {messages.title}
              </h1>
              <p className="mx-auto max-w-xl text-pretty text-[clamp(0.875rem,2vh,1.25rem)] leading-relaxed text-ink-600">
                {messages.text}
              </p>
            </div>
          </div>

          <div className="aspect-square w-[min(50vmin,42vh,24rem)] shrink-0 rounded-[1.5rem] border border-cream-300 bg-white p-3 shadow-sm sm:rounded-[1.75rem] sm:p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={messages.imageAlt}
              className="mx-auto size-full object-contain"
              width={1024}
              height={1024}
            />
          </div>

          <div className="flex w-full max-w-xl shrink-0 flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => void copy()}
              title={copied ? messages.copied : messages.copy}
              aria-label={copied ? messages.copied : messages.copy}
              className={cn(
                "w-full max-w-full rounded-2xl border px-3 py-2.5 text-center transition-colors",
                copied
                  ? "border-gold-500/50 bg-gold-200/40 text-navy-900"
                  : "border-cream-300 bg-white text-navy-900 hover:border-navy-800/30",
              )}
            >
              <span className="block truncate font-mono text-[clamp(0.7rem,1.6vh,0.95rem)]">
                {qrUrl}
              </span>
              <span className="mt-1 block text-[0.7rem] font-semibold tracking-wide text-ink-500 uppercase">
                {copied ? messages.copied : messages.copy}
              </span>
            </button>

            <Link
              href={homeHref}
              className="pt-1 text-sm font-semibold text-navy-800 underline decoration-gold-500 decoration-2 underline-offset-[6px] transition-colors hover:decoration-navy-800 sm:text-base"
            >
              {homeLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
