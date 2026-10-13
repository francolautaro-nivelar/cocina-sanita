"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent } from "@/lib/analytics";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: "accepted" | "rejected") {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-green/10 bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-brand-green-dark/80 sm:text-left">
          Guardamos tu carrito en este navegador y registramos de forma anónima qué
          productos interesan más, para mejorar la tienda. Más info en nuestra{" "}
          <Link href="/privacidad" className="font-semibold text-brand-olive hover:underline">
            Política de privacidad
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="rounded-full border border-brand-green/30 px-4 py-2 text-sm font-semibold text-brand-green-dark transition-all hover:bg-brand-cream/40 active:scale-95"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-green-dark active:scale-95"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
