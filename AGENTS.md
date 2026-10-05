<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

Project Description:

# RDH Tekstil — Kurumsal Web Sitesi + Talep Sistemi + Admin Paneli

Bu dosya, projeyi sıfırdan başlatacak geliştirme ajanı için tek kaynak (single source of truth) olarak hazırlanmıştır. Önce tamamını oku, sonra "Çalışma Yöntemi" bölümündeki sırayla ilerle.

---

# RDH Tekstil — Geliştirme Prompt'u (3 Fazlı)

## 0. Çalışma Düzeni: Fazlar ve Onay Kapıları (ÖNCE BUNU OKU)

Bu proje **3 faza** bölünmüştür. Fazlar sırayla ve **her biri bağımsız olarak teslim edilir.**

| Faz       | Kapsam                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Faz 1** | Landing Page / herkese açık site (statik içerik katmanı, katalog, SEO, i18n, tasarım sistemi)                                  |
| **Faz 2** | Dinamik alanlar: Supabase entegrasyonu, Auth altyapısı, Talep Ekranı, Başarı Ekranı, İletişim formu, dosya yükleme ve güvenlik |
| **Faz 3** | Admin Paneli + içerik yönetimi (CMS) + final test ve teslim                                                                    |

### Onay kapısı kuralları (zorunlu)

1. Yalnızca **o an aktif olan fazın** kapsamında çalış. Sonraki fazın işini **başlatma**, "hazırlık" olarak bile ekleme (istisna: bu dosyada açıkça "Faz X'te hazırlık" diye belirtilenler).
2. Faz bittiğinde **dur** ve şunları içeren bir **Faz Teslim Raporu** yaz:
   - Ne yapıldı (kısa liste)
   - Nasıl çalıştırılır / nasıl test edilir (komutlar, URL'ler)
   - Faz kabul kriterlerinin her biri için ✅ / ❌ durumu
   - Açık kalan işler, `TODO(content)` listesi, README'ye yazılan varsayımlar
   - Bir sonraki faz için önerilen başlangıç noktası
3. Raporun sonunda şu soruyu sor ve **cevap bekle:** _"Faz X'i onaylıyor musunuz? Onay verirseniz Faz X+1'e geçeceğim."_
4. **Açık ve açık onay gelmeden** bir sonraki faza geçme. Kullanıcı değişiklik isterse aynı fazda düzelt, raporu güncelle ve tekrar onay iste.
5. Her faz ayrı branch'te çalışılır (`phase-1-landing`, `phase-2-dynamic`, `phase-3-admin`); onaydan sonra `main`'e birleştirilir. Faz içinde küçük, anlamlı commit'ler.
6. Her fazın sonunda proje **çalışır durumda** olmalı (build, lint, typecheck, testler geçer). Yarım bırakılmış özellik kalmamalı.

---

## 1. Proje Özeti

RDH Tekstil, özel tasarım **bere ve atkı** üreten bir tekstil üreticisidir. Geliştirilecek sistem üç parçadan oluşur:

1. **Kurumsal web sitesi + ürün kataloğu** (herkese açık, TR + EN) → **Faz 1**
2. **Talep ekranı + başarı ekranı** (ziyaretçi logosunu, renklerini, sloganını ve örnek modellerini gönderir) → **Faz 2**
3. **Admin paneli** (gelen her talep ayrı ayrı saklanır ve panelde görüntülenir) → **Faz 3**

Kullanım akışı bundan ibarettir:

```
Siteyi gez → Kataloğu incele → Talep ekranını doldur ve dosyaları yükle
→ Başarı ekranı ("örnek modeller ve fiyat teklifi kısa süre içinde e-posta ile iletilecek")
→ RDH ekibi admin panelden talebi görüntüler ve müşteriye e-posta ile kendisi döner
```

Müşteriye dönüş (örnek model + fiyat teklifi) **sistemin dışında, RDH ekibi tarafından e-posta ile yapılır.** Sistem yalnızca talebi toplar, saklar ve admin panelde gösterir.

Kapsamı genişletme. Yukarıdaki üç parçanın dışında bir özellik gerekiyorsa uygulamadan önce not düş ve atla.

---

## 2. Teknoloji Yığını

Başka bir yığın belirtilmedikçe şunu kullan. Gerekçeli bir sapma gerekiyorsa README'de belirt. UI/UX için listedekilerin dışında bir kütüphane kullanman gerekiyorsa bunu bana sorarak yap.

- **Framework:** Next.js (App Router) + TypeScript
- **Stil:** Tailwind CSS
- **UI:** shadcn/ui
- **Icons:** lucide-react
- **Motion:** framer-motion
- **Veritabanı:** Supabase (PostgreSQL) — _Faz 2'den itibaren_ (`https://supabase.com/docs/guides/getting-started/quickstarts/nextjs` bölümünü takip ediniz)
- **Dosya depolama:** Supabase Storage (private bucket) — _Faz 2'den itibaren_
- **Admin kimlik doğrulama:** Supabase Auth — _altyapı Faz 2'de, panel arayüzü Faz 3'te_
- **Şema yönetimi:** Supabase CLI migration'ları (SQL) + RLS politikaları; yerel geliştirme için `supabase start`
- **Çoklu dil:** `next-intl` (veya eşdeğeri), `/tr/` ve `/en/` path prefix
- **Form doğrulama:** Zod (istemci + sunucu aynı şema)
- **Bot koruması:** Supabase reCAPTCHA + honeypot
- **Analytics:** GA4 + GTM (çerez onayına bağlı) — _Faz 1'de kurulum, Faz 2'de form event'leri_
- **Kalite:** ESLint, Prettier, TypeScript strict
- **Tasarım Referansı:** https://www.furevo.com/

Ortam değişkenleri `.env.example` içinde belgelenmeli. Hiçbir gizli anahtar istemci koduna girmemeli.

---

## 3. Marka ve Konumlandırma

**Konumlandırma:** Bere ve atkı üretiminde uzmanlaşmış üretici. Genel bir tekstil veya promosyon firması gibi görünme.

**Ana söylem:** `YOUR BRAND. YOUR DESIGN. OUR PRODUCTION.`

**Footer/marka alt satırı:** `CUSTOM SCARVES & BEANIES`

**Değer önerileri:**

| Başlık                 | Açıklama                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| Bere & Atkıda Uzmanlık | Odağımızı bildiğimiz ürünlere veriyor, bere ve atkı üretimindeki deneyimimizi her projeye taşıyoruz. |
| Özel Tasarım           | Renk, desen, logo ve ürün detaylarını markanıza ve projenize göre şekillendiriyoruz.                 |
| Düşük Minimum Adet     | Farklı ölçeklerdeki projelere uygun esnek üretim seçenekleri sunuyoruz.                              |
| Private Label          | Etiket, ürün ve sunum detaylarını markanıza göre özelleştiriyoruz.                                   |
| Hızlı Üretim           | Planlı üretim altyapımızla projeleri ihtiyaç duyulan termin doğrultusunda yönetiyoruz.               |
| Zamanında Teslimat     | Üretim ve sevkiyat süreçlerini planlanan teslim takvimine göre takip ediyoruz.                       |

**Dil kuralı:** "Numune / sampling" ifadesi kullanılmaz. Müşteriye gönderilecek şey için **"örnek model"** veya **"tasarım önerisi"** denir.

---

## 4. Görsel Kimlik ve Tasarım Yönergesi

Mevcut kurumsal materyallerin dili web'e taşınacak, ancak sitenin fuar standının dijital kopyası gibi görünmemesi gerekir: daha modern, ferah, fonksiyonel, profesyonel ve kullanıcı dostu olmalı.

- **Renkler:** lacivert (ana), krem / kırık beyaz (zemin), altın / sıcak vurgu
- **Doku:** geometrik RDH pattern (logo/pattern dosyaları teslim edildiğinde kullanılacak; o zamana kadar placeholder)
- **Tipografi:** güçlü hiyerarşi, premium his
- **Görsel önceliği:** 1) gerçek ürünler 2) gerçek RDH üretimleri 3) gerçek referans projeleri 4) üretim detayları 5) gerektiğinde destekleyici lifestyle görseller. Stock tekstil görselleri ana iletişimi taşımamalı.
- Geliştirme sırasında gerçek görsel yoksa net işaretlenmiş placeholder kullan; Gerçek görsel: `public/product-images/` klasörü altında bulunur.
- Mobile-first, tam responsive, erişilebilir (klavye odağı, kontrast, `prefers-reduced-motion`).
- Tasarım dili olarak şu siteyi referans alacağız: `https://www.furevo.com/`

