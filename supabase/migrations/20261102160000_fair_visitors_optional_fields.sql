-- Fuar formu: OTHER ürün grubu + opsiyonel alanlar + 30-50 adet seçeneği

alter type public.fair_product_group add value if not exists 'OTHER';

alter table public.fair_visitors
  alter column job_title drop not null,
  alter column country drop not null,
  alter column email drop not null,
  alter column phone drop not null,
  alter column quantity_range drop not null;

insert into public.form_options (type, value, label_tr, label_en, sort_order, is_active)
values ('quantity', '30-50', '30–50', '30–50', 5, true)
on conflict (type, value) do update
set
  label_tr = excluded.label_tr,
  label_en = excluded.label_en,
  sort_order = excluded.sort_order,
  is_active = true;
