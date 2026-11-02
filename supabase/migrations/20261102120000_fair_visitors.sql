-- Fuar ziyaretçi formu: kayıtlar + durum akışı
-- Anonim/authenticated doğrudan erişemez; yazma/okuma service_role ile yapılır.

create type public.fair_visitor_status as enum ('NEW', 'MET', 'QUOTED', 'FOLLOW_UP');
create type public.fair_product_group as enum ('BEANIE', 'SCARF', 'SATIN_SHAWL', 'SET');

create table public.fair_visitors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  locale text not null check (locale in ('tr', 'en')),
  full_name text not null,
  company text not null,
  job_title text not null,
  country text not null,
  email text not null,
  phone text not null,
  product_group public.fair_product_group not null,
  quantity_range text not null,
  desired_date date,
  notes text,
  privacy_consent_at timestamptz not null,
  privacy_consent_version text not null,
  status public.fair_visitor_status not null default 'NEW',
  read_at timestamptz,
  internal_note text
);

create index fair_visitors_created_at_idx on public.fair_visitors (created_at desc);
create index fair_visitors_status_idx on public.fair_visitors (status);
create index fair_visitors_email_idx on public.fair_visitors (email);

alter table public.fair_visitors enable row level security;

revoke all on table public.fair_visitors from anon, authenticated;
grant all on table public.fair_visitors to service_role;
