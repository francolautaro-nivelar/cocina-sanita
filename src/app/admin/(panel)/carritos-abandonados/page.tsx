import { MessageCircle } from "lucide-react";
import { getAbandonedCarts } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/format";
import { buildCartRecoveryLink } from "@/lib/whatsapp";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "hace menos de 1 hora";
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default async function AdminCarritosAbandonadosPage() {
  const carts = await getAbandonedCarts();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-bold text-brand-green-dark">
        Carritos abandonados
      </h1>
      <p className="mb-6 text-sm text-brand-green-dark/60">
        Carritos con productos cargados hace más de una hora que no se convirtieron en
        pedido. Si la persona llegó a escribir su nombre y celular en el checkout,
        aparece acá aunque no haya confirmado.
      </p>

      {carts.length === 0 ? (
        <p className="rounded-xl bg-brand-cream/30 px-4 py-6 text-brand-green-dark/70">
          No hay carritos abandonados por ahora.
        </p>
      ) : (
        <div className="space-y-3">
          {carts.map((cart) => (
            <div
              key={cart.session_id}
              className="rounded-2xl border border-brand-green/10 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display font-bold text-brand-green-dark">
                    {cart.customer_name || "Sin nombre"}
                    {cart.customer_phone && (
                      <span className="ml-2 font-normal text-brand-green-dark/60">
                        {cart.customer_phone}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-brand-green-dark/50">
                    Actualizado {timeAgo(cart.updated_at)}
                  </p>
                </div>
                <p className="font-display text-lg font-bold text-brand-olive">
                  {formatPrice(cart.total)}
                </p>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-brand-green-dark/80">
                {cart.items.map((item) => (
                  <li key={item.product_id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                      {item.unit_label ? ` (${item.unit_label})` : ""}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              {cart.customer_phone && (
                <a
                  href={buildCartRecoveryLink({
                    phone: cart.customer_phone,
                    customerName: cart.customer_name,
                    items: cart.items,
                    total: cart.total,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-sage/20 px-3 py-1 text-xs font-semibold text-brand-green-dark hover:bg-brand-sage/40"
                >
                  <MessageCircle size={14} /> Escribir por WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
