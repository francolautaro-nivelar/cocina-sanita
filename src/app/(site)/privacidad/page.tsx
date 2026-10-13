import type { Metadata } from "next";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo Cocina Sanita recolecta y usa tus datos al hacer un pedido.",
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-brand-green-dark">
        Política de privacidad
      </h1>
      <p className="mt-2 text-sm text-brand-green-dark/60">
        Última actualización: octubre de 2026.
      </p>

      <div className="mt-8 space-y-6 text-brand-green-dark/80">
        <Section title="Qué datos recolectamos">
          <p>
            Cuando hacés un pedido te pedimos nombre, celular y, si elegís envío,
            una dirección o zona de referencia. Estos datos se guardan junto al
            detalle de tu pedido para poder contactarte y coordinar la entrega.
          </p>
          <p>
            No procesamos pagos en el sitio: el pago se coordina directamente con
            vos por WhatsApp. No pedimos ni guardamos datos de tarjetas ni de
            cuentas bancarias.
          </p>
        </Section>

        <Section title="Carrito y navegación">
          <p>
            El carrito de compras se guarda en tu propio navegador (almacenamiento
            local) y también en nuestra base de datos, identificado con un código
            anónimo (no con tu nombre), a medida que lo armás — así, si empezás un
            pedido y no llegás a confirmarlo, podemos contactarte para ofrecerte
            una mano a cerrarlo, igual que haríamos si te vemos en el local. Si
            llegaste a escribir tu nombre o celular en el formulario de checkout,
            esos datos también quedan guardados aunque no confirmes el pedido.
          </p>
          <p>
            Además, registramos de forma anónima qué productos se ven y se
            agregan al carrito, para entender qué le interesa a la gente y
            mejorar el catálogo. Todo esto podés rechazarlo desde el aviso de
            cookies que aparece al entrar al sitio.
          </p>
        </Section>

        <Section title="Con quién compartimos datos">
          <p>Usamos dos proveedores para que la tienda funcione:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Supabase</strong>, donde se guarda la base de datos de
              productos y pedidos.
            </li>
            <li>
              <strong>Resend</strong>, que usamos para mandarnos un aviso por mail
              cuando entra un pedido nuevo.
            </li>
          </ul>
          <p>
            No vendemos ni compartimos tus datos con terceros para publicidad ni
            con ningún otro fin.
          </p>
        </Section>

        <Section title="Tus derechos">
          <p>
            De acuerdo a la Ley 25.326 de Protección de Datos Personales, tenés
            derecho a acceder, rectificar o pedir la eliminación de tus datos
            cuando quieras. Para ejercer cualquiera de estos derechos, escribinos
            por WhatsApp al{" "}
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
