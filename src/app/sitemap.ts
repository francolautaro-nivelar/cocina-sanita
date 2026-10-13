import type { MetadataRoute } from "next";
import { getActiveCategories } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cocinasanita.com";

  const staticRoutes = [
    "",
    "/productos",
    "/nosotros",
    "/contacto",
    "/privacidad",
    "/terminos",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/productos" ? 0.9 : path.startsWith("/privacidad") || path.startsWith("/terminos") ? 0.2 : 0.5,
  }));

  const categories = await getActiveCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${base}/productos?categoria=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes];
}
