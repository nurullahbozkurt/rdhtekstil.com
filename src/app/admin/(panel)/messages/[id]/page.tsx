import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { ContactActions } from "@/components/admin/contact-actions";
import {
  CONTACT_STATUS_LABEL,
  contactStatusClass,
  formatProductInterest,
} from "@/lib/admin/contact-labels";
import { formatCountryLabel } from "@/lib/admin/countries";
import { getContactMessage, markContactRead } from "@/lib/admin/contacts";
import { formatAdminDate } from "@/lib/admin/request-labels";
import { cn } from "@/lib/utils";

export const metadata = { title: "Mesaj detayı" };

function waLink(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${digits}`;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-navy-900">{children}</dd>
    </div>
  );
}

export default async function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await getContactMessage(id);
  if (!message) notFound();
  await markContactRead(id);

  const summaryChips = [
    { label: "Ürün", value: formatProductInterest(message.product_interest) },
    { label: "Adet", value: message.quantity_range || "—" },
    { label: "Ülke", value: formatCountryLabel(message.country) },
    { label: "Dil", value: message.locale.toUpperCase() },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="space-y-3">
        <Link
          href="/admin/messages"
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Mesajlar
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900 sm:text-3xl">
                {message.full_name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                  contactStatusClass(message.status),
                )}
              >
                {CONTACT_STATUS_LABEL[message.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-600">
              {formatAdminDate(message.created_at, {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${message.email}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-cream-50 sm:flex-none"
            >
              <Mail className="size-4" aria-hidden />
              E-posta
            </a>
            {message.phone ? (
              <>
                <a
                  href={`tel:${message.phone}`}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-cream-50 sm:flex-none"
                >
                  <Phone className="size-4" aria-hidden />
                  Ara
                </a>
                <a
                  href={waLink(message.phone)}
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

      <section className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-5">
        <h2 className="font-heading text-lg font-medium text-navy-900">Mesaj</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy-900">
          {message.message}
        </p>
      </section>

      <section className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-5">
        <h2 className="font-heading text-lg font-medium text-navy-900">Gönderen</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Ad Soyad">{message.full_name}</Field>
          <Field label="Firma">{message.company || "—"}</Field>
          <Field label="E-posta">
            <a
              className="break-all underline decoration-cream-300 underline-offset-2 hover:decoration-navy-900"
              href={`mailto:${message.email}`}
            >
              {message.email}
            </a>
          </Field>
          <Field label="Telefon">
            {message.phone ? (
              <a
                className="underline decoration-cream-300 underline-offset-2 hover:decoration-navy-900"
                href={`tel:${message.phone}`}
              >
                {message.phone}
              </a>
            ) : (
              "—"
            )}
          </Field>
          <Field label="Ülke">{formatCountryLabel(message.country)}</Field>
          <Field label="Dil">{message.locale.toUpperCase()}</Field>
          <Field label="İlgilenilen ürün">{formatProductInterest(message.product_interest)}</Field>
          <Field label="Tahmini adet">{message.quantity_range || "—"}</Field>
        </dl>
      </section>

      <ContactActions id={message.id} name={message.full_name} status={message.status} />

      <section className="rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm sm:px-5">
        <p className="text-ink-600">
          <span className="font-semibold text-navy-900">KVKK:</span>{" "}
          {formatAdminDate(message.privacy_consent_at, {
            dateStyle: "short",
            timeStyle: "medium",
          })}{" "}
          · v{message.privacy_consent_version}
        </p>
      </section>
    </div>
  );
}
