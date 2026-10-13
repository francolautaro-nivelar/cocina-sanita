import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente de solo lectura para datos públicos de la tienda (categorías,
// productos). A diferencia de src/lib/supabase/server.ts, no lee cookies,
// así que no fuerza el renderizado dinámico de las páginas del storefront
// y permite que Next.js las sirva estáticas / cacheadas (ISR).
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
