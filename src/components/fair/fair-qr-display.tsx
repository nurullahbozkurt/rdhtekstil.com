"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Messages } from "@/i18n/messages";
import { Logo } from "@/components/layout/logo";

/** Fuar standında yansıtmak için tam ekran QR gösterimi. */
export function FairQrDisplay({
  qrDataUrl,
  brandName,
  tagline,
  homeHref,
  homeLabel,
  messages,
}: {
  qrDataUrl: string;
  brandName: string;
  tagline: string;
  homeHref: string;
  homeLabel: string;
  messages: Messages["fair"]["qr"];
}) {
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
          <div className="shrink-0 space-y-2 text-center">
            <h1 className="max-w-3xl text-balance font-heading text-[clamp(1.5rem,4.5vh,3.25rem)] font-medium tracking-tight">
              {messages.title}
            </h1>
            <p className="mx-auto max-w-xl text-pretty text-[clamp(0.875rem,2vh,1.25rem)] leading-relaxed text-ink-600">
              {messages.text}
            </p>
          </div>

          <div className="aspect-square w-[min(58vmin,52vh,28rem)] shrink-0 rounded-[1.5rem] border border-cream-300 bg-white p-3 shadow-sm sm:rounded-[1.75rem] sm:p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={messages.imageAlt}
              className="mx-auto size-full object-contain"
              width={1024}
              height={1024}
            />
          </div>

          <Link
            href={homeHref}
            className="shrink-0 pt-1 text-sm font-semibold text-navy-800 underline decoration-gold-500 decoration-2 underline-offset-[6px] transition-colors hover:decoration-navy-800 sm:text-base"
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
