-- Fuar ziyaretçi düzenleme geçmişi

create table public.fair_visitor_edit_logs (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references public.fair_visitors (id) on delete cascade,
  created_at timestamptz not null default now(),
  actor_id uuid references public.admin_profiles (id) on delete set null,
  actor_name text not null,
  changes jsonb not null default '[]'::jsonb
);

create index fair_visitor_edit_logs_visitor_id_idx
  on public.fair_visitor_edit_logs (visitor_id, created_at desc);

alter table public.fair_visitor_edit_logs enable row level security;

revoke all on table public.fair_visitor_edit_logs from anon, authenticated;
grant all on table public.fair_visitor_edit_logs to service_role;
