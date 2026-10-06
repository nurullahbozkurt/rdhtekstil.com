# RDH Tekstil — Kurumsal Web Sitesi + Talep Sistemi + Admin

Özel tasarım bere ve atkı üreticisi RDH Tekstil için TR + EN kurumsal site, talep sistemi ve admin paneli.

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

### Şema (SQL Editor)

Sırayla çalıştırın:

1. `supabase/migrations/20261005142724_phase2_schema.sql`
2. `supabase/FAZ3_SQL.sql` (veya iki Faz 3 migration dosyası)

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

İçerik, Supabase yapılandırıldığında otomatik olarak veritabanında tutulur; paneldan yapılan değişiklikler doğrudan CMS kaydına yazılır.

## Ortam değişkenleri

| Değişken                                  | Açıklama                      |
| ----------------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_SITE_URL`                    | Kanonik site adresi           |
| `NEXT_PUBLIC_GTM_ID`                      | Boş bırakılabilir             |
| `NEXT_PUBLIC_ALLOW_INDEXING`              | Staging için `false`          |
| `NEXT_PUBLIC_SUPABASE_URL`                | Supabase API URL              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`           | Publishable / anon key        |
| `SUPABASE_SERVICE_ROLE_KEY`               | Secret key (istemciye gitmez) |
| `ADMIN_*`                                 | Seed script                   |
| `NEXT_PUBLIC_TURNSTILE_*` / `TURNSTILE_*` | Opsiyonel bot koruması        |

## Komutlar

| Komut                                  | Açıklama   |
| -------------------------------------- | ---------- |
| `npm run dev`                          | Geliştirme |
| `npm run build` / `start`              | Üretim     |
| `npm run lint` / `typecheck` / `check` | Kalite     |
| `npm run seed:admin` / `link:admin`    | Admin      |

## Fazlar

| Faz               | Durum     |
| ----------------- | --------- |
| 1 Landing         | Tamam     |
| 2 Dinamik alanlar | Tamam     |
| 3 Admin + CMS     | Bu branch |

### Admin paneli

- Talepler: arama, filtre, detay, durum, iç not, dosya önizleme/indirme/zip, silme
- İletişim mesajları
- Kullanıcı yönetimi (ekle / sil / parola; son admin silinemez)
- CMS (panel): SSS, yasal sayfalar — diğer içerikler kod üzerinden yönetilir
- Talepler yalnızca admin panelden manuel silinir (otomatik saklama süresi kapalı)

İçerik katmanı arayüzü (`getProducts` vb.) korunur. Supabase bağlıysa içerik `cms_documents` üzerinden okunur/yazılır; boşsa uygulama bir kez başlangıç içeriğini kendisi oluşturur.

## Varsayımlar

- `product_type`: `BEANIE` \| `SCARF` \| `SET`
- Turnstile boşken atlanır; honeypot + rate limit aktif
- Rate limit bellek içi (tek instance)
- Admin rotası locale dışında: `/admin`
- Katalog (ad/özet) ve SEO (slug/title/description/H1) paneldan düzenlenir; görsel yükleme content-media bucket’ına sonraki iterasyonda eklenebilir
- GTM şimdilik boş

## TODO(content)

- Gerçek referans logoları, yasal metinler, iletişim bilgileri
- GTM / Turnstile (canlıya çıkarken)

## Dağıtım

1. Faz 2 + Faz 3 migration’larını uzak Supabase’e uygulayın
2. Env’leri hosting’e ekleyin (`SERVICE_ROLE` yalnızca sunucu)
3. `npm run seed:admin` (bir kez)
4. `npm run build && npm run start` (CMS içeriği ilk istekte otomatik oluşur)
