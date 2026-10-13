import { Resend } from "resend";
import type { DeliveryMethod, OrderItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_TO = process.env.ORDER_NOTIFICATION_EMAIL ?? "cocinasanita@gmail.com";
// "onboarding@resend.dev" funciona sin configurar nada, pero Resend solo deja
// mandar con ese remitente a la casilla dueña de la cuenta. Para que le
// lleguen los avisos a NOTIFICATION_TO hay que verificar cocinasanita.com en
// Resend y setear EMAIL_FROM (ver README).
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Cocina Sanita <onboarding@resend.dev>";

export async function sendNewOrderEmail(order: {
  customerName: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  addressRef?: string;
  notes?: string;
  items: OrderItem[];
  total: number;
}) {
  if (!RESEND_API_KEY) {
    console.warn(
      "Email no configurado (falta RESEND_API_KEY en .env.local) — se omite el aviso por mail."
    );
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.quantity}x ${item.name}${
          item.unit_label ? ` (${item.unit_label})` : ""
        } — ${formatPrice(item.price * item.quantity)}</li>`
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; color: #1f3320;">
      <h2 style="color: #2e4a2e;">Nuevo pedido en la web 🥑</h2>
      <p><strong>${order.customerName}</strong> (${order.phone})</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: ${formatPrice(order.total)}</strong></p>
      <p>Entrega: ${order.deliveryMethod === "retiro" ? "Retiro" : "Envío a coordinar"}${
        order.addressRef ? ` — ${order.addressRef}` : ""
      }</p>
      ${order.notes ? `<p>Notas: ${order.notes}</p>` : ""}
      ${
        process.env.NEXT_PUBLIC_SITE_URL
          ? `<p style="margin-top: 24px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/pedidos" style="color:#2e4a2e;">
                Ver en el panel de pedidos
              </a>
            </p>`
          : ""
      }
    </div>
  `;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: NOTIFICATION_TO,
      subject: `Nuevo pedido de ${order.customerName} — ${formatPrice(order.total)}`,
      html,
    });
    if (error) console.error("sendNewOrderEmail", error);
  } catch (err) {
    console.error("sendNewOrderEmail", err);
  }
}
