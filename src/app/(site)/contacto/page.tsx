import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto | Cocina Sanita",
  description: "Hablanos por WhatsApp, Instagram o Facebook.",
};

const CONTACTS = [
  {
    label: "WhatsApp",
    value: "221 494-8515",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: MessageCircle,
  },
  {
    label: "Instagram",
    value: "@cocina.sanita",
    href: "https://www.instagram.com/cocina.sanita/",
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    value: "Cocina Sanita",
    href: "https://www.facebook.com/profile.php?id=61575097626490&locale=es_LA",
    icon: FacebookIcon,
  },
];

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-center text-3xl font-bold text-brand-green-dark">
        Contacto
      </h1>
      <p className="mt-2 text-center text-brand-green-dark/70">
        ¿Tenés dudas sobre un pedido o querés coordinar algo especial? Escribinos.
      </p>

      <div className="mt-8 space-y-3">
        {CONTACTS.map(({ label, value, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-brand-green/10 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <span className="rounded-full bg-brand-cream/50 p-3 text-brand-olive">
              <Icon size={24} />
            </span>
            <div>
              <p className="font-display font-bold text-brand-green-dark">{label}</p>
              <p className="text-sm text-brand-green-dark/70">{value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
