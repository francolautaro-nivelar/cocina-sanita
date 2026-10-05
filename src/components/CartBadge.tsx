"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBasket } from "lucide-react";
import { useCartStore, cartCount } from "@/store/cart";

export default function CartBadge() {
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <Link
      href="/carrito"
      className="relative rounded-md p-2 text-brand-green-dark transition-colors hover:text-brand-gold"
      aria-label="Ver carrito"
    >
      <ShoppingBasket size={24} className={bump ? "animate-pop" : undefined} />
      {count > 0 && (
        <span
          className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-xs font-bold text-brand-green-dark ${
            bump ? "animate-pop" : ""
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
