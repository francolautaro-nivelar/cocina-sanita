import type { DeliveryMethod, OrderItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

// Número de WhatsApp del negocio (confirmado desde el linktree de Instagram).
// Se usa solo como dato de contacto (footer, /contacto) — el checkout ya no
// redirige automáticamente ahí.
export const WHATSAPP_NUMBER = "5492214948515";

// Normaliza un teléfono cargado a mano en el checkout (ej "221 555-5555") a
// formato wa.me. Es una aproximación (asume Argentina) para el link rápido del
// admin — no reemplaza confirmar el número con el cliente.
export function buildCustomerWhatsAppLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("54") ? digits : `549${digits.replace(/^0/, "")}`;
  return `https://wa.me/${withCountryCode}`;
}

// Mensaje que Carla usa desde /admin/pedidos para avisarle a un cliente que su
// pedido está confirmado — es ella quien decide escribir, no algo automático.
export function buildOrderConfirmationLink({
  phone,
  customerName,
  deliveryMethod,
  addressRef,
  items,
  total,
}: {
  phone: string;
  customerName: string;
  deliveryMethod: DeliveryMethod;
  addressRef?: string | null;
  items: OrderItem[];
  total: number;
}) {
  const lines = [
    `¡Hola ${customerName}! Soy Carla, de Cocina Sanita 🥑`,
    `Te escribo para confirmar tu pedido:`,
    "",
    ...items.map(
      (item) =>
        `• ${item.quantity}x ${item.name}${
          item.unit_label ? ` (${item.unit_label})` : ""
        } — ${formatPrice(item.price * item.quantity)}`
    ),
    "",
    `Total: ${formatPrice(total)}`,
    `Entrega: ${deliveryMethod === "retiro" ? "Retiro" : "Envío a coordinar"}${
      addressRef ? ` — ${addressRef}` : ""
    }`,
    "",
    `Coordinamos el pago y la entrega por acá, ¿dale?`,
  ];

  return `${buildCustomerWhatsAppLink(phone)}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// Mensaje que Carla usa desde /admin/carritos-abandonados para ofrecerle una
// mano a alguien que dejó productos cargados sin confirmar el pedido.
export function buildCartRecoveryLink({
  phone,
  customerName,
  items,
  total,
}: {
  phone: string;
  customerName?: string | null;
  items: OrderItem[];
  total: number;
}) {
  const lines = [
    `¡Hola${customerName ? ` ${customerName}` : ""}! Soy Carla, de Cocina Sanita 🥑`,
    `Vi que dejaste armado un pedido en la web y no llegaste a confirmarlo:`,
    "",
    ...items.map(
      (item) =>
        `• ${item.quantity}x ${item.name}${
          item.unit_label ? ` (${item.unit_label})` : ""
        } — ${formatPrice(item.price * item.quantity)}`
    ),
    "",
    `Total: ${formatPrice(total)}`,
    "",
    `¿Te ayudo a cerrarlo? Cualquier duda, acá estoy.`,
  ];

  return `${buildCustomerWhatsAppLink(phone)}?text=${encodeURIComponent(lines.join("\n"))}`;
}
