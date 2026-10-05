"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CmsSeedButton({ seeded }: { seeded: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5">
      <p className="text-sm text-ink-600">
        CMS durumu:{" "}
        <strong className="text-navy-900">{seeded ? "Supabase’te içerik var" : "Henüz seed edilmedi (yerel seed kullanılıyor)"}</strong>
      </p>
      <button
        type="button"
        disabled={pending}
        className="mt-3 h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50 disabled:opacity-60"
        onClick={() => {
          if (seeded && !window.confirm("Mevcut CMS içeriğinin üzerine yerel seed yazılsın mı?")) return;
          setPending(true);
          void fetch("/api/admin/cms", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "seed" }),
          })
            .then(async (res) => {
              setMessage(res.ok ? "Seed tamamlandı." : "Seed başarısız.");
              if (res.ok) router.refresh();
            })
            .finally(() => setPending(false));
        }}
      >
        Yerel içeriği Supabase’e aktar
      </button>
      {message ? <p className="mt-2 text-sm text-ink-600">{message}</p> : null}
    </div>
  );
}
