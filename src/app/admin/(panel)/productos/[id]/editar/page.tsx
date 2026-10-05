import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllCategories, getProductById } from "@/lib/admin-queries";
import ProductForm from "../../ProductForm";
import { updateProduct } from "../../actions";

export default async function EditarProductoPage({
  params,
}: PageProps<"/admin/productos/[id]/editar">) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getAllCategories(),
    getProductById(id),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/productos"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-olive hover:underline"
      >
        <ArrowLeft size={16} /> Volver a productos
      </Link>
      <h1 className="font-display mb-6 text-2xl font-bold text-brand-green-dark">
        Editar producto
      </h1>

      <ProductForm
        action={boundUpdate}
        categories={categories}
        product={product}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
