import type { ContentStoreInput } from "../schema";

export const siteSettings: ContentStoreInput["siteSettings"] = {
  brandName: "RDH Tekstil",
  // TODO(content): Resmî ticari unvan RDH'den teyit edilecek.
  legalName: "RDH Tekstil",
  tagline: "CUSTOM SCARVES & BEANIES",
  slogan: {
    tr: "Sizin Markanız. Sizin Tasarımınız. Bizim Üretimimiz.",
    en: "Your Brand. Your Design. Our Production.",
  },
  logo: { light: "/logo-rdh-light.png", dark: "/logo-rdh-dark.png" },
  defaultOgImage: "/product-images/setler/rdh/2.jpg",
  contact: {
    // TODO(content): Gerçek telefon, WhatsApp, e-posta, adres ve harita bağlantısı RDH'den gelecek.
    phone: "+902120000000",
    phoneDisplay: "+90 (212) 000 00 00",
    whatsapp: "902120000000",
    email: "info@rdhtekstil.com",
    address: {
      tr: "Adres bilgisi yakında eklenecek. Türkiye",
      en: "Address details coming soon. Türkiye",
    },
    mapUrl: "https://www.google.com/maps/search/?api=1&query=RDH+Tekstil",
    country: "TR",
    contentStatus: "placeholder",
  },
  // TODO(content): Gerçek sosyal medya hesap bağlantıları.
  social: [
    { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/" },
    { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
  navigation: {
    tr: {
      products: "Ürünler",
      industries: "Kullanım Alanları",
      customProduction: "Özel Üretim",
      references: "Referanslar",
      about: "Hakkımızda",
      contact: "İletişim",
      faq: "SSS",
      footerProducts: "Ürünler",
      footerIndustries: "Kullanım Alanları",
      footerCompany: "RDH",
      footerLegal: "Yasal",
    },
    en: {
      products: "Products",
      industries: "Industries",
      customProduction: "Custom Production",
      references: "References",
      about: "About",
      contact: "Contact",
      faq: "FAQ",
      footerProducts: "Products",
      footerIndustries: "Industries",
      footerCompany: "RDH",
      footerLegal: "Legal",
    },
  },
  ctas: {
    designRequest: { tr: "Tasarım Talebi Oluştur", en: "Create Design Request" },
    browseProducts: { tr: "Ürünleri İncele", en: "Browse Products" },
    productRequest: { tr: "Bu Ürün İçin Talep Oluştur", en: "Request This Product" },
    customRequest: { tr: "Özel Üretim Talebi Oluştur", en: "Request Custom Production" },
    startProject: { tr: "Projenizi Başlatalım", en: "Let's Start Your Project" },
    otherProducts: { tr: "Diğer Ürünleri İncele", en: "Browse Other Products" },
  },
  trustLine: {
    tr: [
      "Özel Tasarım",
      "Düşük Minimum Adet",
      "Private Label",
      "Hızlı Üretim",
      "Türkiye'de Üretim",
    ],
    en: ["Custom Design", "Low Minimums", "Private Label", "Fast Production", "Made in Türkiye"],
  },
  valueProps: [
    {
      id: "expertise",
      icon: "target",
      title: { tr: "Bere & Atkıda Uzmanlık", en: "Beanie & Scarf Expertise" },
      short: {
        tr: "Odağımızı bildiğimiz ürünlere veriyoruz.",
        en: "We focus on the products we know best.",
      },
      long: {
        tr: "Odağımızı bildiğimiz ürünlere veriyor, bere ve atkı üretimindeki deneyimimizi her projeye taşıyoruz.",
        en: "We focus on the products we know and bring our beanie and scarf production experience to every project.",
      },
    },
    {
      id: "low-moq",
      icon: "layers",
      title: { tr: "Düşük Minimum Adet", en: "Low Minimum Quantity" },
      short: {
        tr: "Farklı ölçeklerdeki projelere uygun üretim.",
        en: "Production suited to projects of every scale.",
      },
      long: {
        tr: "Farklı ölçeklerdeki projelere uygun esnek üretim seçenekleri sunuyoruz.",
        en: "We offer flexible production options for projects of different scales.",
      },
    },
    {
      id: "custom-design",
      icon: "palette",
      title: { tr: "Özel Tasarım", en: "Custom Design" },
      short: {
        tr: "Markanıza ve ihtiyacınıza göre şekillendirilen ürünler.",
        en: "Products shaped around your brand and needs.",
      },
      long: {
        tr: "Renk, desen, logo ve ürün detaylarını markanıza ve projenize göre şekillendiriyoruz.",
        en: "We shape colour, pattern, logo and product details around your brand and project.",
      },
    },
    {
      id: "private-label",
      icon: "tag",
      title: { tr: "Private Label", en: "Private Label" },
      short: {
        tr: "Markanıza özel ürün ve etiket çözümleri.",
        en: "Product and label solutions under your brand.",
      },
      long: {
        tr: "Etiket, ürün ve sunum detaylarını markanıza göre özelleştiriyoruz.",
        en: "We customise label, product and presentation details for your brand.",
      },
    },
    {
      id: "fast-production",
      icon: "zap",
      title: { tr: "Hızlı Üretim", en: "Fast Production" },
      short: {
        tr: "Planlı ve esnek üretim süreçleri.",
        en: "Planned, flexible production processes.",
      },
      long: {
        tr: "Planlı üretim altyapımızla projeleri ihtiyaç duyulan termin doğrultusunda yönetiyoruz.",
        en: "With planned production capacity, we manage each project to the lead time you need.",
      },
    },
    {
      id: "on-time",
      icon: "truck",
      title: { tr: "Zamanında Teslimat", en: "On-Time Delivery" },
      short: {
        tr: "Baştan sona takip edilen üretim ve sevkiyat.",
        en: "Production and shipping tracked end to end.",
      },
      long: {
        tr: "Üretim ve sevkiyat süreçlerini planlanan teslim takvimine göre takip ediyoruz.",
        en: "We track production and shipping against the planned delivery schedule.",
      },
    },
  ],
  processSteps: [
    {
      title: { tr: "Talebini Oluştur", en: "Create Your Request" },
      text: {
        tr: "Ürününü, kullanım alanını ve ihtiyacın olan adedi seç.",
        en: "Choose your product, industry and the quantity you need.",
      },
    },
    {
      title: { tr: "Marka Materyallerini Gönder", en: "Send Your Brand Materials" },
      text: {
        tr: "Logonu, renklerini, varsa sloganını ve örnek modellerini yükle.",
        en: "Upload your logo, colours, slogan if you have one, and reference models.",
      },
    },
    {
      title: { tr: "Örnek Modelini Al", en: "Get Your Design Proposal" },
      text: {
        tr: "Ekibimiz örnek modelleri ve fiyat teklifini e-posta ile iletsin.",
        en: "Our team emails you design proposals and a price quote.",
      },
    },
    {
      title: { tr: "Detayları Netleştirelim", en: "Finalise the Details" },
      text: {
        tr: "Tasarımı, adedi ve koşulları birlikte kesinleştirelim.",
        en: "We confirm the design, quantity and terms together.",
      },
    },
    {
      title: { tr: "Üretime Geçelim", en: "Move to Production" },
      text: {
        tr: "Onay sonrası üretim planlamasını başlatalım.",
        en: "Production planning starts after your approval.",
      },
    },
    {
      title: { tr: "Teslim Edelim", en: "Delivery" },
      text: {
        tr: "Kalite kontrolü tamamlanan ürünleri planlanan sevkiyata alalım.",
        en: "Quality-checked products go out on the planned shipment.",
      },
    },
  ],
};
