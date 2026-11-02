"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FairVisitorForm } from "@/components/forms/fair-visitor-form";
import type { Messages } from "@/i18n/messages";
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

function FairBoothInner({ formProps }: { formProps: FormProps }) {
  const searchParams = useSearchParams();
  const qrLanding = useMemo(() => {
    return isQrParam(searchParams.get("kaynak")) || isQrParam(searchParams.get("source"));
  }, [searchParams]);

  const source: FairVisitorSource = qrLanding ? "QR" : "STAFF";
  const fair = formProps.fairMessages;

  return (
    <div className="space-y-4 sm:space-y-6">
      {qrLanding ? (
        <div className="rounded-2xl border border-gold-500/40 bg-gold-200/30 px-4 py-3.5 text-sm text-navy-900">
          <p className="font-semibold">{fair.qr.landingBadge}</p>
          <p className="mt-1 leading-relaxed text-ink-600">{fair.qr.landingText}</p>
        </div>
      ) : null}
      <div className={panelClass}>
        <FairVisitorForm {...formProps} source={source} />
      </div>
    </div>
  );
}

export function FairBoothPanel({ formProps }: { formProps: FormProps }) {
  return (
    <Suspense
      fallback={
        <div className={panelClass}>
          <FairVisitorForm {...formProps} source="STAFF" />
        </div>
      }
    >
      <FairBoothInner formProps={formProps} />
    </Suspense>
  );
}
