import Image from "next/image";
import Link from "next/link";
import { Leaf, Wheat, ShieldCheck } from "lucide-react";
import { getActiveCategories, getFeaturedProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const [categories, featured] = await Promise.all([
    getActiveCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-green-dark">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 md:flex-row">
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
              Simplificá tu vida y comé sano
            </h1>
            <p className="mt-4 text-lg text-brand-cream/90">
              Frutas, verduras y pulpas congeladas, listas para tus comidas. Libres de
              gluten y aditivos.
            </p>
            <div className="mt-6 flex justify-center gap-3 md:justify-start">
              <Link
                href="/productos"
                className="rounded-full bg-brand-gold px-6 py-3 font-semibold text-brand-green-dark transition-colors hover:bg-brand-gold-light"
              >
                Ver la tienda
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/logo-cocina-sanita.jpg"
              alt="Cocina Sanita"
              width={220}
              height={220}
              className="rounded-full shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-3">
          <Highlight icon={<Leaf />} title="100% natural" text="Fruta y verdura congelada en su punto justo." />
          <Highlight icon={<Wheat />} title="Sin gluten ni aditivos" text="Ingredientes simples, nada más." />
          <Highlight icon={<ShieldCheck />} title="Pedí fácil" text="Armá tu carrito y confirmá tu pedido online." />
        </div>
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <h2 className="font-display mb-4 text-2xl font-bold text-brand-green-dark">
            Categorías
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/productos?categoria=${category.slug}`}
                className="rounded-full bg-brand-sage/20 px-5 py-2 font-semibold text-brand-green-dark transition-colors hover:bg-brand-sage/40"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Destacados */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-brand-green-dark">
              Productos destacados
            </h2>
            <Link href="/productos" className="font-semibold text-brand-olive hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Highlight({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-brand-cream/30 p-6 text-center">
      <span className="text-brand-olive">{icon}</span>
      <h3 className="font-display font-bold text-brand-green-dark">{title}</h3>
      <p className="text-sm text-brand-green-dark/70">{text}</p>
    </div>
  );
}
