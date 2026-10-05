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
      tr: "Klasik, katlamalı, ponponlu ve jakarlı modellerden çocuk berelerine kadar; renk, desen, logo ve etiket detaylarıyla markanıza özel bere üretiyoruz.",
      en: "From classic, cuffed, pompom and jacquard models to kids' beanies, we produce beanies made for your brand with custom colours, patterns, logos and labels.",
    },
    image: img(`${P}/bereler/jets/1.jpg`, "Bordo-sarı ponponlu jakarlı Troisdorf Jets beresi", "Burgundy and gold pompom jacquard Troisdorf Jets beanie"),
    types: [
      { id: "classic", label: { tr: "Klasik", en: "Classic" } },
      { id: "cuffed", label: { tr: "Katlamalı", en: "Cuffed" } },
      { id: "pompom", label: { tr: "Ponponlu", en: "Pompom" } },
      { id: "jacquard", label: { tr: "Jakarlı", en: "Jacquard" } },
      { id: "kids", label: { tr: "Çocuk", en: "Kids" } },
      { id: "custom", label: { tr: "Özel Üretim", en: "Custom Made" } },
    ],
    faqIds: ["beanie-models", "beanie-logo", "min-order", "own-logo"],
    seo: {
      tr: {
        slug: "bere-uretimi",
        title: "Özel Tasarım Bere Üretimi | RDH Tekstil",
        description:
          "Logolu, jakarlı, ponponlu ve katlamalı bere üretimi. Kulüpler, markalar ve kurumlar için düşük minimum adetle özel tasarım bereler.",
        h1: "Markanıza Özel Bere Üretimi",
      },
      en: {
        slug: "beanie-manufacturing",
        title: "Custom Beanie Manufacturing | RDH Tekstil",
        description:
          "Custom logo, jacquard, pompom and cuffed beanie manufacturing for clubs, brands and organisations, with low minimum order quantities.",
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
      tr: "Örgü ve jakarlı atkılardan taraftar ve kurumsal koleksiyonlara kadar; renk, yazı, arma ve etiket detaylarını projenize göre şekillendiriyoruz.",
      en: "From knitted and jacquard scarves to fan and corporate collections, we shape colours, lettering, crests and labels around your project.",
    },
    image: img(`${P}/atkilar/warriors/1.jpg`, "Yeşil-sarı jakarlı Warriors Football atkısı", "Green and gold jacquard Warriors Football scarf"),
    types: [
      { id: "knit", label: { tr: "Örgü", en: "Knitted" } },
      { id: "jacquard", label: { tr: "Jakarlı", en: "Jacquard" } },
      { id: "fan", label: { tr: "Taraftar / Futbol", en: "Fan / Football" } },
      { id: "corporate", label: { tr: "Kurumsal", en: "Corporate" } },
      { id: "kids", label: { tr: "Çocuk", en: "Kids" } },
      { id: "custom", label: { tr: "Özel Üretim", en: "Custom Made" } },
    ],
    faqIds: ["scarf-size", "scarf-text", "min-order", "own-logo"],
    seo: {
      tr: {
        slug: "atki-uretimi",
        title: "Özel Tasarım Atkı Üretimi | RDH Tekstil",
        description:
          "Jakarlı, örgü, taraftar ve kurumsal atkı üretimi. Kulüp renkleri, arma, yazı ve etiketle markanıza özel atkılar, düşük minimum adet.",
        h1: "Markanıza Özel Atkı Üretimi",
      },
      en: {
        slug: "scarf-manufacturing",
        title: "Custom Scarf Manufacturing | RDH Tekstil",
        description:
          "Jacquard, knitted, fan and corporate scarf manufacturing with your club colours, crest, lettering and labels, at low minimum quantities.",
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
    image: img(`${P}/setler/jets/2.jpg`, "Troisdorf Jets bere ve atkı seti", "Troisdorf Jets beanie and scarf set"),
    types: [
      { id: "beanie-scarf", label: { tr: "Bere + Atkı", en: "Beanie + Scarf" } },
      { id: "corporate", label: { tr: "Kurumsal", en: "Corporate" } },
      { id: "fan", label: { tr: "Taraftar", en: "Fan" } },
      { id: "kids", label: { tr: "Çocuk", en: "Kids" } },
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
