-- Cocina Sanita — esquema inicial
-- Correr este archivo completo en el SQL editor de Supabase (Dashboard > SQL Editor > New query).

create extension if not exists pgcrypto;

-- =========================
-- Tablas
-- =========================

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  price integer, -- en ARS, sin decimales. null = sin precio cargado (ver in_stock)
  unit_label text, -- ej "x 1kg", "x 1/2kg"
  image_url text,
  in_stock boolean not null default true,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  delivery_method text not null check (delivery_method in ('retiro', 'envio')),
  address_ref text,
  notes text,
  items jsonb not null, -- [{ product_id, name, unit_label, price, quantity }]
  total integer not null,
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products (category_id);

-- =========================
-- updated_at automático en products
-- =========================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

-- =========================
-- Row Level Security
-- =========================
-- Lectura pública solo de lo activo. Cualquier usuario autenticado (el admin,
-- que se crea a mano desde el Dashboard > Authentication) puede gestionar todo.

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

drop policy if exists "public read active categories" on categories;
create policy "public read active categories" on categories
  for select using (active = true);

drop policy if exists "admin manage categories" on categories;
create policy "admin manage categories" on categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public read active products" on products;
create policy "public read active products" on products
  for select using (active = true);

drop policy if exists "admin manage products" on products;
create policy "admin manage products" on products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Pedidos: cualquiera puede crear uno desde el checkout; solo el admin los lee.
drop policy if exists "public insert orders" on orders;
create policy "public insert orders" on orders
  for insert with check (true);

drop policy if exists "admin read orders" on orders;
create policy "admin read orders" on orders
  for select using (auth.role() = 'authenticated');

drop policy if exists "admin delete orders" on orders;
create policy "admin delete orders" on orders
  for delete using (auth.role() = 'authenticated');

-- =========================
-- Storage: fotos de producto
-- =========================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');
