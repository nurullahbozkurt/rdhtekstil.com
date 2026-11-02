import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { FairVisitorChangeLog } from "@/components/admin/fair-visitor-change-log";
import { FairVisitorEditForm } from "@/components/admin/fair-visitor-edit-form";
import {
  FAIR_VISITOR_SOURCE_LABEL,
  FAIR_VISITOR_STATUS_LABEL,
  fairVisitorSourceClass,
  fairVisitorStatusClass,
  formatFairProductGroup,
} from "@/lib/admin/fair-visitor-labels";
import { formatCountryLabel } from "@/lib/admin/countries";
import {
  getFairVisitor,
  listFairVisitorEditLogs,
  markFairVisitorRead,
} from "@/lib/admin/fair-visitors";
import { formatAdminDate } from "@/lib/admin/request-labels";
import { getDbFormOptions } from "@/lib/form-options";
import { cn } from "@/lib/utils";

export const metadata = { title: "Fuar ziyaretçisi" };

function waLink(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${digits}`;
}

export default async function AdminFairVisitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [visitor, logs, countries, quantities] = await Promise.all([
    getFairVisitor(id),
    listFairVisitorEditLogs(id),
    getDbFormOptions("country", "tr"),
    getDbFormOptions("quantity", "tr"),
  ]);
  if (!visitor) notFound();
  await markFairVisitorRead(id);

  const summaryChips = [
    { label: "Ürün", value: formatFairProductGroup(visitor.product_group) },
    { label: "Adet", value: visitor.quantity_range || "—" },
    { label: "Ülke", value: formatCountryLabel(visitor.country) },
    { label: "Kaynak", value: FAIR_VISITOR_SOURCE_LABEL[visitor.source] },
    { label: "Dil", value: visitor.locale.toUpperCase() },
  ];

  const formKey = [
    visitor.full_name,
    visitor.company,
    visitor.job_title,
    visitor.email,
    visitor.phone,
    visitor.country,
    visitor.product_group,
    visitor.quantity_range,
    visitor.desired_date,
    visitor.notes,
    visitor.status,
    visitor.internal_note,
    logs[0]?.id ?? "none",
  ].join("|");

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="space-y-3">
        <Link
          href="/admin/fair-visitors"
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Fuar ziyaretçileri
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900 sm:text-3xl">
                {visitor.full_name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                  fairVisitorStatusClass(visitor.status),
                )}
              >
                {FAIR_VISITOR_STATUS_LABEL[visitor.status]}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                  fairVisitorSourceClass(visitor.source),
                )}
              >
                {FAIR_VISITOR_SOURCE_LABEL[visitor.source]}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-600">
              {formatAdminDate(visitor.created_at, {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {visitor.email ? (
              <a
                href={`mailto:${visitor.email}`}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-cream-50 sm:flex-none"
              >
                <Mail className="size-4" aria-hidden />
                E-posta
              </a>
            ) : null}
            {visitor.phone ? (
              <>
                <a
                  href={`tel:${visitor.phone}`}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-cream-50 sm:flex-none"
                >
                  <Phone className="size-4" aria-hidden />
                  Ara
                </a>
                <a
                  href={waLink(visitor.phone)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 flex-[1_1_100%] items-center justify-center gap-1.5 rounded-xl bg-navy-800 px-3 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-900 sm:flex-none"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  WhatsApp
                </a>
              </>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {summaryChips.map((chip) => (
            <div
              key={chip.label}
              className="rounded-xl border border-cream-300 bg-white px-3 py-2.5"
            >
              <p className="text-[11px] text-ink-500">{chip.label}</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-navy-900">{chip.value}</p>
            </div>
          ))}
        </div>
      </div>

      <FairVisitorEditForm
        key={formKey}
        visitor={visitor}
        countries={countries}
        quantities={quantities}
      />

      <FairVisitorChangeLog logs={logs} />

      <section className="rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm sm:px-5">
        <p className="text-ink-600">
          <span className="font-semibold text-navy-900">KVKK:</span>{" "}
          {formatAdminDate(visitor.privacy_consent_at, {
            dateStyle: "short",
            timeStyle: "medium",
          })}{" "}
          · v{visitor.privacy_consent_version}
        </p>
      </section>
    </div>
  );
}
