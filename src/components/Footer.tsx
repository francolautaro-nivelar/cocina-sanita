import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-green-dark text-brand-cream">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Cocina Sanita</h3>
            <p className="mt-2 text-sm text-brand-cream/80">
              Simplificá tu vida y comé sano. Frutas, verduras y pulpas congeladas,
              listas para tus comidas. Libres de gluten y aditivos.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-white">Navegación</h4>
            <ul className="mt-2 space-y-1 text-sm text-brand-cream/80">
              <li><Link href="/productos" className="hover:text-brand-gold-light">Tienda</Link></li>
              <li><Link href="/nosotros" className="hover:text-brand-gold-light">Nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-brand-gold-light">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white">Seguinos</h4>
            <div className="mt-2 flex gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full bg-white/10 p-2 transition-all hover:bg-brand-gold hover:text-brand-green-dark active:scale-90"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="https://www.instagram.com/cocina.sanita/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-white/10 p-2 transition-all hover:bg-brand-gold hover:text-brand-green-dark active:scale-90"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61575097626490&locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-white/10 p-2 transition-all hover:bg-brand-gold hover:text-brand-green-dark active:scale-90"
              >
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-xs text-brand-cream/60">
          © {new Date().getFullYear()} Cocina Sanita. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
