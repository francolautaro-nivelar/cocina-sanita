import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cocina Sanita | Frutas, pulpas y verduras congeladas",
  description:
    "Simplificá tu vida y comé sano. Frutas, verduras y pulpas congeladas, listas para tus comidas. Libres de gluten y aditivos. Pedí online, retirá o coordinamos el envío.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-brand-bg text-brand-green-dark font-sans">
        {children}
      </body>
    </html>
  );
}
