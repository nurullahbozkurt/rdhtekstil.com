"use client";

import { useSearchParams } from "next/navigation";

/**
 * Talep ekranında `?urun=` / `?alan=` ön seçimini görsel olarak gösterir.
 * Asıl form `RequestForm` içinde aynı parametrelerle draft’ı doldurur.
 */
export function RequestPrefill({
  products,
  industries,
  labels,
}: {
  products: Record<string, string>;
  industries: Record<string, string>;
  labels: { product: string; industry: string };
}) {
  const params = useSearchParams();
  const productId = params.get("urun") ?? "";
  const industryId = params.get("alan") ?? "";
  const product = products[productId];
  const industry = industries[industryId];

  if (!product && !industry) return null;

  return (
    <dl
      data-testid="request-prefill"
      className="mt-8 grid gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-6 sm:grid-cols-2"
    >
      {product ? (
        <div>
          <dt className="eyebrow">{labels.product}</dt>
          <dd className="mt-1 font-heading text-xl text-navy-900" data-product-id={productId}>
            {product}
          </dd>
        </div>
      ) : null}
      {industry ? (
        <div>
          <dt className="eyebrow">{labels.industry}</dt>
          <dd className="mt-1 font-heading text-xl text-navy-900" data-industry-id={industryId}>
            {industry}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
