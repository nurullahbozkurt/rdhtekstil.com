"use client";

import { useState } from "react";

export function FilePreviewList({
  files,
  requestId,
}: {
  requestId: string;
  files: Array<{
    id: string;
    kind: string;
    original_name: string;
    mime_type: string;
    size_bytes: number;
  }>;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openFile = async (id: string, download = false) => {
    setError(null);
    const res = await fetch(`/api/admin/files/${id}`);
    if (!res.ok) {
      setError("Dosya açılamadı.");
      return;
    }
    const json = (await res.json()) as { url: string; originalName: string };
    if (download) {
      const a = document.createElement("a");
      a.href = json.url;
      a.download = json.originalName;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.click();
      return;
    }
    if (json.url) setLightbox(json.url);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <a
          href={`/api/admin/requests/${requestId}/zip`}
          className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-semibold"
        >
          Tümünü zip olarak indir
        </a>
      </div>
      <ul className="space-y-2">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-navy-900">
                [{file.kind}] {file.original_name}
              </p>
              <p className="text-xs text-ink-500">
                {file.mime_type} · {Math.round(file.size_bytes / 1024)} KB
              </p>
            </div>
            <div className="flex gap-2">
              {file.mime_type.startsWith("image/") ? (
                <button
                  type="button"
                  className="rounded-lg border border-cream-300 px-3 py-1.5 font-semibold"
                  onClick={() => void openFile(file.id)}
                >
                  Önizle
                </button>
              ) : null}
              <button
                type="button"
                className="rounded-lg border border-cream-300 px-3 py-1.5 font-semibold"
                onClick={() => void openFile(file.id, true)}
              >
                İndir
              </button>
            </div>
          </li>
        ))}
      </ul>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 p-6"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(null)}
          role="dialog"
          aria-modal
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-xl object-contain" />
        </div>
      ) : null}
    </div>
  );
}
