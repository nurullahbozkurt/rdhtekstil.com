"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ContactStatus } from "@/lib/admin/contacts";

export function ContactActions({ id, status }: { id: string; status: ContactStatus }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [pending, setPending] = useState(false);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-cream-300 bg-cream-50 p-4">
      <label className="space-y-1 text-sm">
        <span className="font-semibold">Durum</span>
        <select
          className="block h-11 rounded-xl border border-cream-300 bg-white px-3"
          value={current}
          onChange={(e) => setCurrent(e.target.value as ContactStatus)}
        >
          <option value="NEW">Yeni</option>
          <option value="READ">Okundu</option>
          <option value="ARCHIVED">Arşiv</option>
        </select>
      </label>
      <button
        type="button"
        disabled={pending}
        className="h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50"
        onClick={async () => {
          setPending(true);
          await fetch(`/api/admin/contacts/${id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ status: current }),
          });
          router.refresh();
          setPending(false);
        }}
      >
        Kaydet
      </button>
      <button
        type="button"
        disabled={pending}
        className="h-11 rounded-xl border border-destructive/40 px-4 font-semibold text-destructive"
        onClick={async () => {
          if (!window.confirm("Mesaj silinsin mi?")) return;
          setPending(true);
          await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
          router.push("/admin/messages");
          router.refresh();
        }}
      >
        Sil
      </button>
    </div>
  );
}
