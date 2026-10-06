import { ProductCard, type ProductCardData } from "../cards/product-card";

export function ProductGrid({
  products,
  labels,
}: {
  products: ProductCardData[];
  labels: {
    noResults: string;
    placeholderImage: string;
    placeholderBadge: string;
  };
}) {
  return (
    <div>
      {products.length ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
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
