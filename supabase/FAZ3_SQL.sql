-- Faz 3: SQL Editor'da bu dosyanın tamamını çalıştırın
-- (site_runtime_settings + cms_documents + content-media bucket)

create table if not exists public.site_runtime_settings (
  id text primary key default 'default',
  retention_enabled boolean not null default false,
  retention_days integer not null default 0 check (retention_days >= 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.site_runtime_settings enable row level security;
revoke all on table public.site_runtime_settings from anon, authenticated;
grant all on table public.site_runtime_settings to service_role;

insert into public.site_runtime_settings (id, retention_enabled, retention_days)
values ('default', false, 0)
on conflict (id) do nothing;

create table if not exists public.cms_documents (
  id text primary key,
  collection text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index if not exists cms_documents_collection_idx on public.cms_documents (collection);

alter table public.cms_documents enable row level security;
revoke all on table public.cms_documents from anon, authenticated;
grant all on table public.cms_documents to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-media',
  'content-media',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/avif']
)
on conflict (id) do nothing;
