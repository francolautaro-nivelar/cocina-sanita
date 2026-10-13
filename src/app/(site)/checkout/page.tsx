"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCartStore, cartTotal, type CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import type { DeliveryMethod } from "@/lib/types";
import { getCartSessionId } from "@/lib/cartSession";
import { syncCartSession } from "@/lib/cartSync";
import { submitOrder } from "./actions";

type ConfirmedOrder = {
  items: CartItem[];
  total: number;
  deliveryMethod: DeliveryMethod;
};

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const total = cartTotal(items);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("retiro");
  const [addressRef, setAddressRef] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  useEffect(() => {
    if (!customerName.trim() && !phone.trim()) return;
    syncCartSession({
      customerName,
      customerPhone: phone,
      deliveryMethod,
      addressRef: deliveryMethod === "envio" ? addressRef : "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerName, phone, deliveryMethod, addressRef]);

  if (confirmedOrder) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-brand-olive" size={56} strokeWidth={1.5} />
        <h1 className="font-display text-2xl font-bold text-brand-green-dark">
          ¡Pedido recibido!
        </h1>
        <p className="mt-3 text-brand-green-dark/70">
          Tu pedido por {formatPrice(confirmedOrder.total)} ya quedó registrado. Te vamos
          a contactar para coordinar{" "}
          {confirmedOrder.deliveryMethod === "retiro" ? "el retiro" : "el envío"} y el
          pago.
        </p>
        <div className="mt-6 rounded-2xl border border-brand-green/10 bg-white p-4 text-left">
          <ul className="space-y-1 text-sm text-brand-green-dark/80">
            {confirmedOrder.items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                  {item.unitLabel ? ` (${item.unitLabel})` : ""}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/productos"
          className="mt-6 inline-block rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition-all hover:bg-brand-green-dark active:scale-95"
        >
          Seguir comprando
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-green-dark">
          Tu carrito está vacío
        </h1>
        <Link
          href="/productos"
          className="mt-4 inline-block rounded-full bg-brand-green px-6 py-3 font-semibold text-white hover:bg-brand-green-dark"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const orderItems = items.map((i) => ({
      product_id: i.productId,
      name: i.name,
      unit_label: i.unitLabel,
      price: i.price,
      quantity: i.quantity,
    }));

    const result = await submitOrder({
      customerName,
      phone,
      deliveryMethod,
      addressRef: deliveryMethod === "envio" ? addressRef : undefined,
      notes,
      items: orderItems,
      total,
      cartSessionId: getCartSessionId(),
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setConfirmedOrder({ items, total, deliveryMethod });
    clear();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display mb-2 text-3xl font-bold text-brand-green-dark">
        Finalizar pedido
      </h1>
      <p className="mb-6 text-brand-green-dark/70">
        Completá tus datos y confirmá. Te vamos a contactar para coordinar el pago y la
        entrega.
      </p>

      <div className="mb-6 rounded-2xl border border-brand-green/10 bg-white p-4">
        <h2 className="font-display mb-2 font-bold text-brand-green-dark">Resumen</h2>
        <ul className="space-y-1 text-sm text-brand-green-dark/80">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between">
              <span>
                {item.quantity}x {item.name}
                {item.unitLabel ? ` (${item.unitLabel})` : ""}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-brand-green/10 pt-3 font-display font-bold text-brand-green-dark">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nombre y apellido *">
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="input"
            placeholder="Tu nombre"
          />
        </Field>

        <Field label="Celular *">
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
            placeholder="Ej: 221 555-5555"
          />
        </Field>

        <Field label="Entrega">
          <div className="flex gap-3">
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-brand-green/20 px-4 py-3 has-[:checked]:border-brand-green has-[:checked]:bg-brand-cream/30">
              <input
                type="radio"
                name="delivery"
                checked={deliveryMethod === "retiro"}
                onChange={() => setDeliveryMethod("retiro")}
              />
              Retiro
            </label>
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-brand-green/20 px-4 py-3 has-[:checked]:border-brand-green has-[:checked]:bg-brand-cream/30">
              <input
                type="radio"
                name="delivery"
                checked={deliveryMethod === "envio"}
                onChange={() => setDeliveryMethod("envio")}
              />
              Envío a coordinar
            </label>
          </div>
        </Field>

        {deliveryMethod === "envio" && (
          <Field label="Dirección / zona de referencia *">
            <input
              required
              value={addressRef}
              onChange={(e) => setAddressRef(e.target.value)}
              className="input"
              placeholder="Calle, barrio o zona"
            />
          </Field>
        )}

        <Field label="Notas (opcional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input min-h-20"
            placeholder="Alguna aclaración para tu pedido"
          />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition-all hover:bg-brand-green-dark active:scale-95 disabled:opacity-60"
        >
          {submitting ? "Enviando..." : "Confirmar pedido"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
        {label}
      </span>
      {children}
    </label>
  );
}
