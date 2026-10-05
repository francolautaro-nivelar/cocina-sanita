import { MessageCircle } from "lucide-react";
import { getOrders } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/format";
import { buildOrderConfirmationLink } from "@/lib/whatsapp";
import DateRangeFilter from "@/components/admin/DateRangeFilter";
import DeleteOrderButton from "./DeleteOrderButton";
import OrderStatusSelect from "./OrderStatusSelect";
import type { OrderStatus } from "@/lib/types";

const STATUS_FILTERS: { label: string; value: OrderStatus | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Pendientes", value: "pendiente" },
  { label: "Confirmados", value: "confirmado" },
  { label: "Entregados", value: "entregado" },
  { label: "Cancelados", value: "cancelado" },
];

export default async function AdminPedidosPage({
  searchParams,
}: PageProps<"/admin/pedidos">) {
  const { desde, hasta, estado } = await searchParams;
  const desdeStr = Array.isArray(desde) ? desde[0] : desde;
  const hastaStr = Array.isArray(hasta) ? hasta[0] : hasta;
  const estadoStr = (Array.isArray(estado) ? estado[0] : estado) as OrderStatus | undefined;

  const allOrders = await getOrders({ from: desdeStr, to: hastaStr });
  const orders = estadoStr ? allOrders.filter((o) => o.status === estadoStr) : allOrders;
  const totalPeriodo = orders.reduce((sum, o) => sum + o.total, 0);

  const queryTail = `${desdeStr ? `&desde=${desdeStr}` : ""}${hastaStr ? `&hasta=${hastaStr}` : ""}`;

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-bold text-brand-green-dark">Pedidos</h1>
      <p className="mb-6 text-sm text-brand-green-dark/60">
        Pedidos armados desde la web. Confirmalos acá y coordiná el pago y la entrega
        cuando quieras.
      </p>

      <DateRangeFilter basePath="/admin/pedidos" desde={desdeStr} hasta={hastaStr} />

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <a
            key={f.value}
            href={`/admin/pedidos?${f.value === "todos" ? "" : `estado=${f.value}`}${queryTail}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              (estadoStr ?? "todos") === f.value
                ? "bg-brand-green text-white"
                : "bg-brand-cream/50 text-brand-green-dark hover:bg-brand-cream"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="rounded-xl bg-brand-cream/30 px-4 py-6 text-brand-green-dark/70">
          No hay pedidos con esos filtros.
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm font-semibold text-brand-green-dark/70">
            {orders.length} pedido{orders.length !== 1 ? "s" : ""} — total {formatPrice(totalPeriodo)}
          </p>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-brand-green/10 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-bold text-brand-green-dark">
                      {order.customer_name}
                    </p>
                    <p className="text-sm text-brand-green-dark/60">{order.phone}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-right">
                      <p className="font-display font-bold text-brand-olive">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs text-brand-green-dark/50">
                        {new Date(order.created_at).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <DeleteOrderButton orderId={order.id} customerName={order.customer_name} />
                  </div>
                </div>

                <p className="mt-2 text-sm text-brand-green-dark/70">
                  {order.delivery_method === "retiro" ? "Retiro" : "Envío a coordinar"}
                  {order.address_ref ? ` — ${order.address_ref}` : ""}
                </p>

                <ul className="mt-2 space-y-0.5 text-sm text-brand-green-dark/80">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.quantity}x {item.name}
                      {item.unit_label ? ` (${item.unit_label})` : ""} —{" "}
                      {formatPrice(item.price * item.quantity)}
                    </li>
                  ))}
                </ul>

                {order.notes && (
                  <p className="mt-2 text-sm italic text-brand-green-dark/60">
                    Notas: {order.notes}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-brand-green/10 pt-3">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                  <a
                    href={buildOrderConfirmationLink({
                      phone: order.phone,
                      customerName: order.customer_name,
                      deliveryMethod: order.delivery_method,
                      addressRef: order.address_ref,
                      items: order.items,
                      total: order.total,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-brand-sage/20 px-3 py-1 text-xs font-semibold text-brand-green-dark hover:bg-brand-sage/40"
                  >
                    <MessageCircle size={14} /> Confirmar por WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
