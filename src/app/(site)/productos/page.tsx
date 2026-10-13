import type { Metadata } from "next";
import { getCategoriesWithProducts } from "@/lib/queries";
import { groupProductVariants } from "@/lib/variants";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Tienda | Cocina Sanita",
  description: "Frutas, pulpas, verduras y mix congelados. Pedí online.",
};

export const revalidate = 60;

export default async function ProductosPage({
  searchParams,
}: PageProps<"/productos">) {
  const { categoria } = await searchParams;
  const categoriaSlug = Array.isArray(categoria) ? categoria[0] : categoria;

  const categories = await getCategoriesWithProducts();
  const visibleCategories = categoriaSlug
    ? categories.filter((c) => c.slug === categoriaSlug)
    : categories;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-brand-green-dark">
          Nuestra tienda
        </h1>
        <p className="mt-1 text-brand-green-dark/70">
          Elegí tus productos y armá tu pedido online.
        </p>
      </div>

      <CategoryNav categories={categories} activeSlug={categoriaSlug} />

      <div className="mt-8 space-y-12">
        {visibleCategories.map((category) => (
          <section key={category.id} id={category.slug}>
            <h2 className="font-display mb-4 text-xl font-bold text-brand-green-dark">
              {category.name}
            </h2>

            {category.products.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {groupProductVariants(category.products).map((group) => (
                  <ProductCard key={group.key} group={group} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-brand-cream/30 px-4 py-6 text-center text-brand-green-dark/60">
                Próximamente nuevos productos en esta categoría.
              </p>
            )}
          </section>
        ))}

        {visibleCategories.length === 0 && (
          <p className="text-center text-brand-green-dark/60">
            No encontramos esa categoría.
          </p>
        )}
      </div>
    </div>
  );
}
