export default function LoadingProductos() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-8">
      <div className="mb-6">
        <div className="h-8 w-56 rounded-lg bg-brand-cream/60" />
        <div className="mt-2 h-4 w-72 rounded-lg bg-brand-cream/40" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-brand-cream/50" />
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-4 h-6 w-32 rounded-lg bg-brand-cream/60" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-brand-green/10 bg-white"
            >
              <div className="aspect-square w-full bg-brand-sage/15" />
              <div className="space-y-2 p-3">
                <div className="h-4 w-3/4 rounded bg-brand-cream/60" />
                <div className="h-4 w-1/3 rounded bg-brand-cream/40" />
                <div className="h-8 w-full rounded-full bg-brand-cream/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
