# Cocina Sanita — Tienda Online

Ecommerce de Cocina Sanita (frutas, verduras y pulpas congeladas): catálogo público con
carrito y pedido 100% online, más un panel de administración en `/admin` para cargar
productos, gestionar pedidos, clientes y ver las finanzas básicas del negocio.

Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase (base de datos,
auth del admin y storage de fotos) + Zustand (carrito, persistido en el navegador) +
Resend (aviso por mail cuando entra un pedido).

## Puesta en marcha

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Conectar Supabase** — copiá `.env.local.example` a `.env.local` y completá con los
   datos de tu proyecto (Dashboard de Supabase > Project Settings > API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

3. **Crear las tablas** — en el Dashboard de Supabase, abrí el **SQL Editor** y corré,
   en orden:
   1. [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) — crea las
      tablas `categories`, `products`, `orders`, las políticas de seguridad (RLS) y el
      bucket de Storage para las fotos de producto.
   2. [`supabase/migrations/0002_order_status.sql`](supabase/migrations/0002_order_status.sql)
      — agrega el estado del pedido (pendiente/confirmado/entregado/cancelado) y el
      permiso para que el admin lo actualice.
   3. [`supabase/seed.sql`](supabase/seed.sql) — carga las categorías y productos de
      `Lista de precios.md`.

4. **Crear el usuario admin** — en el Dashboard de Supabase: Authentication > Users >
   Add user. Con ese email/contraseña vas a poder entrar a `/admin`. Cualquier usuario
   autenticado tiene acceso al panel (pensado para un solo admin).

5. **Mail de aviso de pedido nuevo (opcional pero recomendado)** — se manda con
   [Resend](https://resend.com):
   1. Creá una cuenta gratis en [resend.com](https://resend.com) (3.000 mails/mes gratis).
   2. Dashboard > API Keys > Create API Key, y copiala.
   3. En `.env.local`, completá:
      ```
      RESEND_API_KEY=<tu api key>
      ORDER_NOTIFICATION_EMAIL=cocinasanita@gmail.com
      ```
      Con solo esto ya funciona, pero el remitente por defecto
      (`onboarding@resend.dev`) solo le puede mandar mails a la casilla con la que te
      registraste en Resend. Para que le lleguen los avisos a
      `ORDER_NOTIFICATION_EMAIL` en producción hay que verificar el dominio propio:
   4. (Recomendado) Dashboard de Resend > Domains > Add Domain > `cocinasanita.com`,
      y cargá en GoDaddy los registros DNS (TXT/DKIM/MX) que te muestre Resend — mismo
      lugar donde se cargó el dominio de Vercel. Una vez verificado, agregá en
      `.env.local` / Vercel:
      ```
      EMAIL_FROM=Cocina Sanita <pedidos@cocinasanita.com>
      ```
   Si no se configura `RESEND_API_KEY`, el sitio sigue funcionando igual — el pedido se
   guarda en la base, simplemente no llega el mail.

6. **Levantar el sitio**

   ```bash
   npm run dev
   ```

   - Tienda: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Cómo funciona el pedido

El cliente arma el carrito (se guarda en el navegador), completa sus datos en
`/checkout` y confirma. El pedido queda guardado en la tabla `orders` con estado
**"Pendiente"**, Carla recibe un mail de aviso, y el cliente ve una confirmación en la
misma web (sin redirección a WhatsApp). Desde `/admin/pedidos`, Carla gestiona el
estado del pedido y, cuando quiere, le escribe al cliente por WhatsApp con un mensaje
pre-armado para coordinar el pago y la entrega — es una acción que ella inicia, no algo
automático del checkout. No hay cobro online.

## Estructura

- `src/app/(site)` — tienda pública (home, `/productos`, `/carrito`, `/checkout`,
  `/nosotros`, `/contacto`).
- `src/app/admin` — panel privado (`/admin/login`, y dentro de `(panel)`:
  `/admin/productos`, `/admin/categorias`, `/admin/pedidos`, `/admin/clientes`,
  `/admin/finanzas`), protegido por `src/proxy.ts` usando la sesión de Supabase.
- `src/lib` — clientes de Supabase, queries, helpers (precio, slug, WhatsApp, mail,
  rango de fechas).
- `src/store/cart.ts` — estado del carrito (Zustand + localStorage).
- `supabase/` — migraciones y seed SQL.

## Deploy

Pensado para deployar en [Vercel](https://vercel.com): importá el repo y configurá las
mismas variables de entorno de `.env.local` en el proyecto de Vercel (incluyendo
`NEXT_PUBLIC_SITE_URL` con la URL real de producción).
