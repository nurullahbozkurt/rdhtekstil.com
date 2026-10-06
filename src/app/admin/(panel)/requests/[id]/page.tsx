import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { FilePreviewList } from "@/components/admin/file-preview-list";
import { RequestActions } from "@/components/admin/request-actions";
import { formatCountryLabel } from "@/lib/admin/countries";
import {
  formatAdminDate,
  REQUEST_PRODUCT_LABEL,
  REQUEST_STATUS_LABEL,
  requestStatusClass,
} from "@/lib/admin/request-labels";
import { getRequest, listRequestsByEmail, markRequestRead } from "@/lib/admin/requests";
import { ON_REQUEST_STYLE } from "@/lib/catalog/styles";
import { getCategories, getIndustries, getProduct } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata = { title: "Talep detayı" };

function waLink(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${digits}`;
}

function ColorSwatch({ value, label }: { value: string; label: string }) {
  const hex = value.startsWith("#") ? value : undefined;
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-cream-300 bg-cream-50 px-2.5 py-2">
      <span
        className="size-8 shrink-0 rounded-lg border border-cream-300"
        style={{ backgroundColor: hex ?? "#ddd" }}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="text-[11px] text-ink-500">{label}</p>
        <p className="truncate text-sm font-medium text-navy-900">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-navy-900">{children}</dd>
    </div>
  );
}

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getRequest(id);
  if (!request) notFound();
  await markRequestRead(id);

  const locale = request.locale === "en" ? "en" : "tr";
  const [previous, categories, industries, product] = await Promise.all([
    listRequestsByEmail(request.email, request.id),
    getCategories(locale),
    getIndustries(locale),
    request.product_slug ? getProduct(request.product_slug, locale) : Promise.resolve(undefined),
  ]);

  const styleLabel =
    request.style_slug === ON_REQUEST_STYLE
      ? "Talebinize göre"
      : request.style_slug
        ? (categories
            .flatMap((category) => category.types)
            .find((type) => type.id === request.style_slug)?.label ?? request.style_slug)
        : null;

  const industryLabel = request.industry
    ? (industries.find((item) => item.id === request.industry)?.name ?? request.industry)
    : null;

  const modelLabel = product?.name ?? request.model_slug ?? request.product_slug ?? null;

  const summaryChips = [
    { label: "Ürün", value: REQUEST_PRODUCT_LABEL[request.product_type] },
    ...(styleLabel ? [{ label: "Kalıp", value: styleLabel }] : []),
    { label: "Adet", value: request.quantity_range },
    { label: "Ülke", value: formatCountryLabel(request.country) },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="space-y-3">
        <Link
          href="/admin/requests"
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Talepler
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900 sm:text-3xl">
                {request.number}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                  requestStatusClass(request.status),
                )}
              >
                {REQUEST_STATUS_LABEL[request.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-600">
              {formatAdminDate(request.created_at, {
                dateStyle: "long",
                timeStyle: "short",
              })}{" "}
              · {request.locale.toUpperCase()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${request.email}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-cream-50 sm:flex-none"
            >
              <Mail className="size-4" aria-hidden />
              E-posta
            </a>
            <a
              href={`tel:${request.phone}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-cream-50 sm:flex-none"
            >
              <Phone className="size-4" aria-hidden />
              Ara
            </a>
            <a
              href={waLink(request.phone)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 flex-[1_1_100%] items-center justify-center gap-1.5 rounded-xl bg-navy-800 px-3 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-900 sm:flex-none"
            >
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>

        <div
          className={cn(
            "grid gap-2",
            summaryChips.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3",
          )}
        >
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
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-medium text-navy-900">Yüklenen dosyalar</h2>
          {!request.files.length ? <span className="text-xs text-ink-500">Dosya yok</span> : null}
        </div>
        {request.files.length ? (
          <FilePreviewList requestId={request.id} files={request.files} />
        ) : (
          <p className="rounded-xl border border-dashed border-cream-300 bg-cream-50 px-3 py-8 text-center text-sm text-ink-600">
            Bu talepte yüklenen dosya yok.
          </p>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-5">
          <h2 className="font-heading text-lg font-medium text-navy-900">Müşteri</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Ad Soyad">{request.full_name}</Field>
            <Field label="Firma">{request.company || "—"}</Field>
            <Field label="E-posta">
              <a
                className="break-all underline decoration-cream-300 underline-offset-2 hover:decoration-navy-900"
                href={`mailto:${request.email}`}
              >
                {request.email}
              </a>
            </Field>
            <Field label="Telefon">
              <a
                className="underline decoration-cream-300 underline-offset-2 hover:decoration-navy-900"
                href={`tel:${request.phone}`}
              >
                {request.phone}
              </a>
            </Field>
            <Field label="Ülke">{formatCountryLabel(request.country)}</Field>
            <Field label="Dil">{request.locale.toUpperCase()}</Field>
          </dl>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-5">
          <h2 className="font-heading text-lg font-medium text-navy-900">Talep detayı</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Ürün tipi">{REQUEST_PRODUCT_LABEL[request.product_type]}</Field>
            <Field label="Model">{modelLabel || "—"}</Field>
            {styleLabel ? <Field label="Kalıp">{styleLabel}</Field> : null}
            {industryLabel ? <Field label="Kullanım alanı">{industryLabel}</Field> : null}
            <Field label="Adet">{request.quantity_range}</Field>
            <Field label="Teslim tarihi">{request.desired_date || "—"}</Field>
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-500">Renkler</dt>
              <dd className="mt-1.5 grid gap-2 sm:grid-cols-3">
                <ColorSwatch label="Ana renk" value={request.color1} />
                {request.color2 ? <ColorSwatch label="İkinci renk" value={request.color2} /> : null}
                {request.color3 ? <ColorSwatch label="Üçüncü renk" value={request.color3} /> : null}
              </dd>
            </div>
            {request.slogan ? (
              <div className="sm:col-span-2">
                <Field label="Slogan">{request.slogan}</Field>
              </div>
            ) : null}
            {request.note ? (
              <div className="sm:col-span-2">
                <Field label="Not">
                  <span className="whitespace-pre-wrap">{request.note}</span>
                </Field>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <RequestActions
        id={request.id}
        number={request.number}
        status={request.status}
        internalNote={request.internal_note ?? ""}
      />

      <section className="rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
          <p className="text-ink-600">
            <span className="font-semibold text-navy-900">KVKK:</span>{" "}
            {formatAdminDate(request.privacy_consent_at, {
              dateStyle: "short",
              timeStyle: "medium",
            })}{" "}
            · v{request.privacy_consent_version}
          </p>
          <p className="text-ink-600">
            <span className="font-semibold text-navy-900">Pazarlama:</span>{" "}
            {request.marketing_consent ? "Verildi" : "Verilmedi"}
          </p>
        </div>
      </section>

      {previous.length ? (
        <section className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-5">
          <h2 className="font-heading text-lg font-medium text-navy-900">
            Aynı e-postadan önceki talepler
          </h2>
          <ul className="mt-2 divide-y divide-cream-200">
            {previous.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
              >
                <Link
                  href={`/admin/requests/${item.id}`}
                  className="font-semibold text-navy-900 underline-offset-2 hover:underline"
                >
                  {item.number}
                </Link>
                <span className="text-ink-600">
                  {REQUEST_STATUS_LABEL[item.status as keyof typeof REQUEST_STATUS_LABEL]} ·{" "}
                  {formatAdminDate(item.created_at, { dateStyle: "short" })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
