import { getProductEventStats } from "@/lib/admin-queries";
import DateRangeFilter from "@/components/admin/DateRangeFilter";
import type { ProductEventStats } from "@/lib/types";

export default async function AdminAnaliticasPage({
  searchParams,
}: PageProps<"/admin/analiticas">) {
  const { desde, hasta } = await searchParams;
  const desdeStr = Array.isArray(desde) ? desde[0] : desde;
  const hastaStr = Array.isArray(hasta) ? hasta[0] : hasta;

  const stats = await getProductEventStats({ from: desdeStr, to: hastaStr });
  const totalViews = stats.reduce((sum, s) => sum + s.views, 0);
  const totalAdds = stats.reduce((sum, s) => sum + s.adds, 0);

  const byAdds = [...stats].sort((a, b) => b.adds - a.adds || b.views - a.views).slice(0, 10);
  const byViews = [...stats].sort((a, b) => b.views - a.views || b.adds - a.adds).slice(0, 10);

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-bold text-brand-green-dark">Analíticas</h1>
      <p className="mb-6 text-sm text-brand-green-dark/60">
        Qué productos ven y agregan al carrito los visitantes de la tienda. No incluye
        datos personales, solo conteos por producto.
      </p>

      <DateRangeFilter basePath="/admin/analiticas" desde={desdeStr} hasta={hastaStr} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard label="Vistas de producto" value={totalViews.toString()} />
        <StatCard label="Agregados al carrito" value={totalAdds.toString()} />
      </div>

      {stats.length === 0 ? (
        <p className="rounded-xl bg-brand-cream/30 px-4 py-6 text-brand-green-dark/70">
          Todavía no hay datos en ese rango de fechas.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Ranking title="Más agregados al carrito" items={byAdds} metric="adds" />
          <Ranking title="Más vistos" items={byViews} metric="views" />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-brand-cream/30 px-5 py-4">
      <p className="text-sm font-semibold text-brand-green-dark/60">{label}</p>
      <p className="font-display text-2xl font-bold text-brand-green-dark">{value}</p>
    </div>
  );
}

function Ranking({
  title,
  items,
  metric,
}: {
  title: string;
  items: ProductEventStats[];
  metric: "views" | "adds";
}) {
  const max = Math.max(1, ...items.map((i) => i[metric]));

  return (
    <div className="rounded-2xl border border-brand-green/10 bg-white p-5">
      <h2 className="font-display mb-4 font-bold text-brand-green-dark">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-brand-green-dark/60">Sin datos todavía.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <span className="w-28 flex-shrink-0 truncate text-xs text-brand-green-dark/70" title={item.name}>
                {item.name}
              </span>
              <div className="h-5 flex-1 overflow-hidden rounded-full bg-brand-cream/30">
                <div
                  className="h-full rounded-full bg-brand-green"
                  style={{ width: `${Math.max(4, (item[metric] / max) * 100)}%` }}
                />
              </div>
              <span className="w-8 flex-shrink-0 text-right text-xs font-semibold text-brand-green-dark">
                {item[metric]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
