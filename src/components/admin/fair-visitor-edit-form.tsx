"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DeleteFairVisitorButton } from "@/components/admin/delete-fair-visitor-button";
import { formatCountryLabel } from "@/lib/admin/countries";
import {
  FAIR_PRODUCT_GROUP_LABEL,
  FAIR_VISITOR_SOURCE_LABEL,
  FAIR_VISITOR_STATUS_LABEL,
  fairVisitorSourceClass,
  fairVisitorStatusClass,
} from "@/lib/admin/fair-visitor-labels";
import type { FairVisitorDetail, FairVisitorStatus } from "@/lib/admin/fair-visitors";
import { formatAdminDate } from "@/lib/admin/request-labels";
import { cn } from "@/lib/utils";
import { FAIR_PRODUCT_GROUPS, type FairProductGroup } from "@/lib/validation/fair-visitor";

type Option = { value: string; label: string };

type Draft = {
  fullName: string;
  company: string;
  jobTitle: string;
  country: string;
  email: string;
  phone: string;
  productGroup: FairProductGroup;
  quantityRange: string;
  desiredDate: string;
  notes: string;
  status: FairVisitorStatus;
  internalNote: string;
};

const inputClass =
  "h-11 w-full rounded-xl border border-cream-300 bg-white px-3 text-base text-navy-900";

function toDraft(visitor: FairVisitorDetail): Draft {
  return {
    fullName: visitor.full_name,
    company: visitor.company,
    jobTitle: visitor.job_title ?? "",
    country: visitor.country ?? "",
    email: visitor.email ?? "",
    phone: visitor.phone ?? "",
    productGroup: visitor.product_group,
    quantityRange: visitor.quantity_range ?? "",
    desiredDate: visitor.desired_date ?? "",
    notes: visitor.notes ?? "",
    status: visitor.status,
    internalNote: visitor.internal_note ?? "",
  };
}

function ReadField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium whitespace-pre-wrap text-navy-900">{children}</dd>
    </div>
  );
}

