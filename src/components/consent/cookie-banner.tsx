"use client";

import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import type { ConsentChoices } from "@/lib/analytics/consent";
import { cn } from "@/lib/utils";
import { ctaVariants } from "../site/button-link";

export type CookieBannerText = {
  title: string;
  text: string;
  policyLink: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  save: string;
  necessary: string;
  necessaryText: string;
  analytics: string;
  analyticsText: string;
  marketing: string;
  marketingText: string;
  alwaysOn: string;
  close: string;
};

export function CookieBanner({
  text,
  policyHref,
  initial,
  onSave,
  dismissible,
  onClose,
}: {
  text: CookieBannerText;
  policyHref: string;
  initial: ConsentChoices;
  onSave: (choices: ConsentChoices) => void;
  dismissible: boolean;
  onClose: () => void;
}) {
  const [customizing, setCustomizing] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>(initial);
  const titleId = useId();

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      data-testid="cookie-banner"
      className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] z-[60] mx-auto max-w-xl rounded-2xl border border-cream-300 bg-cream-50 p-5 text-navy-900 shadow-[0_24px_60px_-20px_rgba(11,20,40,0.45)] sm:p-6 lg:right-auto lg:bottom-6 lg:left-6 lg:mx-0"
    >
      <div className="flex items-start gap-3">
        <Cookie aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-700" />
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="font-sans text-base font-bold">
            {text.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            {text.text}{" "}
            <Link
              href={policyHref}
              className="font-semibold text-navy-800 underline underline-offset-4"
            >
              {text.policyLink}
            </Link>
          </p>
        </div>
        {dismissible ? (
          <button
            type="button"
            onClick={onClose}
            className="-m-1 rounded-full p-1 text-ink-600 hover:bg-cream-200"
            aria-label={text.close}
          >
            <X aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>

      {customizing ? (
        <fieldset className="mt-5 space-y-3">
          <legend className="sr-only">{text.customize}</legend>
          <ConsentRow
            title={text.necessary}
            description={text.necessaryText}
            checked
            disabled
            badge={text.alwaysOn}
          />
          <ConsentRow
            title={text.analytics}
            description={text.analyticsText}
            checked={choices.analytics}
            onChange={(analytics) => setChoices((c) => ({ ...c, analytics }))}
          />
          <ConsentRow
            title={text.marketing}
            description={text.marketingText}
            checked={choices.marketing}
            onChange={(marketing) => setChoices((c) => ({ ...c, marketing }))}
          />
        </fieldset>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          className={cn(ctaVariants({ variant: "primary", size: "sm" }), "sm:flex-1")}
          onClick={() => onSave({ analytics: true, marketing: true })}
        >
          {text.acceptAll}
        </button>
        <button
          type="button"
          className={cn(ctaVariants({ variant: "outline", size: "sm" }), "sm:flex-1")}
          onClick={() => onSave({ analytics: false, marketing: false })}
        >
          {text.rejectAll}
        </button>
        {customizing ? (
          <button
            type="button"
            className={cn(ctaVariants({ variant: "outline", size: "sm" }), "sm:w-full")}
            onClick={() => onSave(choices)}
          >
            {text.save}
          </button>
        ) : (
          <button
            type="button"
            className={cn(ctaVariants({ variant: "link", size: "sm" }), "self-center sm:w-full")}
            onClick={() => setCustomizing(true)}
          >
            {text.customize}
          </button>
        )}
      </div>
    </div>
  );
}

function ConsentRow({
  title,
  description,
  checked,
  disabled,
  badge,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onChange?: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3 rounded-xl border border-cream-300 bg-cream-100 p-3">
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 accent-navy-800"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <label htmlFor={id} className="min-w-0 flex-1 text-sm">
        <span className="flex items-center gap-2 font-semibold">
          {title}
          {badge ? (
            <span className="rounded-full bg-cream-300 px-2 py-0.5 text-[0.7rem] font-semibold text-ink-600">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-ink-600">{description}</span>
      </label>
    </div>
  );
}
