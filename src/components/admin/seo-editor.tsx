"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type SeoRow = {
  key: string;
  kind: "page" | "category" | "product" | "industry";
  label: string;
  slugTr: string;
  slugEn: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  h1Tr: string;
  h1En: string;
};

export function SeoEditor({ items }: { items: SeoRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {rows.map((row, index) => (
        <form
          key={`${row.kind}-${row.key}`}
          className="space-y-3 rounded-2xl border border-cream-300 bg-white p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void fetch("/api/admin/cms/content", {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ type: "seo", ...row }),
            }).then(async (res) => {
              setMessage(res.ok ? `${row.label} kaydedildi.` : "Hata");
              if (res.ok) router.refresh();
            });
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-heading text-lg font-medium text-navy-900">{row.label}</p>
            <span className="text-xs font-semibold uppercase text-ink-500">
              {row.kind} · {row.key}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(
              [
                ["slugTr", "Slug TR"],
                ["slugEn", "Slug EN"],
                ["titleTr", "Title TR"],
                ["titleEn", "Title EN"],
                ["h1Tr", "H1 TR"],
                ["h1En", "H1 EN"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="space-y-1 text-sm">
                <span>{label}</span>
                <input
                  className="h-11 w-full rounded-xl border border-cream-300 px-3"
                  value={row[field]}
                  onChange={(e) => {
                    const next = [...rows];
                    next[index] = { ...row, [field]: e.target.value };
                    setRows(next);
                  }}
                />
              </label>
            ))}
            <label className="space-y-1 text-sm md:col-span-2">
              <span>Meta description TR</span>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-cream-300 px-3 py-2"
                value={row.descriptionTr}
                onChange={(e) => {
                  const next = [...rows];
                  next[index] = { ...row, descriptionTr: e.target.value };
                  setRows(next);
                }}
              />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span>Meta description EN</span>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-cream-300 px-3 py-2"
                value={row.descriptionEn}
                onChange={(e) => {
                  const next = [...rows];
                  next[index] = { ...row, descriptionEn: e.target.value };
                  setRows(next);
                }}
              />
            </label>
          </div>
          <button type="submit" className="h-10 rounded-xl bg-navy-800 px-4 text-sm font-semibold text-cream-50">
            Kaydet
          </button>
        </form>
      ))}
      {message ? <p className="text-sm text-ink-600">{message}</p> : null}
    </div>
  );
}
