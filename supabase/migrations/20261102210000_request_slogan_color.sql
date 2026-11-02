-- Talep formuna slogan rengi alanı

alter table public.requests
  add column if not exists slogan_color text;
