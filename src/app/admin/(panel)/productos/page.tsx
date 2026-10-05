import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getAllProducts } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/format";
import { deleteProduct, toggleProductField } from "./actions";
import DeleteProductButton from "./DeleteProductButton";

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

      {products.length === 0 ? (
        <p className="rounded-xl bg-brand-cream/30 px-4 py-6 text-brand-green-dark/70">
          Todavía no cargaste productos.
        </p>
      ) : (
        <>
          {/* Mobile: lista de tarjetas */}
          <div className="space-y-3 sm:hidden">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-brand-green/10 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-brand-green-dark">
                      {product.name}
                      {product.unit_label && (
                        <span className="ml-1 text-xs text-brand-green-dark/50">
                          ({product.unit_label})
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-brand-green-dark/60">
                      {product.category?.name ?? "—"}
                    </p>
                  </div>
                  <p className="flex-shrink-0 font-semibold text-brand-olive">
                    {product.price != null ? formatPrice(product.price) : "—"}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={toggleProductField.bind(null, product.id, "in_stock", !product.in_stock)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.in_stock
                          ? "bg-brand-sage/30 text-brand-green-dark"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.in_stock ? "Con stock" : "Sin stock"}
                    </button>
                  </form>
                  <form action={toggleProductField.bind(null, product.id, "active", !product.active)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.active
                          ? "bg-brand-gold/30 text-brand-green-dark"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.active ? "Visible" : "Oculto"}
                    </button>
                  </form>

                  <div className="ml-auto flex items-center gap-1">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="rounded-full p-2 text-brand-green-dark hover:bg-brand-cream/40"
                      aria-label="Editar"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteProductButton
                      productId={product.id}
                      productName={product.name}
                      deleteAction={deleteProduct}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabla */}
          <div className="hidden overflow-x-auto rounded-2xl border border-brand-green/10 bg-white sm:block">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-brand-green/10 text-left text-brand-green-dark/60">
                  <th className="px-4 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">Categoría</th>
                  <th className="px-4 py-3 font-semibold">Precio</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Visible</th>
                  <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-brand-green/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-brand-green-dark">
                      {product.name}
                      {product.unit_label && (
                        <span className="ml-1 text-xs text-brand-green-dark/50">
                          ({product.unit_label})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-green-dark/70">
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-brand-green-dark/70">
                      {product.price != null ? formatPrice(product.price) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <form action={toggleProductField.bind(null, product.id, "in_stock", !product.in_stock)}>
                        <button
                          type="submit"
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.in_stock
                              ? "bg-brand-sage/30 text-brand-green-dark"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.in_stock ? "Con stock" : "Sin stock"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <form action={toggleProductField.bind(null, product.id, "active", !product.active)}>
                        <button
                          type="submit"
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.active
                              ? "bg-brand-gold/30 text-brand-green-dark"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {product.active ? "Visible" : "Oculto"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/productos/${product.id}/editar`}
                          className="rounded-full p-2 text-brand-green-dark hover:bg-brand-cream/40"
                          aria-label="Editar"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                          deleteAction={deleteProduct}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
