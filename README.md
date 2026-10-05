# RDH Tekstil — Kurumsal Web Sitesi

Özel tasarım bere ve atkı üreticisi RDH Tekstil için TR + EN kurumsal site + talep sistemi (Faz 2).

## Gereksinimler

- Node.js ≥ 20.9
- npm
- Supabase projesi (uzak veya `npx supabase start` ile yerel)

## Kurulum

```bash
cp .env.example .env.local
npm install
```

`.env.local` içine doldurun:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key)
- `SUPABASE_SERVICE_ROLE_KEY` (secret key — yalnızca sunucu)

Şema: SQL Editor’da `supabase/migrations/20261005142724_phase2_schema.sql` çalıştırın  
veya `npx supabase link --project-ref <ref> && npx supabase db push`.

Admin:

```bash
# .env.local: ADMIN_EMAIL, ADMIN_PASSWORD (≥8), ADMIN_NAME
npm run seed:admin
# veya Dashboard’dan user oluşturup:
npm run link:admin -- <user-uuid> "RDH Admin"
```

```bash
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  

## Ortam değişkenleri

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Kanonik site adresi |
| `NEXT_PUBLIC_GTM_ID` | Boş bırakılabilir |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Staging için `false` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable / anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key (istemciye gitmez) |
| `ADMIN_*` | Seed script |
| `NEXT_PUBLIC_TURNSTILE_*` / `TURNSTILE_*` | Opsiyonel bot koruması |

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme |
| `npm run build` / `start` | Üretim |
| `npm run lint` / `typecheck` / `check` | Kalite |
| `npm run seed:admin` / `link:admin` | Admin |

## Faz 2 kapsamı

- Supabase şema + RLS + private `request-files` bucket
- Adım adım talep formu + dosya yükleme (tip/boyut/magic bytes/SVG sanitize)
- İletişim formu gerçek gönderim
- Honeypot + rate limit (+ opsiyonel Turnstile)
- Admin giriş + placeholder (`/admin`); panel UI Faz 3
- Dosya erişimi: `/api/admin/files/[id]` (imzalı URL)

Katalog hâlâ yerel içerik katmanından gelir.

## Varsayımlar

- `product_type`: `BEANIE` \| `SCARF` \| `SET`
- Turnstile boşken atlanır; honeypot + rate limit aktif
- Rate limit bellek içi (tek instance)
- Admin rotası locale dışında: `/admin`
- GTM şimdilik boş

## TODO(content)

- Gerçek referans logoları, yasal metinler, iletişim bilgileri
- GTM / Turnstile (canlıya çıkarken)

## Dağıtım

1. Migration’ı uzak Supabase’e uygulayın
2. Env’leri hosting’e ekleyin (`SERVICE_ROLE` yalnızca sunucu)
3. `npm run seed:admin` (bir kez)
4. `npm run build && npm run start`
