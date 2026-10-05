"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RefRow = {
  id: string;
  name: string;
  permissionConfirmed: boolean;
  sortOrder: number;
};

export function ReferencesEditor({ items }: { items: RefRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {rows.map((row, index) => (
        <form
          key={row.id}
          className="grid gap-3 rounded-2xl border border-cream-300 bg-white p-4 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            void fetch("/api/admin/cms/content", {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                type: "reference",
                id: row.id,
                name: row.name,
                permissionConfirmed: row.permissionConfirmed,
                sortOrder: row.sortOrder,
              }),
            }).then(async (res) => {
              setMessage(res.ok ? `${row.id} kaydedildi.` : "Hata");
              if (res.ok) router.refresh();
            });
          }}
        >
          <div className="md:col-span-4 text-xs font-semibold uppercase text-ink-500">{row.id}</div>
          <input
            className="h-10 rounded-xl border border-cream-300 px-3 text-sm md:col-span-2"
            value={row.name}
            onChange={(e) => {
              const next = [...rows];
              next[index] = { ...row, name: e.target.value };
              setRows(next);
            }}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={row.permissionConfirmed}
              onChange={(e) => {
                const next = [...rows];
                next[index] = { ...row, permissionConfirmed: e.target.checked };
                setRows(next);
              }}
            />
            İzin onaylı
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
