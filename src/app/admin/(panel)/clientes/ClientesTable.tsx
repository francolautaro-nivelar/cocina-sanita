"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import type { CustomerSummary } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { buildCustomerWhatsAppLink } from "@/lib/whatsapp";

export default function ClientesTable({ customers }: { customers: CustomerSummary[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o teléfono..."
        className="input mb-4 sm:max-w-sm"
      />

      {filtered.length === 0 ? (
        <p className="rounded-xl bg-brand-cream/30 px-4 py-6 text-center text-brand-green-dark/60">
          No encontramos clientes con esa búsqueda.
        </p>
      ) : (
        <>
          {/* Mobile: lista de tarjetas */}
          <div className="space-y-3 sm:hidden">
            {filtered.map((customer) => (
              <div key={customer.phone} className="rounded-2xl border border-brand-green/10 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-brand-green-dark">{customer.name}</p>
                    <p className="text-sm text-brand-green-dark/60">{customer.phone}</p>
                  </div>
                  <p className="flex-shrink-0 font-semibold text-brand-olive">
                    {formatPrice(customer.totalSpent)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-brand-green-dark/60">
                    {customer.ordersCount} pedido{customer.ordersCount !== 1 ? "s" : ""} — último{" "}
                    {new Date(customer.lastOrderAt).toLocaleDateString("es-AR")}
                  </p>
                  <a
                    href={buildCustomerWhatsAppLink(customer.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-brand-sage/20 px-3 py-1 text-xs font-semibold text-brand-green-dark hover:bg-brand-sage/40"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabla */}
          <div className="hidden overflow-x-auto rounded-2xl border border-brand-green/10 bg-white sm:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-brand-green/10 text-left text-brand-green-dark/60">
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Teléfono</th>
                  <th className="px-4 py-3 font-semibold">Pedidos</th>
                  <th className="px-4 py-3 font-semibold">Total gastado</th>
                  <th className="px-4 py-3 font-semibold">Último pedido</th>
                  <th className="px-4 py-3 font-semibold text-right">Contacto</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.phone} className="border-b border-brand-green/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-brand-green-dark">{customer.name}</td>
                    <td className="px-4 py-3 text-brand-green-dark/70">{customer.phone}</td>
                    <td className="px-4 py-3 text-brand-green-dark/70">{customer.ordersCount}</td>
                    <td className="px-4 py-3 font-semibold text-brand-olive">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-brand-green-dark/70">
                      {new Date(customer.lastOrderAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={buildCustomerWhatsAppLink(customer.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-brand-sage/20 px-3 py-1 text-xs font-semibold text-brand-green-dark hover:bg-brand-sage/40"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
