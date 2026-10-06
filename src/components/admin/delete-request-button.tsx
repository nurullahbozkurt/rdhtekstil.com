"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DeleteRequestButton({
  id,
  number,
  variant = "button",
  className,
  onDeleted,
}: {
  id: string;
  number?: string;
  variant?: "button" | "icon";
  className?: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete_failed");
      setOpen(false);
      onDeleted?.();
      router.push("/admin/requests");
      router.refresh();
    } catch {
      setError("Silinemedi.");
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          variant === "icon"
            ? "inline-flex size-10 items-center justify-center rounded-lg border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
            : "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 px-4 font-semibold text-destructive disabled:opacity-60 sm:w-auto",
          className,
        )}
        aria-label={number ? `${number} talebini sil` : "Talebi sil"}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setError(null);
          setOpen(true);
        }}
      >
        {variant === "icon" ? (
          <Trash2 className="size-4" aria-hidden />
        ) : (
          <>
            <Trash2 className="size-4" aria-hidden />
            Sil
          </>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(calc(100%-2rem),28rem)]" showCloseButton={!pending}>
          <DialogHeader>
            <DialogTitle>Talebi sil</DialogTitle>
            <DialogDescription>
              {number ? (
                <>
                  <span className="font-semibold text-navy-900">{number}</span> numaralı talep ve
                  ilişkili tüm dosyalar kalıcı olarak silinecek. Bu işlem geri alınamaz.
                </>
              ) : (
                <>Bu talep ve ilişkili tüm dosyalar kalıcı olarak silinecek. Bu işlem geri alınamaz.</>
              )}
            </DialogDescription>
          </DialogHeader>
          {error ? (
            <DialogBody className="py-2">
              <p className="text-sm text-destructive">{error}</p>
            </DialogBody>
          ) : null}
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={pending}
              onClick={() => setOpen(false)}
              className="h-11 rounded-xl border border-cream-300 px-4 font-semibold text-navy-900 disabled:opacity-60"
            >
              Vazgeç
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => void remove()}
              className="h-11 rounded-xl bg-destructive px-4 font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Siliniyor…" : "Evet, sil"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
