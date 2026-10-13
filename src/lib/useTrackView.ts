"use client";

import { useEffect, useRef } from "react";
import { trackProductEvent } from "@/lib/analytics";

// Registra una vista de producto la primera vez que la tarjeta entra en el
// viewport (no simplemente al montarse), así no se cuentan como "vistos" los
// productos que quedaron más abajo en la grilla y nunca se llegaron a ver.
export function useTrackView(productId: string) {
  const ref = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    trackedRef.current = false;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedRef.current) {
          trackedRef.current = true;
          trackProductEvent(productId, "view");
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [productId]);

  return ref;
}
