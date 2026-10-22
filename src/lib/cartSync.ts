"use client";

import { createClient } from "@/lib/supabase/client";
import { getCartSessionId } from "@/lib/cartSession";
import { getConsent } from "@/lib/analytics";
import type { CartItem } from "@/store/cart";
import type { DeliveryMethod } from "@/lib/types";

let timer: ReturnType<typeof setTimeout> | null = null;

export type CartSessionPatch = {
  items?: CartItem[];
  total?: number;
  customerName?: string;
  customerPhone?: string;
  deliveryMethod?: DeliveryMethod;
  addressRef?: string;
};

// Guarda (debounced) el estado del carrito/checkout en curso, para poder ver
// en el admin los carritos que quedaron sin confirmar. No manda nada si el
// visitante rechazó las analíticas desde el banner de cookies.
export function syncCartSession(patch: CartSessionPatch) {
  if (getConsent() === "rejected") return;
  if (timer) clearTimeout(timer);

  timer = setTimeout(() => {
    const sessionId = getCartSessionId();
    if (!sessionId) return;

    // Va por una función de la base en vez de un upsert directo: con RLS el
    // visitante anónimo no puede leer cart_sessions, y sin lectura Postgres no
    // resuelve el ON CONFLICT. Cada campo en null significa "dejá el que ya está".
    const supabase = createClient();
    supabase
      .rpc("upsert_cart_session", {
        p_session_id: sessionId,
        p_items:
          patch.items?.map((i) => ({
            product_id: i.productId,
            name: i.name,
            unit_label: i.unitLabel,
            price: i.price,
            quantity: i.quantity,
          })) ?? null,
        p_total: patch.total ?? null,
        p_customer_name: patch.customerName?.trim() || null,
        p_customer_phone: patch.customerPhone?.trim() || null,
        p_delivery_method: patch.deliveryMethod ?? null,
        p_address_ref: patch.addressRef?.trim() || null,
      })
      .then(() => {});
  }, 800);
}
