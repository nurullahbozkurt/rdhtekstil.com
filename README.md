# RDH Tekstil — Kurumsal Web Sitesi

Özel tasarım bere ve atkı üreticisi RDH Tekstil için TR + EN kurumsal site + talep sistemi.

## Gereksinimler

- Node.js ≥ 20.9
- npm
- Faz 2 yerel geliştirme için: [Docker](https://docs.docker.com/get-docker/) + Supabase CLI (`npx supabase`)

## Kurulum

```bash
cp .env.example .env.local
npm install
```

### Yerel Supabase (önerilen)

```bash
npx supabase start
npx supabase status   # URL, anon key, service_role key
```

`.env.local` içine status çıktısındaki değerleri yazın:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Migration + seed (form_options):

```bash
npx supabase db reset
```

Admin kullanıcı:

```bash
# .env.local: ADMIN_EMAIL, ADMIN_PASSWORD (≥12 karakter), ADMIN_NAME
npm run seed:admin
```

Uygulama:

```bash
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Ortam değişkenleri

| Değişken                                                  | Açıklama                       |
| --------------------------------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                                    | Kanonik site adresi            |
| `NEXT_PUBLIC_GTM_ID`                                      | GTM container ID               |
| `NEXT_PUBLIC_ALLOW_INDEXING`                              | Staging için `false`           |
| `NEXT_PUBLIC_SUPABASE_URL`                                | Supabase API URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`                           | Anon/publishable key           |
| `SUPABASE_SERVICE_ROLE_KEY`                               | Yalnızca sunucu                |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD`                          | Seed script                    |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Bot koruması (prod’da zorunlu) |

## Komutlar

| Komut                                  | Açıklama            |
| -------------------------------------- | ------------------- |
| `npm run dev`                          | Geliştirme sunucusu |
| `npm run build` / `start`              | Üretim              |
| `npm run lint` / `typecheck` / `check` | Kalite              |
| `npm run supabase:start` / `reset`     | Yerel DB            |
| `npm run seed:admin`                   | İlk admin           |

## Faz 2 kapsamı

- Supabase şema + RLS + private `request-files` bucket
- Adım adım talep formu, dosya yükleme (tip/boyut/magic bytes/SVG sanitize)
- İletişim formu gerçek gönderim
- Turnstile (yapılandırılmışsa), honeypot, rate limit, güvenlik başlıkları
- Admin giriş + placeholder sayfa (`/admin`); panel UI Faz 3
- Dosya erişimi: `/api/admin/files/[id]` (imzalı URL, yalnızca admin)

Katalog içeriği hâlâ yerel içerik katmanından gelir (Faz 3’te CMS).

## Varsayımlar

- `product_type` enum: `BEANIE` \| `SCARF` \| `SET` (Faz 1 kategori id’leriyle uyumlu; AGENTS’teki BERET yerine BEANIE).
- Turnstile secret yokken development’ta doğrulama atlanır; production’da zorunlu.
- Rate limit bellek içi (tek instance).
- i18n: yerel sözlükler; path `/tr` / `/en`.
- Admin rotası locale dışında: `/admin`.

## TODO(content)

- Gerçek referans logoları, yasal metinler, iletişim bilgileri, GTM ID
- Canlı Turnstile anahtarları
- RDH için ayrı Supabase projesi (uzak ortam)

## Dağıtım

1. Supabase projesine migration uygulayın (`supabase db push` veya CI).
2. Env’leri hosting’e ekleyin (`SERVICE_ROLE` yalnızca sunucu).
3. `npm run seed:admin` (bir kez).
4. `npm run build && npm run start`.
