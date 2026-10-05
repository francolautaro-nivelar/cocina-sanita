import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Nosotros | Cocina Sanita",
  description: "Conocé la propuesta de Cocina Sanita: comer sano, simple y rico.",
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex justify-center">
        <Image
          src="/logo-cocina-sanita.jpg"
          alt="Cocina Sanita"
          width={160}
          height={160}
          className="rounded-full shadow-md"
        />
      </div>

      <h1 className="font-display text-center text-3xl font-bold text-brand-green-dark">
        Simplificá tu vida y comé sano
      </h1>

      <div className="mt-6 space-y-4 text-lg leading-relaxed text-brand-green-dark/80">
        <p>
          En Cocina Sanita creemos que comer rico y comer sano no tienen que ser cosas
          distintas. Por eso preparamos frutas, verduras y pulpas congeladas, listas
          para usar en tus comidas de todos los días: licuados, postres, jugos o para
          cocinar.
        </p>
        <p>
          Todos nuestros productos son <strong>libres de gluten y aditivos</strong>,
          pensados para que ahorres tiempo en la cocina sin resignar calidad ni
          naturalidad.
        </p>
        <p>
          Trabajamos a pedido: elegís lo que necesitás y armás tu pedido desde la web, y
          nosotros te contactamos para coordinar el pago y la entrega.
        </p>
      </div>
    </div>
  );
}
