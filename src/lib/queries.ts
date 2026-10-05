import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getActiveCategories", error);
    return [];
  }
  return data ?? [];
}

export async function getCategoriesWithProducts(): Promise<
  (Category & { products: Product[] })[]
> {
  const supabase = await createClient();
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (catError || !categories) {
    console.error("getCategoriesWithProducts/categories", catError);
    return [];
  }

  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (prodError) {
    console.error("getCategoriesWithProducts/products", prodError);
  }

  return categories.map((category) => ({
    ...category,
    products: (products ?? []).filter((p) => p.category_id === category.id),
  }));
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("in_stock", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProducts", error);
    return [];
  }
  return data ?? [];
}
