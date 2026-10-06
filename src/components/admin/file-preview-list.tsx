"use client";

import { Download, FileText, ImageIcon, Package, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { REQUEST_FILE_KIND_LABEL } from "@/lib/admin/request-labels";
import { cn } from "@/lib/utils";

type FileItem = {
  id: string;
  kind: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
};

type LoadedFile = FileItem & {
  url: string | null;
  loadError?: boolean;
};

type LightboxSurface = "light" | "dark" | "solid";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function surfaceClass(surface: LightboxSurface) {
  if (surface === "dark") return "bg-checkered-dark";
  if (surface === "solid") return "bg-cream-50";
  return "bg-checkered";
}

export function FilePreviewList({
  files,
  requestId,
}: {
  requestId: string;
  files: FileItem[];
}) {
  const [loaded, setLoaded] = useState<LoadedFile[]>([]);
  const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);
  const [surface, setSurface] = useState<LightboxSurface>("light");
  const [error, setError] = useState<string | null>(null);

  const fileKey = files.map((file) => file.id).join(",");

  useEffect(() => {
    let cancelled = false;
    setLoaded(files.map((file) => ({ ...file, url: null })));
    setLightbox(null);

    async function loadUrls() {
      const next = await Promise.all(
        files.map(async (file) => {
          try {
            const res = await fetch(`/api/admin/files/${file.id}`);
            if (!res.ok) return { ...file, url: null, loadError: true };
            const json = (await res.json()) as { url: string };
            return { ...file, url: json.url ?? null };
          } catch {
            return { ...file, url: null, loadError: true };
          }
        }),
      );
      if (!cancelled) setLoaded(next);
    }

    void loadUrls();
    return () => {
      cancelled = true;
    };
    // fileKey tracks identity; files array is rebuilt by the server component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileKey]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const downloadFile = async (id: string) => {
    setError(null);
    const existing = loaded.find((file) => file.id === id);
    let url = existing?.url ?? null;
    let name = existing?.original_name ?? "dosya";

    if (!url) {
      const res = await fetch(`/api/admin/files/${id}`);
      if (!res.ok) {
        setError("Dosya indirilemedi.");
        return;
      }
      const json = (await res.json()) as { url: string; originalName: string };
      url = json.url;
      name = json.originalName;
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.click();
  };

  const images = loaded.filter((file) => file.mime_type.startsWith("image/"));
  const others = loaded.filter((file) => !file.mime_type.startsWith("image/"));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-sm text-ink-600">
          {files.length} dosya
          {images.length ? ` · ${images.length} görsel` : ""}
        </p>
        <a
          href={`/api/admin/requests/${requestId}/zip`}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-semibold text-navy-900 transition-colors hover:bg-cream-50 sm:w-auto"
        >
          <Package className="size-4" aria-hidden />
          <span className="sm:hidden">Zip indir</span>
          <span className="hidden sm:inline">Tümünü zip olarak indir</span>
        </a>
      </div>

      {images.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((file) => (
            <li key={file.id}>
              <button
                type="button"
                onClick={() => {
                  if (file.url) {
                    setSurface("light");
                    setLightbox({ url: file.url, name: file.original_name });
                  }
                }}
                disabled={!file.url}
                className={cn(
                  "group relative flex aspect-square w-full flex-col overflow-hidden rounded-2xl border border-cream-300 text-left transition",
                  "bg-checkered",
                  file.url
                    ? "cursor-zoom-in hover:border-navy-800/30 hover:shadow-sm"
                    : "cursor-wait opacity-70",
                )}
              >
                {file.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.url}
                    alt={file.original_name}
                    className="size-full object-contain p-2 transition duration-200 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 text-ink-400">
                    <ImageIcon className="size-6" aria-hidden />
                    <span className="text-xs">
                      {file.loadError ? "Yüklenemedi" : "Yükleniyor…"}
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/80 to-transparent px-2.5 pt-8 pb-2">
                  <p className="truncate text-xs font-semibold text-cream-50">
                    {REQUEST_FILE_KIND_LABEL[file.kind] ?? file.kind}
                  </p>
                  <p className="truncate text-[11px] text-cream-50/80">{file.original_name}</p>
                </div>
              </button>
              <div className="mt-1.5 flex items-center justify-between gap-2 px-0.5">
                <span className="truncate text-[11px] text-ink-500">{formatSize(file.size_bytes)}</span>
                <button
                  type="button"
                  onClick={() => void downloadFile(file.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy-900 hover:underline"
                >
                  <Download className="size-3" aria-hidden />
                  İndir
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {others.length ? (
        <ul className="space-y-2">
          {others.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-cream-100 text-ink-500">
                  <FileText className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-navy-900">
                    [{REQUEST_FILE_KIND_LABEL[file.kind] ?? file.kind}] {file.original_name}
                  </p>
                  <p className="text-xs text-ink-500">
                    {file.mime_type} · {formatSize(file.size_bytes)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-cream-300 px-3 py-1.5 font-semibold"
                onClick={() => void downloadFile(file.id)}
              >
                <Download className="size-3.5" aria-hidden />
                İndir
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-navy-900/90"
          role="dialog"
          aria-modal
          aria-label={lightbox.name}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <p className="min-w-0 truncate text-sm font-medium text-cream-50">{lightbox.name}</p>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 rounded-full bg-cream-50/10 p-1 sm:flex">
                {(
                  [
                    ["light", "Açık"],
                    ["dark", "Koyu"],
                    ["solid", "Düz"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSurface(value)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold transition",
                      surface === value
                        ? "bg-cream-50 text-navy-900"
                        : "text-cream-50/80 hover:text-cream-50",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="inline-flex size-10 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition hover:bg-cream-50/20"
                aria-label="Kapat"
              >
                <XIcon className="size-5" />
              </button>
            </div>
          </div>

          <div
            className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8"
            onClick={() => setLightbox(null)}
          >
            <div
              className={cn(
                "flex max-h-full max-w-full items-center justify-center rounded-2xl p-4 sm:p-8",
                surfaceClass(surface),
              )}
              onClick={(event) => event.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox.url}
                alt={lightbox.name}
                className="max-h-[min(78vh,52rem)] max-w-[min(92vw,56rem)] object-contain"
              />
            </div>
          </div>

          <div className="flex shrink-0 justify-center gap-1 px-4 pb-4 sm:hidden">
            {(
              [
                ["light", "Açık"],
                ["dark", "Koyu"],
                ["solid", "Düz"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSurface(value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  surface === value
                    ? "bg-cream-50 text-navy-900"
                    : "bg-cream-50/10 text-cream-50",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
