"use client";

const SESSION_KEY = "cocina-sanita-cart-session";

// Id anónimo por navegador (no por persona) para poder identificar "el mismo
// carrito" entre cambios sin pedir login. Se guarda en localStorage, igual
// que el carrito.
export function getCartSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
