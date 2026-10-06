"use client";

import { ChevronDown, Home, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
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

export type FaqEditorItem = {
  id: string;
  questionTr: string;
  questionEn: string;
  answerTr: string;
  answerEn: string;
  topics: string[];
  sortOrder: number;
  showOnHome: boolean;
};

type DraftFaq = {
  questionTr: string;
  questionEn: string;
  answerTr: string;
  answerEn: string;
  showOnHome: boolean;
};

const emptyDraft = (): DraftFaq => ({
  questionTr: "",
  questionEn: "",
  answerTr: "",
  answerEn: "",
  showOnHome: false,
});

function makeFaqId() {
  return `faq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function FaqEditor({ items }: { items: FaqEditorItem[] }) {
  const router = useRouter();
  const baseId = useId();
  const [rows, setRows] = useState(items);
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const [prevItems, setPrevItems] = useState(items);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState<DraftFaq>(emptyDraft);
  const [draftError, setDraftError] = useState<string | null>(null);

  // Server refresh sonrası prop değişince lokal taslağı senkronize et (effect yerine render sırasında).
  if (items !== prevItems) {
    setPrevItems(items);
    setRows(items);
    setOpenId((current) => {
      if (current && items.some((item) => item.id === current)) return current;
      return items[0]?.id ?? null;
    });
  }

  const updateRow = (id: string, patch: Partial<FaqEditorItem>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const openAddModal = () => {
    setDraft(emptyDraft());
    setDraftError(null);
    setAddOpen(true);
    setMessage(null);
    setError(null);
  };

  const confirmAddFaq = () => {
    if (
      !draft.questionTr.trim() ||
      !draft.questionEn.trim() ||
      !draft.answerTr.trim() ||
      !draft.answerEn.trim()
    ) {
      setDraftError("Tüm soru ve cevap alanlarını (TR + EN) doldurun.");
      return;
    }

    const next: FaqEditorItem = {
      id: makeFaqId(),
      questionTr: draft.questionTr.trim(),
      questionEn: draft.questionEn.trim(),
      answerTr: draft.answerTr.trim(),
      answerEn: draft.answerEn.trim(),
      topics: ["general"],
      sortOrder: rows.length + 1,
      showOnHome: draft.showOnHome,
    };

    setRows((prev) => [...prev, next]);
    setOpenId(next.id);
    setAddOpen(false);
    setDraft(emptyDraft());
    setDraftError(null);
    setMessage("Soru listeye eklendi. Kalıcı olması için Kaydet’e basın.");
  };

  const removeFaq = (id: string) => {
    if (!window.confirm("Bu soru silinsin mi?")) return;
    setRows((prev) => {
      const next = prev.filter((row) => row.id !== id);
      setOpenId((current) => {
        if (current !== id) return current;
        return next[0]?.id ?? null;
      });
      return next;
    });
    setMessage(null);
    setError(null);
  };

  const saveAll = async () => {
    setPending(true);
    setMessage(null);
    setError(null);

    const invalid = rows.find(
      (row) =>
        !row.questionTr.trim() ||
        !row.questionEn.trim() ||
        !row.answerTr.trim() ||
        !row.answerEn.trim(),
    );
    if (invalid) {
      setOpenId(invalid.id);
      setError("Tüm soru ve cevap alanlarını (TR + EN) doldurun.");
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/cms/content", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "faqs",
          items: rows.map((row, index) => ({
            id: row.id,
            questionTr: row.questionTr.trim(),
            questionEn: row.questionEn.trim(),
            answerTr: row.answerTr.trim(),
            answerEn: row.answerEn.trim(),
            topics: row.topics.length ? row.topics : ["general"],
            sortOrder: index + 1,
            showOnHome: row.showOnHome,
          })),
        }),
      });
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(
          json?.error === "forbidden"
            ? "İstek reddedildi (origin). Sayfayı yenileyip tekrar deneyin."
            : json?.error === "unauthorized"
              ? "Oturum gerekli. Tekrar giriş yapın."
              : (json?.error ?? "Kayıt başarısız."),
        );
        return;
      }
      setMessage(`${rows.length} soru kaydedildi.`);
      router.refresh();
    } catch {
      setError("Kayıt başarısız.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-[4.25rem] z-20 -mx-4 border-b border-cream-300 bg-cream-100/95 px-4 py-3 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none lg:top-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-600">{rows.length} soru</p>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cream-300 bg-white px-4 font-semibold text-navy-900 hover:bg-cream-50"
            >
              <Plus className="size-4" aria-hidden />
              Yeni soru
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => void saveAll()}
              className="h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50 disabled:opacity-60"
            >
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        </div>
      </div>

      {rows.length ? (
        <div className="overflow-hidden rounded-2xl border border-cream-300 bg-white">
          {rows.map((row, index) => {
            const open = openId === row.id;
            const panelId = `${baseId}-${row.id}-panel`;
            const triggerId = `${baseId}-${row.id}-trigger`;
            const title = row.questionTr.trim() || `Yeni soru ${index + 1}`;

            return (
              <div key={row.id} className="border-b border-cream-200 last:border-b-0">
                <div className="flex items-stretch">
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : row.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left hover:bg-cream-50"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-cream-100 text-xs font-semibold text-ink-600">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-heading text-base font-medium text-navy-900">
                        {title}
                      </span>
                      {row.questionEn.trim() ? (
                        <span className="mt-0.5 block truncate text-xs text-ink-500">
                          {row.questionEn}
                        </span>
                      ) : null}
                    </span>
                    {row.showOnHome ? (
                      <span className="hidden rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-bold text-navy-900 sm:inline">
                        Anasayfa
                      </span>
                    ) : null}
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-ink-500 transition-transform",
                        open && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRow(row.id, { showOnHome: !row.showOnHome })}
                    className={cn(
                      "inline-flex w-12 shrink-0 items-center justify-center border-l border-cream-200 transition-colors",
                      row.showOnHome
                        ? "bg-gold-500/15 text-navy-900 hover:bg-gold-500/25"
                        : "text-ink-500 hover:bg-cream-50 hover:text-navy-900",
                    )}
                    aria-pressed={row.showOnHome}
                    aria-label={row.showOnHome ? "Anasayfada gösterme" : "Anasayfada göster"}
                    title={row.showOnHome ? "Anasayfada gösterme" : "Anasayfada göster"}
                  >
                    <Home className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaq(row.id)}
                    className="inline-flex w-12 shrink-0 items-center justify-center border-l border-cream-200 text-destructive hover:bg-destructive/5"
                    aria-label={`${title} sorusunu sil`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>

                {open ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="space-y-3 border-t border-cream-200 bg-cream-50/50 px-4 py-4"
                  >
                    <div className="grid gap-3">
                      <label className="space-y-1 text-sm">
                        <span className="font-medium text-navy-900">Soru (TR)</span>
                        <input
                          className="h-11 w-full rounded-xl border border-cream-300 bg-white px-3"
                          value={row.questionTr}
                          onChange={(e) => updateRow(row.id, { questionTr: e.target.value })}
                        />
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="font-medium text-navy-900">Soru (EN)</span>
                        <input
                          className="h-11 w-full rounded-xl border border-cream-300 bg-white px-3"
                          value={row.questionEn}
                          onChange={(e) => updateRow(row.id, { questionEn: e.target.value })}
                        />
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="font-medium text-navy-900">Cevap (TR)</span>
                        <textarea
                          rows={3}
                          className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2"
                          value={row.answerTr}
                          onChange={(e) => updateRow(row.id, { answerTr: e.target.value })}
                        />
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="font-medium text-navy-900">Cevap (EN)</span>
                        <textarea
                          rows={3}
                          className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2"
                          value={row.answerEn}
                          onChange={(e) => updateRow(row.id, { answerEn: e.target.value })}
                        />
                      </label>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-white px-4 py-12 text-center text-sm text-ink-600">
          Henüz soru yok. “Yeni soru” ile ekleyin.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="text-sm">
          {error ? <p className="text-destructive">{error}</p> : null}
          {message ? <p className="text-ink-600">{message}</p> : null}
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cream-300 bg-white px-4 font-semibold text-navy-900 hover:bg-cream-50"
          >
            <Plus className="size-4" aria-hidden />
            Yeni soru
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void saveAll()}
            className="h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50 disabled:opacity-60"
          >
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="w-[min(calc(100%-2rem),36rem)]">
          <DialogHeader>
            <DialogTitle>Yeni soru ekle</DialogTitle>
            <DialogDescription>
              Soru ve cevapları TR / EN olarak doldurun. Listeye eklendikten sonra Kaydet ile kalıcı
              yapın.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-navy-900">Soru (TR)</span>
              <input
                className="h-11 w-full rounded-xl border border-cream-300 bg-white px-3"
                value={draft.questionTr}
                onChange={(e) => setDraft((prev) => ({ ...prev, questionTr: e.target.value }))}
                autoFocus
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-navy-900">Soru (EN)</span>
              <input
                className="h-11 w-full rounded-xl border border-cream-300 bg-white px-3"
                value={draft.questionEn}
                onChange={(e) => setDraft((prev) => ({ ...prev, questionEn: e.target.value }))}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-navy-900">Cevap (TR)</span>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2"
                value={draft.answerTr}
                onChange={(e) => setDraft((prev) => ({ ...prev, answerTr: e.target.value }))}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-navy-900">Cevap (EN)</span>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2"
                value={draft.answerEn}
                onChange={(e) => setDraft((prev) => ({ ...prev, answerEn: e.target.value }))}
              />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-cream-300 bg-white px-3 py-3 text-sm">
              <input
                type="checkbox"
                checked={draft.showOnHome}
                onChange={(e) => setDraft((prev) => ({ ...prev, showOnHome: e.target.checked }))}
                className="size-4 rounded border-cream-300"
              />
              <span className="font-medium text-navy-900">Anasayfada göster</span>
            </label>
            {draftError ? <p className="text-sm text-destructive">{draftError}</p> : null}
          </DialogBody>
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="h-11 rounded-xl border border-cream-300 px-4 font-semibold text-navy-900"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={confirmAddFaq}
              className="h-11 rounded-xl bg-navy-800 px-4 font-semibold text-cream-50"
            >
              Listeye ekle
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
