"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FairQrPanel } from "@/components/fair/fair-qr-panel";
import { FairVisitorForm } from "@/components/forms/fair-visitor-form";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";
import type { FairVisitorSource } from "@/lib/validation/fair-visitor";

type Option = { value: string; label: string };

type FormProps = {
  locale: "tr" | "en";
  formMessages: Messages["form"];
  fairMessages: Messages["fair"];
  options: { countries: Option[]; quantities: Option[] };
  privacyHref: string;
  submitLabel: string;
  disclosure: {
    title: string;
    intro?: string;
    sections: { heading: string; paragraphs: string[] }[];
  };
  disclosureClose: string;
  disclosureOpenFull: string;
};

function isQrParam(value: string | null) {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "qr" || normalized === "1" || normalized === "true";
}

const panelClass =
  "rounded-[1.25rem] border border-cream-300 bg-cream-50 p-4 sm:rounded-[1.75rem] sm:p-8 lg:p-10";

function FairBoothInner({
  formProps,
  qrDataUrl,
  qrUrl,
}: {
  formProps: FormProps;
  qrDataUrl: string;
  qrUrl: string;
}) {
  const searchParams = useSearchParams();
  const qrLanding = useMemo(() => {
    return isQrParam(searchParams.get("kaynak")) || isQrParam(searchParams.get("source"));
  }, [searchParams]);

  const [tab, setTab] = useState<"staff" | "qr">("staff");
  const source: FairVisitorSource = qrLanding ? "QR" : "STAFF";
  const fair = formProps.fairMessages;

  if (qrLanding) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="rounded-2xl border border-gold-500/40 bg-gold-200/30 px-4 py-3.5 text-sm text-navy-900">
          <p className="font-semibold">{fair.qr.landingBadge}</p>
          <p className="mt-1 leading-relaxed text-ink-600">{fair.qr.landingText}</p>
        </div>
        <div className={panelClass}>
          <FairVisitorForm {...formProps} source="QR" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div
        role="tablist"
        aria-label={fair.tabsLabel}
        className="sticky top-[4.5rem] z-30 grid grid-cols-2 gap-1.5 rounded-2xl border border-cream-300/90 bg-cream-50/95 p-1.5 shadow-sm backdrop-blur-md lg:top-20"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "staff"}
          onClick={() => setTab("staff")}
          className={cn(
            "min-h-12 rounded-xl text-sm font-semibold transition-colors active:scale-[0.99]",
            tab === "staff"
              ? "bg-navy-800 text-cream-50"
              : "text-ink-600 hover:bg-white hover:text-navy-900",
          )}
        >
          {fair.tabs.staff}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "qr"}
          onClick={() => setTab("qr")}
          className={cn(
            "min-h-12 rounded-xl text-sm font-semibold transition-colors active:scale-[0.99]",
            tab === "qr"
              ? "bg-navy-800 text-cream-50"
              : "text-ink-600 hover:bg-white hover:text-navy-900",
          )}
        >
          {fair.tabs.qr}
        </button>
      </div>

      {tab === "staff" ? (
        <div className={panelClass}>
          <FairVisitorForm {...formProps} source={source} />
        </div>
      ) : (
        <div className={panelClass}>
          <FairQrPanel qrDataUrl={qrDataUrl} qrUrl={qrUrl} messages={fair.qr} />
        </div>
      )}
    </div>
  );
}

export function FairBoothPanel(props: {
  formProps: FormProps;
  qrDataUrl: string;
  qrUrl: string;
}) {
  return (
    <Suspense
      fallback={
        <div className={panelClass}>
          <FairVisitorForm {...props.formProps} source="STAFF" />
        </div>
      }
    >
      <FairBoothInner {...props} />
    </Suspense>
  );
}
