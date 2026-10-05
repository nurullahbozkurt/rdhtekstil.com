import type { ContentStoreInput } from "../schema";
import { img, P } from "./helpers";

export const pages: ContentStoreInput["pages"] = {
  home: {
    seo: {
      tr: {
        slug: "",
        title: "Markanıza Özel Bere ve Atkı Üretimi | RDH Tekstil",
        description:
          "Markalar, spor kulüpleri ve kurumlar için özel tasarım bere ve atkı üretimi. Düşük minimum adet, private label ve Türkiye'de üretim.",
        h1: "Markanıza Özel Bere ve Atkı Üretimi",
      },
      en: {
        slug: "",
        title: "Custom Beanie & Scarf Manufacturing | RDH Tekstil",
        description:
          "Custom-designed beanies and scarves for brands, sports clubs and organisations. Low minimums, private label and production in Türkiye.",
        h1: "Custom Beanies and Scarves, Made for Your Brand",
      },
    },
    heroImages: [
      img(`${P}/mankenler/5.jpg`, "Warriors Football bere ve atkı setini stadyumda takan taraftar", "Fan wearing the Warriors Football beanie and scarf set at the stadium"),
      img(`${P}/bereler/rdh/1.jpg`, "Lacivert ve altın çizgili, ponponlu RDH Tekstil beresi", "Navy RDH Tekstil pompom beanie with gold stripes"),
      img(`${P}/atkilar/jets/1.jpg`, "Bordo-sarı Troisdorf Jets jakarlı taraftar atkısı", "Burgundy and gold Troisdorf Jets jacquard fan scarf"),
    ],
    storyImage: img(`${P}/shop/2.jpg`, "RDH Tekstil üretimi kulüp atkılarının raflarda sergilendiği alan", "RDH Tekstil club scarves displayed on shelves"),
    content: {
      tr: {
        eyebrow: "YOUR BRAND. YOUR DESIGN. OUR PRODUCTION.",
        heroText:
          "Markalar, spor kulüpleri, kurumlar ve topluluklar için özel tasarım bere ve atkılar üretiyoruz. Tasarım detaylarından üretime, private label çözümlerine kadar tüm süreci tek noktadan yönetiyoruz.",
        referencesTitle: "Markaların ve Takımların Üretim Partneri",
        storyTitle: "Tekstil Üretiminin Ötesinde",
        storyText:
          "RDH Tekstil olarak yalnızca ürün üretmiyoruz. Markaların, takımların ve kurumların kimliğini taşıyan özel bere ve atkı koleksiyonları geliştiriyoruz. Renkten desene, etiketten ürün detaylarına kadar her projeyi ihtiyaca göre şekillendiriyor; tasarımdan üretime kadar süreci tek merkezden yönetiyoruz.",
        productsTitle: "Uzmanlaştığımız Ürünler",
        productsText:
          "Bere ve atkı üretimine odaklanan uzmanlığımızla farklı kullanım alanlarına, yaş gruplarına ve marka ihtiyaçlarına özel ürünler geliştiriyoruz.",
        requestTitle: "Logonu Gönder. Örnek Modelini Al.",
        requestText:
          "Ürününü seç; logonu, renklerini ve sloganını gönder. Ekibimiz markana özel örnek modelleri ve fiyat teklifini e-posta ile iletsin.",
        requestPoints: [
          "Ürününü seç",
          "Logonu, renklerini ve sloganını gönder",
          "Örnek modelleri ve fiyat teklifini e-posta ile al",
        ],
        industriesTitle: "Farklı İhtiyaçlara Özel Üretim",
        whyTitle: "Neden RDH?",
        processTitle: "Fikirden Üretime",
        faqTitle: "Sıkça Sorulan Sorular",
      },
      en: {
        eyebrow: "YOUR BRAND. YOUR DESIGN. OUR PRODUCTION.",
        heroText:
          "We produce custom-designed beanies and scarves for brands, sports clubs, organisations and communities. From design details to production and private label solutions, we manage the whole process from a single point.",
        referencesTitle: "The Production Partner for Brands and Teams",
        storyTitle: "Beyond Textile Production",
        storyText:
          "At RDH Tekstil, we don't just make products. We develop custom beanie and scarf collections that carry the identity of brands, teams and organisations. From colour to pattern, from labels to product details, we shape every project around its needs and manage the journey from design to production in one place.",
        productsTitle: "The Products We Specialise In",
        productsText:
          "With expertise focused on beanie and scarf production, we develop products for different uses, age groups and brand needs.",
        requestTitle: "Send Your Logo. Get Your Design Proposal.",
        requestText:
          "Choose your product; send your logo, colours and slogan. Our team will email you design proposals and a price quote made for your brand.",
        requestPoints: [
          "Choose your product",
          "Send your logo, colours and slogan",
          "Receive design proposals and a quote by email",
        ],
        industriesTitle: "Made for Different Needs",
        whyTitle: "Why RDH?",
        processTitle: "From Idea to Production",
        faqTitle: "Frequently Asked Questions",
      },
    },
  },
  products: {
    seo: {
      tr: {
        slug: "urunler",
        title: "Bere, Atkı ve Set Üretimi | RDH Tekstil",
        description:
          "Bereler, atkılar ve bere & atkı setleri: markanıza, kulübünüze veya kurumunuza özel renk, desen, logo ve etiketle üretilen ürünler.",
        h1: "Bere ve Atkı Ürünlerimiz",
      },
      en: {
        slug: "products",
        title: "Beanie, Scarf and Set Manufacturing | RDH Tekstil",
        description:
          "Beanies, scarves and beanie & scarf sets produced with custom colours, patterns, logos and labels for your brand, club or organisation.",
        h1: "Our Beanies and Scarves",
      },
    },
    content: {
      tr: {
        intro:
          "Bere ve atkı üretimine odaklanan uzmanlığımızla farklı kullanım alanlarına, yaş gruplarına ve marka ihtiyaçlarına özel ürünler geliştiriyoruz.",
      },
      en: {
        intro:
          "With expertise focused on beanie and scarf production, we develop products for different uses, age groups and brand needs.",
      },
    },
  },
  industries: {
    seo: {
      tr: {
        slug: "kullanim-alanlari",
        title: "Kullanım Alanları: Kulüp, Kurumsal, Okul | RDH Tekstil",
        description:
          "Futbol ve spor kulüpleri, taraftar ürünleri, kurumsal projeler, okullar ve private label koleksiyonlar için özel bere ve atkı üretimi.",
        h1: "Farklı İhtiyaçlara Özel Üretim",
      },
      en: {
        slug: "industries",
        title: "Industries: Clubs, Corporate, Schools | RDH Tekstil",
        description:
          "Custom beanie and scarf production for football and sports clubs, fanwear, corporate projects, schools and private label collections.",
        h1: "Made for Different Needs",
      },
    },
    content: {
      tr: {
        intro:
          "Kulüplerden markalara, okullardan kurumlara kadar her kullanım alanı için kimliğinizi taşıyan bere ve atkı koleksiyonları geliştiriyoruz.",
      },
      en: {
        intro:
          "From clubs to brands, schools to companies, we develop beanie and scarf collections that carry your identity in every field.",
      },
    },
  },
  customProduction: {
    seo: {
      tr: {
        slug: "ozel-uretim",
        title: "Özel Üretim Bere ve Atkı | RDH Tekstil",
        description:
          "Renk, iplik, desen, örgü, logo uygulaması, özel etiket ve private label: bere ve atkılarınız markanıza göre baştan şekillenir.",
        h1: "Markanız İçin Üretilir.",
      },
      en: {
        slug: "custom-production",
        title: "Custom Beanie and Scarf Production | RDH Tekstil",
        description:
          "Colour, yarn, pattern, knit, logo application, custom labels and private label: your beanies and scarves are shaped around your brand.",
        h1: "Made for Your Brand.",
      },
    },
    image: img(`${P}/setler/ecs/3.jpg`, "ECS Crocodiles için üretilen yeşil-siyah jakarlı bere ve atkı seti", "Green and black jacquard beanie and scarf set made for ECS Crocodiles"),
    featureImages: [
      img(`${P}/setler/tinder/1.jpg`, "Pembe ve turuncu özel renk kombinasyonlu bere ve atkı", "Beanie and scarf in a custom pink and orange colour combination"),
      img(`${P}/bereler/trosel/1.jpg`, "Dağ silüeti jakarlı desenli Ski-Club Trösel beresi", "Ski-Club Trösel beanie with a jacquard mountain pattern"),
      img(`${P}/bereler/ecs/1.jpg`, "Dokuma arma uygulamalı ECS Crocodiles beresi", "ECS Crocodiles beanie with a woven crest badge"),
      img(`${P}/bereler/es/1.jpg`, "Deri etiketli gri katlamalı bere", "Grey cuffed beanie with a leather patch label"),
      img(`${P}/setler/rdh/1.png`, "RDH Tekstil etiketli lacivert bere ve atkı seti", "Navy beanie and scarf set with RDH Tekstil labels"),
    ],
    content: {
      tr: {
        intro:
          "Hazır bir ürüne logo eklemekten daha fazlasını yapıyoruz. Renk, desen, örgü, etiket ve ürün detaylarını projenizin ihtiyaçlarına göre şekillendiriyoruz.",
        features: [
          { title: "Renk & İplik", text: "Marka kimliğinize ve tasarımınıza uygun renk kombinasyonları." },
          { title: "Desen & Örgü", text: "Ürüne ve kullanım alanına uygun farklı örgü ve desen seçenekleri." },
          { title: "Logo Uygulamaları", text: "Tasarıma ve ürüne uygun farklı marka uygulamaları." },
          { title: "Özel Etiket", text: "Markanıza özel etiket çözümleri." },
          { title: "Private Label", text: "Ürünlerin müşterinin kendi markası altında hazırlanabilmesi." },
        ],
      },
      en: {
        intro:
          "We do more than add a logo to an existing product. We shape colour, pattern, knit, label and product details around the needs of your project.",
        features: [
          { title: "Colour & Yarn", text: "Colour combinations that match your brand identity and design." },
          { title: "Pattern & Knit", text: "Knit and pattern options suited to the product and how it will be used." },
          { title: "Logo Applications", text: "Brand applications suited to the design and the product." },
          { title: "Custom Labels", text: "Label solutions made for your brand." },
          { title: "Private Label", text: "Products prepared under the customer's own brand." },
        ],
      },
    },
  },
  references: {
    seo: {
      tr: {
        slug: "referanslar",
        title: "Referanslar ve Projelerimiz | RDH Tekstil",
        description:
          "Kulüpler, markalar ve kurumlar için ürettiğimiz özel bere ve atkı projeleri: ihtiyaç, RDH çözümü, ürün özellikleri ve final ürünler.",
        h1: "Referanslar ve Projelerimiz",
      },
      en: {
        slug: "references",
        title: "References and Projects | RDH Tekstil",
        description:
          "Custom beanie and scarf projects we produced for clubs, brands and organisations: the need, the RDH solution, product details and final products.",
        h1: "References and Projects",
      },
    },
    content: {
      tr: {
        intro:
          "Kulüplerden markalara, farklı ölçeklerdeki projelerde ürettiğimiz bere ve atkılardan bir seçki.",
      },
      en: {
        intro:
          "A selection of the beanies and scarves we have produced for clubs and brands, in projects of every scale.",
      },
    },
  },
  about: {
    seo: {
      tr: {
        slug: "hakkimizda",
        title: "Hakkımızda: Bere ve Atkı Üreticisi | RDH Tekstil",
        description:
          "RDH Tekstil; markalar, spor kulüpleri ve kurumlar için tasarım, üretim ve private label süreçlerini tek yapıda yöneten bere ve atkı üreticisidir.",
        h1: "Üretimin Ötesinde Bir İş Ortağı",
      },
      en: {
        slug: "about",
        title: "About Us: Beanie and Scarf Manufacturer | RDH Tekstil",
        description:
          "RDH Tekstil is a beanie and scarf manufacturer managing design, production and private label for brands, sports clubs and organisations.",
        h1: "A Partner Beyond Production",
      },
    },
    images: [
      img(`${P}/shop/3.jpg`, "RDH Tekstil gri bere ve atkı ürünleri", "RDH Tekstil grey beanies and scarves"),
      img(`${P}/shop/1.jpg`, "RDH Tekstil atkı koleksiyonu ve bereler", "RDH Tekstil scarf collection and beanies"),
      img(`${P}/shop/4.jpg`, "Askıda sergilenen RDH Tekstil atkıları", "RDH Tekstil scarves displayed on a rail"),
    ],
    content: {
      tr: {
        text: "RDH Tekstil; markalar, spor kulüpleri ve kurumlar için özel üretim bere ve atkı çözümleri geliştirir. Her projeyi yalnızca üretilecek bir tekstil ürünü olarak değil, markanın kimliğini taşıyan bir parça olarak ele alıyoruz. Tasarım, üretim ve private label süreçlerini aynı yapı içerisinde yöneterek müşterilerimize uçtan uca üretim desteği sunuyoruz. Esnek üretim yaklaşımımız sayesinde farklı ölçeklerdeki projelere cevap verirken kalite, iletişim ve teslimat süreçlerini baştan sona takip ediyoruz.",
        subheading: "Sizin Markanız. Sizin Tasarımınız. Bizim Üretimimiz.",
        subtext:
          "Ürünlerimizin merkezinde müşterimizin markası vardır. Renk, desen, ürün ve etiket detaylarını her projenin kendi ihtiyaçlarına göre şekillendiriyoruz.",
      },
      en: {
        text: "RDH Tekstil develops custom-made beanie and scarf solutions for brands, sports clubs and organisations. We treat every project not just as a textile product to be made, but as a piece that carries the brand's identity. By managing design, production and private label within the same structure, we offer our customers end-to-end production support. Our flexible production approach lets us serve projects of different scales while we follow quality, communication and delivery from start to finish.",
        subheading: "Your Brand. Your Design. Our Production.",
        subtext:
          "Our customer's brand sits at the centre of every product. We shape colour, pattern, product and label details around the needs of each project.",
      },
    },
  },
  contact: {
    seo: {
      tr: {
        slug: "iletisim",
        title: "İletişim: Projenizi Konuşalım | RDH Tekstil",
        description:
          "Yeni bir bere veya atkı projeniz mi var? Ürün, adet ve tasarım ihtiyacınızı paylaşın; ekibimiz üretim detaylarıyla size dönsün.",
        h1: "Projenizi Konuşalım.",
      },
      en: {
        slug: "contact",
        title: "Contact: Let's Talk About Your Project | RDH Tekstil",
        description:
          "Working on a new beanie or scarf project? Share your product, quantity and design needs, and our team will get back to you with production details.",
        h1: "Let's Talk About Your Project.",
      },
    },
    content: {
      tr: {
        text: "Yeni bir bere veya atkı projesi üzerinde çalışıyorsanız ihtiyacınızı bizimle paylaşın. Ekibimiz ürün, adet, tasarım ve üretim detaylarını değerlendirerek sizinle iletişime geçsin.",
      },
      en: {
        text: "If you are working on a new beanie or scarf project, share your needs with us. Our team will review the product, quantity, design and production details and get in touch with you.",
      },
    },
  },
  faq: {
    seo: {
      tr: {
        slug: "sikca-sorulan-sorular",
        title: "Sıkça Sorulan Sorular | RDH Tekstil",
        description:
          "Minimum sipariş adedi, logo kullanımı, private label, üretim süresi ve yurt dışı gönderim hakkında sık sorulan sorular ve yanıtları.",
        h1: "Sıkça Sorulan Sorular",
      },
      en: {
        slug: "faq",
        title: "Frequently Asked Questions | RDH Tekstil",
        description:
          "Answers to common questions about minimum order quantity, using your logo, private label, production time and international shipping.",
        h1: "Frequently Asked Questions",
      },
    },
    content: {
      tr: {
        intro:
          "Bere ve atkı projelerinde en çok sorulan soruları burada topladık. Aradığınız yanıt yoksa bize yazın.",
      },
      en: {
        intro:
          "We have gathered the questions we hear most about beanie and scarf projects. If you can't find your answer, get in touch.",
      },
    },
  },
  request: {
    seo: {
      tr: {
        slug: "talep",
        title: "Tasarım Talebi Oluştur | RDH Tekstil",
        description:
          "Logonuzu, renklerinizi ve sloganınızı gönderin; ekibimiz örnek modelleri ve fiyat teklifini e-posta ile iletsin.",
        h1: "Tasarımınızı Üretime Taşıyalım.",
        noindex: true,
      },
      en: {
        slug: "request",
        title: "Create a Design Request | RDH Tekstil",
        description:
          "Send your logo, colours and slogan; our team will email you design proposals and a price quote.",
        h1: "Let's Take Your Design to Production.",
        noindex: true,
      },
    },
    content: {
      tr: {
        text: "Projenizle ilgili birkaç bilgiyi paylaşın. Ekibimiz tasarımınızı ve ihtiyacınızı değerlendirerek örnek modeller ve fiyat teklifi için sizinle iletişime geçsin.",
        submitLabel: "Talebimi Gönder",
      },
      en: {
        text: "Share a few details about your project. Our team will review your design and needs and get in touch with design proposals and a price quote.",
        submitLabel: "Send My Request",
      },
    },
  },
  requestComplete: {
    seo: {
      tr: {
        slug: "talep/tamamlandi",
        title: "Talebinizi Aldık | RDH Tekstil",
        description:
          "Talebiniz RDH ekibine iletildi. Örnek modeller ve fiyat teklifi kısa süre içinde e-posta ile gönderilecek.",
        h1: "Talebinizi Aldık.",
        noindex: true,
      },
      en: {
        slug: "request/complete",
        title: "We've Received Your Request | RDH Tekstil",
        description:
          "Your request has reached the RDH team. Design proposals and a price quote will be emailed to you shortly.",
        h1: "We've Received Your Request.",
        noindex: true,
      },
    },
    content: {
      tr: {
        // "Kısa süre içinde" ifadesi bu alandan gelir; Faz 3'te panelden düzenlenebilir.
        text: "Logonuz, renkleriniz ve proje detaylarınız RDH ekibine iletildi. Ekibimiz talebinizi inceleyerek örnek modelleri ve fiyat teklifini kısa süre içinde e-posta ile gönderecektir.",
      },
      en: {
        text: "Your logo, colours and project details have been passed on to the RDH team. Our team will review your request and email you design proposals and a price quote shortly.",
      },
    },
  },
};
