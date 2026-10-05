"use server";

import { createClient } from "@/lib/supabase/server";
import { sendNewOrderEmail } from "@/lib/email";
import type { DeliveryMethod, OrderItem } from "@/lib/types";

export async function submitOrder(input: {
  customerName: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  addressRef?: string;
  notes?: string;
  items: OrderItem[];
  total: number;
}) {
  if (!input.customerName.trim() || !input.phone.trim() || input.items.length === 0) {
    return { ok: false as const, error: "Faltan datos del pedido." };
  }

  if (input.deliveryMethod === "envio" && !input.addressRef?.trim()) {
    return {
      ok: false as const,
      error: "Falta la dirección o zona de referencia para el envío.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("orders").insert({
    customer_name: input.customerName.trim(),
    phone: input.phone.trim(),
    delivery_method: input.deliveryMethod,
    address_ref: input.addressRef?.trim() || null,
    notes: input.notes?.trim() || null,
    items: input.items,
    total: input.total,
  });

  if (error) {
    console.error("submitOrder", error);
    return { ok: false as const, error: "No pudimos registrar el pedido. Probá de nuevo." };
  }

  // El mail es un aviso secundario: si falla, el pedido ya quedó guardado igual.
  await sendNewOrderEmail({
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    deliveryMethod: input.deliveryMethod,
    addressRef: input.addressRef?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    items: input.items,
    total: input.total,
  });

  return { ok: true as const };
}