### Copy dili

Jenerik tekstil söylemi yasak ("Kalite ve güvenin adresi", "Hayallerinizi gerçeğe dönüştürüyoruz", "Tekstilde yenilikçi çözümler", "Yılların deneyimiyle geleceği örüyoruz" gibi). Kısa, net, kanıtlanabilir ifadeler kullan:

- Bere ve atkıda uzman üretim.
- Markanıza özel tasarım.
- Düşük minimum adet.
- Private label üretim.
- Logonuzu gönderin, örnek modelinizi alın.
- Sizin markanız. Sizin tasarımınız. Bizim üretimimiz.

Bu dil TR ve EN içeriklerin tamamında korunur. Bu dosyadaki tüm metinler birebir kullanılabilir; Türkçe ana metindir.

---

## 5. Genel Kod ve Çalışma Kuralları (tüm fazlar için geçerli)

- TypeScript strict; `any` kullanma. Zod şemaları istemci ve sunucuda ortak.
- İçeriği bileşenlerin içine sabit yazma; metinler i18n / **içerik katmanı** üzerinden gelsin (bkz. Faz 1, "İçerik katmanı"). Bu dosyadaki metinler seed verisi olarak yüklenir.
- Kapsam dışı listesine (bölüm 1) dokunma. Belirsizlik varsa varsayımı README'deki "Varsayımlar" başlığına yaz ve ilerle; yalnızca ilerlemeyi tamamen engelleyen durumlarda dur ve sor.
- Gerçek logo, ürün görseli, yasal metin ve referans listesi sonradan gelecek; placeholder'ları açıkça işaretle (`TODO(content)`).
- Her faz sonunda README güncel olmalı (kurulum, çalıştırma, test, varsayımlar).

---

---

# FAZ 1 — LANDING PAGE (Herkese Açık Site)

**Amaç:** Tamamen çalışan, tasarımı ve içeriği tamamlanmış, SEO ve performans açısından hazır, TR + EN herkese açık site. **Veritabanı, Supabase, auth, gerçek form gönderimi ve admin paneli bu fazda YOKTUR.**

## F1.1 Faz 1 Kapsam Sınırı

**Faz 1'de yapılacaklar:** proje kurulumu, tasarım sistemi, i18n, içerik katmanı, header/footer, ana sayfa, katalog (kategori + ürün detay), kullanım alanı sayfaları, özel üretim, referanslar/projeler, hakkımızda, iletişim sayfası (arayüz), FAQ, yasal sayfalar (placeholder), SEO, JSON-LD, çerez bannerı, GA4+GTM kurulumu (statik event'ler), performans ve erişilebilirlik, temel testler.

**Faz 1'de YAPILMAYACAKLAR:** Supabase bağlantısı, veritabanı, auth, dosya yükleme, talep/iletişim formunun gerçek gönderimi, admin paneli, Turnstile, rate limit.

**Dinamik sayfalar için Faz 1 davranışı:**

