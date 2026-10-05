import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllCategories } from "@/lib/admin-queries";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export default async function NuevoProductoPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <Link
        href="/admin/productos"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-olive hover:underline"
      >
        <ArrowLeft size={16} /> Volver a productos
      </Link>
      <h1 className="font-display mb-6 text-2xl font-bold text-brand-green-dark">
        Nuevo producto
      </h1>

      {categories.length === 0 ? (
        <p className="rounded-xl bg-brand-cream/30 px-4 py-6 text-brand-green-dark/70">
          Primero creá una categoría en la sección{" "}
          <Link href="/admin/categorias" className="underline">
            Categorías
          </Link>
          .
        </p>
      ) : (
        <ProductForm action={createProduct} categories={categories} submitLabel="Crear producto" />
      )}
    </div>
  );
}
