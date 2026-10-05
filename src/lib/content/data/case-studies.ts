import type { ContentStoreInput } from "../schema";
import { img, P } from "./helpers";

/**
 * Case study'ler. Metinler yalnızca ürün görsellerinden doğrulanabilen bilgilere dayanır.
 * TODO(content): Müşteri onayı, ülke, adet ve proje ihtiyacı detayları RDH tarafından teyit edilecek.
 */
export const caseStudies: ContentStoreInput["caseStudies"] = [
  {
    id: "troisdorf-jets",
    referenceId: "troisdorf-jets",
    categories: ["football", "fan"],
    sortOrder: 1,
    contentStatus: "placeholder",
    title: { tr: "Troisdorf Jets Taraftar Koleksiyonu", en: "Troisdorf Jets Fan Collection" },
    summary: {
      tr: "Kulüp renklerinde, şehir adını ve takım logosunu taşıyan bere, atkı ve set koleksiyonu.",
      en: "A beanie, scarf and set collection in the club colours, carrying the city name and team badge.",
    },
    sector: { tr: "Spor kulübü", en: "Sports club" },
    productLabel: {
      tr: "Ponponlu bere, taraftar atkısı, bere & atkı seti",
      en: "Pompom beanie, fan scarf, beanie & scarf set",
    },
    productIds: ["troisdorf-jets-bere", "troisdorf-jets-atki", "troisdorf-jets-set"],
    country: { tr: "Almanya", en: "Germany" },
    need: {
      tr: "Kulüp, bordo-sarı renklerini ve şehir adını öne çıkaran; taraftarların birlikte kullanabileceği bere ve atkıdan oluşan bir koleksiyon istedi.",
      en: "The club wanted a collection of beanies and scarves that puts its burgundy and gold colours and city name front and centre, for fans to wear together.",
    },
    solution: {
      tr: "Şehir adını jakarlı örgüyle bere ve atkıya işledik; takım logosunu dokuma etiketle uyguladık ve bereyi kulüp renklerinde ponponla tamamladık.",
      en: "We knitted the city name into the beanie and scarf in jacquard, applied the team logo as a woven badge and finished the beanie with a pompom in the club colours.",
    },
    features: {
      tr: [
        "Jakarlı şehir yazısı",
        "Dokuma takım logosu",
        "İki renkli ponpon ve püskül",
        "Bere ve atkıda eşleşen tasarım",
      ],
      en: [
        "Jacquard city lettering",
        "Woven team badge",
        "Two-tone pompom and fringe",
        "Matching beanie and scarf design",
      ],
    },
    images: [
      img(
        `${P}/bereler/jets/1.jpg`,
        "Troisdorf Jets ponponlu beresi",
        "Troisdorf Jets pompom beanie",
      ),
      img(`${P}/atkilar/jets/1.jpg`, "Troisdorf Jets taraftar atkısı", "Troisdorf Jets fan scarf"),
      img(
        `${P}/setler/jets/1.jpg`,
        "Troisdorf Jets setini takan bir kadın",
        "A woman wearing the Troisdorf Jets set",
      ),
    ],
    finalImage: img(
      `${P}/setler/jets/2.jpg`,
      "Troisdorf Jets bere ve atkı seti",
      "Troisdorf Jets beanie and scarf set",
    ),
    seo: {
      tr: {
        slug: "troisdorf-jets",
        title: "Troisdorf Jets Taraftar Koleksiyonu | RDH Tekstil",
        description:
          "Troisdorf Jets için kulüp renklerinde, jakarlı şehir yazısı ve dokuma logolu bere, atkı ve set koleksiyonu.",
        h1: "Troisdorf Jets Taraftar Koleksiyonu",
      },
      en: {
        slug: "troisdorf-jets",
        title: "Troisdorf Jets Fan Collection | RDH Tekstil",
        description:
          "A beanie, scarf and set collection for Troisdorf Jets in the club colours, with jacquard city lettering and woven badges.",
        h1: "Troisdorf Jets Fan Collection",
      },
    },
  },
  {
    id: "warriors-football",
    referenceId: "warriors-football",
    categories: ["football", "fan"],
    sortOrder: 2,
    contentStatus: "placeholder",
    title: { tr: "Warriors Football Kulüp Ürünleri", en: "Warriors Football Club Products" },
    summary: {
      tr: "Çizgili kulüp renklerinde, takım adını taşıyan jakarlı bere ve atkı.",
      en: "Jacquard beanies and scarves carrying the team name in striped club colours.",
    },
    sector: { tr: "Amerikan futbolu kulübü", en: "American football club" },
    productLabel: {
      tr: "Jakarlı bere, taraftar atkısı, set",
      en: "Jacquard beanie, fan scarf, set",
    },
    productIds: ["warriors-football-bere", "warriors-football-atki", "warriors-football-set"],
    country: { tr: "Bilgi eklenecek", en: "To be confirmed" },
    need: {
      tr: "Takım adının uzaktan okunabildiği, kulüp renklerini çizgilerle taşıyan tribün ürünleri.",
      en: "Stand products with a team name that reads from a distance and club colours carried in stripes.",
    },
    solution: {
      tr: "Takım adını büyük puntolu jakarlı yazıyla ürünlerin merkezine yerleştirdik; yeşil, sarı ve kahve çizgilerle kulüp renklerini dengeledik ve armayı dokuma etiketle uyguladık.",
      en: "We placed the team name at the centre in large jacquard lettering, balanced the club colours with green, gold and brown stripes, and applied the crest as a woven badge.",
    },
    features: {
      tr: [
        "Büyük puntolu jakarlı yazı",
        "Çok renkli çizgi düzeni",
        "Dokuma arma",
        "Kalın püsküller",
      ],
      en: ["Large jacquard lettering", "Multicolour stripe layout", "Woven crest", "Chunky fringe"],
    },
    images: [
      img(`${P}/bereler/warriors/1.jpg`, "Warriors Football beresi", "Warriors Football beanie"),
      img(`${P}/atkilar/warriors/1.jpg`, "Warriors Football atkısı", "Warriors Football scarf"),
      img(`${P}/setler/warriors/2.jpg`, "Warriors Football seti", "Warriors Football set"),
    ],
    finalImage: img(
      `${P}/mankenler/5.jpg`,
      "Warriors Football bere ve atkısını takan bir taraftar",
      "A fan wearing the Warriors Football beanie and scarf",
    ),
    seo: {
      tr: {
        slug: "warriors-football",
        title: "Warriors Football Kulüp Ürünleri | RDH Tekstil",
        description:
          "Warriors Football için çizgili kulüp renklerinde, jakarlı takım yazısı ve dokuma armalı bere, atkı ve set üretimi.",
        h1: "Warriors Football Kulüp Ürünleri",
      },
      en: {
        slug: "warriors-football",
        title: "Warriors Football Club Products | RDH Tekstil",
        description:
          "Beanies, scarves and sets for Warriors Football in striped club colours, with jacquard team lettering and a woven crest.",
        h1: "Warriors Football Club Products",
      },
    },
  },
  {
    id: "ecs-crocodiles",
    referenceId: "ecs-crocodiles",
    categories: ["football", "fan"],
    sortOrder: 3,
    contentStatus: "placeholder",
    title: { tr: "ECS Crocodiles Taraftar Seti", en: "ECS Crocodiles Fan Set" },
    summary: {
      tr: "Yeşil-siyah renk bloklarında kulüp kısaltması ve maskot armasıyla bere ve atkı.",
      en: "Beanies and scarves with the club initials and mascot badge in green and black colour blocks.",
    },
    sector: { tr: "Spor kulübü", en: "Sports club" },
    productLabel: {
      tr: "Ponponlu bere, atkı, bere & atkı seti",
      en: "Pompom beanie, scarf, beanie & scarf set",
    },
    productIds: ["ecs-crocodiles-bere", "ecs-crocodiles-atki", "ecs-crocodiles-set"],
    country: { tr: "Bilgi eklenecek", en: "To be confirmed" },
    need: {
      tr: "Maskot kimliğini ve kulüp kısaltmasını güçlü renk kontrastıyla taşıyan, soğuk havada tribünde kullanılacak ürünler.",
      en: "Products for cold days in the stands that carry the mascot identity and club initials with strong colour contrast.",
    },
    solution: {
      tr: "Kulüp kısaltmasını yeşil-siyah bloklar arasında jakarlı örgüyle işledik, maskot armasını dokuma etiketle uyguladık ve setin iki parçasını aynı tasarım diliyle eşleştirdik.",
      en: "We knitted the club initials in jacquard between green and black blocks, applied the mascot crest as a woven badge and matched both pieces of the set in one design language.",
    },
    features: {
      tr: [
        "Yüksek kontrastlı renk blokları",
        "Jakarlı kulüp kısaltması",
        "Dokuma maskot arması",
        "Siyah ponpon",
      ],
      en: [
        "High-contrast colour blocks",
        "Jacquard club initials",
        "Woven mascot badge",
        "Black pompom",
      ],
    },
    images: [
      img(`${P}/bereler/ecs/1.jpg`, "ECS Crocodiles beresi", "ECS Crocodiles beanie"),
      img(`${P}/atkilar/ecs/1.jpg`, "ECS Crocodiles atkısı", "ECS Crocodiles scarf"),
      img(
        `${P}/mankenler/6.jpg`,
        "ECS Crocodiles setini tribünde takan bir taraftar",
        "A fan wearing the ECS Crocodiles set in the stands",
      ),
    ],
    finalImage: img(
      `${P}/setler/ecs/3.jpg`,
      "ECS Crocodiles bere ve atkı seti",
      "ECS Crocodiles beanie and scarf set",
    ),
    seo: {
      tr: {
        slug: "ecs-crocodiles",
        title: "ECS Crocodiles Taraftar Seti | RDH Tekstil",
        description:
          "ECS Crocodiles için yeşil-siyah renk bloklarında jakarlı kulüp kısaltması ve maskot armalı bere ve atkı seti.",
        h1: "ECS Crocodiles Taraftar Seti",
      },
      en: {
        slug: "ecs-crocodiles",
        title: "ECS Crocodiles Fan Set | RDH Tekstil",
        description:
          "A beanie and scarf set for ECS Crocodiles in green and black colour blocks, with jacquard club initials and a mascot badge.",
        h1: "ECS Crocodiles Fan Set",
      },
    },
  },
  {
    id: "ski-club-trosel",
    referenceId: "ski-club-trosel",
    categories: ["football"],
    sortOrder: 4,
    contentStatus: "placeholder",
    title: { tr: "Ski-Club Trösel Kulüp Seti", en: "Ski-Club Trösel Club Set" },
    summary: {
      tr: "Kulübün dağ kimliğini jakarlı desenle taşıyan lacivert bere ve atkı.",
      en: "Navy beanies and scarves that carry the club's mountain identity in a jacquard pattern.",
    },
    sector: { tr: "Kayak kulübü", en: "Ski club" },
    productLabel: { tr: "Jakarlı bere, örgü atkı, set", en: "Jacquard beanie, knitted scarf, set" },
    productIds: ["ski-club-trosel-bere", "ski-club-trosel-atki", "ski-club-trosel-set"],
    country: { tr: "Bilgi eklenecek", en: "To be confirmed" },
    need: {
      tr: "Kulüp üyelerinin sezon boyunca kullanacağı, kulübün kayak kimliğini sade ama tanınır biçimde yansıtan ürünler.",
      en: "Products for club members to wear all season, reflecting the club's ski identity in a simple but recognisable way.",
    },
    solution: {
      tr: "Berede dağ silüetini ve kulüp adını jakarlı desenle kurguladık; atkıda çizgilerle sade bir çizgide kaldık ve iki üründe de kayakçı logosunu nakışla uyguladık.",
      en: "We built a mountain silhouette and the club name into the beanie in jacquard, kept the scarf simple with stripes and embroidered the skier logo on both pieces.",
    },
    features: {
      tr: [
        "Jakarlı dağ silüeti",
        "Nakış kayakçı logosu",
        "Lacivert-beyaz renk düzeni",
        "Püsküllü atkı",
      ],
      en: [
        "Jacquard mountain silhouette",
        "Embroidered skier logo",
        "Navy and white colourway",
        "Fringed scarf",
      ],
    },
    images: [
      img(`${P}/bereler/trosel/1.jpg`, "Ski-Club Trösel beresi", "Ski-Club Trösel beanie"),
      img(`${P}/atkilar/trosel/1.jpg`, "Ski-Club Trösel atkısı", "Ski-Club Trösel scarf"),
    ],
    finalImage: img(
      `${P}/setler/trosel/1.jpg`,
      "Ski-Club Trösel bere ve atkı seti",
      "Ski-Club Trösel beanie and scarf set",
    ),
    seo: {
      tr: {
        slug: "ski-club-trosel",
        title: "Ski-Club Trösel Kulüp Seti | RDH Tekstil",
        description:
          "Ski-Club Trösel için jakarlı dağ silüeti ve nakış kayakçı logolu lacivert bere ve atkı seti üretimi.",
        h1: "Ski-Club Trösel Kulüp Seti",
      },
      en: {
        slug: "ski-club-trosel",
        title: "Ski-Club Trösel Club Set | RDH Tekstil",
        description:
          "A navy beanie and scarf set for Ski-Club Trösel, with a jacquard mountain silhouette and an embroidered skier logo.",
        h1: "Ski-Club Trösel Club Set",
      },
    },
  },
  {
    id: "tinder",
    referenceId: "tinder",
    categories: ["corporate"],
    sortOrder: 5,
    contentStatus: "placeholder",
    title: { tr: "Tinder Kurumsal Koleksiyon", en: "Tinder Corporate Collection" },
    summary: {
      tr: "Marka renkleriyle tüm yüzeye işlenmiş özel desende bere, atkı ve set.",
      en: "Beanies, scarves and sets in a custom all-over pattern in the brand's colours.",
    },
    sector: { tr: "Teknoloji / tüketici markası", en: "Technology / consumer brand" },
    productLabel: {
      tr: "Desenli bere, atkı, kurumsal set",
      en: "Patterned beanie, scarf, corporate set",
    },
    productIds: ["tinder-bere", "tinder-atki", "tinder-set"],
    country: { tr: "Bilgi eklenecek", en: "To be confirmed" },
    need: {
      tr: "Logodan fazlasını taşıyan; markanın enerjik renk dünyasını doğrudan yansıtan, dikkat çeken bir kurumsal ürün.",
      en: "A corporate product that carries more than a logo, reflecting the brand's energetic colour world and standing out.",
    },
    solution: {
      tr: "Markanın renklerinden yola çıkarak tüm yüzeye yayılan özgün bir jakarlı desen geliştirdik; logoyu sade bir dokuma etiketle uygulayarak deseni ön plana çıkardık.",
      en: "Starting from the brand colours, we developed an original all-over jacquard pattern and applied the logo as a simple woven label so the pattern could lead.",
    },
    features: {
      tr: [
        "Tüm yüzeyde özgün jakarlı desen",
        "Marka renklerinde iplik seçimi",
        "Dokuma marka etiketi",
        "Renkli püskül",
      ],
      en: [
        "Original all-over jacquard pattern",
        "Yarn chosen in brand colours",
        "Woven brand label",
        "Multicolour fringe",
      ],
    },
    images: [
      img(`${P}/bereler/tinder/1.jpg`, "Tinder desenli bere", "Tinder patterned beanie"),
      img(`${P}/atkilar/tinder/1.jpg`, "Tinder desenli atkı", "Tinder patterned scarf"),
      img(
        `${P}/setler/tinder/3.jpg`,
        "Tinder setini takan bir kadın",
        "A woman wearing the Tinder set",
      ),
    ],
    finalImage: img(
      `${P}/setler/tinder/1.jpg`,
      "Tinder bere ve atkı seti",
      "Tinder beanie and scarf set",
    ),
    seo: {
      tr: {
        slug: "tinder",
        title: "Tinder Kurumsal Koleksiyon | RDH Tekstil",
        description:
          "Tinder için marka renkleriyle tüm yüzeye işlenmiş özgün jakarlı desende kurumsal bere, atkı ve set üretimi.",
        h1: "Tinder Kurumsal Koleksiyon",
      },
      en: {
        slug: "tinder",
        title: "Tinder Corporate Collection | RDH Tekstil",
        description:
          "Corporate beanies, scarves and sets for Tinder in an original all-over jacquard pattern built from the brand colours.",
        h1: "Tinder Corporate Collection",
      },
    },
  },
  {
    id: "es-private-label",
    referenceId: "es",
    categories: ["private-label"],
    sortOrder: 6,
    contentStatus: "placeholder",
    title: { tr: "ES Private Label Koleksiyon", en: "ES Private Label Collection" },
    summary: {
      tr: "Deri etiketle markalanan, sade gri tonlarda private label bere ve atkı.",
      en: "Private label beanies and scarves in understated grey tones, branded with leather patches.",
    },
    sector: { tr: "Moda / aksesuar markası", en: "Fashion / accessories brand" },
    productLabel: { tr: "Katlamalı bere, örgü atkı, set", en: "Cuffed beanie, knitted scarf, set" },
    productIds: ["es-deri-etiketli-bere", "es-deri-etiketli-atki", "es-set"],
    country: { tr: "Bilgi eklenecek", en: "To be confirmed" },
    need: {
      tr: "Kendi markası altında satılacak, sade ve zamansız bir bere ve atkı koleksiyonu.",
      en: "A simple, timeless beanie and scarf collection to be sold under the customer's own brand.",
    },
    solution: {
      tr: "Gri örgü gövdeyi sade bıraktık; markayı kabartma logolu deri etiketle öne çıkardık ve bere ile atkıyı aynı etiket diliyle eşleştirdik.",
      en: "We kept the grey knit body clean, let the brand lead with an embossed leather patch and matched the beanie and scarf with the same label language.",
    },
    features: {
      tr: [
        "Sade gri örgü",
        "Kabartma logolu deri etiket",
        "Ton sür ton püsküller",
        "Private label sunum",
      ],
      en: [
        "Clean grey knit",
        "Leather patch with embossed logo",
        "Tonal fringe",
        "Private label presentation",
      ],
    },
    images: [
      img(`${P}/bereler/es/1.jpg`, "ES deri etiketli bere", "ES leather patch beanie"),
      img(`${P}/atkilar/es/1.jpg`, "ES deri etiketli atkı", "ES leather patch scarf"),
    ],
    finalImage: img(`${P}/setler/es/1.jpg`, "ES bere ve atkı seti", "ES beanie and scarf set"),
    seo: {
      tr: {
        slug: "es-private-label",
        title: "ES Private Label Koleksiyon | RDH Tekstil",
        description:
          "ES için kabartma logolu deri etiketle markalanan, sade gri tonlarda private label bere ve atkı koleksiyonu.",
        h1: "ES Private Label Koleksiyon",
      },
      en: {
        slug: "es-private-label",
        title: "ES Private Label Collection | RDH Tekstil",
        description:
          "A private label beanie and scarf collection for ES in understated grey, branded with embossed leather patches.",
        h1: "ES Private Label Collection",
      },
    },
  },
];
