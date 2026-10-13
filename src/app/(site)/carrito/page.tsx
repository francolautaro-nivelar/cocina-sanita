"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBasket } from "lucide-react";
import { useCartStore, cartTotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";

export default function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
        <ShoppingBasket size={48} className="text-brand-sage" />
        <h1 className="font-display text-2xl font-bold text-brand-green-dark">
          Tu carrito está vacío
        </h1>
        <p className="text-brand-green-dark/70">
          Todavía no agregaste productos. Dale una vuelta a la tienda.
        </p>
        <Link
          href="/productos"
          className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition-all hover:bg-brand-green-dark active:scale-95"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display mb-6 text-3xl font-bold text-brand-green-dark">
        Tu carrito
      </h1>

      <div className="divide-y divide-brand-green/10 rounded-2xl border border-brand-green/10 bg-white">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="font-display font-bold text-brand-green-dark">{item.name}</p>
              {item.unitLabel && (
                <p className="text-xs text-brand-green-dark/60">{item.unitLabel}</p>
              )}
              <p className="text-sm text-brand-olive">{formatPrice(item.price)}</p>
            </div>

            <div className="flex items-center rounded-full border border-brand-green/20">
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                className="p-1.5 text-brand-green-dark transition-transform hover:text-brand-gold active:scale-75"
                aria-label="Restar cantidad"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                className="p-1.5 text-brand-green-dark transition-transform hover:text-brand-gold active:scale-75"
                aria-label="Sumar cantidad"
              >
                <Plus size={14} />
              </button>
            </div>

            <p className="w-24 text-right font-display font-bold text-brand-green-dark">
              {formatPrice(item.price * item.quantity)}
            </p>

            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="p-2 text-brand-green-dark/50 transition-transform hover:text-red-500 active:scale-75"
              aria-label="Quitar producto"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-brand-cream/30 px-5 py-4">
        <span className="font-display text-lg font-bold text-brand-green-dark">Total</span>
        <span className="font-display text-2xl font-bold text-brand-green-dark">
          {formatPrice(total)}
        </span>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link
          href="/productos"
          className="rounded-full border border-brand-green/30 px-6 py-3 text-center font-semibold text-brand-green-dark transition-all hover:bg-brand-cream/30 active:scale-95"
        >
          Seguir comprando
        </Link>
        <Link
          href="/checkout"
          className="rounded-full bg-brand-green px-6 py-3 text-center font-semibold text-white transition-all hover:bg-brand-green-dark active:scale-95"
        >
          Continuar con el pedido
        </Link>
      </div>
    </div>
  );
}
