"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SettingsForm({
  retentionEnabled,
  retentionDays,
}: {
  retentionEnabled: boolean;
  retentionDays: number;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(retentionEnabled);
  const [days, setDays] = useState(retentionDays);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="max-w-xl space-y-4 rounded-2xl border border-cream-300 bg-white p-6"
      onSubmit={(e) => {
        e.preventDefault();
        void fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ retention_enabled: enabled, retention_days: days }),
        }).then(async (res) => {
          setMessage(res.ok ? "Kaydedildi." : "Kaydedilemedi.");
          if (res.ok) router.refresh();
        });
      }}
    >
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Saklama süresi job’ını etkinleştir
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Saklama süresi (gün)</span>
        <input
          type="number"
          min={0}
          className="h-11 w-full rounded-xl border border-cream-300 px-3"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        />
        <span className="text-xs text-ink-500">
          Varsayılan kapalı. Etkinleştirildiğinde `scripts/retention-cleanup.mjs` bu ayarı okuyabilir.
        </span>
      </label>
      <button type="submit" className="h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50">
        Kaydet
      </button>
      {message ? <p className="text-sm text-ink-600">{message}</p> : null}
    </form>
  );
}
