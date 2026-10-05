import type { ContentStoreInput } from "../schema";

// Genel SSS metinleri AGENTS.md'den birebir alınmıştır.
// TODO(content): Kategori ve kullanım alanına özel SSS metinleri RDH tarafından onaylanacak.
export const faqs: ContentStoreInput["faqs"] = [
  {
    id: "min-order",
    sortOrder: 1,
    topics: [
      "general",
      "beanies",
      "scarves",
      "sets",
      "football-clubs",
      "corporate",
      "schools",
      "private-label",
    ],
    question: { tr: "Minimum sipariş adedi nedir?", en: "What is the minimum order quantity?" },
    answer: {
      tr: "Minimum sipariş adedi ürün ve üretim detaylarına göre değişebilir. Ürününüzü ve ihtiyacınız olan adedi paylaştığınızda ekibimiz uygun üretim seçeneklerini iletecektir.",
      en: "The minimum order quantity depends on the product and production details. Share your product and the quantity you need, and our team will send you suitable production options.",
    },
  },
  {
    id: "own-logo",
    sortOrder: 2,
    topics: ["general", "beanies", "scarves", "corporate"],
    question: { tr: "Kendi logomuzu kullanabilir miyiz?", en: "Can we use our own logo?" },
    answer: {
      tr: "Evet. Logo, renk ve tasarım detayları markanıza göre uygulanabilir.",
      en: "Yes. Logo, colour and design details can be applied to suit your brand.",
    },
  },
  {
    id: "private-label",
    sortOrder: 3,
    topics: ["general", "sets", "private-label"],
    question: {
      tr: "Kendi markamızla üretim yapabilir misiniz?",
      en: "Can you produce under our own brand?",
    },
    answer: {
      tr: "Evet. Private label projelerde ürün ve etiket detayları markanıza göre özelleştirilebilir.",
      en: "Yes. In private label projects, product and label details can be customised for your brand.",
    },
  },
  {
    id: "production-time",
    sortOrder: 4,
    topics: ["general", "fans"],
    question: { tr: "Üretim süresi ne kadar?", en: "How long does production take?" },
    answer: {
      tr: "Üretim süresi ürün, adet ve tasarım detaylarına göre değişmektedir. Proje kapsamı netleştikten sonra termin bilgisi teklif aşamasında paylaşılır.",
      en: "Production time depends on the product, quantity and design details. Once the project scope is clear, the lead time is shared with your quote.",
    },
  },
  {
    id: "international-shipping",
    sortOrder: 5,
    topics: ["general"],
    question: { tr: "Yurt dışına gönderim yapıyor musunuz?", en: "Do you ship internationally?" },
    answer: {
      tr: "Uluslararası projeler için teslimat seçenekleri proje ve ülkeye göre değerlendirilmektedir.",
      en: "For international projects, delivery options are assessed by project and country.",
    },
  },
  {
    id: "no-design",
    sortOrder: 6,
    topics: ["general", "schools"],
    question: { tr: "Tasarımım yoksa ne yapmalıyım?", en: "What if I don't have a design?" },
    answer: {
      tr: "Logonuzu ve ihtiyacınızı talep ekranından paylaşabilirsiniz; ekibimiz örnek modelleri hazırlayıp e-posta ile iletecektir.",
      en: "You can share your logo and needs through the request screen; our team will prepare design proposals and email them to you.",
    },
  },
  {
    id: "beanie-models",
    sortOrder: 10,
    topics: ["beanies"],
    question: {
      tr: "Hangi bere modellerini üretiyorsunuz?",
      en: "Which beanie models do you produce?",
    },
    answer: {
      tr: "Klasik, katlamalı, ponponlu, jakarlı ve çocuk berelerinin yanı sıra projenize özel modeller üretiyoruz. Model seçimi kullanım alanına ve tasarıma göre birlikte netleştirilir.",
      en: "We produce classic, cuffed, pompom, jacquard and kids' beanies, as well as models made for your project. The model is finalised together, based on use and design.",
    },
  },
  {
    id: "beanie-logo",
    sortOrder: 11,
    topics: ["beanies"],
    question: {
      tr: "Logomuz bereye nasıl uygulanır?",
      en: "How is our logo applied to the beanie?",
    },
    answer: {
      tr: "Logo; jakarlı örgü, dokuma arma, nakış veya deri etiket gibi farklı yöntemlerle uygulanabilir. Uygun yöntem logonuzun detaylarına ve ürün modeline göre önerilir.",
      en: "Your logo can be applied through jacquard knitting, a woven badge, embroidery or a leather patch. We recommend the right method based on your logo's details and the product model.",
    },
  },
  {
    id: "scarf-size",
    sortOrder: 12,
    topics: ["scarves"],
    question: {
      tr: "Atkı ölçüsü ve püskül detayları değiştirilebilir mi?",
      en: "Can the scarf size and fringe be changed?",
    },
    answer: {
      tr: "Atkı ölçüsü, püskül ve kenar detayları projenin ihtiyacına göre değerlendirilir. İstediğiniz detayları talep ekranında belirtebilirsiniz.",
      en: "Scarf size, fringe and edge details are assessed according to the project. You can note the details you want on the request screen.",
    },
  },
  {
    id: "scarf-text",
    sortOrder: 13,
    topics: ["scarves"],
    question: {
      tr: "Atkıya kulüp adı veya slogan yazılabilir mi?",
      en: "Can a club name or slogan be added to the scarf?",
    },
    answer: {
      tr: "Evet. Kulüp adı, şehir adı veya slogan; renkleriniz ve arma ile birlikte atkı tasarımına uygulanabilir.",
      en: "Yes. A club name, city name or slogan can be worked into the scarf design together with your colours and crest.",
    },
  },
  {
    id: "set-separate",
    sortOrder: 14,
    topics: ["sets"],
    question: {
      tr: "Set ürünleri ayrı ayrı sipariş edebilir miyiz?",
      en: "Can we order set items separately?",
    },
    answer: {
      tr: "Evet. Bere ve atkıyı aynı tasarım diliyle set olarak veya ayrı ürünler olarak planlayabiliriz; adetler projeye göre netleştirilir.",
      en: "Yes. Beanies and scarves can be planned as a matching set or as separate products; quantities are finalised per project.",
    },
  },
  {
    id: "club-colours",
    sortOrder: 20,
    topics: ["football-clubs", "fans"],
    question: {
      tr: "Kulüp renklerimizi birebir kullanabilir misiniz?",
      en: "Can you match our club colours?",
    },
    answer: {
      tr: "Kulüp renklerinizi HEX veya Pantone kodlarıyla paylaşabilirsiniz; tasarım önerisi bu renklere en yakın iplik seçenekleriyle hazırlanır.",
      en: "You can share your club colours as HEX or Pantone codes; the design proposal is prepared with the yarn options closest to them.",
    },
  },
  {
    id: "club-resale",
    sortOrder: 21,
    topics: ["football-clubs", "fans"],
    question: {
      tr: "Kulüp mağazamızda satış için üretim yapıyor musunuz?",
      en: "Do you produce for our club shop?",
    },
    answer: {
      tr: "Evet. Kulüp mağazaları ve taraftar satışları için koleksiyon ürünleri planlayabiliriz; etiket ve sunum detayları markanıza göre hazırlanır.",
      en: "Yes. We can plan collection products for club shops and fan sales, with label and presentation details prepared for your brand.",
    },
  },
  {
    id: "corporate-gift-pack",
    sortOrder: 22,
    topics: ["corporate"],
    question: {
      tr: "Kurumsal hediye projeleri için üretim yapıyor musunuz?",
      en: "Do you produce for corporate gift projects?",
    },
    answer: {
      tr: "Evet. Çalışan kitleri, etkinlikler ve kurumsal hediyeler için kurumsal renk ve logolarınızla bere ve atkı üretiyoruz.",
      en: "Yes. We produce beanies and scarves in your corporate colours and logos for employee kits, events and corporate gifts.",
    },
  },
  {
    id: "kids-sizes",
    sortOrder: 23,
    topics: ["schools"],
    question: {
      tr: "Çocuk bedenlerinde üretim yapıyor musunuz?",
      en: "Do you produce in kids' sizes?",
    },
    answer: {
      tr: "Evet. Okul ve çocuk projeleri için çocuk bedenlerinde bere, atkı ve set üretimi yapıyoruz.",
      en: "Yes. For school and kids' projects, we produce beanies, scarves and sets in kids' sizes.",
    },
  },
  {
    id: "label-options",
    sortOrder: 24,
    topics: ["private-label", "custom-production"],
    question: {
      tr: "Hangi etiket seçeneklerini sunuyorsunuz?",
      en: "Which label options do you offer?",
    },
    answer: {
      tr: "Dokuma etiket, deri etiket ve markanıza özel etiket çözümleri sunuyoruz. Etiket seçimi ürün modeline ve marka diline göre birlikte belirlenir.",
      en: "We offer woven labels, leather patches and custom label solutions for your brand. The label is chosen together, based on the product model and your brand language.",
    },
  },
];
