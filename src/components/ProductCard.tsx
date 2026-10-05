import Image from "next/image";
import { Leaf } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = !product.in_stock || product.price == null;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-brand-green/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square w-full bg-brand-sage/15">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Leaf className="text-brand-sage" size={40} strokeWidth={1.5} />
          </div>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-green-dark/90 px-2 py-0.5 text-xs font-semibold text-white">
            Sin stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <h3 className="font-display font-bold leading-tight text-brand-green-dark">
            {product.name}
          </h3>
          {product.unit_label && (
            <p className="text-xs text-brand-green-dark/60">{product.unit_label}</p>
          )}
        </div>

        {product.price != null && (
          <p className="font-display text-lg font-bold text-brand-olive">
            {formatPrice(product.price)}
          </p>
        )}

        <div className="mt-auto pt-1">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
