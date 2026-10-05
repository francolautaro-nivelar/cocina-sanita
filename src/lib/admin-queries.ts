import { createClient } from "@/lib/supabase/server";
import type { Category, CustomerSummary, Order, Product } from "@/lib/types";
import { toQueryRange, type DateRange } from "@/lib/date-range";

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAllCategories", error);
    return [];
  }
  return data ?? [];
}

export async function getAllProducts(): Promise<
  (Product & { category: Pick<Category, "id" | "name"> | null })[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name)")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAllProducts", error);
    return [];
  }
  return (data ?? []) as (Product & { category: Pick<Category, "id" | "name"> | null })[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProductById", error);
    return null;
  }
  return data;
}

export async function getOrders(range: DateRange = {}): Promise<Order[]> {
  const supabase = await createClient();
  const { from, to } = toQueryRange(range);

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);

  const { data, error } = await query;

  if (error) {
    console.error("getOrders", error);
    return [];
  }
  return data ?? [];
}

export async function getPendingOrdersCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pendiente");

  if (error) {
    console.error("getPendingOrdersCount", error);
    return 0;
  }
  return count ?? 0;
}

export async function getCustomers(): Promise<CustomerSummary[]> {
  // Se arma agrupando por teléfono: no hay una tabla de clientes propia, así
  // siempre queda sincronizado con los pedidos (altas, bajas, etc). Los
  // cancelados no cuentan para las estadísticas del cliente.
  const orders = (await getOrders()).filter((o) => o.status !== "cancelado");

  const byPhone = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const phone = order.phone.trim();
    const existing = byPhone.get(phone);

    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += order.total;
      existing.firstOrderAt = order.created_at; // vamos de más nuevo a más viejo
    } else {
      byPhone.set(phone, {
        phone,
        name: order.customer_name,
        ordersCount: 1,
        totalSpent: order.total,
        firstOrderAt: order.created_at,
        lastOrderAt: order.created_at,
      });
    }
  }

  return Array.from(byPhone.values()).sort((a, b) =>
    b.lastOrderAt.localeCompare(a.lastOrderAt)
  );
}
