# RDH Tekstil — Kurumsal Web Sitesi

Özel tasarım bere ve atkı üreticisi RDH Tekstil için TR + EN kurumsal site (Faz 1: landing / katalog).

## Gereksinimler

- Node.js ≥ 20.9
- npm

## Kurulum

```bash
cp .env.example .env.local
npm install
npm run dev
```

Site: [http://localhost:3000](http://localhost:3000) → `/tr` veya `/en` yönlendirmesi.

## Ortam değişkenleri

| Değişken                     | Açıklama                                               |
| ---------------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`       | Kanonik site adresi (canonical, hreflang, sitemap, OG) |
| `NEXT_PUBLIC_GTM_ID`         | GTM container ID; boşsa GTM yüklenmez                  |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Staging için `false` → robots disallow                 |

Gizli anahtar istemciye gitmez. Faz 2’de Supabase değişkenleri eklenecek.

## Komutlar

| Komut               | Açıklama                 |
| ------------------- | ------------------------ |
| `npm run dev`       | Geliştirme sunucusu      |
| `npm run build`     | Üretim derlemesi (SSG)   |
| `npm run start`     | Üretim sunucusu          |
| `npm run lint`      | ESLint                   |
| `npm run typecheck` | TypeScript               |
| `npm run format`    | Prettier                 |
| `npm run check`     | lint + typecheck + build |

## Proje yapısı

```
src/
  app/[locale]/          # Layout, ana sayfa, catch-all rota, sitemap, robots
  components/            # Layout, sections, catalog, forms, consent, analytics
  views/                 # Sayfa görünümleri (içerik + UI birleşimi)
  i18n/                  # Locale config + UI mesaj sözlükleri (TR/EN)
  lib/content/           # İçerik katmanı arayüzü + seed veri (Zod tipli)
  lib/routing/           # Rota tablosu, SEO helpers, link builder
  lib/analytics/         # Consent + dataLayer event'leri
  proxy.ts               # Locale yönlendirme (Next.js proxy)
public/product-images/   # Ürün görselleri
```

## İçerik katmanı

UI bileşenleri yalnızca `src/lib/content` arayüzünü kullanır (`getProducts`, `getFaqs`, `getSeo` vb.). Seed veri `src/lib/content/data/` altındadır. Faz 3’te arka uç Supabase’e geçirilir; UI değişmez.

Yeni dil eklemek: `src/i18n/config.ts` + mesaj sözlüğü + içerik alanları (kod mimarisi değiştirilmeden).

## Çerez onayı ve analytics

- Onay verilmeden GTM yüklenmez.
- Tercih `localStorage`’da saklanır; footer’dan yeniden açılabilir.
- Faz 1 event’leri: `view_product`, `view_industry`, `view_case_study`, `whatsapp_click`, `email_click` (PII yok).

## Faz 1 kapsamı

- TR + EN herkese açık site, katalog, kullanım alanları, özel üretim, referanslar, hakkımızda, iletişim (arayüz), yasal placeholder’lar, SEO.
- `/talep` ve `/talep/tamamlandi`: `noindex` iskelet (`TODO(phase-2)`).
- İletişim formu: Zod doğrulama; gönderim Faz 2’de.
- Supabase, auth, dosya yükleme, admin paneli **yok**.

## Varsayımlar

- i18n için `next-intl` yerine yerel sözlükler (`src/i18n/messages`) kullanıldı; path prefix `/tr` / `/en` aynı kaldı.
- Türkçe URL’lerde ASCII slug tercih edildi (`atkilar`, `hakkimizda` vb.).
- Logo dosya adı `logo-rdh-*` olarak kullanıldı.
- Ürün tipi enum’unda `BEANIE` kullanıldı (AGENTS’teki BERET ile eşdeğer konumlandırma).
- `?urun=` parametresi ürün **id**’sini taşır (slug değil).
- İletişim bilgileri ve harita: placeholder / dış link (`TODO(content)`).
- Yasal sayfalar: dört sayfa (KVKK, gizlilik, çerez, aydınlatma); metinler placeholder.
- `robots.txt` noindex sayfaları disallow etmez; sayfa meta `noindex` yeterlidir.
- Masaüstü navigasyon kırılımı `xl` (menü taşmasını önlemek için).
- `not-found` locale’i istemci tarafında path’ten seçilir.

## TODO(content)

- Gerçek referans logoları (`public/reference-images/` henüz yok / eksik).
- Eksik ürün / case study görselleri (placeholder rozetli).
- Yasal metinlerin RDH onaylı sürümleri.
- Gerçek telefon, WhatsApp, e-posta, adres, harita gömme.
- Sosyal medya URL’leri.
- GTM / GA4 canlı container ID.

## Dağıtım notları

1. `.env.local` / hosting env: `NEXT_PUBLIC_SITE_URL`, isteğe bağlı `NEXT_PUBLIC_GTM_ID`.
2. `npm run build && npm run start` veya Vercel/Node host.
3. Staging’de `NEXT_PUBLIC_ALLOW_INDEXING=false`.
