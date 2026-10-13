import type { Product } from "@/lib/types";

export type ProductGroup = {
  key: string;
  name: string;
  image_url: string | null;
  category_id: string;
  sort_order: number;
  variants: Product[];
};

function parseGrams(unitLabel: string | null): number {
  if (!unitLabel) return Infinity;
  const s = unitLabel.toLowerCase();

  if (/1\/2\s*kg/.test(s)) return 500;

  const kgMatch = s.match(/([\d]+(?:[.,]\d+)?)\s*kg/);
  if (kgMatch) return parseFloat(kgMatch[1].replace(",", ".")) * 1000;

  const gMatch = s.match(/([\d]+(?:[.,]\d+)?)\s*g\b/);
  if (gMatch) return parseFloat(gMatch[1].replace(",", "."));

  return Infinity;
}

/**
 * Agrupa productos que son la misma presentación en distintos pesos (ej:
 * "Almendras x 1kg" y "Almendras x 1/2kg") para mostrarlos como una sola
 * tarjeta con selector de peso, en vez de dos productos repetidos.
 */
export function groupProductVariants(products: Product[]): ProductGroup[] {
  const map = new Map<string, ProductGroup>();

  for (const p of products) {
    const key = `${p.category_id}|${p.name.trim().toLowerCase()}`;
    let group = map.get(key);
    if (!group) {
      group = {
        key,
        name: p.name,
        image_url: p.image_url,
        category_id: p.category_id,
        sort_order: p.sort_order,
        variants: [],
      };
      map.set(key, group);
    }
    group.variants.push(p);
    if (p.sort_order < group.sort_order) group.sort_order = p.sort_order;
    if (!group.image_url && p.image_url) group.image_url = p.image_url;
  }

  const groups = Array.from(map.values());
  for (const group of groups) {
    group.variants.sort((a, b) => parseGrams(a.unit_label) - parseGrams(b.unit_label));
  }
  groups.sort((a, b) => a.sort_order - b.sort_order);

  return groups;
}
