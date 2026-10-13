-- Analítica propia: registra vistas y "agregar al carrito" por producto para
-- poder ver en /admin/analiticas qué productos generan más interés. No guarda
-- ningún dato personal (ni IP, ni usuario) — solo producto, tipo de evento y
-- fecha.

create table if not exists product_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  event_type text not null check (event_type in ('view', 'add_to_cart')),
  created_at timestamptz not null default now()
);

create index if not exists product_events_product_id_idx on product_events(product_id);
create index if not exists product_events_created_at_idx on product_events(created_at);

alter table product_events enable row level security;

drop policy if exists "public insert product_events" on product_events;
create policy "public insert product_events" on product_events
  for insert with check (true);

drop policy if exists "admin read product_events" on product_events;
create policy "admin read product_events" on product_events
  for select using (auth.role() = 'authenticated');
