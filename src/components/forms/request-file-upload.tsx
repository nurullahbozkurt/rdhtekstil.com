"use client";

import { FileIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ALLOWED_MIME, MAX_FILE_BYTES } from "@/lib/uploads/config";

export type UploadedFileMeta = {
  kind: "LOGO" | "REFERENCE" | "OTHER";
  originalName: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  previewUrl?: string;
};

type Labels = {
  drop: string;
  uploading: string;
  remove: string;
  retry: string;
  help?: string;
  privacy: string;
};

export function RequestFileUpload({
  kind,
  multiple,
  files,
  onChange,
  labels,
  disabled,
}: {
  kind: UploadedFileMeta["kind"];
  multiple?: boolean;
  files: UploadedFileMeta[];
  onChange: (files: UploadedFileMeta[]) => void;
  labels: Labels;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadOne = async (file: File): Promise<UploadedFileMeta | null> => {
    if (file.size > MAX_FILE_BYTES) {
      setError("too_large");
      return null;
    }
    if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) {
      setError("type_not_allowed");
      return null;
    }

    const body = new FormData();
    body.set("file", file);
    body.set("kind", kind);
    body.set("website", "");
    body.set("turnstileToken", "");

    const res = await fetch("/api/uploads", { method: "POST", body });
    if (!res.ok) {
      setError("upload_failed");
      return null;
    }
    const json = (await res.json()) as { file: UploadedFileMeta };
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    return { ...json.file, previewUrl };
  };

  const onPick = async (list: FileList | null) => {
    if (!list?.length || disabled) return;
    setError(null);
    setUploading(true);
    try {
      const picked = Array.from(list);
      const next = multiple ? [...files] : [];
      for (const file of picked) {
        if (!multiple && next.length >= 1) break;
        if (next.length >= 10) break;
        const uploaded = await uploadOne(file);
        if (uploaded) next.push(uploaded);
      }
      onChange(next);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {labels.help ? <p className="text-sm text-ink-600">{labels.help}</p> : null}
      <p className="text-xs text-ink-500">{labels.privacy}</p>
      <label
        className={cn(
          "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-4 py-6 text-center transition-colors hover:border-navy-700/40",
          (disabled || uploading) && "pointer-events-none opacity-60",
        )}
      >
        {uploading ? (
          <Loader2 className="size-5 animate-spin text-navy-800" aria-hidden />
        ) : (
          <Upload className="size-5 text-navy-800" aria-hidden />
        )}
        <span className="text-sm font-semibold text-navy-900">
          {uploading ? labels.uploading : labels.drop}
        </span>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={ALLOWED_MIME.join(",")}
          multiple={multiple}
          capture="environment"
          disabled={disabled || uploading}
          onChange={(e) => void onPick(e.target.files)}
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <ul className="space-y-2">
        {files.map((file) => (
          <li
            key={file.storageKey}
            className="flex items-center gap-3 rounded-xl border border-cream-300 bg-cream-50 p-3"
          >
            {file.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={file.previewUrl} alt="" className="size-12 rounded-lg object-cover" />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-lg bg-cream-200">
                <FileIcon className="size-4" aria-hidden />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy-900">{file.originalName}</p>
              <p className="text-xs text-ink-500">{Math.round(file.sizeBytes / 1024)} KB</p>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-ink-600 hover:bg-cream-200 hover:text-navy-900"
              aria-label={labels.remove}
              onClick={() => onChange(files.filter((f) => f.storageKey !== file.storageKey))}
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