export function FairVisitorEditForm({
  visitor,
  countries,
  quantities,
}: {
  visitor: FairVisitorDetail;
  countries: Option[];
  quantities: Option[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => toDraft(visitor));
  const [baseline, setBaseline] = useState<Draft>(() => toDraft(visitor));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(baseline), [draft, baseline]);

  useEffect(() => {
    if (!editing || !dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editing, dirty]);

  const patch = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setNotice(null);
    setError(null);
  };

  const startEditing = () => {
    const next = toDraft(visitor);
    setDraft(next);
    setBaseline(next);
    setError(null);
    setNotice(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    if (dirty && !window.confirm("Kaydedilmemiş değişiklikler var. Vazgeçilsin mi?")) return;
    setDraft(baseline);
    setError(null);
    setNotice(null);
    setEditing(false);
  };

  const save = async () => {
    if (!draft.fullName.trim() || !draft.company.trim()) {
      setError("Ad soyad ve firma zorunludur.");
      return;
    }
    setPending(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/fair-visitors/${visitor.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("save_failed");
      const json = (await res.json()) as { changes?: number };
      const saved = toDraft({
        ...visitor,
        full_name: draft.fullName.trim(),
        company: draft.company.trim(),
        job_title: draft.jobTitle.trim() || null,
        country: draft.country.trim() || null,
        email: draft.email.trim() || null,
        phone: draft.phone.trim() || null,
        product_group: draft.productGroup,
        quantity_range: draft.quantityRange.trim() || null,
        desired_date: draft.desiredDate.trim() || null,
        notes: draft.notes.trim() || null,
        status: draft.status,
        internal_note: draft.internalNote.trim() || null,
      });
      setDraft(saved);
      setBaseline(saved);
      setEditing(false);
      setNotice(
        json.changes && json.changes > 0
          ? `${json.changes} alan güncellendi.`
          : "Değişiklik yok.",
      );
      router.refresh();
    } catch {
      setError("Kaydedilemedi.");
    } finally {
      setPending(false);
    }
  };

  const quantityLabel =
    quantities.find((option) => option.value === visitor.quantity_range)?.label ??
    visitor.quantity_range;

  return (
    <section
      className={cn(
        "space-y-5 rounded-2xl border bg-white p-4 sm:p-5",
        editing ? "border-navy-800/30 ring-1 ring-navy-800/10" : "border-cream-300",
        editing && dirty && "pb-28 sm:pb-5",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-medium text-navy-900">Ziyaretçi bilgileri</h2>
          <p className="mt-1 text-sm text-ink-600">
            {editing
              ? dirty
                ? "Kaydedilmemiş değişiklikler var"
                : "Düzenleme modu"
              : "Bilgileri görüntüleyin; değiştirmek için düzenleye basın"}
          </p>
        </div>
        {!editing ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-navy-800 px-4 text-sm font-semibold text-cream-50"
            >
              <Pencil className="size-4" aria-hidden />
              Düzenle
            </button>
            <DeleteFairVisitorButton
              id={visitor.id}
              name={visitor.full_name}
              className="w-full sm:w-auto"
            />
          </div>
        ) : (
          <div className="hidden items-center gap-2 sm:flex">
            {dirty ? (
              <span className="rounded-full bg-gold-500/20 px-2.5 py-1 text-xs font-semibold text-navy-900 ring-1 ring-gold-500/40">
                Kaydedilmedi
              </span>
            ) : null}
            <button
              type="button"
              disabled={pending}
              onClick={cancelEditing}
              className="h-11 rounded-xl border border-cream-300 px-4 text-sm font-semibold text-navy-900 disabled:opacity-60"
            >
              Vazgeç
            </button>
            <button
              type="button"
              disabled={pending || !dirty || !draft.fullName.trim() || !draft.company.trim()}
              onClick={() => void save()}
              className="h-11 rounded-xl bg-navy-800 px-4 text-sm font-semibold text-cream-50 disabled:opacity-60"
            >
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="space-y-5">
          <dl className="grid gap-3 sm:grid-cols-2">
            <ReadField label="Ad Soyad">{visitor.full_name}</ReadField>
            <ReadField label="Firma">{visitor.company}</ReadField>
            <ReadField label="Görev">{visitor.job_title || "—"}</ReadField>
            <ReadField label="Ülke">{formatCountryLabel(visitor.country)}</ReadField>
            <ReadField label="E-posta">{visitor.email || "—"}</ReadField>
            <ReadField label="Telefon / WhatsApp">{visitor.phone || "—"}</ReadField>
            <ReadField label="Ürün grubu">
              {FAIR_PRODUCT_GROUP_LABEL[visitor.product_group]}
            </ReadField>
            <ReadField label="Tahmini adet">{quantityLabel || "—"}</ReadField>
            <ReadField label="Hedef teslim">
              {visitor.desired_date
                ? formatAdminDate(`${visitor.desired_date}T00:00:00Z`, { dateStyle: "medium" })
                : "—"}
            </ReadField>
            <ReadField label="Durum">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                  fairVisitorStatusClass(visitor.status),
                )}
              >
                {FAIR_VISITOR_STATUS_LABEL[visitor.status]}
              </span>
            </ReadField>
            <ReadField label="Kaynak">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                  fairVisitorSourceClass(visitor.source),
                )}
              >
                {FAIR_VISITOR_SOURCE_LABEL[visitor.source]}
              </span>
            </ReadField>
            <ReadField label="Görüşme notu">{visitor.notes || "—"}</ReadField>
            <ReadField label="İç not">{visitor.internal_note || "—"}</ReadField>
          </dl>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-navy-900">Ad Soyad *</span>
              <input
                className={inputClass}
                value={draft.fullName}
                onChange={(e) => patch("fullName", e.target.value)}
                required
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-navy-900">Firma *</span>
              <input
                className={inputClass}
                value={draft.company}
                onChange={(e) => patch("company", e.target.value)}
                required
              />
            </label>
            <label className="block space-y-1.5 text-sm sm:col-span-2">
              <span className="font-semibold text-navy-900">Görev</span>
              <input
                className={inputClass}
                value={draft.jobTitle}
                onChange={(e) => patch("jobTitle", e.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-navy-900">Ülke</span>
              <select
                className={inputClass}
                value={draft.country}
                onChange={(e) => patch("country", e.target.value)}
              >
                <option value="">Seçiniz</option>
                {countries.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-navy-900">E-posta</span>
              <input
                type="email"
                className={inputClass}
                value={draft.email}
                onChange={(e) => patch("email", e.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-sm sm:col-span-2">
              <span className="font-semibold text-navy-900">Telefon / WhatsApp</span>
              <input
                type="tel"
                className={inputClass}
                value={draft.phone}
                onChange={(e) => patch("phone", e.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-navy-900">Ürün grubu *</span>
              <select
                className={inputClass}
                value={draft.productGroup}
                onChange={(e) => patch("productGroup", e.target.value as FairProductGroup)}
              >
                {FAIR_PRODUCT_GROUPS.map((value) => (
                  <option key={value} value={value}>
                    {FAIR_PRODUCT_GROUP_LABEL[value]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-navy-900">Tahmini adet</span>
              <select
                className={inputClass}
                value={draft.quantityRange}
                onChange={(e) => patch("quantityRange", e.target.value)}
              >
                <option value="">Seçiniz</option>
                {quantities.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm sm:col-span-2">
              <span className="font-semibold text-navy-900">Hedef teslim tarihi</span>
              <input
                type="date"
                className={inputClass}
                value={draft.desiredDate}
                onChange={(e) => patch("desiredDate", e.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-sm sm:col-span-2">
              <span className="font-semibold text-navy-900">Görüşme notu</span>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-base"
                value={draft.notes}
                onChange={(e) => patch("notes", e.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 border-t border-cream-200 pt-5 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-navy-900">Durum</span>
              <select
                className={inputClass}
                value={draft.status}
                onChange={(e) => patch("status", e.target.value as FairVisitorStatus)}
              >
                {(Object.keys(FAIR_VISITOR_STATUS_LABEL) as FairVisitorStatus[]).map((value) => (
                  <option key={value} value={value}>
                    {FAIR_VISITOR_STATUS_LABEL[value]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm sm:col-span-2">
              <span className="font-semibold text-navy-900">İç not (ziyaretçi görmez)</span>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-base"
                value={draft.internalNote}
                onChange={(e) => patch("internalNote", e.target.value)}
                placeholder="Ekip içi not ekleyin…"
              />
            </label>
          </div>

          {/* Mobile sticky action bar */}
          <div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-300 bg-cream-50/95 px-3 pt-3 backdrop-blur-md sm:hidden"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto flex max-w-5xl items-center gap-2">
              {dirty ? (
                <span className="sr-only">Kaydedilmemiş değişiklikler var</span>
              ) : null}
              <button
                type="button"
                disabled={pending}
                onClick={cancelEditing}
                className="h-12 flex-1 rounded-xl border border-cream-300 bg-white px-3 text-sm font-semibold text-navy-900 disabled:opacity-60"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={pending || !dirty || !draft.fullName.trim() || !draft.company.trim()}
                onClick={() => void save()}
                className="h-12 flex-[1.4] rounded-xl bg-navy-800 px-3 text-sm font-semibold text-cream-50 disabled:opacity-60"
              >
                {pending ? "Kaydediliyor…" : dirty ? "Kaydet" : "Kaydedildi"}
              </button>
            </div>
          </div>
        </>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {notice && !editing ? <p className="text-sm text-navy-800">{notice}</p> : null}
    </section>
  );
}
