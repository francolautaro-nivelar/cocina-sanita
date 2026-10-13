import type { Metadata } from "next";
import { getCategoriesWithProducts } from "@/lib/queries";
import { groupProductVariants } from "@/lib/variants";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Catálogo completo de frutas, pulpas, verduras y mix congelados en La Plata. Elegí tus productos, armá el carrito y pedí online.",
};

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cocinasanita.com";

export default async function ProductosPage({
  searchParams,
}: PageProps<"/productos">) {
  const { categoria } = await searchParams;
  const categoriaSlug = Array.isArray(categoria) ? categoria[0] : categoria;

  const categories = await getCategoriesWithProducts();
  const visibleCategories = categoriaSlug
    ? categories.filter((c) => c.slug === categoriaSlug)
    : categories;

  let position = 0;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo Cocina Sanita",
    itemListElement: categories.flatMap((category) =>
      category.products
        .filter((p) => p.price != null)
        .map((p) => {
          position += 1;
          return {
            "@type": "ListItem",
            position,
            item: {
              "@type": "Product",
              name: p.name,
              image: p.image_url ?? undefined,
              url: `${SITE_URL}/productos?categoria=${category.slug}`,
              offers: {
                "@type": "Offer",
                priceCurrency: "ARS",
                price: p.price,
                availability: p.in_stock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              },
            },
          };
        })
    ),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
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
