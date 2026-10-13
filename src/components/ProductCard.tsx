"use client";

import { useState } from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";
import type { ProductGroup } from "@/lib/variants";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";

function shortUnit(unitLabel: string | null) {
  if (!unitLabel) return "";
  return unitLabel.replace(/^x\s*/i, "");
}

export default function ProductCard({ group }: { group: ProductGroup }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasVariants = group.variants.length > 1;
  const product = group.variants[selectedIndex] ?? group.variants[0];
  const outOfStock = !product.in_stock || product.price == null;

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-brand-green/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square w-full bg-brand-sage/15">
        {group.image_url ? (
          <Image
            src={group.image_url}
            alt={group.name}
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

      <div className="flex flex-1 flex-col gap-1.5 p-2 sm:gap-2 sm:p-3">
        <div>
          <h3 className="font-display font-bold leading-tight text-brand-green-dark">
            {group.name}
          </h3>
          {!hasVariants && product.unit_label && (
            <p className="text-xs text-brand-green-dark/60">{product.unit_label}</p>
          )}
        </div>

        {hasVariants && (
          <div className="flex flex-wrap gap-1">
            {group.variants.map((variant, i) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`rounded-full border px-2 py-0.5 text-xs font-semibold transition-all active:scale-95 ${
                  i === selectedIndex
                    ? "border-brand-green bg-brand-green text-white"
                    : "border-brand-green/30 text-brand-green-dark hover:bg-brand-cream/40"
                }`}
              >
                {shortUnit(variant.unit_label)}
              </button>
            ))}
          </div>
        )}

        {product.price != null && (
          <p className="font-display text-lg font-bold text-brand-olive">
            {formatPrice(product.price)}
          </p>
        )}

        <div className="mt-auto pt-1">
          <AddToCartButton key={product.id} product={product} />
        </div>
      </div>
    </div>
  );
}
