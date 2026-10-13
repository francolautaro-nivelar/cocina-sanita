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

    const payload: Record<string, unknown> = {
      session_id: sessionId,
      updated_at: new Date().toISOString(),
    };
    if (patch.items) {
      payload.items = patch.items.map((i) => ({
        product_id: i.productId,
        name: i.name,
        unit_label: i.unitLabel,
        price: i.price,
        quantity: i.quantity,
      }));
    }
    if (patch.total !== undefined) payload.total = patch.total;
    if (patch.customerName !== undefined) payload.customer_name = patch.customerName.trim() || null;
    if (patch.customerPhone !== undefined) payload.customer_phone = patch.customerPhone.trim() || null;
    if (patch.deliveryMethod !== undefined) payload.delivery_method = patch.deliveryMethod;
    if (patch.addressRef !== undefined) payload.address_ref = patch.addressRef.trim() || null;

    const supabase = createClient();
    supabase
      .from("cart_sessions")
      .upsert(payload, { onConflict: "session_id" })
      .then(() => {});
  }, 800);
}
