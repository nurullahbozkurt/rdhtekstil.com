-- Faz 2: talep / iletişim / form seçenekleri / admin profil + private storage
-- Anonim ve authenticated roller tablolara doğrudan erişemez; yazma service_role ile yapılır.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.product_type as enum ('BEANIE', 'SCARF', 'SET');
create type public.request_status as enum ('NEW', 'IN_REVIEW', 'REPLIED');
create type public.request_file_kind as enum ('LOGO', 'REFERENCE', 'OTHER');
create type public.form_option_type as enum ('quantity', 'country');
create type public.contact_status as enum ('NEW', 'READ', 'ARCHIVED');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.form_options (
  id uuid primary key default gen_random_uuid(),
  type public.form_option_type not null,
  value text not null,
  label_tr text not null,
  label_en text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  unique (type, value)
);

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  created_at timestamptz not null default now(),
  locale text not null check (locale in ('tr', 'en')),
  product_type public.product_type not null,
  product_slug text,
  model_slug text,
  industry text,
  color1 text not null,
  color2 text,
  color3 text,
  slogan text,
  quantity_range text not null,
  desired_date date,
  note text,
  full_name text not null,
  company text not null,
  email text not null,
  phone text not null,
  country text not null,
  privacy_consent_at timestamptz not null,
  privacy_consent_version text not null,
  marketing_consent boolean not null default false,
  status public.request_status not null default 'NEW',
  internal_note text,
  read_at timestamptz,
  idempotency_key text not null unique
);

create index requests_created_at_idx on public.requests (created_at desc);
create index requests_email_idx on public.requests (email);
create index requests_status_idx on public.requests (status);

create table public.request_files (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id) on delete cascade,
  kind public.request_file_kind not null,
  original_name text not null,
  storage_key text not null unique,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  created_at timestamptz not null default now()
);

create index request_files_request_id_idx on public.request_files (request_id);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  locale text not null check (locale in ('tr', 'en')),
  full_name text not null,
  company text,
  email text not null,
  phone text,
  country text,
  product_interest text,
  quantity_range text,
  message text not null,
  privacy_consent_at timestamptz not null,
  privacy_consent_version text not null,
  status public.contact_status not null default 'NEW',
  read_at timestamptz
);

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- Okunabilir talep numarası: RDH-YYYY-NNNNNN
create sequence public.request_number_seq start 1;

create or replace function public.next_request_number()
returns text
language plpgsql
as $$
declare
  n bigint;
begin
  n := nextval('public.request_number_seq');
  return 'RDH-' || to_char(now() at time zone 'UTC', 'YYYY') || '-' || lpad(n::text, 6, '0');
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS: anon/authenticated için doğrudan erişim yok
-- ---------------------------------------------------------------------------
alter table public.admin_profiles enable row level security;
alter table public.form_options enable row level security;
alter table public.requests enable row level security;
alter table public.request_files enable row level security;
alter table public.contact_messages enable row level security;

-- form_options: yalnızca aktif seçenekler authenticated admin'e okunabilir (panel Faz 3).
-- Public site seçenekleri service_role / sunucu üzerinden okunur.
-- Bilinçli olarak anon SELECT politikası YOK.

revoke all on table public.admin_profiles from anon, authenticated;
revoke all on table public.form_options from anon, authenticated;
revoke all on table public.requests from anon, authenticated;
revoke all on table public.request_files from anon, authenticated;
revoke all on table public.contact_messages from anon, authenticated;

grant all on table public.admin_profiles to service_role;
grant all on table public.form_options to service_role;
grant all on table public.requests to service_role;
grant all on table public.request_files to service_role;
grant all on table public.contact_messages to service_role;
grant usage, select on sequence public.request_number_seq to service_role;

-- Admin: kendi profilini okuyabilir (oturum kontrolü için)
create policy admin_profiles_select_own
  on public.admin_profiles
  for select
  to authenticated
  using (auth.uid() = id);

grant select on table public.admin_profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: private bucket (müşteri yüklemeleri)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'request-files',
  'request-files',
  false,
  10485760,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'application/pdf'
  ]
)
on conflict (id) do nothing;

-- Storage: anon/authenticated doğrudan erişemez; erişim sunucu (service_role) üzerinden.
-- Varsayılan storage politikası eklenmez (deny by default when RLS on + no policies).

-- ---------------------------------------------------------------------------
-- Seed: form_options
-- ---------------------------------------------------------------------------
insert into public.form_options (type, value, label_tr, label_en, sort_order) values
  ('quantity', '50-99', '50–99', '50–99', 10),
  ('quantity', '100-249', '100–249', '100–249', 20),
  ('quantity', '250-499', '250–499', '250–499', 30),
  ('quantity', '500-999', '500–999', '500–999', 40),
  ('quantity', '1000-2499', '1.000–2.499', '1,000–2,499', 50),
  ('quantity', '2500+', '2.500+', '2,500+', 60),
  ('country', 'TR', 'Türkiye', 'Türkiye', 10),
  ('country', 'DE', 'Almanya', 'Germany', 20),
  ('country', 'AT', 'Avusturya', 'Austria', 30),
  ('country', 'CH', 'İsviçre', 'Switzerland', 40),
  ('country', 'NL', 'Hollanda', 'Netherlands', 50),
  ('country', 'BE', 'Belçika', 'Belgium', 60),
  ('country', 'FR', 'Fransa', 'France', 70),
  ('country', 'GB', 'Birleşik Krallık', 'United Kingdom', 80),
  ('country', 'IT', 'İtalya', 'Italy', 90),
  ('country', 'ES', 'İspanya', 'Spain', 100),
  ('country', 'US', 'Amerika Birleşik Devletleri', 'United States', 110),
  ('country', 'OTHER', 'Diğer', 'Other', 999);
