import Link from "next/link";
import clsx from "clsx";
import type { Category } from "@/lib/types";

export default function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/productos"
        className={clsx(
          "rounded-full px-4 py-1.5 text-sm font-semibold transition-all active:scale-95",
          !activeSlug
            ? "bg-brand-green text-white"
            : "bg-brand-cream/50 text-brand-green-dark hover:bg-brand-cream"
        )}
      >
        Todos
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/productos?categoria=${category.slug}`}
          className={clsx(
            "rounded-full px-4 py-1.5 text-sm font-semibold transition-all active:scale-95",
            activeSlug === category.slug
              ? "bg-brand-green text-white"
              : "bg-brand-cream/50 text-brand-green-dark hover:bg-brand-cream"
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
