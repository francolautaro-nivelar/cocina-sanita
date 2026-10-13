import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProducts } from "@/lib/admin-queries";
import ProductsList from "./ProductsList";

export default async function AdminProductosPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-brand-green-dark">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark"
        >
          <Plus size={16} /> Nuevo
        </Link>
      </div>

      <ProductsList products={products} />
    </div>
  );
}
