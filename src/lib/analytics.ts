"use client";

import { createClient } from "@/lib/supabase/client";

const CONSENT_KEY = "cocina-sanita-cookie-consent";

export type Consent = "accepted" | "rejected";

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setConsent(value: Consent) {
  window.localStorage.setItem(CONSENT_KEY, value);
}

// Registra un evento anónimo (vista o "agregar al carrito") de un producto.
// No se manda nada si el visitante rechazó las analíticas. Nunca bloquea ni
// tira error visible: si falla, se pierde el evento y listo.
export function trackProductEvent(productId: string, eventType: "view" | "add_to_cart") {
  if (getConsent() === "rejected") return;
  const supabase = createClient();
  supabase
    .from("product_events")
    .insert({ product_id: productId, event_type: eventType })
    .then(() => {});
}
