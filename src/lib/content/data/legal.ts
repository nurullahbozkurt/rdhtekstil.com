import type { ContentStoreInput } from "../schema";

const PLACEHOLDER_TR = "Bu metin RDH Tekstil tarafından sağlanacaktır. Yayına almadan önce hukuki onaydan geçmiş nihai metin bu alana girilecektir.";
const PLACEHOLDER_EN = "This text will be provided by RDH Tekstil. The final, legally reviewed text will be entered here before going live.";

// TODO(content): Tüm yasal metinler RDH'den gelecek; Faz 3'te admin panelden düzenlenebilir olacak.
export const legalPages: ContentStoreInput["legalPages"] = [
  {
    id: "kvkk",
    navLabel: { tr: "KVKK", en: "KVKK" },
    version: "0.1-taslak",
    updatedAt: "2026-10-05",
    contentStatus: "placeholder",
    seo: {
      tr: {
        slug: "kvkk",
        title: "KVKK Bilgilendirmesi | RDH Tekstil",
        description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında RDH Tekstil'in kişisel verileri işleme esasları.",
        h1: "KVKK Bilgilendirmesi",
      },
      en: {
        slug: "personal-data-protection",
        title: "Personal Data Protection (KVKK) | RDH Tekstil",
        description: "How RDH Tekstil processes personal data under the Turkish Personal Data Protection Law No. 6698 (KVKK).",
        h1: "Personal Data Protection (KVKK)",
      },
    },
    intro: {
      tr: "Bu sayfa, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki bilgilendirmeleri içerecektir.",
      en: "This page will contain the information required under the Turkish Personal Data Protection Law No. 6698.",
    },
    sections: {
      tr: [
        { heading: "Veri sorumlusu", paragraphs: [PLACEHOLDER_TR] },
        { heading: "İşlenen kişisel veriler ve amaçları", paragraphs: [PLACEHOLDER_TR] },
        { heading: "Haklarınız", paragraphs: [PLACEHOLDER_TR] },
      ],
      en: [
        { heading: "Data controller", paragraphs: [PLACEHOLDER_EN] },
        { heading: "Personal data processed and purposes", paragraphs: [PLACEHOLDER_EN] },
        { heading: "Your rights", paragraphs: [PLACEHOLDER_EN] },
      ],
    },
  },
  {
    id: "disclosure",
    navLabel: { tr: "Aydınlatma Metni", en: "Information Notice" },
    version: "0.1-taslak",
    updatedAt: "2026-10-05",
    contentStatus: "placeholder",
    seo: {
      tr: {
        slug: "aydinlatma-metni",
        title: "Aydınlatma Metni | RDH Tekstil",
        description: "Talep ve iletişim formları aracılığıyla paylaştığınız kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
        h1: "Aydınlatma Metni",
      },
      en: {
        slug: "information-notice",
        title: "Information Notice | RDH Tekstil",
        description: "Information notice on how personal data you share through our request and contact forms is processed.",
        h1: "Information Notice",
      },
    },
    intro: {
      tr: "Bu metin, talep ve iletişim formlarında paylaştığınız kişisel verilerin hangi amaçla işlendiğini açıklayacaktır.",
      en: "This notice will explain why the personal data you share in our request and contact forms is processed.",
    },
    sections: {
      tr: [
        { heading: "Toplanan veriler", paragraphs: [PLACEHOLDER_TR] },
        { heading: "İşleme amacı ve hukuki sebep", paragraphs: [PLACEHOLDER_TR] },
        { heading: "Saklama süresi", paragraphs: [PLACEHOLDER_TR] },
        { heading: "Başvuru", paragraphs: [PLACEHOLDER_TR] },
      ],
      en: [
        { heading: "Data collected", paragraphs: [PLACEHOLDER_EN] },
        { heading: "Purpose and legal basis", paragraphs: [PLACEHOLDER_EN] },
        { heading: "Retention period", paragraphs: [PLACEHOLDER_EN] },
        { heading: "Requests", paragraphs: [PLACEHOLDER_EN] },
      ],
    },
  },
  {
    id: "privacy",
    navLabel: { tr: "Gizlilik Politikası", en: "Privacy Policy" },
    version: "0.1-taslak",
    updatedAt: "2026-10-05",
    contentStatus: "placeholder",
    seo: {
      tr: {
        slug: "gizlilik-politikasi",
        title: "Gizlilik Politikası | RDH Tekstil",
        description: "RDH Tekstil web sitesini kullanırken paylaştığınız bilgilerin nasıl korunduğunu anlatan gizlilik politikası.",
        h1: "Gizlilik Politikası",
      },
      en: {
        slug: "privacy-policy",
        title: "Privacy Policy | RDH Tekstil",
        description: "Our privacy policy explains how the information you share while using the RDH Tekstil website is protected.",
        h1: "Privacy Policy",
      },
    },
    intro: {
      tr: "Gizlilik politikamız, web sitemizi kullanırken paylaştığınız bilgilerin nasıl korunduğunu açıklayacaktır.",
      en: "Our privacy policy will explain how the information you share while using our website is protected.",
    },
    sections: {
      tr: [
        { heading: "Genel", paragraphs: [PLACEHOLDER_TR] },
        { heading: "Bilgi güvenliği", paragraphs: [PLACEHOLDER_TR] },
        { heading: "Üçüncü taraflar", paragraphs: [PLACEHOLDER_TR] },
      ],
      en: [
        { heading: "General", paragraphs: [PLACEHOLDER_EN] },
        { heading: "Information security", paragraphs: [PLACEHOLDER_EN] },
        { heading: "Third parties", paragraphs: [PLACEHOLDER_EN] },
      ],
    },
  },
  {
    id: "cookies",
    navLabel: { tr: "Çerez Politikası", en: "Cookie Policy" },
    version: "0.1-taslak",
    updatedAt: "2026-10-05",
    contentStatus: "placeholder",
    seo: {
      tr: {
        slug: "cerez-politikasi",
        title: "Çerez Politikası | RDH Tekstil",
        description: "RDH Tekstil web sitesinde kullanılan zorunlu, analitik ve pazarlama çerezleri ile tercihlerinizi nasıl yönetebileceğiniz.",
        h1: "Çerez Politikası",
      },
      en: {
        slug: "cookie-policy",
        title: "Cookie Policy | RDH Tekstil",
        description: "The necessary, analytics and marketing cookies used on the RDH Tekstil website, and how to manage your preferences.",
        h1: "Cookie Policy",
      },
    },
    intro: {
      tr: "Sitemizde zorunlu çerezler her zaman, analitik ve pazarlama çerezleri ise yalnızca onayınızla kullanılır. Tercihlerinizi sayfanın altındaki “Çerez Tercihleri” bağlantısından istediğiniz zaman değiştirebilirsiniz.",
      en: "Necessary cookies are always used on our site; analytics and marketing cookies are used only with your consent. You can change your preferences at any time via the “Cookie Preferences” link at the bottom of the page.",
    },
    sections: {
      tr: [
        { heading: "Zorunlu çerezler", paragraphs: ["Dil tercihiniz ve çerez onay tercihiniz gibi sitenin çalışması için gereken bilgiler tarayıcınızda saklanır.", PLACEHOLDER_TR] },
        { heading: "Analitik çerezler", paragraphs: ["Google Tag Manager ve Google Analytics 4 yalnızca analitik çerezlere onay vermeniz hâlinde yüklenir.", PLACEHOLDER_TR] },
        { heading: "Pazarlama çerezleri", paragraphs: [PLACEHOLDER_TR] },
      ],
      en: [
        { heading: "Necessary cookies", paragraphs: ["Information needed for the site to work, such as your language and cookie consent preference, is stored in your browser.", PLACEHOLDER_EN] },
        { heading: "Analytics cookies", paragraphs: ["Google Tag Manager and Google Analytics 4 are loaded only if you consent to analytics cookies.", PLACEHOLDER_EN] },
        { heading: "Marketing cookies", paragraphs: [PLACEHOLDER_EN] },
      ],
    },
  },
];
