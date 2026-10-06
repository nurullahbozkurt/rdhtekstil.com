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

export function DeleteContactButton({
  id,
  name,
  variant = "button",
  className,
}: {
  id: string;
  name?: string;
  variant?: "button" | "icon";
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete_failed");
      setOpen(false);
      router.push("/admin/messages");
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
        aria-label={name ? `${name} mesajını sil` : "Mesajı sil"}
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
            <DialogTitle>Mesajı sil</DialogTitle>
            <DialogDescription>
              {name ? (
                <>
                  <span className="font-semibold text-navy-900">{name}</span> adlı kişinin mesajı
                  kalıcı olarak silinecek. Bu işlem geri alınamaz.
                </>
              ) : (
                <>Bu mesaj kalıcı olarak silinecek. Bu işlem geri alınamaz.</>
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
