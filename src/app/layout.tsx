import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cocinasanita.com";
const TITLE = "Cocina Sanita | Frutas, pulpas y verduras congeladas en La Plata";
const DESCRIPTION =
  "Frutas, verduras y pulpas congeladas en La Plata, listas para tus comidas: licuados, jugos, postres y cocina de todos los días. Libres de gluten y aditivos. Pedí online y coordinamos retiro o envío en La Plata y alrededores.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Cocina Sanita",
  },
  description: DESCRIPTION,
  keywords: [
    "frutas congeladas La Plata",
    "verduras congeladas La Plata",
    "pulpas de fruta La Plata",
    "congelados La Plata",
    "comida saludable La Plata",
    "mix de vegetales congelados",
    "Cocina Sanita",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Cocina Sanita",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/logo-cocina-sanita.jpg", width: 800, height: 800, alt: "Cocina Sanita" }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/logo-cocina-sanita.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  name: "Cocina Sanita",
  description: DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-cocina-sanita.jpg`,
  image: `${SITE_URL}/logo-cocina-sanita.jpg`,
  telephone: `+${WHATSAPP_NUMBER}`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "La Plata",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  areaServed: {
    "@type": "City",
    name: "La Plata",
  },
  sameAs: [
    "https://www.instagram.com/cocina.sanita/",
    "https://www.facebook.com/profile.php?id=61575097626490&locale=es_LA",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-brand-bg text-brand-green-dark font-sans">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
