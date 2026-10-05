"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type FormOptionRow = {
  id: string;
  type: "quantity" | "country";
  value: string;
  label_tr: string;
  label_en: string;
  sort_order: number;
  is_active: boolean;
};

export function FormOptionsEditor({ options }: { options: FormOptionRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(options);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {rows.map((row, index) => (
        <form
          key={row.id}
          className="grid gap-2 rounded-2xl border border-cream-300 bg-white p-4 md:grid-cols-6"
          onSubmit={(e) => {
            e.preventDefault();
            void fetch("/api/admin/cms/content", {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                type: "formOption",
                id: row.id,
                optionType: row.type,
                value: row.value,
                labelTr: row.label_tr,
                labelEn: row.label_en,
                sortOrder: row.sort_order,
                isActive: row.is_active,
              }),
            }).then(async (res) => {
              setMessage(res.ok ? "Kaydedildi." : "Hata");
              if (res.ok) router.refresh();
            });
          }}
        >
          <div className="text-xs font-semibold uppercase text-ink-500 md:col-span-6">
            {row.type} · {row.value}
          </div>
          <input
            className="h-10 rounded-xl border border-cream-300 px-3 text-sm md:col-span-2"
            value={row.label_tr}
            onChange={(e) => {
              const next = [...rows];
              next[index] = { ...row, label_tr: e.target.value };
              setRows(next);
            }}
          />
          <input
            className="h-10 rounded-xl border border-cream-300 px-3 text-sm md:col-span-2"
            value={row.label_en}
            onChange={(e) => {
              const next = [...rows];
              next[index] = { ...row, label_en: e.target.value };
              setRows(next);
            }}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={row.is_active}
              onChange={(e) => {
                const next = [...rows];
                next[index] = { ...row, is_active: e.target.checked };
                setRows(next);
              }}
            />
            Aktif
          </label>
          <button type="submit" className="h-10 rounded-xl bg-navy-800 text-sm font-semibold text-cream-50">
            Kaydet
          </button>
        </form>
      ))}
      {message ? <p className="text-sm text-ink-600">{message}</p> : null}
    </div>
  );
}
