"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CaseRow = {
  id: string;
  titleTr: string;
  titleEn: string;
  summaryTr: string;
  summaryEn: string;
};

export function CaseStudiesEditor({ items }: { items: CaseRow[] }) {
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
              body: JSON.stringify({ type: "caseStudy", ...row }),
            }).then(async (res) => {
              setMessage(res.ok ? `${row.id} kaydedildi.` : "Hata");
              if (res.ok) router.refresh();
            });
          }}
        >
          <p className="text-sm font-semibold text-ink-600">{row.id}</p>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="h-11 rounded-xl border border-cream-300 px-3 text-sm"
              value={row.titleTr}
              placeholder="Başlık TR"
              onChange={(e) => {
                const next = [...rows];
                next[index] = { ...row, titleTr: e.target.value };
                setRows(next);
              }}
            />
            <input
              className="h-11 rounded-xl border border-cream-300 px-3 text-sm"
              value={row.titleEn}
              placeholder="Title EN"
              onChange={(e) => {
                const next = [...rows];
                next[index] = { ...row, titleEn: e.target.value };
                setRows(next);
              }}
            />
            <textarea
              rows={3}
              className="rounded-xl border border-cream-300 px-3 py-2 text-sm md:col-span-2"
              value={row.summaryTr}
              placeholder="Özet TR"
              onChange={(e) => {
                const next = [...rows];
                next[index] = { ...row, summaryTr: e.target.value };
                setRows(next);
              }}
            />
            <textarea
              rows={3}
              className="rounded-xl border border-cream-300 px-3 py-2 text-sm md:col-span-2"
              value={row.summaryEn}
              placeholder="Summary EN"
              onChange={(e) => {
                const next = [...rows];
                next[index] = { ...row, summaryEn: e.target.value };
                setRows(next);
              }}
            />
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
