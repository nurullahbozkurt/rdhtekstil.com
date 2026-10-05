type Props = { data: Record<string, unknown> | null | (Record<string, unknown> | null)[] };

/** JSON-LD yapısal verisi. `<` kaçışlanarak XSS'e karşı korunur. */
export function JsonLd({ data }: Props) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!items.length) return null;
  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
