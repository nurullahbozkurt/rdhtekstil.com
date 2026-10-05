-- Faz 3: CMS belgeleri (içerik katmanı seed'inin DB karşılığı)

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

-- Public site görselleri için ayrı bucket (okunabilir)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-media',
  'content-media',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/avif']
)
on conflict (id) do nothing;
