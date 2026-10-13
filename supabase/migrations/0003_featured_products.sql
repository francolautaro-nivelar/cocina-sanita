-- Permite marcar productos como destacados para la home.
alter table products add column if not exists featured boolean not null default false;
