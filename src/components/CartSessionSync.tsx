"use client";

import { useEffect } from "react";
import { useCartStore, cartTotal } from "@/store/cart";
import { syncCartSession } from "@/lib/cartSync";

// Montado una sola vez en el layout del sitio: cada vez que cambia el
// carrito (en cualquier página), lo manda a guardar. No renderiza nada.
export default function CartSessionSync() {
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    if (items.length === 0) return;
    syncCartSession({ items, total: cartTotal(items) });
  }, [items]);

  return null;
}
