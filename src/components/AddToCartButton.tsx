"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBasket, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [lastAddedQty, setLastAddedQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  if (product.price == null) {
    return (
      <span className="block rounded-full bg-brand-cream/50 px-3 py-1.5 text-center text-sm font-semibold text-brand-green-dark/60">
        Sin stock
      </span>
    );
  }

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setLastAddedQty(quantity);
    setBurstKey((k) => k + 1);
    setQuantity(1);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
      <div className="flex flex-shrink-0 items-center rounded-full border border-brand-green/20">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-1 text-brand-green-dark hover:text-brand-gold sm:p-1.5"
          aria-label="Restar cantidad"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center text-sm font-semibold sm:w-5">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="p-1 text-brand-green-dark hover:text-brand-gold sm:p-1.5"
          aria-label="Sumar cantidad"
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="relative flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-visible rounded-full bg-brand-green px-2 py-1.5 text-sm font-semibold text-white transition-all hover:bg-brand-green-dark active:scale-95 disabled:opacity-60 sm:px-3"
        disabled={!product.in_stock}
      >
        <span key={burstKey} className={added ? "flex min-w-0 items-center gap-1.5 animate-pop" : "flex min-w-0 items-center gap-1.5"}>
          {added ? (
            <>
              <Check size={16} className="hidden flex-shrink-0 sm:block" />
              <span className="truncate">Agregado</span>
            </>
          ) : (
            <>
              <ShoppingBasket size={16} className="hidden flex-shrink-0 sm:block" />
              <span className="truncate">Agregar</span>
            </>
          )}
        </span>

        {added && (
          <span
            key={`fly-${burstKey}`}
            className="pointer-events-none absolute -top-1 right-3 animate-fly-up text-brand-gold-light"
          >
            +{lastAddedQty > 1 ? lastAddedQty : ""}
          </span>
        )}
      </button>
    </div>
  );
}
