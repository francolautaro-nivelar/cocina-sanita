"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

function revalidateOrders() {
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin/finanzas");
  revalidatePath("/admin/clientes");
}

export async function deleteOrder(orderId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", orderId);

  if (error) {
    throw new Error(`No se pudo eliminar el pedido: ${error.message}`);
  }

  revalidateOrders();
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

  if (error) {
    throw new Error(`No se pudo actualizar el pedido: ${error.message}`);
  }

  revalidateOrders();
}
