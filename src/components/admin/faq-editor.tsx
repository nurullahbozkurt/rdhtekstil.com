"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FaqItem = {
  id: string;
  questionTr: string;
  questionEn: string;
  answerTr: string;
  answerEn: string;
};

export function FaqEditor({ items }: { items: FaqItem[] }) {
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
              body: JSON.stringify({ type: "faq", ...row }),
            }).then(async (res) => {
              setMessage(res.ok ? `${row.id} kaydedildi.` : "Kayıt başarısız.");
              if (res.ok) router.refresh();
            });
          }}
        >
          <p className="text-sm font-semibold text-ink-600">{row.id}</p>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>Soru (TR)</span>
              <input
                className="h-11 w-full rounded-xl border border-cream-300 px-3"
                value={row.questionTr}
                onChange={(e) => {
                  const next = [...rows];
                  next[index] = { ...row, questionTr: e.target.value };
                  setRows(next);
                }}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Soru (EN)</span>
              <input
                className="h-11 w-full rounded-xl border border-cream-300 px-3"
                value={row.questionEn}
                onChange={(e) => {
                  const next = [...rows];
                  next[index] = { ...row, questionEn: e.target.value };
                  setRows(next);
                }}
              />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span>Cevap (TR)</span>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-cream-300 px-3 py-2"
                value={row.answerTr}
                onChange={(e) => {
                  const next = [...rows];
                  next[index] = { ...row, answerTr: e.target.value };
                  setRows(next);
                }}
              />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span>Cevap (EN)</span>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-cream-300 px-3 py-2"
                value={row.answerEn}
                onChange={(e) => {
                  const next = [...rows];
                  next[index] = { ...row, answerEn: e.target.value };
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
