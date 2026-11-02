"use client";

import { Check, Copy, QrCode } from "lucide-react";
import { useState } from "react";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";

export function FairQrPanel({
  qrDataUrl,
  qrUrl,
  messages,
}: {
  qrDataUrl: string;
  qrUrl: string;
  messages: Messages["fair"]["qr"];
}) {
  const [copied, setCopied] = useState(false);

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
    <div className="space-y-5 text-center sm:space-y-6">
      <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-navy-800 text-cream-50 sm:size-12">
        <QrCode className="size-5 sm:size-6" aria-hidden />
      </div>
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium tracking-tight text-navy-900 sm:text-2xl">
          {messages.title}
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-600">{messages.text}</p>
      </div>

      <div className="mx-auto w-full max-w-[18rem] rounded-[1.25rem] border border-cream-300 bg-white p-3 shadow-sm sm:max-w-xs sm:rounded-[1.5rem] sm:p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={messages.imageAlt}
          className="mx-auto aspect-square w-full"
          width={512}
          height={512}
        />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.08em] text-ink-500 uppercase">
          {messages.linkLabel}
        </p>
        <div className="flex flex-col gap-2">
          <code className="break-all rounded-2xl border border-cream-300 bg-white px-3 py-3 text-left text-xs leading-relaxed text-navy-900 sm:truncate sm:text-sm sm:break-normal">
            {qrUrl}
          </code>
          <button
            type="button"
            onClick={() => void copy()}
            className={cn(
              "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-colors sm:h-11 sm:w-auto sm:self-center sm:rounded-xl",
              copied
                ? "bg-gold-500/20 text-navy-900 ring-1 ring-gold-500/40"
                : "bg-navy-800 text-cream-50 hover:bg-navy-900",
            )}
          >
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? messages.copied : messages.copy}
          </button>
        </div>
        <p className="text-sm text-ink-600">{messages.hint}</p>
      </div>
    </div>
  );
}
