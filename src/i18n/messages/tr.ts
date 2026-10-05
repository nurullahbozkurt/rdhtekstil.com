/**
 * Arayüz metinleri (buton etiketleri, form alanları, hata mesajları, erişilebilirlik metinleri).
 * Sayfa içerikleri (başlıklar, açıklamalar, ürünler, SSS…) içerik katmanındadır: `src/lib/content`.
 */
const tr = {
  a11y: {
    skipToContent: "İçeriğe geç",
    mainNav: "Ana menü",
    footerNav: "Alt menü",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    breadcrumb: "Sayfa konumu",
    languageSwitcher: "Dil seçimi",
    previousImage: "Önceki görsel",
    nextImage: "Sonraki görsel",
    showImage: "Görseli göster",
    referencesStrip: "Referans markalar",
    external: "yeni sekmede açılır",
  },
  nav: {
    home: "Ana Sayfa",
    allProducts: "Tüm Ürünler",
    allIndustries: "Tüm Kullanım Alanları",
    menu: "Menü",
  },
  common: {
    learnMore: "Detayları Gör",
    viewProject: "Projeyi İncele",
    viewAll: "Tümünü Gör",
    all: "Tümü",
    productCount: "{count} ürün",
    placeholderImage: "Görsel hazırlanıyor",
    placeholderBadge: "Örnek içerik",
  },
  catalog: {
    modelsTitle: "Referans Modeller",
    filterLabel: "Ürün tipine göre filtrele",
    noResults: "Bu filtreye uygun ürün bulunamadı.",
    features: "Özellikler",
    customizations: "Uygulanabilir özelleştirmeler",
    customizationLabels: {
      color: "Renk",
      pattern: "Desen",
      logo: "Logo",
      label: "Etiket",
    },
    relatedProjects: "Bu ürünle ilgili projeler",
    relatedProducts: "Benzer ürünler",
    productFaq: "Bu ürün hakkında sık sorulanlar",
    category: "Kategori",
    types: "Ürün tipi",
    noPrice: "Fiyat ve termin, tasarım detaylarına göre teklif aşamasında paylaşılır.",
  },
  industry: {
    whatWeMake: "Bu alanda ürettiklerimiz",
    relatedProducts: "Öne çıkan ürünler",
    references: "Bu alandaki referanslarımız",
    noReferences: "Bu alandaki paylaşılabilir referanslar yakında eklenecek.",
  },
  references: {
    brands: "Referans Markalar",
    projects: "Projeler",
    filterLabel: "Projeleri kategoriye göre filtrele",
    noProjects: "Bu kategoride henüz yayınlanmış proje yok.",
    logoNotice: "Referans logoları, kullanım izinleri tamamlandıkça eklenecektir.",
    otherCaseStudies: "Diğer projeler",
    fields: {
      client: "Müşteri / Marka",
      sector: "Sektör",
      product: "Ürün",
      country: "Ülke",
      quantity: "Adet",
      need: "Proje ihtiyacı",
      solution: "RDH çözümü",
      features: "Ürün özellikleri",
      gallery: "Görseller",
      finalProduct: "Final ürün",
    },
    categories: {
      football: "Futbol",
      fan: "Taraftar",
      corporate: "Kurumsal",
      school: "Okul",
      "private-label": "Private Label",
      other: "Diğer",
    },
  },
  faq: {
    title: "Sıkça Sorulan Sorular",
  },
  contact: {
    infoTitle: "İletişim Bilgileri",
    phone: "Telefon",
    whatsapp: "WhatsApp",
    email: "E-posta",
    address: "Adres",
    map: "Harita",
    openMap: "Google Haritalar'da aç",
    mapNotice: "Harita, çerez tercihlerinizden bağımsız olarak yeni sekmede açılır.",
    social: "Sosyal medya",
    designRequestTitle: "Logo ve renklerinizi mi göndermek istiyorsunuz?",
    designRequestText:
      "Logo ve renklerinizi göndermek için Tasarım Talebi Oluştur. Ekibimiz örnek modelleri ve fiyat teklifini e-posta ile iletsin.",
  },
  form: {
    required: "Zorunlu alan",
    optional: "İsteğe bağlı",
    selectPlaceholder: "Seçiniz",
    fields: {
      fullName: "Ad Soyad",
      company: "Firma",
      email: "E-posta",
      phone: "Telefon",
      country: "Ülke",
      productInterest: "İlgilendiğiniz Ürün",
      quantityRange: "Tahmini Adet",
      message: "Mesaj",
      privacyConsent:
        "{link} metnini okudum, kişisel verilerimin talebimin değerlendirilmesi amacıyla işlenmesini kabul ediyorum.",
      privacyConsentLink: "Aydınlatma Metni",
    },
    errors: {
      required: "Bu alanı doldurmanız gerekiyor.",
      tooShort: "Lütfen en az {min} karakter girin.",
      tooLong: "Lütfen en fazla {max} karakter girin.",
      invalidEmail: "Geçerli bir e-posta adresi girin (ör. ad@firma.com).",
      invalidPhone: "Geçerli bir telefon numarası girin (ör. +90 555 000 00 00).",
      selectOption: "Listeden bir seçenek seçin.",
      consentRequired: "Devam etmek için aydınlatma metnini onaylamanız gerekiyor.",
      summary: "Formda düzeltilmesi gereken {count} alan var.",
    },
    submit: "Projemi Gönder",
    phaseNoticeTitle: "Form önizleme modunda",
    phaseNotice:
      "Bilgileriniz doğrulandı ancak hiçbir yere gönderilmedi. Form gönderimi Faz 2'de etkinleştirilecek.",
  },
  request: {
    phaseNoticeTitle: "Bu ekran Faz 2'de etkinleştirilecek",
    phaseNotice:
      "Adım adım talep formu, dosya yükleme ve gönderim Faz 2'de devreye alınacak. Şimdilik bize iletişim bilgilerimizden ulaşabilirsiniz.",
    prefilledProduct: "Seçilen ürün",
    prefilledIndustry: "Kullanım alanı",
    contactInstead: "İletişim sayfasına git",
  },
  consent: {
    title: "Çerez tercihleriniz",
    text: "Sitemizin çalışması için gerekli çerezleri kullanıyoruz. Ziyaretinizi analiz etmek ve iletişimimizi iyileştirmek için ek çerezler kullanmak istiyoruz; bunlar yalnızca onay verirseniz yüklenir.",
    policyLink: "Çerez Politikası",
    acceptAll: "Tümünü kabul et",
    rejectAll: "Yalnızca gerekli",
    customize: "Tercihleri yönet",
    save: "Tercihleri kaydet",
    necessary: "Zorunlu çerezler",
    necessaryText:
      "Sitenin temel işlevleri ve tercihlerinizin hatırlanması için gereklidir. Kapatılamaz.",
    analytics: "Analitik çerezler",
    analyticsText:
      "Google Analytics 4 ile sitenin nasıl kullanıldığını anonim olarak ölçmemize yardımcı olur.",
    marketing: "Pazarlama çerezleri",
    marketingText: "Reklam ve yeniden pazarlama ölçümleri için kullanılır.",
    alwaysOn: "Her zaman açık",
    manage: "Çerez Tercihleri",
    close: "Kapat",
  },
  legal: {
    version: "Metin sürümü",
    updated: "Son güncelleme",
  },
  footer: {
    rights: "Tüm hakları saklıdır.",
    language: "Dil",
  },
  notFound: {
    title: "Aradığınız sayfayı bulamadık.",
    text: "Sayfa taşınmış ya da adres yanlış yazılmış olabilir. Ürünlerimize göz atabilir veya ana sayfaya dönebilirsiniz.",
    home: "Ana Sayfaya Dön",
  },
};

export default tr;

type DeepStringify<T> = { [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]> };
export type Messages = DeepStringify<typeof tr>;
