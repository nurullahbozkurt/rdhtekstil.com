import type { ContentStoreInput } from "../schema";
import { img, P } from "./helpers";

export const industries: ContentStoreInput["industries"] = [
  {
    id: "football-clubs",
    sortOrder: 1,
    name: { tr: "Futbol & Spor Kulüpleri", en: "Football & Sports Clubs" },
    shortName: { tr: "Futbol & Spor Kulüpleri", en: "Football & Sports Clubs" },
    cardText: {
      tr: "Kulüp renkleri, arma ve logo uygulamalarıyla kulüp koleksiyonları.",
      en: "Club collections with your colours, crest and logo applications.",
    },
    intro: {
      tr: "Kulüp kimliğinize özel renk, desen ve logo uygulamalarıyla bere ve atkı koleksiyonları geliştiriyoruz. Taraftar ürünlerinden kulüp koleksiyonlarına kadar farklı ihtiyaçlara uygun üretim çözümleri sunuyoruz.",
      en: "We develop beanie and scarf collections with colours, patterns and logo applications made for your club's identity. From fan products to club collections, we offer production solutions for every need.",
    },
    highlights: {
      tr: [
        "Kulüp atkıları",
        "Bereler",
        "Bere + atkı setleri",
        "Logo uygulamaları",
        "Renk ve desen seçenekleri",
        "Private label",
      ],
      en: [
        "Club scarves",
        "Beanies",
        "Beanie + scarf sets",
        "Logo applications",
        "Colour and pattern options",
        "Private label",
      ],
    },
    cta: { tr: "Kulübünüz İçin Talep Oluşturun", en: "Create a Request for Your Club" },
    image: img(
      `${P}/mankenler/5.jpg`,
      "Warriors Football bere ve atkısıyla stadyumda bir taraftar",
      "A supporter at the stadium in a Warriors Football beanie and scarf",
    ),
    referenceCategories: ["football"],
    faqIds: ["club-colours", "club-resale", "min-order"],
    seo: {
      tr: {
        slug: "futbol-kulubu-atkisi",
        title: "Futbol Kulübü Atkısı ve Bere Üretimi | RDH Tekstil",
        description:
          "Futbol ve spor kulüpleri için kulüp renkleri, arma ve logolu atkı, bere ve set üretimi. Kulüp koleksiyonları ve private label.",
        h1: "Takım Ruhunu Taşıyan Ürünler",
      },
      en: {
        slug: "football-club-scarves",
        title: "Football Club Scarves and Beanies | RDH Tekstil",
        description:
          "Scarves, beanies and sets for football and sports clubs, made with your club colours, crest and logo. Club collections and private label.",
        h1: "Products That Carry Your Team Spirit",
      },
    },
  },
  {
    id: "fans",
    sortOrder: 2,
    name: { tr: "Taraftar & Fanwear", en: "Fans & Fanwear" },
    shortName: { tr: "Taraftar", en: "Fanwear" },
    cardText: {
      tr: "Takım renklerini ve taraftar kültürünü taşıyan atkı ve bereler.",
      en: "Scarves and beanies that carry team colours and fan culture.",
    },
    intro: {
      tr: "Takım renklerini, armaları ve taraftar kültürünü taşıyan özel üretim bere ve atkılar geliştiriyoruz. Klasik taraftar ürünlerinden özel koleksiyonlara kadar farklı projeleri markanıza göre şekillendiriyoruz.",
      en: "We develop custom-made beanies and scarves that carry team colours, crests and fan culture. From classic fan products to special collections, we shape every project around your brand.",
    },
    highlights: {
      tr: [
        "Jakarlı taraftar atkıları",
        "Klasik katlamalı ve ponponlu bereler",
        "Maç günü bere + atkı setleri",
        "Arma ve yazı uygulamaları",
        "Özel koleksiyon ve sezon ürünleri",
      ],
      en: [
        "Jacquard fan scarves",
        "Classic cuffed and pom-pom beanies",
        "Match-day beanie + scarf sets",
        "Crest and lettering applications",
        "Special collections and seasonal products",
      ],
    },
    cta: { tr: "Taraftar Koleksiyonunu Başlatın", en: "Start Your Fan Collection" },
    image: img(
      `${P}/mankenler/6.jpg`,
      "ECS Crocodiles bere ve atkısıyla tribünde bir taraftar",
      "A fan in the stands wearing an ECS Crocodiles beanie and scarf",
    ),
    referenceCategories: ["fan"],
    faqIds: ["club-colours", "club-resale", "production-time"],
    seo: {
      tr: {
        slug: "taraftar-atkisi",
        title: "Taraftar Atkısı ve Bere Üretimi | RDH Tekstil",
        description:
          "Takım renkleri ve arması ile jakarlı taraftar atkısı, bere ve maç günü setleri. Taraftar grupları ve kulüp mağazaları için üretim.",
        h1: "Tribünden Sokağa Taşınan Tasarımlar",
      },
      en: {
        slug: "fan-scarves",
        title: "Fan Scarf and Beanie Manufacturing | RDH Tekstil",
        description:
          "Jacquard fan scarves, beanies and match-day sets with your team colours and crest, for supporter groups and club shops.",
        h1: "Designs That Go from the Stands to the Street",
      },
    },
  },
  {
    id: "corporate",
    sortOrder: 3,
    name: { tr: "Kurumsal", en: "Corporate" },
    shortName: { tr: "Kurumsal", en: "Corporate" },
    cardText: {
      tr: "Çalışan kitleri, etkinlikler ve kurumsal hediyeler için markalı ürünler.",
      en: "Branded products for employee kits, events and corporate gifts.",
    },
    intro: {
      tr: "Çalışan kitleri, etkinlikler, kurumsal hediyeler ve marka koleksiyonları için kurumsal kimliğinize özel bere ve atkılar üretiyoruz. Renk, logo, desen ve etiket detaylarını markanızın görsel dünyasına göre şekillendiriyoruz.",
      en: "We produce beanies and scarves made for your corporate identity, for employee kits, events, corporate gifts and brand collections. We shape colours, logos, patterns and labels around your brand's visual world.",
    },
    highlights: {
      tr: [
        "Çalışan kitleri",
        "Etkinlik ve fuar ürünleri",
        "Kurumsal hediyeler",
        "Kurumsal renklerde desen",
        "Dokuma, deri ve özel etiketler",
      ],
      en: [
        "Employee kits",
        "Event and trade fair products",
        "Corporate gifts",
        "Patterns in your corporate colours",
        "Woven, leather and custom labels",
      ],
    },
    cta: { tr: "Kurumsal Projenizi Başlatın", en: "Start Your Corporate Project" },
    image: img(
      `${P}/mankenler/4.jpg`,
      "Tinder için üretilen desenli bere ve atkıyı takan bir kişi",
      "A person wearing the patterned beanie and scarf produced for Tinder",
    ),
    referenceCategories: ["corporate"],
    faqIds: ["corporate-gift-pack", "own-logo", "min-order"],
    seo: {
      tr: {
        slug: "kurumsal-bere-atki",
        title: "Kurumsal Bere ve Atkı Üretimi | RDH Tekstil",
        description:
          "Çalışan kitleri, etkinlikler ve kurumsal hediyeler için logolu bere ve atkı üretimi. Kurumsal renkler, özel desen ve etiket.",
        h1: "Markanızı Taşıyan Kurumsal Tekstil",
      },
      en: {
        slug: "corporate-beanies-scarves",
        title: "Corporate Beanies and Scarves | RDH Tekstil",
        description:
          "Logo beanies and scarves for employee kits, events and corporate gifts, in your corporate colours with custom patterns and labels.",
        h1: "Corporate Textiles That Carry Your Brand",
      },
    },
  },
  {
    id: "schools",
    sortOrder: 4,
    name: { tr: "Okullar", en: "Schools" },
    shortName: { tr: "Okullar", en: "Schools" },
    cardText: {
      tr: "Okul renkleri ve kimliğiyle öğrenci ve takım koleksiyonları.",
      en: "Student and team collections in your school colours and identity.",
    },
    intro: {
      tr: "Okullar, öğrenci toplulukları ve okul takımları için kurum renklerine ve kimliğine özel bere ve atkı koleksiyonları üretiyoruz.",
      en: "We produce beanie and scarf collections in your institution's colours and identity for schools, student communities and school teams.",
    },
    highlights: {
      tr: [
        "Okul atkıları ve bereleri",
        "Çocuk bedenleri",
        "Okul takımı ürünleri",
        "Mezuniyet ve etkinlik koleksiyonları",
        "Okul arması uygulamaları",
      ],
      en: [
        "School scarves and beanies",
        "Kids' sizes",
        "School team products",
        "Graduation and event collections",
        "School crest applications",
      ],
    },
    cta: { tr: "Okulunuz İçin Talep Oluşturun", en: "Create a Request for Your School" },
    image: img(
      `${P}/mankenler/1.jpg`,
      "Açık mavi örgü bere ve atkı takan gülümseyen bir çocuk",
      "A smiling child wearing a light blue knitted beanie and scarf",
    ),
    referenceCategories: ["school"],
    faqIds: ["kids-sizes", "min-order", "no-design"],
    seo: {
      tr: {
        slug: "okul-bere-atki",
        title: "Okul Beresi ve Okul Atkısı Üretimi | RDH Tekstil",
        description:
          "Okullar, öğrenci toplulukları ve okul takımları için okul renkleri ve armasıyla bere ve atkı üretimi. Çocuk bedenleri dahil.",
        h1: "Okul Kimliğini Taşıyan Özel Ürünler",
      },
      en: {
        slug: "school-beanies-scarves",
        title: "School Beanies and Scarves | RDH Tekstil",
        description:
          "Beanies and scarves in your school colours and crest for schools, student communities and school teams, including kids' sizes.",
        h1: "Custom Products That Carry Your School Identity",
      },
    },
  },
  {
    id: "private-label",
    sortOrder: 5,
    name: { tr: "Markalar & Private Label", en: "Brands & Private Label" },
    shortName: { tr: "Private Label", en: "Private Label" },
    cardText: {
      tr: "Kendi markanız altında bere ve atkı koleksiyonları.",
      en: "Beanie and scarf collections under your own brand.",
    },
    intro: {
      tr: "Kendi markası altında bere ve atkı koleksiyonu geliştirmek isteyen işletmeler için özel üretim ve private label çözümleri sunuyoruz. Ürün modelinden renk ve desene, marka uygulamasından etikete kadar koleksiyonun temel detaylarını markanıza göre şekillendiriyoruz.",
      en: "We offer custom production and private label solutions for businesses that want to develop beanie and scarf collections under their own brand. From the product model to colour and pattern, from brand application to label, we shape the core details of the collection around your brand.",
    },
    highlights: {
      tr: [
        "Markanıza özel koleksiyon",
        "Model, renk ve desen geliştirme",
        "Dokuma, deri ve özel etiket",
        "Marka uygulamaları",
        "Sezonluk tekrar üretim",
      ],
      en: [
        "A collection made for your brand",
        "Model, colour and pattern development",
        "Woven, leather and custom labels",
        "Brand applications",
        "Seasonal repeat production",
      ],
    },
    cta: { tr: "Koleksiyonunuzu Konuşalım", en: "Let's Talk About Your Collection" },
    image: img(
      `${P}/setler/es/1.jpg`,
      "Deri etiketli gri bere ve atkı seti",
      "Grey beanie and scarf set with leather labels",
    ),
    referenceCategories: ["private-label"],
    faqIds: ["private-label", "label-options", "min-order"],
    seo: {
      tr: {
        slug: "private-label-bere-atki",
        title: "Private Label Bere ve Atkı Üretimi | RDH Tekstil",
        description:
          "Kendi markanız altında bere ve atkı koleksiyonu: model, renk, desen, marka uygulaması ve özel etiketle private label üretim.",
        h1: "Sizin Markanız. Sizin Koleksiyonunuz.",
      },
      en: {
        slug: "private-label-beanies-scarves",
        title: "Private Label Beanies and Scarves | RDH Tekstil",
        description:
          "Beanie and scarf collections under your own brand: private label production with your model, colours, patterns, branding and labels.",
        h1: "Your Brand. Your Collection.",
      },
    },
  },
];
