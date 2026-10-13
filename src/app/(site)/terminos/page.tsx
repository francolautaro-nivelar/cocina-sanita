import type { Metadata } from "next";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso de la tienda online de Cocina Sanita.",
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-brand-green-dark">
        Términos y condiciones
      </h1>
      <p className="mt-2 text-sm text-brand-green-dark/60">
        Última actualización: octubre de 2026.
      </p>

      <div className="mt-8 space-y-6 text-brand-green-dark/80">
        <Section title="Sobre la tienda">
          <p>
            Cocina Sanita es un emprendimiento de La Plata que vende frutas,
            verduras y pulpas congeladas. Este sitio permite armar un pedido
            online; la confirmación final, el pago y la entrega se coordinan
            directamente con nosotros por WhatsApp.
          </p>
        </Section>

        <Section title="Pedidos">
          <p>
            Al confirmar tu pedido desde la web, queda registrado con estado
            "Pendiente" y nosotros te contactamos para coordinar el pago y la
            entrega. El pedido no implica un cobro automático: el pago se
            coordina aparte.
          </p>
          <p>
            Los precios están expresados en pesos argentinos y pueden cambiar sin
            aviso previo. La disponibilidad de stock mostrada en el sitio es
            referencial y se confirma al coordinar el pedido.
          </p>
        </Section>

        <Section title="Entrega">
          <p>
            Ofrecemos retiro o envío a coordinar en La Plata y alrededores. El
            costo y las condiciones del envío se acuerdan por WhatsApp según la
            zona.
          </p>
        </Section>

        <Section title="Cancelaciones">
          <p>
            Podés cancelar o modificar un pedido mientras no haya sido
            confirmado, escribiéndonos por WhatsApp.
          </p>
        </Section>

        <Section title="Propiedad intelectual">
          <p>
            El nombre, el logo y los contenidos de este sitio pertenecen a
            Cocina Sanita y no pueden reproducirse sin autorización.
          </p>
        </Section>

        <Section title="Cambios en estos términos">
          <p>
            Podemos actualizar estos términos en cualquier momento; la versión
            vigente es siempre la publicada en esta página.
          </p>
        </Section>

        <Section title="Contacto">
          <p>
            Ante cualquier duda sobre estos términos, escribinos por WhatsApp al{" "}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-olive hover:underline"
            >
              +54 9 221 494-8515
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display mb-2 text-lg font-bold text-brand-green-dark">{title}</h2>
      <div className="space-y-2 leading-relaxed">{children}</div>
    </section>
  );
}
