"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type CatalogProduct = {
  id: string;
  nameTr: string;
  nameEn: string;
  summaryTr: string;
  summaryEn: string;
};

export type CatalogCategory = {
  id: string;
  nameTr: string;
  nameEn: string;
};

export type CatalogIndustry = {
  id: string;
  nameTr: string;
  nameEn: string;
  ctaTr: string;
  ctaEn: string;
};

export function CatalogEditor({
  products,
  categories,
  industries,
}: {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  industries: CatalogIndustry[];
}) {
  const router = useRouter();
  const [productRows, setProductRows] = useState(products);
  const [categoryRows, setCategoryRows] = useState(categories);
  const [industryRows, setIndustryRows] = useState(industries);
  const [message, setMessage] = useState<string | null>(null);

  async function save(body: Record<string, unknown>) {
    const res = await fetch("/api/admin/cms/content", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setMessage(res.ok ? "Kaydedildi." : "Kayıt başarısız.");
    if (res.ok) router.refresh();
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-medium">Ürünler</h2>
        {productRows.map((row, index) => (
          <form
            key={row.id}
            className="space-y-3 rounded-2xl border border-cream-300 bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              void save({ type: "product", ...row });
            }}
          >
            <p className="text-xs font-semibold uppercase text-ink-500">{row.id}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="h-11 rounded-xl border border-cream-300 px-3 text-sm"
                value={row.nameTr}
                placeholder="Ad TR"
                onChange={(e) => {
                  const next = [...productRows];
                  next[index] = { ...row, nameTr: e.target.value };
                  setProductRows(next);
                }}
              />
              <input
                className="h-11 rounded-xl border border-cream-300 px-3 text-sm"
                value={row.nameEn}
                placeholder="Name EN"
                onChange={(e) => {
                  const next = [...productRows];
                  next[index] = { ...row, nameEn: e.target.value };
                  setProductRows(next);
                }}
              />
              <textarea
                rows={2}
                className="rounded-xl border border-cream-300 px-3 py-2 text-sm md:col-span-2"
                value={row.summaryTr}
                onChange={(e) => {
                  const next = [...productRows];
                  next[index] = { ...row, summaryTr: e.target.value };
                  setProductRows(next);
                }}
              />
              <textarea
                rows={2}
                className="rounded-xl border border-cream-300 px-3 py-2 text-sm md:col-span-2"
                value={row.summaryEn}
                onChange={(e) => {
                  const next = [...productRows];
                  next[index] = { ...row, summaryEn: e.target.value };
                  setProductRows(next);
                }}
              />
            </div>
            <button type="submit" className="h-10 rounded-xl bg-navy-800 px-4 text-sm font-semibold text-cream-50">
              Kaydet
            </button>
          </form>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-medium">Kategoriler</h2>
        {categoryRows.map((row, index) => (
          <form
            key={row.id}
            className="grid gap-3 rounded-2xl border border-cream-300 bg-white p-4 md:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault();
              void save({ type: "category", ...row });
            }}
          >
            <p className="text-xs font-semibold uppercase text-ink-500 md:col-span-3">{row.id}</p>
            <input
              className="h-10 rounded-xl border border-cream-300 px-3 text-sm"
              value={row.nameTr}
              onChange={(e) => {
                const next = [...categoryRows];
                next[index] = { ...row, nameTr: e.target.value };
                setCategoryRows(next);
              }}
            />
            <input
              className="h-10 rounded-xl border border-cream-300 px-3 text-sm"
              value={row.nameEn}
              onChange={(e) => {
                const next = [...categoryRows];
                next[index] = { ...row, nameEn: e.target.value };
                setCategoryRows(next);
              }}
            />
            <button type="submit" className="h-10 rounded-xl bg-navy-800 text-sm font-semibold text-cream-50">
              Kaydet
            </button>
          </form>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-medium">Kullanım alanları</h2>
        {industryRows.map((row, index) => (
          <form
            key={row.id}
            className="space-y-3 rounded-2xl border border-cream-300 bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              void save({ type: "industry", ...row });
            }}
          >
            <p className="text-xs font-semibold uppercase text-ink-500">{row.id}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="h-11 rounded-xl border border-cream-300 px-3 text-sm"
                value={row.nameTr}
                onChange={(e) => {
                  const next = [...industryRows];
                  next[index] = { ...row, nameTr: e.target.value };
                  setIndustryRows(next);
                }}
              />
              <input
                className="h-11 rounded-xl border border-cream-300 px-3 text-sm"
                value={row.nameEn}
                onChange={(e) => {
                  const next = [...industryRows];
                  next[index] = { ...row, nameEn: e.target.value };
                  setIndustryRows(next);
                }}
              />
              <input
                className="h-11 rounded-xl border border-cream-300 px-3 text-sm"
                value={row.ctaTr}
                placeholder="CTA TR"
                onChange={(e) => {
                  const next = [...industryRows];
                  next[index] = { ...row, ctaTr: e.target.value };
                  setIndustryRows(next);
                }}
              />
              <input
                className="h-11 rounded-xl border border-cream-300 px-3 text-sm"
                value={row.ctaEn}
                placeholder="CTA EN"
                onChange={(e) => {
                  const next = [...industryRows];
                  next[index] = { ...row, ctaEn: e.target.value };
                  setIndustryRows(next);
                }}
              />
            </div>
            <button type="submit" className="h-10 rounded-xl bg-navy-800 px-4 text-sm font-semibold text-cream-50">
              Kaydet
            </button>
          </form>
        ))}
      </section>

      {message ? <p className="text-sm text-ink-600">{message}</p> : null}
    </div>
  );
}
