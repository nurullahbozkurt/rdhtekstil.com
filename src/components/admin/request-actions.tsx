"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteRequestButton } from "@/components/admin/delete-request-button";
import type { RequestStatus } from "@/lib/admin/requests";

export function RequestActions({
  id,
  number,
  status,
  internalNote,
}: {
  id: string;
  number: string;
  status: RequestStatus;
  internalNote: string;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [note, setNote] = useState(internalNote);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: currentStatus, internalNote: note }),
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
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as RequestStatus)}
          >
            <option value="NEW">Yeni</option>
            <option value="IN_REVIEW">İnceleniyor</option>
            <option value="REPLIED">Yanıtlandı</option>
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
          <DeleteRequestButton id={id} number={number} className="w-full sm:w-auto" />
        </div>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-navy-900">İç not (müşteri görmez)</span>
        <textarea
          rows={4}
          className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-base"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ekip içi not ekleyin…"
        />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
