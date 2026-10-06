"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CtaEditor({
  initial,
}: {
  initial: {
    designRequestTr: string;
    designRequestEn: string;
    browseProductsTr: string;
    browseProductsEn: string;
    otherProductsTr: string;
    otherProductsEn: string;
    textTr: string;
    textEn: string;
  };
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <form
        className="space-y-3 rounded-2xl border border-cream-300 bg-white p-5"
        onSubmit={(e) => {
          e.preventDefault();
          void fetch("/api/admin/cms/content", {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              type: "cta",
              designRequestTr: values.designRequestTr,
              designRequestEn: values.designRequestEn,
              browseProductsTr: values.browseProductsTr,
              browseProductsEn: values.browseProductsEn,
              otherProductsTr: values.otherProductsTr,
              otherProductsEn: values.otherProductsEn,
            }),
          }).then(async (res) => {
            setMessage(res.ok ? "CTA kaydedildi." : "Kayıt başarısız.");
            if (res.ok) router.refresh();
          });
        }}
      >
        <h2 className="font-heading text-xl font-medium">CTA metinleri</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["designRequestTr", "Tasarım talebi TR"],
              ["designRequestEn", "Design request EN"],
              ["browseProductsTr", "Ürünleri incele TR"],
              ["browseProductsEn", "Browse products EN"],
              ["otherProductsTr", "Diğer ürünler TR"],
              ["otherProductsEn", "Other products EN"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="space-y-1 text-sm">
              <span>{label}</span>
              <input
                className="h-11 w-full rounded-xl border border-cream-300 px-3"
                value={values[key]}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              />
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="h-10 rounded-xl bg-navy-800 px-4 text-sm font-semibold text-cream-50"
        >
          CTA kaydet
        </button>
      </form>

      <form
        className="space-y-3 rounded-2xl border border-cream-300 bg-white p-5"
        onSubmit={(e) => {
          e.preventDefault();
          void fetch("/api/admin/cms/content", {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              type: "successText",
              textTr: values.textTr,
              textEn: values.textEn,
            }),
          }).then(async (res) => {
            setMessage(res.ok ? "Başarı metni kaydedildi." : "Kayıt başarısız.");
            if (res.ok) router.refresh();
          });
        }}
      >
        <h2 className="font-heading text-xl font-medium">Talep başarı metni</h2>
        <label className="block space-y-1 text-sm">
          <span>TR</span>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-cream-300 px-3 py-2"
            value={values.textTr}
            onChange={(e) => setValues({ ...values, textTr: e.target.value })}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>EN</span>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-cream-300 px-3 py-2"
            value={values.textEn}
            onChange={(e) => setValues({ ...values, textEn: e.target.value })}
          />
        </label>
        <button
          type="submit"
          className="h-10 rounded-xl bg-navy-800 px-4 text-sm font-semibold text-cream-50"
        >
          Başarı metnini kaydet
        </button>
      </form>
      {message ? <p className="text-sm text-ink-600">{message}</p> : null}
    </div>
  );
}
