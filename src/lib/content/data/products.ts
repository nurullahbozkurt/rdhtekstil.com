import type { z } from "zod";
import type { ContentStoreInput, productSchema } from "../schema";
import { img, P } from "./helpers";

type ProductInput = z.input<typeof productSchema>;
type Pair = readonly [tr: string, en: string];

/**
 * Ürün özellikleri sözlüğü. Ürünler yalnızca görsellerde doğrulanabilen özellikleri listeler.
 * TODO(content): İplik/malzeme bilgileri RDH'den geldiğinde özelliklere eklenecek.
 */
const FEATURES = {
  jacquard: ["Jakarlı örgü yazı ve desen", "Jacquard-knit lettering and pattern"],
  textBand: ["Kulüp, şehir veya marka adı yazısı", "Club, city or brand name lettering"],
  pompom: ["Renklerinize uygun ponpon", "Pompom in your colours"],
  cuff: ["Katlamalı kenar", "Folded cuff"],
  rib: ["Fitilli örgü gövde", "Ribbed knit body"],
  stripes: ["Çizgili renk blokları", "Striped colour blocks"],
  allover: ["Tüm yüzeyde özel desen", "All-over custom pattern"],
  plainKnit: ["Sade örgü yüzey", "Plain knit surface"],
  wovenBadge: ["Dokuma arma / logo etiketi", "Woven crest / logo badge"],
  embroidery: ["Nakış logo uygulaması", "Embroidered logo"],
  leatherPatch: ["Kabartma logolu deri etiket", "Leather patch with embossed logo"],
  wovenLabel: ["Dokuma marka etiketi", "Woven brand label"],
  fringe: ["Püsküllü uçlar", "Fringed ends"],
  herringbone: ["Balıksırtı doku", "Herringbone texture"],
  kidsFit: ["Çocuk bedenine uygun kalıp", "Kids' fit"],
  matching: ["Bere ve atkıda eşleşen tasarım", "Matching beanie and scarf design"],
  highCrown: ["Yüksek tepe", "Tall crown"],
} as const satisfies Record<string, Pair>;

type FeatureKey = keyof typeof FEATURES;

const REFERENCE_DESCRIPTION: Record<"beanies" | "scarves" | "sets", Pair> = {
  beanies: [
    "Bu model {brand} için geliştirdiğimiz bir üretimdir. Aynı yapıyı kendi renkleriniz, logonuz ve etiketinizle markanıza özel olarak üretebiliriz; örgü tipi, katlama ve ponpon detayları projenize göre belirlenir.",
    "This model is a production we developed for {brand}. We can produce the same build with your own colours, logo and label; knit type, cuff and pompom details are set for your project.",
  ],
  scarves: [
    "Bu model {brand} için geliştirdiğimiz bir üretimdir. Aynı yapıyı kendi renkleriniz, yazınız ve armanızla markanıza özel olarak üretebiliriz; ölçü ve püskül detayları projenize göre belirlenir.",
    "This model is a production we developed for {brand}. We can produce the same build with your own colours, lettering and crest; size and fringe details are set for your project.",
  ],
  sets: [
    "Bu set {brand} için geliştirdiğimiz bir üretimdir. Bere ve atkıyı aynı tasarım diliyle, kendi renkleriniz ve logonuzla markanıza özel olarak üretebiliriz.",
    "This set is a production we developed for {brand}. We can produce the beanie and scarf in one design language, with your own colours and logo.",
  ],
};

const GENERIC_DESCRIPTION: Pair = [
  "Bu modeli renk, desen, logo ve etiket seçenekleriyle projenize göre üretiyoruz. İhtiyacınızı talep ekranından paylaşın; ekibimiz size özel örnek modelleri hazırlasın.",
  "We produce this model for your project with your choice of colours, patterns, logo and label. Share your needs on the request screen and our team will prepare design proposals for you.",
];

type Def = {
  id: string;
  categoryId: ProductInput["categoryId"];
  typeIds: string[];
  industryIds: ProductInput["industryIds"];
  name: Pair;
  slug: Pair;
  summary: Pair;
  features: FeatureKey[];
  images: ProductInput["images"];
  brand?: string;
  caseStudyIds?: string[];
  featured?: boolean;
  contentStatus?: ProductInput["contentStatus"];
};

function product(def: Def, sortOrder: number): ProductInput {
  const description = def.brand
    ? REFERENCE_DESCRIPTION[def.categoryId].map((t) => t.replace("{brand}", def.brand ?? ""))
    : GENERIC_DESCRIPTION;
  return {
    id: def.id,
    categoryId: def.categoryId,
    typeIds: def.typeIds,
    industryIds: def.industryIds,
    name: { tr: def.name[0], en: def.name[1] },
    summary: { tr: def.summary[0], en: def.summary[1] },
    description: { tr: description[0], en: description[1] },
    features: {
      tr: def.features.map((key) => FEATURES[key][0]),
      en: def.features.map((key) => FEATURES[key][1]),
    },
    customizations: ["color", "pattern", "logo", "label"],
    images: def.images,
    caseStudyIds: def.caseStudyIds ?? [],
    faqIds: [],
    featured: def.featured ?? false,
    sortOrder,
    contentStatus: def.contentStatus ?? "final",
    seo: {
      tr: {
        slug: def.slug[0],
        title: `${def.name[0]} | RDH Tekstil`,
        description: def.summary[0],
        h1: def.name[0],
        ogImage: def.images[0]?.src ?? undefined,
      },
      en: {
        slug: def.slug[1],
        title: `${def.name[1]} | RDH Tekstil`,
        description: def.summary[1],
        h1: def.name[1],
        ogImage: def.images[0]?.src ?? undefined,
      },
    },
  };
}

