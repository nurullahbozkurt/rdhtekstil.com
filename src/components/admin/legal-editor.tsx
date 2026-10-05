"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LegalItem = {
  id: string;
  titleTr: string;
  titleEn: string;
  h1Tr: string;
  h1En: string;
  bodyTr: string;
  bodyEn: string;
};

export function LegalEditor({ items }: { items: LegalItem[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {rows.map((row, index) => (
        <form
          key={row.id}
          className="space-y-3 rounded-2xl border border-cream-300 bg-white p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void fetch("/api/admin/cms/content", {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ type: "legal", ...row }),
            }).then(async (res) => {
              setMessage(res.ok ? `${row.id} kaydedildi.` : "Kayıt başarısız.");
              if (res.ok) router.refresh();
            });
          }}
        >
          <p className="font-semibold uppercase tracking-wide text-ink-600">{row.id}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {(
              [
                ["titleTr", "Title TR"],
                ["titleEn", "Title EN"],
                ["h1Tr", "H1 TR"],
                ["h1En", "H1 EN"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="space-y-1 text-sm">
                <span>{label}</span>
                <input
                  className="h-11 w-full rounded-xl border border-cream-300 px-3"
                  value={row[key]}
                  onChange={(e) => {
                    const next = [...rows];
                    next[index] = { ...row, [key]: e.target.value };
                    setRows(next);
                  }}
                />
              </label>
            ))}
            <label className="space-y-1 text-sm md:col-span-2">
              <span>Gövde (TR)</span>
              <textarea
                rows={5}
                className="w-full rounded-xl border border-cream-300 px-3 py-2"
                value={row.bodyTr}
                onChange={(e) => {
                  const next = [...rows];
                  next[index] = { ...row, bodyTr: e.target.value };
                  setRows(next);
                }}
              />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span>Gövde (EN)</span>
              <textarea
                rows={5}
                className="w-full rounded-xl border border-cream-300 px-3 py-2"
                value={row.bodyEn}
                onChange={(e) => {
                  const next = [...rows];
                  next[index] = { ...row, bodyEn: e.target.value };
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
