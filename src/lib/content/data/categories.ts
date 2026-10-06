import type { ContentStoreInput } from "../schema";
import { img, P } from "./helpers";

export const categories: ContentStoreInput["categories"] = [
  {
    id: "beanies",
    sortOrder: 1,
    name: { tr: "Bereler", en: "Beanies" },
    shortName: { tr: "Bereler", en: "Beanies" },
    cardText: {
      tr: "Farklı örgü, renk, desen ve marka uygulamalarıyla projenize özel bere üretimi.",
      en: "Beanies made for your project, with different knits, colours, patterns and brand applications.",
    },
    cardCta: { tr: "Bereleri İncele", en: "Browse Beanies" },
    intro: {
      tr: "Klasik katlamalı, ponponlu, katlamasız uzun, yüksek tepeli ve kulaklıklı bereler üretiyoruz. Renk, desen, logo ve etiket detaylarını markanıza göre belirliyoruz.",
      en: "We produce classic cuffed, pom-pom, uncuffed, high-top and earflap beanies, with colours, patterns, logos and labels shaped around your brand.",
    },
    image: img(
      `${P}/bereler/jets/1.jpg`,
      "Bordo-sarı ponponlu jakarlı Troisdorf Jets beresi",
      "Burgundy and gold pompom jacquard Troisdorf Jets beanie",
    ),
    types: [
      {
        id: "classic-cuffed",
        label: { tr: "Klasik katlamalı bere", en: "Classic Cuffed Beanie" },
        description: {
          tr: "Altta geniş katlı manşet bulunur.",
          en: "A wide folded cuff sits at the hem.",
        },
      },
      {
        id: "pom-pom",
        label: { tr: "Ponponlu bere", en: "Pom-Pom Beanie" },
        description: { tr: "Tepesinde ponpon bulunur.", en: "A pom-pom sits on the crown." },
      },
      {
        id: "uncuffed",
        label: { tr: "Katlamasız uzun bere", en: "Uncuffed Beanie" },
        description: { tr: "Düz, katlanmayan uzun gövde.", en: "A long body with no folded cuff." },
      },
      {
        id: "high-top",
        label: { tr: "Yüksek tepeli bere", en: "High-Top Beanie" },
        description: { tr: "Tepesi dik ve uzun durur.", en: "The crown stands tall." },
      },
      {
        id: "earflap",
        label: { tr: "Kulaklıklı bere", en: "Earflap Beanie" },
        description: {
          tr: "Yanlarda kulakları kapatan parçalar bulunur.",
          en: "Side pieces cover the ears.",
        },
      },
    ],
    faqIds: ["beanie-models", "beanie-logo", "min-order", "own-logo"],
    seo: {
      tr: {
        slug: "bere-uretimi",
        title: "Özel Tasarım Bere Üretimi | RDH Tekstil",
        description:
          "Klasik katlamalı, ponponlu, katlamasız, yüksek tepeli ve kulaklıklı bere üretimi. Kulüpler, markalar ve kurumlar için düşük minimum adetle özel tasarım bereler.",
        h1: "Markanıza Özel Bere Üretimi",
      },
      en: {
        slug: "beanie-manufacturing",
        title: "Custom Beanie Manufacturing | RDH Tekstil",
        description:
          "Classic cuffed, pom-pom, uncuffed, high-top and earflap beanie manufacturing for clubs, brands and organisations, with low minimum order quantities.",
        h1: "Custom Beanie Manufacturing for Your Brand",
      },
    },
  },
  {
    id: "scarves",
    sortOrder: 2,
    name: { tr: "Atkılar", en: "Scarves" },
    shortName: { tr: "Atkılar", en: "Scarves" },
    cardText: {
      tr: "Kurumsal kullanımdan taraftar koleksiyonlarına kadar farklı ihtiyaçlara özel atkı üretimi.",
      en: "Scarves made for every need, from corporate use to fan collections.",
    },
    cardCta: { tr: "Atkıları İncele", en: "Browse Scarves" },
    intro: {
      tr: "Klasik örgü, saçaklı, düz uçlu, ribana ve polar atkılar üretiyoruz. Renk, yazı, arma ve etiket detaylarını projenize göre şekillendiriyoruz.",
      en: "We produce classic knit, fringed, straight-end, ribbed and fleece scarves, and shape colours, lettering, crests and labels around your project.",
    },
    image: img(
      `${P}/atkilar/warriors/1.jpg`,
      "Yeşil-sarı jakarlı Warriors Football atkısı",
      "Green and gold jacquard Warriors Football scarf",
    ),
    types: [
      {
        id: "classic-knit",
        label: { tr: "Klasik örgü atkı", en: "Classic Knit Scarf" },
        description: {
          tr: "Düz örgü gövdeli klasik atkı kalıbı.",
          en: "A classic scarf with a plain knit body.",
        },
      },
      {
        id: "fringed",
        label: { tr: "Saçaklı atkı", en: "Fringed Scarf" },
        description: { tr: "Uçlarda saçak bulunur.", en: "The ends finish with fringe." },
      },
      {
        id: "straight-end",
        label: { tr: "Düz uçlu atkı", en: "Straight-End Scarf" },
        description: {
          tr: "Uçlar saçaksız, düz kesimle biter.",
          en: "The ends are cut straight, without fringe.",
        },
      },
      {
        id: "ribbed",
        label: { tr: "Ribana atkı", en: "Ribbed Knit Scarf" },
        description: { tr: "Fitilli, esneyen ribana örgü.", en: "A stretch rib knit." },
      },
      {
        id: "fleece",
        label: { tr: "Polar atkı", en: "Fleece Scarf" },
        description: { tr: "Yumuşak polar doku.", en: "A soft fleece fabric." },
      },
    ],
    faqIds: ["scarf-models", "scarf-size", "scarf-text", "min-order", "own-logo"],
    seo: {
      tr: {
        slug: "atki-uretimi",
        title: "Özel Tasarım Atkı Üretimi | RDH Tekstil",
        description:
          "Klasik örgü, saçaklı, düz uçlu, ribana ve polar atkı üretimi. Kulüp renkleri, arma ve yazıyla markanıza özel atkılar.",
        h1: "Markanıza Özel Atkı Üretimi",
      },
      en: {
        slug: "scarf-manufacturing",
        title: "Custom Scarf Manufacturing | RDH Tekstil",
        description:
          "Classic knit, fringed, straight-end, ribbed and fleece scarves, made with your colours, crest and lettering.",
        h1: "Custom Scarf Manufacturing for Your Brand",
      },
    },
  },
  {
    id: "sets",
    sortOrder: 3,
    name: { tr: "Bere & Atkı Setleri", en: "Beanie & Scarf Sets" },
    shortName: { tr: "Setler", en: "Sets" },
    cardText: {
      tr: "Aynı renk, desen ve marka diliyle tasarlanan bere ve atkı setleri.",
      en: "Beanie and scarf sets designed in the same colours, patterns and brand language.",
    },
    cardCta: { tr: "Setleri İncele", en: "Browse Sets" },
    intro: {
      tr: "Bere ve atkıyı aynı tasarım diliyle bir araya getiriyoruz. Kulüp, taraftar, kurumsal ve çocuk setlerini markanızın renkleri ve detaylarıyla üretiyoruz.",
      en: "We bring beanies and scarves together in one design language, producing club, fan, corporate and kids' sets in your brand colours and details.",
    },
    image: img(
      `${P}/setler/jets/2.jpg`,
      "Troisdorf Jets bere ve atkı seti",
      "Troisdorf Jets beanie and scarf set",
    ),
    types: [
      {
        id: "beanie-scarf",
        label: { tr: "Bere + Atkı", en: "Beanie + Scarf" },
        description: {
          tr: "Bere ve atkı aynı renk ve tasarım diliyle birlikte üretilir.",
          en: "The beanie and scarf are produced together in one colour and design language.",
        },
      },
      {
        id: "corporate",
        label: { tr: "Kurumsal", en: "Corporate" },
        description: {
          tr: "Kurumsal renk, logo ve etiketle hazırlanan set.",
          en: "A set prepared with corporate colours, a logo and a label.",
        },
      },
      {
        id: "fan",
        label: { tr: "Taraftar", en: "Fan" },
        description: {
          tr: "Kulüp renkleri ve arma ile hazırlanan taraftar seti.",
          en: "A fan set prepared with club colours and a crest.",
        },
      },
      {
        id: "kids",
        label: { tr: "Çocuk", en: "Kids" },
        description: {
          tr: "Çocuk ölçüsünde, okul veya kulüp renkleriyle hazırlanan set.",
          en: "A kids' size set in school or club colours.",
        },
      },
    ],
    faqIds: ["set-separate", "min-order", "private-label"],
    seo: {
      tr: {
        slug: "bere-atki-setleri",
        title: "Bere ve Atkı Seti Üretimi | RDH Tekstil",
        description:
          "Kulüp, taraftar, kurumsal ve çocuk bere & atkı setleri. Aynı renk, desen ve logoyla tasarlanan setler, private label seçeneğiyle.",
        h1: "Bere & Atkı Seti Üretimi",
      },
      en: {
        slug: "beanie-scarf-sets",
        title: "Beanie and Scarf Set Manufacturing | RDH Tekstil",
        description:
          "Club, fan, corporate and kids' beanie & scarf sets, designed with matching colours, patterns and logos, with a private label option.",
        h1: "Beanie & Scarf Set Manufacturing",
      },
    },
  },
];
