"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

function revalidateStorefront() {
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/");
}

async function uploadImageIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  slug: string
) {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return null;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${slug}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    throw new Error(`No se pudo subir la foto: ${error.message}`);
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const categoryId = String(formData.get("category_id") || "");
  const priceRaw = String(formData.get("price") || "").trim();
  const price = priceRaw ? Math.round(Number(priceRaw)) : null;
  const unitLabel = String(formData.get("unit_label") || "").trim() || null;
  const description = String(formData.get("description") || "").trim() || null;
  const inStock = formData.get("in_stock") === "on";
  const active = formData.get("active") === "on";
  const sortOrder = Number(formData.get("sort_order") || 0);
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || name);

  return { name, categoryId, price, unitLabel, description, inStock, active, sortOrder, slug };
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const fields = readProductFields(formData);
  const imageUrl = await uploadImageIfPresent(supabase, formData, fields.slug);

  const { error } = await supabase.from("products").insert({
    category_id: fields.categoryId,
    name: fields.name,
    slug: fields.slug,
    description: fields.description,
    price: fields.price,
    unit_label: fields.unitLabel,
    image_url: imageUrl,
    in_stock: fields.inStock,
    active: fields.active,
    sort_order: fields.sortOrder,
  });

  if (error) {
    throw new Error(`No se pudo crear el producto: ${error.message}`);
  }

  revalidateStorefront();
  redirect("/admin/productos");
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();
  const fields = readProductFields(formData);
  const newImageUrl = await uploadImageIfPresent(supabase, formData, fields.slug);

  const update: Record<string, unknown> = {
    category_id: fields.categoryId,
    name: fields.name,
    slug: fields.slug,
    description: fields.description,
    price: fields.price,
    unit_label: fields.unitLabel,
    in_stock: fields.inStock,
    active: fields.active,
    sort_order: fields.sortOrder,
  };
  if (newImageUrl) update.image_url = newImageUrl;

  const { error } = await supabase.from("products").update(update).eq("id", productId);

  if (error) {
    throw new Error(`No se pudo actualizar el producto: ${error.message}`);
  }

  revalidateStorefront();
  redirect("/admin/productos");
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    throw new Error(`No se pudo eliminar el producto: ${error.message}`);
  }

  revalidateStorefront();
}

export async function toggleProductField(
  productId: string,
  field: "in_stock" | "active",
  value: boolean
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ [field]: value })
    .eq("id", productId);

  if (error) {
    throw new Error(`No se pudo actualizar el producto: ${error.message}`);
  }

  revalidateStorefront();
}
