-- Cocina Sanita — estado de pedidos
-- Correr en el SQL editor de Supabase, después de 0001_init.sql.

alter table orders add column if not exists status text not null default 'pendiente';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_status_check'
  ) then
    alter table orders add constraint orders_status_check
      check (status in ('pendiente', 'confirmado', 'entregado', 'cancelado'));
  end if;
end $$;

-- Hacía falta: el admin podía leer y borrar pedidos, pero no actualizar el estado.
drop policy if exists "admin update orders" on orders;
create policy "admin update orders" on orders
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
