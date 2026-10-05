import nodemailer from "nodemailer";
import type { DeliveryMethod, OrderItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

function getTransport() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
}

export async function sendNewOrderEmail(order: {
  customerName: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  addressRef?: string;
  notes?: string;
  items: OrderItem[];
  total: number;
}) {
  const transport = getTransport();
  if (!transport) {
    console.warn(
      "Email no configurado (faltan GMAIL_USER / GMAIL_APP_PASSWORD en .env.local) — se omite el aviso por mail."
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
    await transport.sendMail({
      from: `Cocina Sanita Web <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `Nuevo pedido de ${order.customerName} — ${formatPrice(order.total)}`,
      html,
    });
  } catch (err) {
    console.error("sendNewOrderEmail", err);
  }
}
