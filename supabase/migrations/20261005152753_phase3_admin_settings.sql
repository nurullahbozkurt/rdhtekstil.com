-- Faz 3: site ayarları (saklama süresi vb.)

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
