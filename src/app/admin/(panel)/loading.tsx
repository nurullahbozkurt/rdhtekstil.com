export default function AdminLoading() {
  return (
    <div className="space-y-5 sm:space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Yükleniyor</span>
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-cream-300 motion-reduce:animate-none" />
        <div className="h-4 w-24 animate-pulse rounded bg-cream-300/80 motion-reduce:animate-none" />
      </div>
      <div className="h-24 animate-pulse rounded-2xl bg-cream-200 motion-reduce:animate-none" />
      <div className="space-y-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-2xl bg-white motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}
