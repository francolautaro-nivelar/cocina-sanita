import { getOrders } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/format";
import DateRangeFilter from "@/components/admin/DateRangeFilter";
import type { Order } from "@/lib/types";

function groupByDay(orders: Order[]) {
  const map = new Map<string, number>();
  for (const order of orders) {
    const day = order.created_at.slice(0, 10); // yyyy-mm-dd
    map.set(day, (map.get(day) ?? 0) + order.total);
  }
  return Array.from(map.entries())
    .map(([day, total]) => ({ day, total }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

function groupByMonth(orders: Order[]) {
  const map = new Map<string, number>();
  for (const order of orders) {
    const month = order.created_at.slice(0, 7); // yyyy-mm
    map.set(month, (map.get(month) ?? 0) + order.total);
  }
  return Array.from(map.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export default async function AdminFinanzasPage({
  searchParams,
}: PageProps<"/admin/finanzas">) {
  const { desde, hasta } = await searchParams;
  const desdeStr = Array.isArray(desde) ? desde[0] : desde;
  const hastaStr = Array.isArray(hasta) ? hasta[0] : hasta;

  const allOrders = await getOrders({ from: desdeStr, to: hastaStr });
  const orders = allOrders.filter((o) => o.status !== "cancelado");
  const canceladosCount = allOrders.length - orders.length;
  const total = orders.reduce((sum, o) => sum + o.total, 0);
  const promedio = orders.length ? Math.round(total / orders.length) : 0;

  const hasRange = Boolean(desdeStr || hastaStr);
  const daily = groupByDay(orders);
  const monthly = groupByMonth(orders);
  const breakdown = hasRange && daily.length <= 31 ? daily.map((d) => ({ label: d.day, total: d.total })) : monthly.map((m) => ({ label: m.month, total: m.total }));
  const maxBar = Math.max(1, ...breakdown.map((b) => b.total));

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-bold text-brand-green-dark">Finanzas</h1>
      <p className="mb-6 text-sm text-brand-green-dark/60">
        Valor de los pedidos que entraron por la web (no incluye los cancelados
        {canceladosCount > 0 ? `, ${canceladosCount} en este período` : ""}).
      </p>

      <DateRangeFilter basePath="/admin/finanzas" desde={desdeStr} hasta={hastaStr} />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Ingresos del período" value={formatPrice(total)} />
        <StatCard label="Pedidos" value={orders.length.toString()} />
        <StatCard label="Ticket promedio" value={formatPrice(promedio)} />
      </div>

      {breakdown.length === 0 ? (
        <p className="rounded-xl bg-brand-cream/30 px-4 py-6 text-brand-green-dark/70">
          No hay pedidos en ese rango de fechas.
        </p>
      ) : (
        <div className="rounded-2xl border border-brand-green/10 bg-white p-5">
          <h2 className="font-display mb-4 font-bold text-brand-green-dark">
            {hasRange && daily.length <= 31 ? "Por día" : "Por mes"}
          </h2>
          <div className="space-y-2">
            {breakdown.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <span className="w-24 flex-shrink-0 text-xs text-brand-green-dark/60">
                  {b.label}
                </span>
                <div className="h-5 flex-1 overflow-hidden rounded-full bg-brand-cream/30">
                  <div
                    className="h-full rounded-full bg-brand-green"
                    style={{ width: `${Math.max(4, (b.total / maxBar) * 100)}%` }}
                  />
                </div>
                <span className="w-24 flex-shrink-0 text-right text-xs font-semibold text-brand-green-dark">
                  {formatPrice(b.total)}
                </span>
              </div>
            ))}
          </div>
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