- `/talep` ve `/talep/tamamlandi` sayfaları **iskelet olarak** oluşturulur: `noindex`, başlık + metin (bölüm F2.1'deki metinler), "Bu ekran Faz 2'de etkinleştirilecek" şeklinde **net işaretli placeholder** (`TODO(phase-2)`). Tüm CTA'lar bu sayfaya `?urun=` / `?alan=` parametreleriyle doğru şekilde yönlenir.
- İletişim sayfasının formu **arayüz olarak** tamamlanır (alanlar, etiketler, doğrulama mesajları, Zod şeması); gönderimde "Faz 2'de etkinleştirilecek" placeholder davranışı gösterir (kullanıcı verisi hiçbir yere gönderilmez).
- `/admin` rotası oluşturulmaz.

## F1.2 İçerik Katmanı (Faz 3'e hazırlık)

İçerik bileşenlerde sabit olmamalı, ancak CMS henüz yok. Bu yüzden:

- `src/lib/content/` altında **veri erişim arayüzü** oluştur: `getCategories(locale)`, `getProducts(locale, filters)`, `getProductBySlug(locale, slug)`, `getIndustries(locale)`, `getReferences(...)`, `getCaseStudies(...)`, `getFaqs(...)`, `getSiteSettings(locale)`, `getSeo(page, locale)` vb.
- Bu fazda arayüzün arkasındaki uygulama **yerel, tipli veri dosyalarıdır** (TS/JSON; TR + EN alanlar). Bu dosyadaki tüm metinler buraya seed olarak yazılır.
- UI bileşenleri **yalnızca bu arayüzü** kullanır; veri dosyalarını doğrudan import etmez. Böylece Faz 3'te uygulama Supabase'e geçirilirken UI değişmez.
- Veri tipleri (Product, Category, Industry, Reference, CaseStudy, Faq, SeoFields…) Zod ile tanımlanır; bu şemalar Faz 3'te veritabanı şemasına temel olur.
- Yeni dil (DE/FR/IT) eklemek kod değişikliği değil, yapılandırma + içerik girişi olmalı.

## F1.3 Site Haritası ve Navigasyon

```
ANA SAYFA
ÜRÜNLER
  ├─ Bereler
  ├─ Atkılar
  └─ Bere & Atkı Setleri
KULLANIM ALANLARI
  ├─ Futbol & Spor Kulüpleri
  ├─ Taraftar & Fanwear
  ├─ Kurumsal
  ├─ Okullar
  └─ Markalar & Private Label
ÖZEL ÜRETİM
REFERANSLAR / PROJELERİMİZ
HAKKIMIZDA
İLETİŞİM
```

- **Header ana CTA** (menüden görsel olarak ayrışır): `TASARIM TALEBİ OLUŞTUR` → talep ekranı
- Mobilde sticky CTA: aynı buton
- Ayrı sayfalar: `/talep` (talep ekranı), `/talep/tamamlandi` (başarı ekranı). İkisi de `noindex`.

### Ürün kapsamı (bilinçli olarak dar)

- **Bereler:** Klasik, Katlamalı, Ponponlu, Jakarlı, Çocuk, Özel Üretim
- **Atkılar:** Örgü, Jakarlı, Taraftar / Futbol, Kurumsal, Çocuk, Özel Üretim
- **Setler:** Bere + Atkı, Kurumsal, Taraftar, Çocuk

Ana marka konumlandırması bere ve atkı üzerinedir.

## F1.4 Katalog

Katalog bir **referans ürün galerisidir**, mağaza değildir.

- Kategori sayfaları: Bereler, Atkılar, Setler (her biri indexlenebilir landing page)
- Ürün detay sayfası: görseller (galeri), ürün adı, kısa açıklama, özellikler (içerik katmanından gelen alanlar), uygulanabilir özelleştirmeler (renk, desen, logo, etiket), ilgili referans projeler, ürüne özel FAQ
- Fiyat, stok, sepet **gösterilmez**
- Her ürün sayfasında CTA: **"Bu Ürün İçin Talep Oluştur"** → `/talep?urun=<slug>` (talep ekranı o ürün seçili açılır)
- Kategori sayfalarında sade filtreleme (ör. ürün tipi). Aşırı karmaşık filtre ekleme.
- Seed: Bölüm F1.3'teki ürün kapsamına uygun örnek ürünler, `TODO(content)` ile işaretli placeholder görsellerle.

## F1.5 Ana Sayfa

Sıra:

### Hero

- **H1:** Markanıza Özel Bere ve Atkı Üretimi
- **Metin:** Markalar, spor kulüpleri, kurumlar ve topluluklar için özel tasarım bere ve atkılar üretiyoruz. Tasarım detaylarından üretime, private label çözümlerine kadar tüm süreci tek noktadan yönetiyoruz.
- **Primary CTA:** Tasarım Talebi Oluştur
- **Secondary CTA:** Ürünleri İncele
- **Alt güven satırı:** Özel Tasarım · Düşük Minimum Adet · Private Label · Hızlı Üretim · Türkiye'de Üretim
- Hero'da gerçek RDH ürün görselleri.

### Referanslar

- **Başlık:** Markaların ve Takımların Üretim Partneri
- Kullanım izni olan referans logoları (Faz 3'te admin panelden yönetilecek; şimdilik içerik katmanından). Çok logo olduğu için masaüstü ve mobil davranışı ayrı tasarlanır (ör. masaüstünde grid/marquee, mobilde kaydırılabilir şerit).
- Geliştirme sırasında gerçek referans görselleri yoksa net işaretlenmiş placeholder kullan; Gerçek referans görselleri: `public/reference-images/` klasörü altında bulunur.

### Marka anlatısı

- **Başlık:** Tekstil Üretiminin Ötesinde
- **Metin:** RDH Tekstil olarak yalnızca ürün üretmiyoruz. Markaların, takımların ve kurumların kimliğini taşıyan özel bere ve atkı koleksiyonları geliştiriyoruz. Renkten desene, etiketten ürün detaylarına kadar her projeyi ihtiyaca göre şekillendiriyor; tasarımdan üretime kadar süreci tek merkezden yönetiyoruz.

### Ürünler

- **Başlık:** Uzmanlaştığımız Ürünler
- **Metin:** Bere ve atkı üretimine odaklanan uzmanlığımızla farklı kullanım alanlarına, yaş gruplarına ve marka ihtiyaçlarına özel ürünler geliştiriyoruz.
- Ana kartlar:
  - **Bereler** — Farklı örgü, renk, desen ve marka uygulamalarıyla projenize özel bere üretimi. CTA: Bereleri İncele
  - **Atkılar** — Kurumsal kullanımdan taraftar koleksiyonlarına kadar farklı ihtiyaçlara özel atkı üretimi. CTA: Atkıları İncele
- Alt kartlar: Bere & Atkı Setleri

### Talep bölümü

- **Başlık:** Logonu Gönder. Örnek Modelini Al.
- **Metin:** Ürününü seç; logonu, renklerini ve sloganını gönder. Ekibimiz markana özel örnek modelleri ve fiyat teklifini e-posta ile iletsin.
- **CTA:** Tasarım Talebi Oluştur

### Kimler için üretiyoruz

- **Başlık:** Farklı İhtiyaçlara Özel Üretim
- Beş kart, her biri kendi landing page'ine gider: Futbol & Spor Kulüpleri, Taraftar & Fanwear, Kurumsal, Okullar, Markalar & Private Label

### Neden RDH?

- Başlık: **Neden RDH?** — Bölüm 3'teki altı değer önerisi, kısa hâlleriyle:
  - Bere & Atkıda Uzmanlık — Odağımızı bildiğimiz ürünlere veriyoruz.
  - Düşük Minimum Adet — Farklı ölçeklerdeki projelere uygun üretim.
  - Özel Tasarım — Markanıza ve ihtiyacınıza göre şekillendirilen ürünler.
  - Private Label — Markanıza özel ürün ve etiket çözümleri.
  - Hızlı Üretim — Planlı ve esnek üretim süreçleri.
  - Zamanında Teslimat — Baştan sona takip edilen üretim ve sevkiyat.

### Nasıl çalışıyoruz?

- **Başlık:** Fikirden Üretime
- Adımlar (bu bir sıra olduğu için numaralı):
  1. **Talebini Oluştur** — Ürününü, kullanım alanını ve ihtiyacın olan adedi seç.
  2. **Marka Materyallerini Gönder** — Logonu, renklerini, varsa sloganını ve örnek modellerini yükle.
  3. **Örnek Modelini Al** — Ekibimiz örnek modelleri ve fiyat teklifini e-posta ile iletsin.
  4. **Detayları Netleştirelim** — Tasarımı, adedi ve koşulları birlikte kesinleştirelim.
  5. **Üretime Geçelim** — Onay sonrası üretim planlamasını başlatalım.
  6. **Teslim Edelim** — Kalite kontrolü tamamlanan ürünleri planlanan sevkiyata alalım.
- **CTA:** Projenizi Başlatalım

## F1.6 Kullanım Alanı Sayfaları

Her sayfa: H1, kısa metin, ilgili ürünler, o kategoriye ait referanslar (içerik katmanından kategoriye göre otomatik çekilir), ilgili FAQ, CTA.

| Sayfa                    | H1                                    | Metin                                                                                                                                                                                                                                                                    | CTA                             |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| Futbol & Spor Kulüpleri  | Takım Ruhunu Taşıyan Ürünler          | Kulüp kimliğinize özel renk, desen ve logo uygulamalarıyla bere ve atkı koleksiyonları geliştiriyoruz. Taraftar ürünlerinden kulüp koleksiyonlarına kadar farklı ihtiyaçlara uygun üretim çözümleri sunuyoruz.                                                           | Kulübünüz İçin Talep Oluşturun  |
| Taraftar & Fanwear       | Tribünden Sokağa Taşınan Tasarımlar   | Takım renklerini, armaları ve taraftar kültürünü taşıyan özel üretim bere ve atkılar geliştiriyoruz. Klasik taraftar ürünlerinden özel koleksiyonlara kadar farklı projeleri markanıza göre şekillendiriyoruz.                                                           | Taraftar Koleksiyonunu Başlatın |
| Kurumsal                 | Markanızı Taşıyan Kurumsal Tekstil    | Çalışan kitleri, etkinlikler, kurumsal hediyeler ve marka koleksiyonları için kurumsal kimliğinize özel bere ve atkılar üretiyoruz. Renk, logo, desen ve etiket detaylarını markanızın görsel dünyasına göre şekillendiriyoruz.                                          | Kurumsal Projenizi Başlatın     |
| Okullar                  | Okul Kimliğini Taşıyan Özel Ürünler   | Okullar, öğrenci toplulukları ve okul takımları için kurum renklerine ve kimliğine özel bere ve atkı koleksiyonları üretiyoruz.                                                                                                                                          | Okulunuz İçin Talep Oluşturun   |
| Markalar & Private Label | Sizin Markanız. Sizin Koleksiyonunuz. | Kendi markası altında bere ve atkı koleksiyonu geliştirmek isteyen işletmeler için özel üretim ve private label çözümleri sunuyoruz. Ürün modelinden renk ve desene, marka uygulamasından etikete kadar koleksiyonun temel detaylarını markanıza göre şekillendiriyoruz. | Koleksiyonunuzu Konuşalım       |

- Futbol & Spor Kulüpleri sayfasında gösterilecekler: kulüp atkıları, bereler, bere + atkı setleri, logo uygulamaları, renk/desen seçenekleri, private label, bu kategorideki gerçek RDH referansları.
- Taraftar sayfasında mümkün olduğunca gerçek tribün / ürün / final üretim görselleri kullanılır.
- Tüm CTA'lar talep ekranına gider ve kullanım alanını `?alan=<slug>` ile taşır.

## F1.7 Özel Üretim Sayfası

- **H1:** Markanız İçin Üretilir.
- **Giriş:** Hazır bir ürüne logo eklemekten daha fazlasını yapıyoruz. Renk, desen, örgü, etiket ve ürün detaylarını projenizin ihtiyaçlarına göre şekillendiriyoruz.
- **Alt başlıklar:**
  - Renk & İplik — Marka kimliğinize ve tasarımınıza uygun renk kombinasyonları.
  - Desen & Örgü — Ürüne ve kullanım alanına uygun farklı örgü ve desen seçenekleri.
  - Logo Uygulamaları — Tasarıma ve ürüne uygun farklı marka uygulamaları.
  - Özel Etiket — Markanıza özel etiket çözümleri.
  - Private Label — Ürünlerin müşterinin kendi markası altında hazırlanabilmesi.
- **CTA:** Özel Üretim Talebi Oluştur

## F1.8 Referanslar / Projelerimiz

İki katmanlı yapı:

1. **Referans Markalar:** logo grid
2. **Projeler:** gerçek üretimlerin case study olarak sunumu

**Case study alanları :** Müşteri / Marka, Sektör, Ürün, Ülke, Proje ihtiyacı, RDH çözümü, Ürün özellikleri, Görseller, Final ürün, Adet (paylaşılması uygunsa).

**Filtre kategorileri:** Futbol / Taraftar / Kurumsal / Okul / Private Label / Diğer

Kullanım alanı sayfalarında ilgili referanslar kategoriye göre otomatik listelenir.

## F1.9 Hakkımızda

- **H1:** Üretimin Ötesinde Bir İş Ortağı
- **Metin:** RDH Tekstil; markalar, spor kulüpleri ve kurumlar için özel üretim bere ve atkı çözümleri geliştirir. Her projeyi yalnızca üretilecek bir tekstil ürünü olarak değil, markanın kimliğini taşıyan bir parça olarak ele alıyoruz. Tasarım, üretim ve private label süreçlerini aynı yapı içerisinde yöneterek müşterilerimize uçtan uca üretim desteği sunuyoruz. Esnek üretim yaklaşımımız sayesinde farklı ölçeklerdeki projelere cevap verirken kalite, iletişim ve teslimat süreçlerini baştan sona takip ediyoruz.
- **Ara başlık:** Sizin Markanız. Sizin Tasarımınız. Bizim Üretimimiz.
- **Ara metin:** Ürünlerimizin merkezinde müşterimizin markası vardır. Renk, desen, ürün ve etiket detaylarını her projenin kendi ihtiyaçlarına göre şekillendiriyoruz.

## F1.10 İletişim Sayfası (arayüz — gönderim Faz 2'de)

- **H1:** Projenizi Konuşalım.
- **Metin:** Yeni bir bere veya atkı projesi üzerinde çalışıyorsanız ihtiyacınızı bizimle paylaşın. Ekibimiz ürün, adet, tasarım ve üretim detaylarını değerlendirerek sizinle iletişime geçsin.
- **Form (kısa, mesaj odaklı):** Ad Soyad, Firma, E-posta, Telefon, Ülke, İlgilendiğiniz Ürün, Tahmini Adet, Mesaj → CTA: **Projemi Gönder**
- Ayrıca: Telefon / WhatsApp, E-mail, Adres, Harita, Sosyal medya
- Logo/renk göndermek isteyenler için belirgin yönlendirme: "Logo ve renklerinizi göndermek için Tasarım Talebi Oluştur"
- Faz 1'de form yalnızca arayüz + istemci tarafı Zod doğrulamasıdır (bkz. F1.1).

## F1.11 Footer

- RDH logo
- Alt satır: `CUSTOM SCARVES & BEANIES`
- **Ürünler:** Bereler, Atkılar, Setler
- **Kullanım Alanları:** Futbol & Spor Kulüpleri, Taraftar, Kurumsal, Okullar, Private Label
- **RDH:** Hakkımızda, Özel Üretim, Referanslar, İletişim
- **Yasal:** KVKK, Gizlilik Politikası, Çerez Politikası, Aydınlatma Metni
- Dil seçici ve sosyal medya bağlantıları

## F1.12 Yasal Sayfalar ve Çerez Onayı

- KVKK Aydınlatma Metni, Gizlilik Politikası, Çerez Politikası sayfaları (metinler RDH'den gelecek, `TODO(content)` placeholder bırak; içerik katmanından okunur, Faz 3'te admin panelden düzenlenecek).
- Çerez onay bannerı: onay verilmeden analytics/pazarlama çerezleri yüklenmez. Tercih daha sonra değiştirilebilir (footer bağlantısı).

## F1.13 Dil Altyapısı

- Faz 1: **Türkçe + İngilizce**. Sitenin ana dili Türkçe'dir. İngilizce ikinci dil olarak eklenmelidir.
- Altyapı ileride DE / FR / IT eklemeye uygun kurulmalı (`/de/` gibi). Yeni dil eklemek kod değişikliği değil, yapılandırma + içerik girişi olmalı.
- URL yapısı: `/tr/...`, `/en/...`
- Her dil için bağımsız yönetilebilen (içerik katmanında alan olarak tanımlı): URL (slug), Title, Meta Description, H1, Canonical, Hreflang, Open Graph (title, description, image)
- Dil seçici header ve footer'da.
- Hata mesajları ve form metinleri (iletişim formu dahil) iki dilde.

## F1.14 SEO

- Her ana ürün ve kullanım alanı bağımsız, indexlenebilir landing page.
- Örnek TR URL'ler: `/bere-uretimi/`, `/atki-uretimi/`, `/taraftar-atkisi/`, `/futbol-kulubu-atkisi/`, `/kurumsal-bere-atki/`, `/okul-bere-atki/`, `/private-label-bere-atki/`, `/bere-atki-uretici/`
- İngilizce karşılıkları ayrı URL'lerde (ör. `/en/beanie-manufacturing/`, `/en/scarf-manufacturing/`)
- `sitemap.xml`, `robots.txt`, canonical, hreflang, JSON-LD (Organization, Product/ItemList, BreadcrumbList, FAQPage)
- `/talep`, `/talep/tamamlandi` → `noindex`
- Her ana landing page'de ilgili FAQ bölümü.

### Genel FAQ başlangıç içeriği

- **Minimum sipariş adedi nedir?** Minimum sipariş adedi ürün ve üretim detaylarına göre değişebilir. Ürününüzü ve ihtiyacınız olan adedi paylaştığınızda ekibimiz uygun üretim seçeneklerini iletecektir.
- **Kendi logomuzu kullanabilir miyiz?** Evet. Logo, renk ve tasarım detayları markanıza göre uygulanabilir.
- **Kendi markamızla üretim yapabilir misiniz?** Evet. Private label projelerde ürün ve etiket detayları markanıza göre özelleştirilebilir.
- **Üretim süresi ne kadar?** Üretim süresi ürün, adet ve tasarım detaylarına göre değişmektedir. Proje kapsamı netleştikten sonra termin bilgisi teklif aşamasında paylaşılır.
- **Yurt dışına gönderim yapıyor musunuz?** Uluslararası projeler için teslimat seçenekleri proje ve ülkeye göre değerlendirilmektedir.
- **Tasarımım yoksa ne yapmalıyım?** Logonuzu ve ihtiyacınızı talep ekranından paylaşabilirsiniz; ekibimiz örnek modelleri hazırlayıp e-posta ile iletecektir.

## F1.15 Analytics (Faz 1 kısmı)

GA4 + GTM kurulur; tüm etiketler çerez onayına bağlıdır. Faz 1'de uygulanacak `dataLayer` event'leri:

| Event             | Tetiklenme                         |
| ----------------- | ---------------------------------- |
| `view_product`    | Ürün detay sayfası görüntüleme     |
| `view_industry`   | Kullanım alanı sayfası görüntüleme |
| `view_case_study` | Proje / case study görüntüleme     |
| `whatsapp_click`  | WhatsApp bağlantısı tıklaması      |
| `email_click`     | E-posta bağlantısı tıklaması       |

Form ve talep event'leri Faz 2'dedir. Event'lerde kişisel veri (ad, e-posta, telefon) **gönderilmez.**

## F1.16 Performans ve Erişilebilirlik

- Mobile-first, tam responsive
- Görseller WebP/AVIF, `next/image` ile boyutlandırma, lazy loading
- CDN ve cache stratejisi, optimize JS/CSS, Core Web Vitals hedefli geliştirme (LCP < 2.5 sn, CLS < 0.1 hedefi)
- WCAG 2.1 AA'ya uygun kontrast ve klavye erişimi; `prefers-reduced-motion` desteği
- Statik sayfalar mümkün olduğunca statik üretilir (SSG/ISR); içerik katmanı bunu desteklemeli.

## F1.17 Faz 1 Çalışma Aşamaları

**1A — Kurulum:** Proje iskeleti, yığın kurulumu, ESLint/Prettier, `.env.example`, README (kurulum, çalıştırma, test), temel CI.
**1B — Tasarım sistemi ve altyapı:** Renk/tipografi/spacing token'ları (bölüm 4), shadcn/ui temeli, i18n (TR/EN), içerik katmanı + seed veri, header/footer, dil seçici, çerez bannerı.
**1C — Sayfalar:** Ana sayfa, katalog (kategori + ürün detay), kullanım alanı sayfaları, özel üretim, referanslar/projeler, hakkımızda, iletişim (arayüz), yasal sayfalar, `/talep` ve `/talep/tamamlandi` iskeletleri.
**1D — SEO, analytics, performans:** Meta/hreflang/canonical/OG, sitemap, robots, JSON-LD, GTM + event'ler, görsel optimizasyonu, erişilebilirlik kontrolü.
**1E — Test ve teslim:** Birim testler (içerik katmanı, Zod şemaları) + Playwright smoke testleri (TR/EN gezinme, ürün → `/talep?urun=` yönlendirmesi, mobil görünüm), Lighthouse kontrolü, README.

## F1.18 Faz 1 Kabul Kriterleri

1. Ziyaretçi TR ve EN sitede tüm sayfaları gezebilir; ürün ve kullanım alanı sayfalarındaki CTA'lar `/talep?urun=` / `?alan=` ile iskelet talep sayfasına gider.
2. Site profesyonel, modern, kullanıcı dostu; tasarım referansına (furevo.com) ve bölüm 4'e uygun.
3. Site 100% responsive, mobile-first.
4. Her sayfada title, meta description, H1, canonical, hreflang, OG alanları dil bazlı tanımlıdır; `sitemap.xml` ve `robots.txt` çalışır; JSON-LD doğrudur.
5. Tüm metinler i18n / içerik katmanından gelir; bileşenlerde sabit metin yoktur.
6. Çerez onayı verilmeden analytics yüklenmez.
7. Core Web Vitals hedefleri (LCP < 2.5 sn, CLS < 0.1) ve WCAG 2.1 AA kontrast/klavye gereksinimleri karşılanır.
8. Lint, typecheck, birim ve Playwright smoke testleri geçer; README ile proje sıfırdan kurulup çalıştırılabilir.
9. Yasak copy kalıpları ("numune" vb.) hiçbir yerde yoktur.

## ⛔ FAZ 1 ONAY KAPISI

Faz 1 bittiğinde **dur**, bölüm 0'daki **Faz Teslim Raporu**'nu yaz ve şunu sor: _"Faz 1'i (Landing Page) onaylıyor musunuz? Onay verirseniz Faz 2'ye (Dinamik Alanlar) geçeceğim."_ Açık onay gelmeden Faz 2'ye başlama.

---

---

# FAZ 2 — DİNAMİK ALANLAR (Supabase, Auth, Talep Ekranı)

**Ön koşul:** Faz 1 onaylanmış ve `main`'e birleştirilmiş olmalı.

**Amaç:** Supabase entegrasyonu, güvenli dosya yükleme, adım adım Talep Ekranı, Başarı Ekranı, çalışan İletişim formu ve auth altyapısı. **Admin paneli arayüzü bu fazda YOKTUR** (Faz 3); ancak gönderilen veriler veritabanında doğru şekilde saklanır ve auth altyapısı hazırdır.

## F2.1 Faz 2 Kapsam Sınırı

**Faz 2'de yapılacaklar:** Supabase kurulumu, şema + migration + RLS, seed, storage (private), upload doğrulama servisi, Talep Ekranı, Başarı Ekranı, İletişim formu gönderimi, güvenlik katmanları, KVKK onay kaydı, form analytics event'leri, auth altyapısı (admin kullanıcı seed, giriş sayfası, rota koruması, dosya erişim ucu).

**Faz 2'de YAPILMAYACAKLAR:** Admin paneli ekranları (talep listesi/detay, içerik yönetimi vb.), içerik katmanının (katalog, SEO vb.) Supabase'e taşınması. Katalog içeriği Faz 1'deki yerel içerik katmanından gelmeye devam eder.

## F2.2 Supabase Altyapısı

- Supabase CLI ile migration'lar; yerel geliştirme `supabase start` ile çalışır; README'de adım adım anlatılır.
- Başlangıç tabloları (bölüm F2.10 veri modeli): `requests`, `request_files`, `contact_messages`, `form_options` (adet aralıkları, ülke listesi), `admin_profiles` (veya Supabase Auth user metadata).
- **RLS açık:** anonim kullanıcı hiçbir tabloyu doğrudan okuyamaz/yazamaz. Talep ve iletişim kaydı **yalnızca sunucu tarafı (service role, yalnızca server code)** üzerinden oluşturulur. `service_role` anahtarı hiçbir zaman istemciye gitmez.
- Storage: **private** bucket. Public erişim yok.
- Seed: ilk admin kullanıcı (seed script, e-posta/parola env'den), `form_options` başlangıç verisi (adet aralıkları: 50–99, 100–249, 250–499, 500–999, 1.000–2.499, 2.500+; ülke listesi).
- Talep numarası okunabilir sıra no olarak üretilir (ör. `RDH-2026-000123`).

## F2.3 Talep Ekranı (`/talep`)

Sitenin ana işlevidir. Standart iletişim formu gibi değil, **adım adım ilerleyen, mobilde rahat tamamlanan** bir akış olarak tasarla. Faz 1'deki iskeletin yerini alır.

### Alanlar

| Adım | Alan                                  | Notlar                                                                                                                                              | Zorunlu              |
| ---- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 1    | Ne tasarlamak istiyorsunuz?           | Bere / Atkı / Bere + Atkı Seti. Katalogdan gelindiyse ürün/model önceden seçili.                                                                    | Evet                 |
| 2    | Model                                 | Katalogdaki modellerden seçim (opsiyonel; "Henüz karar vermedim" seçeneği olsun)                                                                    | Hayır                |
| 3    | Marka renkleri                        | Ana renk, ikinci renk, varsa üçüncü renk. Renk seçici + HEX veya Pantone kodu girişi.                                                               | Ana renk: Evet       |
| 4    | Logo                                  | PNG / JPG / SVG / PDF. Yardım metni: _En iyi sonuç için yüksek çözünürlüklü veya vektörel logonuzu yükleyin._                                       | Hayır                |
| 5    | Slogan / yazı                         | Ürüne uygulanması istenen metin                                                                                                                     | Hayır                |
| 6    | Örnek model / referans                | Beğenilen ürün, mevcut ürün fotoğrafı veya tasarım dosyası. Çoklu dosya.                                                                            | Hayır                |
| 7    | Tahmini adet                          | Seçenekler `form_options` tablosundan gelir (Faz 3'te admin panelden yönetilecek). Başlangıç: 50–99, 100–249, 250–499, 500–999, 1.000–2.499, 2.500+ | Evet                 |
| 8    | İstenen teslim tarihi                 | Tarih seçici                                                                                                                                        | Hayır                |
| 9    | Ek not                                | Serbest metin                                                                                                                                       | Hayır                |
| 10   | Ad Soyad                              |                                                                                                                                                     | Evet                 |
| 11   | Firma                                 |                                                                                                                                                     | Evet                 |
| 12   | E-posta                               | Yanıt kanalı olduğu için format doğrulaması şart                                                                                                    | Evet                 |
| 13   | Telefon / WhatsApp                    |                                                                                                                                                     | Evet                 |
| 14   | Ülke                                  | Liste                                                                                                                                               | Evet                 |
| 15   | KVKK / Gizlilik bilgilendirmesi onayı | Pazarlama izni **zorunlu değil** ve ayrı, işaretsiz checkbox olabilir                                                                               | Evet (bilgilendirme) |

**Başlık:** Tasarımınızı Üretime Taşıyalım.
**Metin:** Projenizle ilgili birkaç bilgiyi paylaşın. Ekibimiz tasarımınızı ve ihtiyacınızı değerlendirerek örnek modeller ve fiyat teklifi için sizinle iletişime geçsin.
**Gönder butonu:** Talebimi Gönder

### Davranış kuralları

- Logo zorunlu değil; yüklemeden de talep gönderilebilir.
- Her dosya için ad, boyut ve (görselse) küçük önizleme gösterilir; kaldırılabilir.
- Yükleme sırasında ilerleme göstergesi. Yükleme hatasında anlaşılır mesaj ve tekrar deneme.
- Hatalar alan bazlı: hangi alan, ne eksik, nasıl düzeltilir.
- Kullanıcı sayfadan ayrılıp dönerse alan değerleri korunur (dosyalar hariç; dosyalar için uyarı göster).
- Çift gönderimi engelle (butonu kilitle + sunucuda idempotency).
- Mobilde: galeriden/kameradan dosya seçme, büyük dokunma alanları, tek sütun.
- Gönderim başarısız olursa kullanıcı verisi kaybolmamalı; yeniden deneme sun.
- Talep ekranına gelen `?urun=` ve `?alan=` parametreleri ilgili alanları önceden doldurur.
- Tüm metinler ve hata mesajları TR + EN.
- Dosya yükleme bileşeni yalnızca `/talep` sayfasında yüklenir (code splitting).
- Dosya yüklemede ayrı kısa bilgilendirme: "Yüklediğiniz dosyalar yalnızca talebinizi değerlendirmek için kullanılır".
- Talep formunda KVKK bilgilendirme metni bağlantısı (Faz 1'deki yasal sayfa).

### Başarı ekranı (`/talep/tamamlandi`)

"Formunuz başarıyla gönderilmiştir." gibi standart ifade **kullanılmaz.**

- **Başlık:** Talebinizi Aldık.
- **Metin:** Logonuz, renkleriniz ve proje detaylarınız RDH ekibine iletildi. Ekibimiz talebinizi inceleyerek örnek modelleri ve fiyat teklifini kısa süre içinde e-posta ile gönderecektir.
- Kullanıcının girdiği e-posta adresi ekranda gösterilir.
- **CTA:** Diğer Ürünleri İncele
- Bu sayfaya doğrudan URL ile girilirse ana sayfaya yönlendir (yalnızca başarılı gönderimden sonra erişilebilir).
- "Kısa süre içinde" ifadesi ve tüm metin içerik katmanından gelir (Faz 3'te admin panelden düzenlenebilir olacak; şimdiden yapılandırılabilir alan olarak tasarla).

## F2.4 İletişim Formu Gönderimi

- Faz 1'deki iletişim formu arayüzü gerçek gönderime bağlanır; kayıtlar `contact_messages` tablosuna yazılır.
- Aynı güvenlik (Turnstile, honeypot, rate limit) ve KVKK kuralları geçerlidir; KVKK onay kaydı (zaman + metin sürümü) saklanır.

## F2.5 Dosya Yükleme Güvenliği ve Veri

Müşteriler marka dosyası yükleyeceği için upload standart medya alanı gibi ele alınmaz.

- Sunucu tarafı **dosya tipi** doğrulaması (uzantı + MIME + magic bytes). İzinli: PNG, JPG/JPEG, SVG, PDF (ve gerekirse WebP). SVG yüklemelerinde script/harici referanslar temizlenir (sanitize); SVG hiçbir zaman satır içi çalıştırılmaz.
- İstemci tarafında da aynı tip/boyut kontrolü yapılır (anlaşılır hata mesajıyla); ancak asıl doğrulama sunucudadır.
- **Boyut limiti:** dosya başına 10 MB, talep başına en fazla 10 dosya (ortam değişkeniyle ayarlanabilir)
- **Zararlı dosya kontrolü:** tarama için adaptör/hook (ör. ClamAV); geliştirmede no-op, üretimde etkinleştirilebilir
- **Private storage:** dosyalar public erişime kapalı; yalnızca doğrulanmış admin oturumu üzerinden, kısa ömürlü imzalı URL veya sunucu üzerinden stream ile erişilir (erişim ucu bu fazda yazılır ve test edilir)
- Dosya adları rastgele/tahmin edilemeyen anahtarlarla saklanır; orijinal ad yalnızca veritabanında tutulur
- **Rate limiting** (talep ve iletişim formu uçları, giriş ucu) + **bot/spam koruması** (Turnstile/hCaptcha) + honeypot alanı
- API anahtarları ve gizli bilgiler yalnızca sunucuda
- Saklama süresi politikası: yapılandırılabilir süre sonunda otomatik silme için hazır bir job/script (varsayılan kapalı)
- Silme mekanizması: talep silindiğinde veritabanı kaydı **ve** dosyalar kalıcı silinir (servis fonksiyonu bu fazda yazılır; arayüzü Faz 3'te)
- Güvenlik başlıkları (CSP, HSTS, X-Content-Type-Options, frame koruması), CSRF koruması, girdi/çıktı kaçışlama

### KVKK / GDPR

- Talep ve iletişim formunda bilgilendirme metni, dosya yüklemede ayrı kısa bilgilendirme
- Teklif talebi için **pazarlama izni zorunlu kılınmaz**
- Onay kaydı (zaman + metin sürümü) talep ile birlikte saklanır

## F2.6 Auth Altyapısı (arayüzü Faz 3'te)

- Supabase Auth ile e-posta + parola giriş; güvenli oturum (SSR cookie), çıkış.
- Minimal `/admin/login` sayfası (sade, Türkçe) + giriş denemelerinde rate limit.
- İlk admin kullanıcı seed script ile oluşturulur.
- `/admin/*` ve tüm admin API rotaları middleware ile yetkisiz erişime kapalı; `noindex`. Girişten sonra geçici bir "Admin paneli Faz 3'te eklenecek" sayfası gösterilir.
- Yetki kontrolü hem middleware'de hem de her sunucu fonksiyonunda yapılır (savunma derinliği).
- Panelden admin ekleme/silme/parola değiştirme **Faz 3**'tedir.

## F2.7 Analytics (Faz 2 kısmı)

Faz 1'deki GA4 + GTM kurulumuna, çerez onayına bağlı olarak şu event'ler eklenir:

| Event              | Tetiklenme                     |
| ------------------ | ------------------------------ |
| `start_request`    | Talep ekranının açılması       |
| `select_product`   | Ürün tipi seçimi               |
| `select_model`     | Model seçimi                   |
| `select_color`     | Renk girişi                    |
| `upload_logo`      | Logo yükleme                   |
| `upload_reference` | Örnek model/referans yükleme   |
| `submit_request`   | Talebin başarıyla gönderilmesi |
| `contact_submit`   | İletişim formu gönderimi       |

Event'lerde kişisel veri (ad, e-posta, telefon) **gönderilmez.**

## F2.8 Faz 2 Çalışma Aşamaları

**2A — Supabase ve veri:** Supabase CLI kurulumu, migration'lar, RLS, seed (admin + form seçenekleri), `.env.example` güncellemesi, README (Supabase yerel kurulum).
**2B — Upload altyapısı:** Storage (private bucket), upload doğrulama servisi (tip, boyut, magic bytes, SVG sanitize), tarama adaptörü (no-op), erişim ucu.
**2C — Talep sistemi:** Adım adım Talep Ekranı, dosya yükleme UI, Zod ortak şema, sunucu doğrulaması, idempotency, kayıt oluşturma, başarı ekranı, `?urun=`/`?alan=` ön doldurma, form event'leri.
**2D — İletişim formu ve güvenlik:** İletişim formu gönderimi, Turnstile, honeypot, rate limit, güvenlik başlıkları, CSRF.
**2E — Auth altyapısı:** Supabase Auth, giriş sayfası, middleware, yetkisiz erişim kapatma, dosya erişim ucu yetkilendirmesi.
**2F — Test ve teslim:** Birim + e2e testler (en az: talep gönderimi, dosya doğrulama reddi, çift gönderim engeli, iletişim formu gönderimi, admin girişi, yetkisiz erişim, yetkisiz dosya erişimi), mobil akış kontrolü, README güncelleme.

## F2.9 Faz 2 Kabul Kriterleri

1. Telefondan: ürün seç → renk gir → galeriden logo yükle → talebi gönder → başarı ekranını gör akışı sorunsuz tamamlanır.
2. Ürün sayfasından `/talep?urun=<slug>` ile ürün seçili açılır; `?alan=<slug>` kullanım alanını ön doldurur.
3. İzin verilmeyen dosya tipi, limit üstü dosya ve zararlı içerik hem sunucuda hem de istemcide reddedilir; kullanıcıya anlaşılır hata gösterilir.
4. Gönderilen her talep ayrı kayıt olarak saklanır (KVKK onay zamanı + metin sürümü dahil); dosyalar public erişime kapalı bir depoda tutulur.
5. Aynı e-posta ile gelen ikinci talep yeni kayıt olur; çift tıklama/çift gönderim tek kayıt üretir.
6. İletişim formu mesajları `contact_messages` tablosuna yazılır.
7. Giriş yapmamış biri `/admin`'e ya da herhangi bir dosya URL'sine erişemez; rate limit ve bot koruması çalışır.
8. Başarı ekranına doğrudan URL ile girilirse ana sayfaya yönlendirilir.
9. `service_role` anahtarı ve diğer gizli bilgiler istemci koduna sızmaz.
10. Lint, typecheck, birim ve e2e testler geçer; README ile Supabase dahil sıfırdan kurulum yapılabilir.

## F2.10 Veri Modeli (Faz 2 başlangıç şeması)

SQL migration'ları bu taslaktan türet; ihtiyaca göre netleştir. (Supabase Auth kullanıcıları `auth.users`'ta tutulur; ayrı `passwordHash` alanı **yoktur.**)

```
admin_profiles   id (auth.users.id), name, createdAt

requests         id, number (okunabilir sıra no), createdAt, locale,
                 productType (BERET|SCARF|SET), productSlug?, modelSlug?, industry?,
                 color1, color2?, color3?, slogan?, quantityRange, desiredDate?, note?,
                 fullName, company, email, phone, country,
                 privacyConsentAt, privacyConsentVersion, marketingConsent (bool),
                 status (NEW|IN_REVIEW|REPLIED), internalNote?, readAt?,
                 idempotencyKey (unique)

request_files    id, requestId, kind (LOGO|REFERENCE|OTHER), originalName,
                 storageKey (tahmin edilemeyen), mimeType, sizeBytes, createdAt

contact_messages id, createdAt, locale, fullName, company?, email, phone?, country?,
                 productInterest?, quantityRange?, message,
                 privacyConsentAt, privacyConsentVersion,
                 status, readAt?

form_options     id, type (quantity|country), value, labelTr, labelEn, sortOrder, isActive
```

Her talep kendi kaydıdır; aynı e-posta ile gelen ikinci talep yeni kayıt olur. `productSlug`/`modelSlug`, Faz 1'deki içerik katmanındaki slug'lara referans verir (Faz 3'te katalog DB'ye taşınınca gerçek foreign key'e dönüştürülür).

## ⛔ FAZ 2 ONAY KAPISI

Faz 2 bittiğinde **dur**, bölüm 0'daki **Faz Teslim Raporu**'nu yaz ve şunu sor: _"Faz 2'yi (Dinamik Alanlar) onaylıyor musunuz? Onay verirseniz Faz 3'e (Admin Paneli) geçeceğim."_ Açık onay gelmeden Faz 3'e başlama.

---

---

# FAZ 3 — ADMIN PANELİ VE İÇERİK YÖNETİMİ

**Ön koşul:** Faz 2 onaylanmış ve `main`'e birleştirilmiş olmalı.

**Amaç:** RDH/Glocal ekibinin gelen talepleri eksiksiz görüntüleyip yönetebildiği, ayrıca site içeriğini yazılımcı desteği olmadan değiştirebildiği admin paneli; ardından final test ve teslim.

## F3.1 Admin Paneli (`/admin`)

Yalnızca yetkili RDH/Glocal kullanıcıları içindir. Panelin ana amacı: **gelen her talebi ayrı bir kayıt olarak saklamak ve eksiksiz göstermek.**

Admin arayüzü Türkçe, sade ve masaüstü öncelikli (mobilde de kullanılabilir olmalı). Tüm `/admin` ve admin API rotaları yetkisiz erişime kapalı; `noindex`.

### F3.1.1 Kimlik doğrulama ve kullanıcı yönetimi

- Faz 2'deki auth altyapısı üzerine inşa edilir: e-posta + parola giriş, güvenli oturum, çıkış, giriş rate limit.
- Panelden admin kullanıcı **ekleme/silme/parola değiştirme** (son admin silinemez).

### F3.1.2 Talepler listesi

- Her talep ayrı satır: talep no, tarih, ad soyad, firma, e-posta, ürün, adet aralığı, ülke, dil, durum
- Arama (ad, firma, e-posta), filtre (tarih aralığı, ürün tipi, durum, dil), sıralama, sayfalama
- Yeni (okunmamış) talepler belirgin

### F3.1.3 Talep detay sayfası

Her talep için **gönderilen her şey** tek ekranda:

- **Müşteri bilgileri:** ad soyad, firma, e-posta (tıklanınca `mailto:`), telefon/WhatsApp (tıklanınca `tel:`/`wa.me`), ülke, site dili
- **Talep detayları:** ürün tipi, model, kullanım alanı (geldiği sayfadan), renkler (renk kutusu + HEX/Pantone), slogan, tahmini adet, istenen teslim tarihi, ek not
- **Dosyalar:** yüklenen logo, örnek model ve diğer dosyalar; görseller için önizleme/lightbox, her dosya için indirme; "Tümünü zip olarak indir"
- **Meta:** gönderim tarihi/saati, KVKK onay kaydı (onay metni sürümü + zaman), pazarlama izni (verildiyse)
- **Durum:** `Yeni` → `İnceleniyor` → `Yanıtlandı` (yalnızca üç basit durum; başka pipeline aşaması ekleme)
- **İç not:** ekibin kendi aralarında not alabileceği serbest alan (müşteri görmez)
- **Sil:** talebi ve ilişkili dosyaları kalıcı siler (onay penceresiyle; veritabanı kaydı **ve** dosyalar silinir)
- Aynı e-postadan gelen önceki talepler küçük bir bağlantı listesi olarak gösterilebilir.
- Talep detayı ilk açıldığında `readAt` işaretlenir.

### F3.1.4 İletişim mesajları

- İletişim sayfasından gelen mesajlar ayrı sekmede listelenir ve aynı mantıkla görüntülenir (basit liste + detay: durum, okundu bilgisi, silme).

## F3.2 İçerik Yönetimi (CMS)

RDH/Glocal ekibi yazılımcı desteği almadan şunları değiştirebilmeli. **İçerik kodda sabit olmamalı.**

- Ürün kategorileri, ürünler, ürün modelleri, görseller, özellikler
- Kullanım alanı sayfa içerikleri
- Referans logoları ve case study'ler
- FAQ
- CTA metinleri, başarı ekranı metni ("kısa süre içinde" ifadesi dahil)
- Talep formundaki adet seçenekleri, ülke listesi
- Header/footer içerikleri
- Yasal sayfa metinleri (KVKK, Gizlilik, Çerez, Aydınlatma)
- SEO alanları (her dil için: slug, Title, Meta Description, H1, Canonical, Hreflang, Open Graph)
- Tüm TR/EN çeviriler (otomatik çeviri kullanılsa bile elle düzenlenebilir)
- Blog: altyapı hazır tutulabilir ama ilk teslim için zorunlu değil

### Geçiş stratejisi (kritik)

- Faz 1'deki **içerik katmanı arayüzü** (`getProducts`, `getFaqs`, `getSeo` vb.) **korunur**; arkasındaki uygulama yerel dosyalardan Supabase'e geçirilir. **UI bileşenleri değişmemelidir.**
- Faz 1 seed verisi (bu dosyadaki tüm metinler dahil) migration/seed script ile veritabanına aktarılır.
- Görseller Supabase Storage'a (bu içerik için public okunabilir ayrı bucket; müşteri yüklemeleri bucket'ından ayrı) taşınır; `public/product-images/` ve `public/reference-images/` içindekiler seed ile yüklenebilir.
- Admin'de yapılan içerik değişikliği sonrası ilgili sayfalar yeniden doğrulanır (ISR revalidate / on-demand revalidation); performans (Faz 1 hedefleri) bozulmamalı.
- Yeni dil eklemek yapılandırma + içerik girişi olarak kalmalı.
- Faz 2'deki `productSlug`/`modelSlug` alanları gerçek foreign key'lere dönüştürülür (veri kaybı olmadan).

## F3.3 Faz 3 Çalışma Aşamaları

**3A — Admin iskeleti:** Admin layout/navigasyon, kullanıcı yönetimi (ekle/sil/parola).
**3B — Talepler:** Liste (arama/filtre/sıralama/sayfalama), detay, dosya önizleme + indirme + zip, durum, iç not, silme, okundu işareti, iletişim mesajları sekmesi.
**3C — İçerik yönetimi:** CMS tabloları + migration, içerik katmanının Supabase uygulaması, seed aktarımı, katalog/referans/case study/FAQ/metin/form seçenekleri/yasal sayfa/SEO yönetim ekranları, revalidation.
**3D — Sertleştirme ve saklama:** Saklama süresi job'ının (varsayılan kapalı) admin ayarı, yetki ve RLS gözden geçirmesi, güvenlik başlıkları son kontrol.
**3E — Test ve teslim:** Tüm projeyi kapsayan birim + e2e testler (en az: talep gönderimi, dosya doğrulama reddi, admin girişi, yetkisiz erişim, dosya erişimi, silme, içerik değişikliğinin sitede görünmesi), mobil kontrol, performans/erişilebilirlik yeniden ölçümü, README ve dağıtım notları.

## F3.4 Faz 3 / Proje Genel Kabul Kriterleri

Proje, aşağıdakilerin hepsi sağlandığında tamamdır:

1. Ziyaretçi TR ve EN sitede katalogu gezebilir; ürün sayfasından talep ekranına ürün seçili geçebilir.
2. Telefondan: ürün seç → renk gir → galeriden logo yükle → talebi gönder → başarı ekranını gör akışı sorunsuz tamamlanır.
3. İzin verilmeyen dosya tipi, limit üstü dosya ve zararlı içerik hem sunucuda hem de istemcide reddedilir; kullanıcıya anlaşılır hata gösterilir.
4. Gönderilen her talep ayrı kayıt olarak saklanır; dosyalar public erişime kapalı bir depoda tutulur.
5. Admin, giriş yaptıktan sonra talepleri listeleyebilir, aramalı/filtreli bulabilir; talep detayında müşteri bilgilerini, talep detaylarını, renkleri, sloganı ve yüklenen tüm görselleri görüp indirebilir.
6. Giriş yapmamış biri `/admin`'e ya da herhangi bir dosya URL'sine erişemez.
7. Admin durum değiştirebilir, iç not ekleyebilir, talebi (dosyalarıyla) kalıcı silebilir.
8. Her sayfada title, meta description, H1, canonical, hreflang, OG alanları dil bazlı **admin panelden** yönetilebilir; `sitemap.xml` ve `robots.txt` çalışır.
9. Admin panelden katalog, referans, case study, FAQ, metinler, form seçenekleri ve yasal sayfalar yazılımcı desteği olmadan düzenlenebilir; değişiklikler sitede görünür.
10. README ile proje sıfırdan kurulup çalıştırılabilir; testler geçer.
11. Site profesyonel, modern, kullanıcı dostu ve kullanıcıya uygun tasarıma sahip; son web trend ve standartlarına uygun.
12. Site 100% responsive, mobile-first.
13. Site SEO dostu; SEO alanları dil bazlı yönetilebilir.
14. Site performansı iyi; Core Web Vitals hedeflerine uygun.

## ⛔ FAZ 3 ONAY KAPISI (Final)

Faz 3 bittiğinde **dur**, bölüm 0'daki **Faz Teslim Raporu**'nu yaz (ek olarak: 14 genel kabul kriterinin tamamı için ✅/❌ tablosu, dağıtım notları, bilinen sınırlamalar) ve şunu sor: _"Faz 3'ü ve projenin tamamını onaylıyor musunuz?"_

<!-- END:nextjs-agent-rules -->
