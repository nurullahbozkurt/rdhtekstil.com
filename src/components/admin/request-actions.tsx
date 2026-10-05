"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { RequestStatus } from "@/lib/admin/requests";

export function RequestActions({
  id,
  status,
  internalNote,
}: {
  id: string;
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

  const remove = async () => {
    if (!window.confirm("Bu talep ve tüm dosyaları kalıcı olarak silinsin mi?")) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete_failed");
      router.push("/admin/requests");
      router.refresh();
    } catch {
      setError("Silinemedi.");
      setPending(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-cream-300 bg-cream-50 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">Durum</span>
          <select
            className="h-11 w-full rounded-xl border border-cream-300 bg-white px-3"
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as RequestStatus)}
          >
            <option value="NEW">Yeni</option>
            <option value="IN_REVIEW">İnceleniyor</option>
            <option value="REPLIED">Yanıtlandı</option>
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => void save()}
            className="h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50 disabled:opacity-60"
          >
            Kaydet
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void remove()}
            className="h-11 rounded-xl border border-destructive/40 px-4 font-semibold text-destructive disabled:opacity-60"
          >
            Sil
          </button>
        </div>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">İç not (müşteri görmez)</span>
        <textarea
          rows={4}
          className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
