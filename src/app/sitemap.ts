import type { MetadataRoute } from "next";
import { getActiveCategories } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cocinasanita.com";

  const staticRoutes = ["", "/productos", "/nosotros", "/contacto"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const categories = await getActiveCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${base}/productos?categoria=${category.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes];
}
