"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteContactButton } from "@/components/admin/delete-contact-button";
import type { ContactStatus } from "@/lib/admin/contacts";

export function ContactActions({
  id,
  name,
  status,
}: {
  id: string;
  name: string;
  status: ContactStatus;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: current }),
      });
      if (!res.ok) throw new Error("save_failed");
      router.refresh();
    } catch {
      setError("Kaydedilemedi.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-cream-300 bg-cream-50 p-4 sm:p-5">
      <h2 className="font-heading text-xl font-medium text-navy-900">Yönetim</h2>
      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-navy-900">Durum</span>
          <select
            className="h-11 w-full rounded-xl border border-cream-300 bg-white px-3 text-base"
            value={current}
            onChange={(e) => setCurrent(e.target.value as ContactStatus)}
          >
            <option value="NEW">Yeni</option>
            <option value="READ">Okundu</option>
            <option value="ARCHIVED">Arşiv</option>
          </select>
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            disabled={pending}
            onClick={() => void save()}
            className="h-11 w-full rounded-xl bg-navy-800 px-4 font-semibold text-cream-50 disabled:opacity-60"
          >
            Kaydet
          </button>
          <DeleteContactButton id={id} name={name} className="w-full sm:w-auto" />
        </div>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