const defs: Def[] = [
  // ---------------------------------------------------------------- Bereler
  {
    id: "troisdorf-jets-bere",
    categoryId: "beanies",
    typeIds: ["pom-pom"],
    industryIds: ["football-clubs", "fans"],
    brand: "Troisdorf Jets",
    name: ["Troisdorf Jets Ponponlu Bere", "Troisdorf Jets Pompom Beanie"],
    slug: ["troisdorf-jets-ponponlu-bere", "troisdorf-jets-pompom-beanie"],
    summary: [
      "Bordo-sarı kulüp renklerinde, jakarlı şehir yazısı ve dokuma takım logosu taşıyan ponponlu, katlamalı bere.",
      "Cuffed pompom beanie in burgundy and gold club colours, with jacquard city lettering and a woven team badge.",
    ],
    features: ["jacquard", "textBand", "pompom", "cuff", "wovenBadge"],
    images: [
      img(
        `${P}/bereler/jets/1.jpg`,
        "Bordo-sarı ponponlu Troisdorf Jets beresi",
        "Burgundy and gold Troisdorf Jets pompom beanie",
      ),
      img(
        `${P}/setler/jets/1.jpg`,
        "Troisdorf Jets beresini ve atkısını takan bir kadın",
        "A woman wearing the Troisdorf Jets beanie and scarf",
      ),
    ],
    caseStudyIds: ["troisdorf-jets"],
    featured: true,
  },
  {
    id: "warriors-football-bere",
    categoryId: "beanies",
    typeIds: ["classic-cuffed"],
    industryIds: ["football-clubs", "fans"],
    brand: "Warriors Football",
    name: ["Warriors Football Jakarlı Bere", "Warriors Football Jacquard Beanie"],
    slug: ["warriors-football-jakarli-bere", "warriors-football-jacquard-beanie"],
    summary: [
      "Yeşil, sarı ve kahve çizgiler arasında jakarlı takım yazısı ve dokuma arma uygulanan katlamalı kulüp beresi.",
      "Cuffed club beanie with jacquard team lettering between green, gold and brown stripes, finished with a woven crest.",
    ],
    features: ["jacquard", "textBand", "stripes", "cuff", "wovenBadge"],
    images: [
      img(
        `${P}/bereler/warriors/1.jpg`,
        "Yeşil zeminli Warriors Football jakarlı beresi",
        "Green Warriors Football jacquard beanie",
      ),
      img(
        `${P}/setler/warriors/2.jpg`,
        "Warriors Football beresini ve atkısını stadyumda takan bir erkek",
        "A man wearing the Warriors Football beanie and scarf at the stadium",
      ),
    ],
    caseStudyIds: ["warriors-football"],
    featured: true,
  },
  {
    id: "ecs-crocodiles-bere",
    categoryId: "beanies",
    typeIds: ["pom-pom"],
    industryIds: ["football-clubs", "fans"],
    brand: "ECS Crocodiles",
    name: ["ECS Crocodiles Ponponlu Bere", "ECS Crocodiles Pompom Beanie"],
    slug: ["ecs-crocodiles-ponponlu-bere", "ecs-crocodiles-pompom-beanie"],
    summary: [
      "Yeşil-siyah renk bloklarında jakarlı kulüp kısaltması, dokuma maskot arması ve siyah ponponla tamamlanan bere.",
      "Beanie with jacquard club initials in green and black colour blocks, a woven mascot badge and a black pompom.",
    ],
    features: ["jacquard", "stripes", "pompom", "cuff", "wovenBadge"],
    images: [
      img(
        `${P}/bereler/ecs/1.jpg`,
        "Yeşil-siyah ECS Crocodiles ponponlu beresi",
        "Green and black ECS Crocodiles pompom beanie",
      ),
      img(
        `${P}/setler/ecs/1.jpg`,
        "ECS Crocodiles beresini ve atkısını stadyumda takan bir erkek",
        "A man wearing the ECS Crocodiles beanie and scarf at the stadium",
      ),
    ],
    caseStudyIds: ["ecs-crocodiles"],
  },
  {
    id: "annaburg-bere",
    categoryId: "beanies",
    typeIds: ["classic-cuffed"],
    industryIds: ["football-clubs", "fans"],
    brand: "SV Grün-Weiss Annaburg",
    name: ["Grün-Weiss Annaburg Kulüp Beresi", "Grün-Weiss Annaburg Club Beanie"],
    slug: ["grun-weiss-annaburg-kulup-beresi", "grun-weiss-annaburg-club-beanie"],
    summary: [
      "Yeşil-beyaz kulüp renklerinde, jakarlı kulüp adı ve nakışlı arma uygulanan katlamalı futbol kulübü beresi.",
      "Cuffed football club beanie in green and white, with the club name knitted in jacquard and an embroidered crest.",
    ],
    features: ["jacquard", "textBand", "stripes", "cuff", "embroidery"],
    images: [
      img(
        `${P}/bereler/anna-burg/1.jpg`,
        "Yeşil-beyaz Grün-Weiss Annaburg kulüp beresi",
        "Green and white Grün-Weiss Annaburg club beanie",
      ),
      img(
        `${P}/setler/anna-burg/1.jpg`,
        "Grün-Weiss Annaburg beresini ve atkısını takan bir erkek",
        "A man wearing the Grün-Weiss Annaburg beanie and scarf",
      ),
    ],
  },
  {
    id: "ski-club-trosel-bere",
    categoryId: "beanies",
    typeIds: ["classic-cuffed"],
    industryIds: ["football-clubs"],
    brand: "Ski-Club Trösel",
    name: ["Ski-Club Trösel Jakarlı Bere", "Ski-Club Trösel Jacquard Beanie"],
    slug: ["ski-club-trosel-jakarli-bere", "ski-club-trosel-jacquard-beanie"],
    summary: [
      "Lacivert zemin üzerinde jakarlı dağ silüeti ve kulüp adı, katlama kısmında nakış kayakçı logosu bulunan bere.",
      "Navy beanie with a jacquard mountain silhouette and club name, plus an embroidered skier logo on the cuff.",
    ],
    features: ["jacquard", "textBand", "cuff", "embroidery"],
    images: [
      img(
        `${P}/bereler/trosel/1.jpg`,
        "Lacivert Ski-Club Trösel jakarlı beresi",
        "Navy Ski-Club Trösel jacquard beanie",
      ),
      img(
        `${P}/setler/trosel/2.jpg`,
        "Ski-Club Trösel beresini ve atkısını takan bir erkek",
        "A man wearing the Ski-Club Trösel beanie and scarf",
      ),
    ],
    caseStudyIds: ["ski-club-trosel"],
  },
  {
    id: "krattigen-bere",
    categoryId: "beanies",
    typeIds: ["classic-cuffed"],
    industryIds: ["football-clubs", "fans"],
    brand: "Krattigen",
    name: ["Krattigen Jakarlı Bere", "Krattigen Jacquard Beanie"],
    slug: ["krattigen-jakarli-bere", "krattigen-jacquard-beanie"],
    summary: [
      "Siyah, gri ve beyaz çizgiler arasında jakarlı yazı ve katlama üzerinde nakış maskot uygulanan kulüp beresi.",
      "Club beanie with jacquard lettering between black, grey and white stripes and an embroidered mascot on the cuff.",
    ],
    features: ["jacquard", "textBand", "stripes", "cuff", "embroidery"],
    images: [
      img(
        `${P}/bereler/krattigen/1.jpg`,
        "Siyah-gri Krattigen jakarlı beresi",
        "Black and grey Krattigen jacquard beanie",
      ),
      img(
        `${P}/setler/krattigen/1.jpg`,
        "Krattigen beresini ve atkısını takan bir erkek",
        "A man wearing the Krattigen beanie and scarf",
      ),
    ],
  },
  {
    id: "tinder-bere",
    categoryId: "beanies",
    typeIds: ["uncuffed"],
    industryIds: ["corporate"],
    brand: "Tinder",
    name: ["Tinder Desenli Kurumsal Bere", "Tinder Patterned Corporate Beanie"],
    slug: ["tinder-desenli-kurumsal-bere", "tinder-patterned-corporate-beanie"],
    summary: [
      "Marka renkleriyle tüm yüzeye işlenmiş jakarlı özel desen ve dokuma marka etiketiyle üretilen kurumsal bere.",
      "Corporate beanie with an all-over custom jacquard pattern in brand colours and a woven brand label.",
    ],
    features: ["allover", "jacquard", "wovenLabel"],
    images: [
      img(
        `${P}/bereler/tinder/1.jpg`,
        "Pembe-turuncu desenli Tinder beresi",
        "Pink and orange patterned Tinder beanie",
      ),
      img(
        `${P}/setler/tinder/3.jpg`,
        "Tinder beresini ve atkısını takan bir kadın",
        "A woman wearing the Tinder beanie and scarf",
      ),
    ],
    caseStudyIds: ["tinder"],
    featured: true,
  },
  {
    id: "es-deri-etiketli-bere",
    categoryId: "beanies",
    typeIds: ["classic-cuffed"],
    industryIds: ["private-label", "corporate"],
    brand: "ES",
    name: ["ES Deri Etiketli Bere", "ES Leather Patch Beanie"],
    slug: ["es-deri-etiketli-bere", "es-leather-patch-beanie"],
    summary: [
      "Gri örgü gövde ve katlama üzerinde kabartma logolu deri etiketle sade bir marka diline sahip private label bere.",
      "Minimal private label beanie in grey knit, with a leather patch carrying an embossed logo on the cuff.",
    ],
    features: ["plainKnit", "cuff", "leatherPatch"],
    images: [
      img(
        `${P}/bereler/es/1.jpg`,
        "Deri etiketli gri katlamalı bere",
        "Grey cuffed beanie with a leather patch",
      ),
      img(
        `${P}/setler/es/2.jpg`,
        "ES beresini ve atkısını takan bir erkek",
        "A man wearing the ES beanie and scarf",
      ),
    ],
    caseStudyIds: ["es-private-label"],
  },
  {
    id: "rdh-cizgili-bere",
    categoryId: "beanies",
    typeIds: ["pom-pom"],
    industryIds: ["private-label", "corporate"],
    brand: "RDH Tekstil",
    name: ["RDH Çizgili Ponponlu Bere", "RDH Striped Pompom Beanie"],
    slug: ["rdh-cizgili-ponponlu-bere", "rdh-striped-pompom-beanie"],
    summary: [
      "Lacivert fitilli örgü, altın tonlu çizgiler, iki renkli ponpon ve dokuma etiketle RDH Tekstil koleksiyon beresi.",
      "RDH Tekstil collection beanie in navy rib knit with gold-tone stripes, a two-tone pompom and a woven label.",
    ],
    features: ["rib", "stripes", "pompom", "cuff", "wovenLabel"],
    images: [
      img(
        `${P}/bereler/rdh/1.jpg`,
        "Lacivert-altın çizgili RDH ponponlu beresi",
        "Navy and gold striped RDH pompom beanie",
      ),
      img(
        `${P}/setler/rdh/2.jpg`,
        "RDH çizgili beresini ve atkısını takan bir erkek",
        "A man wearing the striped RDH beanie and scarf",
      ),
    ],
  },
  {
    id: "cocuk-bere",
    categoryId: "beanies",
    typeIds: ["classic-cuffed"],
    industryIds: ["schools"],
    brand: "RDH Tekstil",
    name: ["Çocuk Beresi", "Kids' Beanie"],
    slug: ["cocuk-beresi", "kids-beanie"],
    summary: [
      "Açık mavi fitilli örgü, katlamalı kenar ve dokuma RDH Tekstil Kids etiketiyle hazırlanan çocuk beresi.",
      "Light blue rib-knit kids' beanie with a folded cuff and a woven RDH Tekstil Kids label.",
    ],
    features: ["kidsFit", "rib", "cuff", "wovenLabel"],
    images: [
      img(
        `${P}/bereler/cocuk/image_20261005_224311.jpg`,
        "Açık mavi fitilli, katlamalı çocuk beresi",
        "Light blue ribbed kids' beanie with a folded cuff",
      ),
      img(
        `${P}/setler/cocuk/1.jpg`,
        "Açık mavi çocuk beresini ve atkısını takan bir çocuk",
        "A child wearing the light blue kids' beanie and scarf",
      ),
    ],
  },

  // ---------------------------------------------------------------- Atkılar
  {
    id: "troisdorf-jets-atki",
    categoryId: "scarves",
    typeIds: ["fringed"],
    industryIds: ["football-clubs", "fans"],
    brand: "Troisdorf Jets",
    name: ["Troisdorf Jets Taraftar Atkısı", "Troisdorf Jets Fan Scarf"],
    slug: ["troisdorf-jets-taraftar-atkisi", "troisdorf-jets-fan-scarf"],
    summary: [
      "Bordo zemin üzerinde sarı jakarlı şehir yazısı, dokuma takım logosu ve iki renkli püsküllerle taraftar atkısı.",
      "Fan scarf with gold jacquard city lettering on burgundy, a woven team badge and two-tone fringe.",
    ],
    features: ["jacquard", "textBand", "wovenBadge", "fringe"],
    images: [
      img(
        `${P}/atkilar/jets/1.jpg`,
        "Bordo-sarı Troisdorf Jets taraftar atkısı",
        "Burgundy and gold Troisdorf Jets fan scarf",
      ),
      img(
        `${P}/setler/jets/1.jpg`,
        "Troisdorf Jets atkısı ve beresini takan bir kadın",
        "A woman wearing the Troisdorf Jets scarf and beanie",
      ),
    ],
    caseStudyIds: ["troisdorf-jets"],
    featured: true,
  },
  {
    id: "warriors-football-atki",
    categoryId: "scarves",
    typeIds: ["fringed"],
    industryIds: ["football-clubs", "fans"],
    brand: "Warriors Football",
    name: ["Warriors Football Taraftar Atkısı", "Warriors Football Fan Scarf"],
    slug: ["warriors-football-taraftar-atkisi", "warriors-football-fan-scarf"],
    summary: [
      "Çizgili kulüp renklerinde jakarlı takım yazısı, dokuma arma ve kalın püsküllerle üretilen taraftar atkısı.",
      "Fan scarf with jacquard team lettering in striped club colours, a woven crest and chunky fringe.",
    ],
    features: ["jacquard", "textBand", "stripes", "wovenBadge", "fringe"],
    images: [
      img(
        `${P}/atkilar/warriors/1.jpg`,
        "Yeşil-sarı Warriors Football atkısı",
        "Green and gold Warriors Football scarf",
      ),
      img(
        `${P}/setler/warriors/2.jpg`,
        "Warriors Football atkısını ve beresini stadyumda takan bir erkek",
        "A man wearing the Warriors Football scarf and beanie at the stadium",
      ),
    ],
    caseStudyIds: ["warriors-football"],
  },
  {
    id: "ecs-crocodiles-atki",
    categoryId: "scarves",
    typeIds: ["ribbed"],
    industryIds: ["football-clubs", "fans"],
    brand: "ECS Crocodiles",
    name: ["ECS Crocodiles Atkısı", "ECS Crocodiles Scarf"],
    slug: ["ecs-crocodiles-atkisi", "ecs-crocodiles-scarf"],
    summary: [
      "Yeşil fitilli örgü üzerinde siyah bant içinde jakarlı kulüp kısaltması ve dokuma maskot armasıyla atkı.",
      "Green rib-knit scarf with jacquard club initials in a black band and a woven mascot badge.",
    ],
    features: ["jacquard", "rib", "wovenBadge", "fringe"],
    images: [
      img(
        `${P}/atkilar/ecs/1.jpg`,
        "Yeşil-siyah ECS Crocodiles atkısı",
        "Green and black ECS Crocodiles scarf",
      ),
      img(
        `${P}/setler/ecs/1.jpg`,
        "ECS Crocodiles atkısını ve beresini stadyumda takan bir erkek",
        "A man wearing the ECS Crocodiles scarf and beanie at the stadium",
      ),
    ],
    caseStudyIds: ["ecs-crocodiles"],
  },
  {
    id: "annaburg-atki",
    categoryId: "scarves",
    typeIds: ["fringed"],
    industryIds: ["football-clubs", "fans"],
    brand: "SV Grün-Weiss Annaburg",
    name: ["Grün-Weiss Annaburg Kulüp Atkısı", "Grün-Weiss Annaburg Club Scarf"],
    slug: ["grun-weiss-annaburg-kulup-atkisi", "grun-weiss-annaburg-club-scarf"],
    summary: [
      "Yeşil-beyaz çizgiler, jakarlı kulüp adı, nakışlı arma ve beyaz püsküllerle tamamlanan futbol kulübü atkısı.",
      "Football club scarf with green and white stripes, the club name in jacquard, an embroidered crest and white fringe.",
    ],
    features: ["jacquard", "textBand", "stripes", "embroidery", "fringe"],
    images: [
      img(
        `${P}/atkilar/anna-burg/1.jpg`,
        "Yeşil-beyaz Grün-Weiss Annaburg atkısı",
        "Green and white Grün-Weiss Annaburg scarf",
      ),
      img(
        `${P}/setler/anna-burg/1.jpg`,
        "Grün-Weiss Annaburg atkısını ve beresini takan bir erkek",
        "A man wearing the Grün-Weiss Annaburg scarf and beanie",
      ),
    ],
  },
  {
    id: "ski-club-trosel-atki",
    categoryId: "scarves",
    typeIds: ["fringed"],
    industryIds: ["football-clubs"],
    brand: "Ski-Club Trösel",
    name: ["Ski-Club Trösel Örgü Atkı", "Ski-Club Trösel Knitted Scarf"],
    slug: ["ski-club-trosel-orgu-atki", "ski-club-trosel-knitted-scarf"],
    summary: [
      "Lacivert örgü gövde, beyaz çizgiler ve nakış kayakçı logosuyla sade bir çizgide üretilen kulüp atkısı.",
      "Understated club scarf in navy knit with white stripes and an embroidered skier logo.",
    ],
    features: ["plainKnit", "stripes", "embroidery", "fringe"],
    images: [
      img(
        `${P}/atkilar/trosel/1.jpg`,
        "Lacivert-beyaz Ski-Club Trösel atkısı",
        "Navy and white Ski-Club Trösel scarf",
      ),
      img(
        `${P}/setler/trosel/2.jpg`,
        "Ski-Club Trösel atkısını ve beresini takan bir erkek",
        "A man wearing the Ski-Club Trösel scarf and beanie",
      ),
    ],
    caseStudyIds: ["ski-club-trosel"],
  },
  {
    id: "krattigen-atki",
    categoryId: "scarves",
    typeIds: ["fringed"],
    industryIds: ["football-clubs", "fans"],
    brand: "Krattigen",
    name: ["Krattigen Jakarlı Atkı", "Krattigen Jacquard Scarf"],
    slug: ["krattigen-jakarli-atki", "krattigen-jacquard-scarf"],
    summary: [
      "Siyah-gri-beyaz çizgiler arasında jakarlı yazı ve dokuma maskot etiketiyle hazırlanan taraftar atkısı.",
      "Fan scarf with jacquard lettering between black, grey and white stripes and a woven mascot label.",
    ],
    features: ["jacquard", "textBand", "stripes", "wovenBadge", "fringe"],
    images: [
      img(
        `${P}/atkilar/krattigen/1.jpg`,
        "Siyah-gri Krattigen jakarlı atkısı",
        "Black and grey Krattigen jacquard scarf",
      ),
      img(
        `${P}/setler/krattigen/1.jpg`,
        "Krattigen atkısını ve beresini takan bir erkek",
        "A man wearing the Krattigen scarf and beanie",
      ),
    ],
  },
  {
    id: "tinder-atki",
    categoryId: "scarves",
    typeIds: ["fringed"],
    industryIds: ["corporate"],
    brand: "Tinder",
    name: ["Tinder Desenli Kurumsal Atkı", "Tinder Patterned Corporate Scarf"],
    slug: ["tinder-desenli-kurumsal-atki", "tinder-patterned-corporate-scarf"],
    summary: [
      "Marka renkleriyle tüm yüzeye işlenmiş jakarlı desen, renkli püskül ve dokuma marka etiketiyle kurumsal atkı.",
      "Corporate scarf with an all-over jacquard pattern in brand colours, multicolour fringe and a woven brand label.",
    ],
    features: ["allover", "jacquard", "wovenLabel", "fringe"],
    images: [
      img(
        `${P}/atkilar/tinder/1.jpg`,
        "Pembe-turuncu desenli Tinder atkısı",
        "Pink and orange patterned Tinder scarf",
      ),
      img(
        `${P}/setler/tinder/3.jpg`,
        "Tinder atkısını ve beresini takan bir kadın",
        "A woman wearing the Tinder scarf and beanie",
      ),
    ],
    caseStudyIds: ["tinder"],
  },
  {
    id: "es-deri-etiketli-atki",
    categoryId: "scarves",
    typeIds: ["fringed"],
    industryIds: ["private-label", "corporate"],
    brand: "ES",
    name: ["ES Deri Etiketli Örgü Atkı", "ES Knitted Scarf with Leather Patch"],
    slug: ["es-deri-etiketli-orgu-atki", "es-knitted-scarf-leather-patch"],
    summary: [
      "Gri örgü gövde, ton sür ton püsküller ve kabartma logolu deri etiketle hazırlanan private label atkı.",
      "Private label scarf in grey knit with tonal fringe and a leather patch carrying an embossed logo.",
    ],
    features: ["plainKnit", "leatherPatch", "fringe"],
    images: [
      img(
        `${P}/atkilar/es/1.jpg`,
        "Deri etiketli gri örgü atkı",
        "Grey knitted scarf with a leather patch",
      ),
      img(
        `${P}/setler/es/2.jpg`,
        "ES atkısını ve beresini takan bir erkek",
        "A man wearing the ES scarf and beanie",
      ),
    ],
    caseStudyIds: ["es-private-label"],
  },
  {
    id: "rdh-cizgili-atki",
    categoryId: "scarves",
    typeIds: ["ribbed"],
    industryIds: ["private-label", "corporate"],
    brand: "RDH Tekstil",
    name: ["RDH Çizgili Örgü Atkı", "RDH Striped Knitted Scarf"],
    slug: ["rdh-cizgili-orgu-atki", "rdh-striped-knitted-scarf"],
    summary: [
      "Lacivert fitilli örgü, altın tonlu çizgiler, iki renkli püskül ve dokuma etiketle RDH Tekstil koleksiyon atkısı.",
      "RDH Tekstil collection scarf in navy rib knit with gold-tone stripes, two-tone fringe and a woven label.",
    ],
    features: ["rib", "stripes", "wovenLabel", "fringe"],
    images: [
      img(
        `${P}/atkilar/rdh/1.jpg`,
        "Lacivert-altın çizgili RDH atkısı",
        "Navy and gold striped RDH scarf",
      ),
      img(
        `${P}/setler/rdh/2.jpg`,
        "RDH çizgili atkısını ve beresini takan bir erkek",
        "A man wearing the striped RDH scarf and beanie",
      ),
    ],
  },
  {
    id: "kurumsal-orgu-atki",
    categoryId: "scarves",
    typeIds: ["fringed"],
    industryIds: ["corporate"],
    name: ["Klasik Kurumsal Örgü Atkı", "Classic Corporate Knitted Scarf"],
    slug: ["klasik-kurumsal-orgu-atki", "classic-corporate-knitted-scarf"],
    summary: [
      "Antrasit balıksırtı dokuda, nakış monogram ve püsküllü uçlarla hazırlanan kurumsal atkı.",
      "Charcoal herringbone scarf with an embroidered monogram and fringed ends, for corporate use.",
    ],
    features: ["herringbone", "embroidery", "fringe"],
    images: [
      img(
        `${P}/atkilar/kurumsal/1.jpg`,
        "Antrasit balıksırtı kurumsal atkı",
        "Charcoal herringbone corporate scarf",
      ),
      img(
        `${P}/atkilar/kurumsal/2.jpg`,
        "Kurumsal atkıyı takan bir erkek",
        "A man wearing the corporate scarf",
      ),
    ],
  },
  {
    id: "cizgili-taraftar-atkisi",
    categoryId: "scarves",
    typeIds: ["fringed"],
    industryIds: ["fans", "football-clubs"],
    name: ["Çizgili Taraftar Atkısı", "Striped Fan Scarf"],
    slug: ["cizgili-taraftar-atkisi", "striped-fan-scarf"],
    summary: [
      "Yeşil-siyah kalın çizgili örgü, nakışlı arma ve püsküllü uçlarla hazırlanan taraftar atkısı.",
      "Fan scarf in bold green and black stripes, with an embroidered crest and fringed ends.",
    ],
    features: ["stripes", "embroidery", "fringe", "wovenLabel"],
    images: [
      img(
        `${P}/atkilar/orgu/1.jpg`,
        "Yeşil-siyah çizgili, nakışlı armalı taraftar atkısı",
        "Green and black striped fan scarf with an embroidered crest",
      ),
      img(
        `${P}/atkilar/orgu/2.jpg`,
        "Çizgili taraftar atkısını takan bir kadın",
        "A woman wearing the striped fan scarf",
      ),
    ],
  },
  {
    id: "cocuk-atki",
    categoryId: "scarves",
    typeIds: ["ribbed"],
    industryIds: ["schools"],
    brand: "RDH Tekstil",
    name: ["Çocuk Atkısı", "Kids' Scarf"],
    slug: ["cocuk-atkisi", "kids-scarf"],
    summary: [
      "Açık mavi fitilli örgü ve dokuma RDH Tekstil etiketle hazırlanan, çocuk bedenine uygun atkı.",
      "Light blue rib-knit kids' scarf with a woven RDH Tekstil label, made in a children's size.",
    ],
    features: ["kidsFit", "rib", "wovenLabel"],
    images: [
      img(
        `${P}/atkilar/cocuk/1.jpg`,
        "Açık mavi fitilli, dokuma etiketli çocuk atkısı",
        "Light blue ribbed kids' scarf with a woven label",
      ),
      img(
        `${P}/setler/cocuk/1.jpg`,
        "Açık mavi çocuk beresini ve atkısını takan bir çocuk",
        "A child wearing the light blue kids' beanie and scarf",
      ),
    ],
  },

  // ---------------------------------------------------------------- Setler
  {
    id: "troisdorf-jets-set",
    categoryId: "sets",
    typeIds: ["fan", "beanie-scarf"],
    industryIds: ["football-clubs", "fans"],
    brand: "Troisdorf Jets",
    name: ["Troisdorf Jets Bere & Atkı Seti", "Troisdorf Jets Beanie & Scarf Set"],
    slug: ["troisdorf-jets-bere-atki-seti", "troisdorf-jets-beanie-scarf-set"],
    summary: [
      "Bordo-sarı kulüp renklerinde, aynı jakarlı şehir yazısı ve takım logosunu taşıyan ponponlu bere ve püsküllü atkı seti.",
      "Pompom beanie and fringed scarf set in burgundy and gold, sharing the same jacquard city lettering and team badge.",
    ],
    features: ["matching", "jacquard", "textBand", "pompom", "wovenBadge", "fringe"],
    images: [
      img(
        `${P}/setler/jets/2.jpg`,
        "Troisdorf Jets bere ve atkı seti",
        "Troisdorf Jets beanie and scarf set",
      ),
      img(
        `${P}/setler/jets/1.jpg`,
        "Troisdorf Jets setini şehirde takan bir kadın",
        "A woman wearing the Troisdorf Jets set in the city",
      ),
      img(`${P}/bereler/jets/1.jpg`, "Troisdorf Jets beresi", "Troisdorf Jets beanie"),
      img(`${P}/atkilar/jets/1.jpg`, "Troisdorf Jets atkısı", "Troisdorf Jets scarf"),
    ],
    caseStudyIds: ["troisdorf-jets"],
    featured: true,
  },
  {
    id: "warriors-football-set",
    categoryId: "sets",
    typeIds: ["fan", "beanie-scarf"],
    industryIds: ["football-clubs", "fans"],
    brand: "Warriors Football",
    name: ["Warriors Football Bere & Atkı Seti", "Warriors Football Beanie & Scarf Set"],
    slug: ["warriors-football-bere-atki-seti", "warriors-football-beanie-scarf-set"],
    summary: [
      "Yeşil-sarı çizgili kulüp renklerinde, jakarlı takım yazısı ve dokuma armayla eşleşen bere ve atkı seti.",
      "Matching beanie and scarf set in green and gold striped club colours, with jacquard team lettering and a woven crest.",
    ],
    features: ["matching", "jacquard", "textBand", "stripes", "wovenBadge", "fringe"],
    images: [
      img(
        `${P}/setler/warriors/1.jpg`,
        "Warriors Football bere ve atkı seti",
        "Warriors Football beanie and scarf set",
      ),
      img(
        `${P}/setler/warriors/2.jpg`,
        "Warriors Football setini stadyumda takan bir erkek",
        "A man wearing the Warriors Football set at the stadium",
      ),
      img(`${P}/bereler/warriors/1.jpg`, "Warriors Football beresi", "Warriors Football beanie"),
      img(`${P}/atkilar/warriors/1.jpg`, "Warriors Football atkısı", "Warriors Football scarf"),
    ],
    caseStudyIds: ["warriors-football"],
  },
  {
    id: "ecs-crocodiles-set",
    categoryId: "sets",
    typeIds: ["fan", "beanie-scarf"],
    industryIds: ["football-clubs", "fans"],
    brand: "ECS Crocodiles",
    name: ["ECS Crocodiles Bere & Atkı Seti", "ECS Crocodiles Beanie & Scarf Set"],
    slug: ["ecs-crocodiles-bere-atki-seti", "ecs-crocodiles-beanie-scarf-set"],
    summary: [
      "Yeşil-siyah renk bloklarında jakarlı kulüp kısaltması ve maskot armasıyla eşleşen ponponlu bere ve atkı seti.",
      "Matching pompom beanie and scarf set with jacquard club initials and a mascot badge in green and black.",
    ],
    features: ["matching", "jacquard", "pompom", "wovenBadge", "fringe"],
    images: [
      img(
        `${P}/setler/ecs/3.jpg`,
        "ECS Crocodiles bere ve atkı seti",
        "ECS Crocodiles beanie and scarf set",
      ),
      img(
        `${P}/setler/ecs/1.jpg`,
        "ECS Crocodiles setini stadyumda takan bir erkek",
        "A man wearing the ECS Crocodiles set at the stadium",
      ),
      img(`${P}/bereler/ecs/1.jpg`, "ECS Crocodiles beresi", "ECS Crocodiles beanie"),
      img(`${P}/atkilar/ecs/1.jpg`, "ECS Crocodiles atkısı", "ECS Crocodiles scarf"),
    ],
    caseStudyIds: ["ecs-crocodiles"],
  },
  {
    id: "annaburg-set",
    categoryId: "sets",
    typeIds: ["fan", "beanie-scarf"],
    industryIds: ["football-clubs", "fans"],
    brand: "SV Grün-Weiss Annaburg",
    name: ["Grün-Weiss Annaburg Bere & Atkı Seti", "Grün-Weiss Annaburg Beanie & Scarf Set"],
    slug: ["grun-weiss-annaburg-bere-atki-seti", "grun-weiss-annaburg-beanie-scarf-set"],
    summary: [
      "Yeşil-beyaz kulüp renklerinde, jakarlı kulüp adı ve nakışlı armayla eşleşen bere ve atkı seti.",
      "Matching beanie and scarf set in green and white club colours, with the club name in jacquard and an embroidered crest.",
    ],
    features: ["matching", "jacquard", "textBand", "embroidery", "fringe"],
    images: [
      img(
        `${P}/setler/anna-burg/2.jpg`,
        "Grün-Weiss Annaburg bere ve atkı seti",
        "Grün-Weiss Annaburg beanie and scarf set",
      ),
      img(
        `${P}/setler/anna-burg/1.jpg`,
        "Grün-Weiss Annaburg setini takan bir erkek",
        "A man wearing the Grün-Weiss Annaburg set",
      ),
      img(
        `${P}/bereler/anna-burg/1.jpg`,
        "Grün-Weiss Annaburg beresi",
        "Grün-Weiss Annaburg beanie",
      ),
      img(
        `${P}/atkilar/anna-burg/1.jpg`,
        "Grün-Weiss Annaburg atkısı",
        "Grün-Weiss Annaburg scarf",
      ),
    ],
  },
  {
    id: "ski-club-trosel-set",
    categoryId: "sets",
    typeIds: ["beanie-scarf"],
    industryIds: ["football-clubs"],
    brand: "Ski-Club Trösel",
    name: ["Ski-Club Trösel Bere & Atkı Seti", "Ski-Club Trösel Beanie & Scarf Set"],
    slug: ["ski-club-trosel-bere-atki-seti", "ski-club-trosel-beanie-scarf-set"],
    summary: [
      "Lacivert-beyaz kulüp renklerinde, nakış kayakçı logosuyla eşleşen jakarlı bere ve örgü atkı seti.",
      "Jacquard beanie and knitted scarf set in navy and white club colours, matched with an embroidered skier logo.",
    ],
    features: ["matching", "jacquard", "stripes", "embroidery", "fringe"],
    images: [
      img(
        `${P}/setler/trosel/1.jpg`,
        "Ski-Club Trösel bere ve atkı seti",
        "Ski-Club Trösel beanie and scarf set",
      ),
      img(
        `${P}/setler/trosel/2.jpg`,
        "Ski-Club Trösel setini takan bir erkek",
        "A man wearing the Ski-Club Trösel set",
      ),
      img(`${P}/bereler/trosel/1.jpg`, "Ski-Club Trösel beresi", "Ski-Club Trösel beanie"),
      img(`${P}/atkilar/trosel/1.jpg`, "Ski-Club Trösel atkısı", "Ski-Club Trösel scarf"),
    ],
    caseStudyIds: ["ski-club-trosel"],
  },
  {
    id: "krattigen-set",
    categoryId: "sets",
    typeIds: ["fan", "beanie-scarf"],
    industryIds: ["football-clubs", "fans"],
    brand: "Krattigen",
    name: ["Krattigen Bere & Atkı Seti", "Krattigen Beanie & Scarf Set"],
    slug: ["krattigen-bere-atki-seti", "krattigen-beanie-scarf-set"],
    summary: [
      "Siyah-gri-beyaz çizgilerde jakarlı yazı ve maskot uygulamasıyla eşleşen kulüp bere ve atkı seti.",
      "Matching club beanie and scarf set with jacquard lettering and a mascot application in black, grey and white stripes.",
    ],
    features: ["matching", "jacquard", "textBand", "stripes", "fringe"],
    images: [
      img(
        `${P}/setler/krattigen/2.jpg`,
        "Krattigen bere ve atkı seti",
        "Krattigen beanie and scarf set",
      ),
      img(
        `${P}/setler/krattigen/1.jpg`,
        "Krattigen setini takan bir erkek",
        "A man wearing the Krattigen set",
      ),
      img(`${P}/bereler/krattigen/1.jpg`, "Krattigen beresi", "Krattigen beanie"),
      img(`${P}/atkilar/krattigen/1.jpg`, "Krattigen atkısı", "Krattigen scarf"),
    ],
  },
  {
    id: "tinder-set",
    categoryId: "sets",
    typeIds: ["corporate", "beanie-scarf"],
    industryIds: ["corporate"],
    brand: "Tinder",
    name: ["Tinder Kurumsal Bere & Atkı Seti", "Tinder Corporate Beanie & Scarf Set"],
    slug: ["tinder-kurumsal-bere-atki-seti", "tinder-corporate-beanie-scarf-set"],
    summary: [
      "Marka renkleriyle tüm yüzeye işlenmiş jakarlı desende, dokuma marka etiketli kurumsal bere ve atkı seti.",
      "Corporate beanie and scarf set with an all-over jacquard pattern in brand colours and woven brand labels.",
    ],
    features: ["matching", "allover", "jacquard", "wovenLabel", "fringe"],
    images: [
      img(`${P}/setler/tinder/2.jpg`, "Tinder bere ve atkı seti", "Tinder beanie and scarf set"),
      img(
        `${P}/setler/tinder/3.jpg`,
        "Tinder setini takan bir kadın",
        "A woman wearing the Tinder set",
      ),
      img(`${P}/bereler/tinder/1.jpg`, "Tinder beresi", "Tinder beanie"),
      img(`${P}/atkilar/tinder/1.jpg`, "Tinder atkısı", "Tinder scarf"),
    ],
    caseStudyIds: ["tinder"],
    featured: true,
  },
  {
    id: "es-set",
    categoryId: "sets",
    typeIds: ["corporate", "beanie-scarf"],
    industryIds: ["private-label", "corporate"],
    brand: "ES",
    name: ["ES Private Label Bere & Atkı Seti", "ES Private Label Beanie & Scarf Set"],
    slug: ["es-private-label-bere-atki-seti", "es-private-label-beanie-scarf-set"],
    summary: [
      "Gri örgü ve kabartma logolu deri etiketlerle sade bir marka diliyle hazırlanan private label bere ve atkı seti.",
      "Private label beanie and scarf set in grey knit with embossed leather patches, in a minimal brand language.",
    ],
    features: ["matching", "plainKnit", "leatherPatch", "fringe"],
    images: [
      img(
        `${P}/setler/es/1.jpg`,
        "Deri etiketli gri bere ve atkı seti",
        "Grey beanie and scarf set with leather patches",
      ),
      img(`${P}/setler/es/2.jpg`, "ES setini takan bir erkek", "A man wearing the ES set"),
      img(`${P}/bereler/es/1.jpg`, "ES beresi", "ES beanie"),
      img(`${P}/atkilar/es/1.jpg`, "ES atkısı", "ES scarf"),
    ],
    caseStudyIds: ["es-private-label"],
  },
  {
    id: "rdh-set",
    categoryId: "sets",
    typeIds: ["corporate", "beanie-scarf"],
    industryIds: ["private-label", "corporate"],
    brand: "RDH Tekstil",
    name: ["RDH Lacivert Bere & Atkı Seti", "RDH Navy Beanie & Scarf Set"],
    slug: ["rdh-lacivert-bere-atki-seti", "rdh-navy-beanie-scarf-set"],
    summary: [
      "Lacivert ve altın tonlarında, dokuma RDH Tekstil etiketli ponponlu bere ve püsküllü atkıdan oluşan koleksiyon seti.",
      "Collection set of a pompom beanie and fringed scarf in navy and gold, with woven RDH Tekstil labels.",
    ],
    features: ["matching", "rib", "stripes", "pompom", "wovenLabel", "fringe"],
    images: [
      img(
        `${P}/setler/rdh/1.png`,
        "RDH Tekstil lacivert bere ve atkı seti",
        "RDH Tekstil navy beanie and scarf set",
      ),
      img(
        `${P}/setler/rdh/2.jpg`,
        "RDH çizgili seti takan bir erkek",
        "A man wearing the striped RDH set",
      ),
      img(`${P}/bereler/rdh/1.jpg`, "RDH çizgili ponponlu bere", "RDH striped pompom beanie"),
      img(`${P}/atkilar/rdh/1.jpg`, "RDH çizgili atkı", "RDH striped scarf"),
    ],
  },
  {
    id: "cocuk-set",
    categoryId: "sets",
    typeIds: ["kids", "beanie-scarf"],
    industryIds: ["schools"],
    brand: "RDH Tekstil",
    name: ["Çocuk Bere & Atkı Seti", "Kids' Beanie & Scarf Set"],
    slug: ["cocuk-bere-atki-seti", "kids-beanie-scarf-set"],
    summary: [
      "Açık mavi fitilli örgüden, dokuma RDH Tekstil Kids etiketli bere ve atkıdan oluşan çocuk seti.",
      "Kids' set of a light blue rib-knit beanie and scarf, with a woven RDH Tekstil Kids label.",
    ],
    features: ["matching", "kidsFit", "rib", "cuff", "wovenLabel"],
    images: [
      img(
        `${P}/setler/cocuk/image_20261005_224324.jpg`,
        "Açık mavi fitilli çocuk bere ve atkı seti",
        "Light blue ribbed kids' beanie and scarf set",
      ),
      img(
        `${P}/setler/cocuk/1.jpg`,
        "Açık mavi çocuk beresini ve atkısını takan bir çocuk",
        "A child wearing the light blue kids' beanie and scarf",
      ),
      img(
        `${P}/bereler/cocuk/image_20261005_224311.jpg`,
        "Açık mavi fitilli çocuk beresi",
        "Light blue ribbed kids' beanie",
      ),
      img(
        `${P}/atkilar/cocuk/1.jpg`,
        "Açık mavi fitilli çocuk atkısı",
        "Light blue ribbed kids' scarf",
      ),
    ],
  },
  {
    id: "yuksek-tepeli-bere",
    categoryId: "beanies",
    typeIds: ["high-top"],
    industryIds: ["private-label", "corporate"],
    brand: "RDH Tekstil",
    name: ["Yüksek Tepeli Bere", "High-Top Beanie"],
    slug: ["yuksek-tepeli-bere", "high-top-beanie"],
    summary: [
      "Siyah fitilli örgü, katlamalı kenar ve yüksek tepeyle hazırlanan RDH Tekstil beresi.",
      "RDH Tekstil high-top beanie in black rib knit, with a folded cuff and a tall crown.",
    ],
    features: ["rib", "cuff", "highCrown"],
    images: [
      img(
        `${P}/bereler/rdh-2/1.jpg`,
        "Siyah fitilli yüksek tepeli bere",
        "Black ribbed high-top beanie",
      ),
      img(
        `${P}/setler/rdh-2/3.jpg`,
        "Yüksek tepeli bereyi ve atkıyı stadyumda takan bir erkek",
        "A man wearing the high-top beanie and scarf at a stadium",
      ),
    ],
  },
  {
    id: "rdh-ribana-atki",
    categoryId: "scarves",
    typeIds: ["ribbed"],
    industryIds: ["private-label", "corporate"],
    brand: "RDH Tekstil",
    name: ["RDH Deri Etiketli Ribana Atkı", "RDH Ribbed Scarf with Leather Patch"],
    slug: ["rdh-deri-etiketli-ribana-atki", "rdh-ribbed-scarf-leather-patch"],
    summary: [
      "Siyah fitilli örgü, püsküllü uçlar ve kabartma logolu deri etiketle hazırlanan RDH Tekstil atkısı.",
      "RDH Tekstil ribbed scarf in black knit, with fringed ends and a leather logo patch.",
    ],
    features: ["rib", "fringe", "leatherPatch"],
    images: [
      img(
        `${P}/atkilar/rdh-2/1.jpg`,
        "Siyah fitilli, püsküllü RDH atkısı",
        "Black ribbed RDH scarf with fringe",
      ),
      img(
        `${P}/setler/rdh-2/3.jpg`,
        "RDH ribana atkısını ve yüksek tepeli bereyi takan bir erkek",
        "A man wearing the RDH ribbed scarf and high-top beanie",
      ),
    ],
  },
  {
    id: "yuksek-tepeli-bere-set",
    categoryId: "sets",
    typeIds: ["beanie-scarf"],
    industryIds: ["private-label", "corporate"],
    brand: "RDH Tekstil",
    name: ["Yüksek Tepeli Bere & Atkı Seti", "High-Top Beanie & Scarf Set"],
    slug: ["yuksek-tepeli-bere-atki-seti", "high-top-beanie-scarf-set"],
    summary: [
      "Siyah fitilli örgüde yüksek tepeli bere ve püsküllü atkıdan oluşan RDH Tekstil seti.",
      "RDH Tekstil set of a high-top beanie and fringed scarf, both in black rib knit.",
    ],
    features: ["matching", "rib", "cuff", "highCrown", "fringe"],
    images: [
      img(
        `${P}/setler/rdh-2/1.jpg`,
        "Siyah fitilli bere ve atkı seti",
        "Black ribbed beanie and scarf set",
      ),
      img(
        `${P}/setler/rdh-2/3.jpg`,
        "Yüksek tepeli bere ve atkıyı stadyumda takan bir erkek",
        "A man wearing the high-top beanie and scarf at a stadium",
      ),
      img(`${P}/bereler/rdh-2/1.jpg`, "Yüksek tepeli bere", "High-top beanie"),
      img(`${P}/atkilar/rdh-2/1.jpg`, "Siyah fitilli RDH atkısı", "Black ribbed RDH scarf"),
    ],
  },
];

export const products: ContentStoreInput["products"] = defs.map((def, index) =>
  product(def, index + 1),
);
