-- Fuar kaydı kaynağı: stand formu veya QR self-service

alter table public.fair_visitors
  add column if not exists source text not null default 'STAFF'
    check (source in ('STAFF', 'QR'));

create index if not exists fair_visitors_source_idx on public.fair_visitors (source);
