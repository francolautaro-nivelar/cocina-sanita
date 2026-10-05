"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

function revalidateStorefront() {
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/");
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const sortOrder = Number(formData.get("sort_order") || 0);

  if (!name) throw new Error("El nombre es obligatorio.");

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(slugInput || name),
    sort_order: sortOrder,
  });

  if (error) {
    throw new Error(`No se pudo crear la categoría: ${error.message}`);
  }

  revalidateStorefront();
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") || "").trim();
  const sortOrder = Number(formData.get("sort_order") || 0);

  if (!name) throw new Error("El nombre es obligatorio.");

  const { error } = await supabase
    .from("categories")
    .update({ name, sort_order: sortOrder })
    .eq("id", categoryId);

  if (error) {
    throw new Error(`No se pudo actualizar la categoría: ${error.message}`);
  }

  revalidateStorefront();
}

export async function toggleCategoryActive(categoryId: string, value: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ active: value })
    .eq("id", categoryId);

  if (error) {
    throw new Error(`No se pudo actualizar la categoría: ${error.message}`);
  }

  revalidateStorefront();
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);

  if (error) {
    throw new Error(
      "No se pudo eliminar la categoría. Si tiene productos cargados, movelos o eliminalos primero."
    );
  }

  revalidateStorefront();
}
