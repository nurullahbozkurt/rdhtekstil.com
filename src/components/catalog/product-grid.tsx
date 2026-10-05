"use client";

import { useMemo, useState } from "react";
import { ProductCard, type ProductCardData } from "../cards/product-card";
import { FilterChips } from "./filter-chips";

export function ProductGrid({
  products,
  types,
  labels,
}: {
  products: ProductCardData[];
  types?: { id: string; label: string }[];
  labels: {
    all: string;
    filter: string;
    noResults: string;
    placeholderImage: string;
    placeholderBadge: string;
  };
}) {
  const [type, setType] = useState("all");
  const visible = useMemo(
    () => (type === "all" ? products : products.filter((p) => p.typeIds.includes(type))),
    [products, type],
  );

  return (
    <div>
      {types?.length ? (
        <div className="mb-10">
          <FilterChips
            label={labels.filter}
            value={type}
            onChange={setType}
            options={[
              { id: "all", label: labels.all, count: products.length },
              ...types.map((t) => ({
                ...t,
                count: products.filter((p) => p.typeIds.includes(t.id)).length,
              })),
            ]}
          />
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {visible.length}
      </p>
      {visible.length ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                placeholderLabel={labels.placeholderImage}
                placeholderBadge={labels.placeholderBadge}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-cream-400 p-10 text-center text-ink-600">
          {labels.noResults}
        </p>
      )}
    </div>
  );
}
