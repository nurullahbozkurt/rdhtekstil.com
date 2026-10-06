import type { ContentStoreInput } from "../schema";

/**
 * Yasal metinler; 6698 sayılı KVKK md. 10, Aydınlatma Tebliği ve
 * KVKK Çerez Uygulamaları Hakkında Rehber’deki asgari unsurlara göre hazırlanmıştır.
 * Ticari unvan, adres ve VERBİS bilgileri RDH tarafından teyit edilmelidir.
 */
export const legalPages: ContentStoreInput["legalPages"] = [
  {
    id: "kvkk",
    navLabel: { tr: "KVKK", en: "KVKK" },
    version: "1.0",
    updatedAt: "2026-10-06",
    contentStatus: "final",
    seo: {
      tr: {
        slug: "kvkk",
        title: "KVKK Bilgilendirmesi | RDH Tekstil",
        description:
          "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında RDH Tekstil'in kişisel verileri işleme esasları.",
        h1: "KVKK Bilgilendirmesi",
      },
      en: {
        slug: "personal-data-protection",
        title: "Personal Data Protection (KVKK) | RDH Tekstil",
        description:
          "How RDH Tekstil processes personal data under the Turkish Personal Data Protection Law No. 6698 (KVKK).",
        h1: "Personal Data Protection (KVKK)",
      },
    },
    intro: {
      tr: "Bu bilgilendirme, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca RDH Tekstil (“Veri Sorumlusu”) tarafından kişisel verilerinizin işlenmesine ilişkin genel esasları açıklamak amacıyla hazırlanmıştır. Formlar aracılığıyla toplanan verilere ilişkin ayrıntılı açıklama için Aydınlatma Metni’ni inceleyiniz.",
      en: "This notice explains the general principles under which RDH Tekstil (“Data Controller”) processes your personal data pursuant to the Turkish Personal Data Protection Law No. 6698 (“KVKK”). For details on data collected through our forms, please also read the Information Notice.",
    },
    sections: {
      tr: [
        {
          heading: "1. Veri sorumlusu",
          paragraphs: [
            "KVKK kapsamında veri sorumlusu: RDH Tekstil.",
            "İletişim: info@rdhtekstil.com · +90 (212) 000 00 00 · Türkiye.",
            "Güncel adres ve ticari unvan bilgileri İletişim sayfasında ve bu metnin güncellenmiş sürümlerinde yayımlanır.",
          ],
        },
        {
          heading: "2. İşlenen kişisel veri kategorileri",
          paragraphs: [
            "Kimlik ve iletişim bilgileri: ad soyad, firma/unvan, e-posta, telefon, ülke.",
            "Talep ve proje bilgileri: ürün tipi, model/kalıp tercihi, renk bilgileri, slogan, tahmini adet, istenen teslim tarihi, serbest not.",
            "Dosya içerikleri: logo, örnek model/referans ve benzeri marka materyalleri (PNG, JPG, SVG, PDF vb.).",
            "İşlem güvenliği ve teknik veriler: IP adresi, tarayıcı/cihaz bilgileri, çerez kayıtları, form gönderim zamanı, KVKK onay zamanı ve metin sürümü.",
            "Pazarlama tercihi: yalnızca ayrı olarak işaretlediğiniz takdirde pazarlama iletişimi izni.",
          ],
        },
        {
          heading: "3. İşleme amaçları",
          paragraphs: [
            "Tasarım talebi ve iletişim başvurularınızın alınması, değerlendirilmesi ve size geri dönüş yapılması.",
            "Örnek model / tasarım önerisi ve fiyat teklifi süreçlerinin yürütülmesi.",
            "Müşteri ilişkileri, sözleşme öncesi müzakereler ve gerektiğinde sözleşmenin ifası.",
            "Yasal yükümlülüklerin yerine getirilmesi ve olası uyuşmazlıklarda hakların korunması.",
            "Web sitesinin güvenliğinin sağlanması, kötüye kullanımın önlenmesi ve teknik altyapının işletilmesi.",
            "Açık rızanız olması hâlinde analitik ölçümleme ve pazarlama iletişimleri.",
          ],
        },
        {
          heading: "4. Hukuki sebepler",
          paragraphs: [
            "KVKK md. 5/2-c: Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması kaydıyla sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması (talep/iletişim süreçleri).",
            "KVKK md. 5/2-ç: Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması.",
            "KVKK md. 5/2-f: Veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması (site güvenliği, talep kayıtlarının yönetimi), temel hak ve özgürlüklerinize zarar vermemek kaydıyla.",
            "KVKK md. 5/1: Açık rızanız (pazarlama iletişimi; zorunlu olmayan analitik/pazarlama çerezleri).",
          ],
        },
        {
          heading: "5. Aktarım",
          paragraphs: [
            "Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olarak; barındırma, e-posta, bulut depolama ve analitik hizmeti sağlayan iş ortaklarımıza (ör. altyapı sağlayıcıları) aktarılabilir.",
            "Yasal zorunluluk hâlinde yetkili kamu kurum ve kuruluşlarına aktarım yapılabilir.",
            "Yurt dışına aktarım söz konusu olduğunda KVKK’nın ilgili hükümleri ve Kurul kararları gözetilir; gerekli hâllerde açık rızanız alınır veya mevzuatta öngörülen diğer güvenceler sağlanır.",
          ],
        },
        {
          heading: "6. Toplama yöntemi",
          paragraphs: [
            "Verileriniz; web sitesi talep formu, iletişim formu, çerezler ve benzeri elektronik kanallar ile otomatik yollarla; ayrıca e-posta, telefon veya yüz yüze iletişim yoluyla kısmen otomatik / otomatik olmayan yollarla toplanabilir.",
          ],
        },
        {
          heading: "7. Saklama süresi",
          paragraphs: [
            "Kişisel veriler, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı / saklama süreleri boyunca muhafaza edilir.",
            "Talep ve iletişim kayıtları ile yüklenen dosyalar; değerlendirme, teklif ve olası uyuşmazlık süreçleri için gerekli süre saklanır; amaç ortadan kalktığında veya saklama süresi dolduğunda silinir, yok edilir veya anonimleştirilir.",
            "Çerezlere ilişkin saklama süreleri Çerez Politikası’nda belirtilmiştir.",
          ],
        },
        {
          heading: "8. İlgili kişinin hakları (KVKK md. 11)",
          paragraphs: [
            "Kişisel verilerinizin işlenip işlenmediğini öğrenme; işlenmişse buna ilişkin bilgi talep etme.",
            "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme.",
            "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme.",
            "Eksik veya yanlış işlenmişse düzeltilmesini isteme.",
            "KVKK md. 7’de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme.",
            "Düzeltme / silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme.",
            "İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme.",
            "Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.",
          ],
        },
        {
          heading: "9. Başvuru",
          paragraphs: [
            "Haklarınıza ilişkin taleplerinizi KVKK ve Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ’e uygun olarak info@rdhtekstil.com adresine veya İletişim sayfasında yer alan iletişim kanalları üzerinden iletebilirsiniz.",
            "Başvurunuzda kimliğinizi tespit etmeye elverişli bilgiler ile talebinizin açık ve anlaşılır şekilde yer alması gerekir. Talepler, KVKK’da öngörülen sürelerde sonuçlandırılır.",
            "Başvurunuzun reddedilmesi, verilen cevabı yetersiz bulmanız veya süresinde başvuruya cevap verilmemesi hâllerinde Kişisel Verileri Koruma Kurulu’na şikâyette bulunma hakkınız saklıdır.",
          ],
        },
      ],
      en: [
        {
          heading: "1. Data controller",
          paragraphs: [
            "Data controller under the KVKK: RDH Tekstil.",
            "Contact: info@rdhtekstil.com · +90 (212) 000 00 00 · Türkiye.",
            "Up-to-date address and legal entity details are published on the Contact page and in updated versions of this notice.",
          ],
        },
        {
          heading: "2. Categories of personal data",
          paragraphs: [
            "Identity and contact data: full name, company, email, phone, country.",
            "Request and project data: product type, model/shape preference, colours, slogan, estimated quantity, desired delivery date, free-text notes.",
            "File contents: logos, reference samples and similar brand materials (PNG, JPG, SVG, PDF, etc.).",
            "Security and technical data: IP address, browser/device information, cookies, form submission time, privacy consent timestamp and text version.",
            "Marketing preference: only if you separately opt in to marketing communications.",
          ],
        },
        {
          heading: "3. Purposes of processing",
          paragraphs: [
            "Receiving, assessing and responding to design requests and contact enquiries.",
            "Preparing design proposals and price quotes.",
            "Customer relations, pre-contractual steps and, where applicable, contract performance.",
            "Complying with legal obligations and protecting rights in disputes.",
            "Securing the website, preventing abuse and operating the technical infrastructure.",
            "Analytics measurement and marketing communications where you have given consent.",
          ],
        },
        {
          heading: "4. Legal bases",
          paragraphs: [
            "KVKK Art. 5/2-c: processing necessary for the establishment or performance of a contract (request/contact processes).",
            "KVKK Art. 5/2-ç: processing necessary for compliance with a legal obligation.",
            "KVKK Art. 5/2-f: processing necessary for the controller’s legitimate interests (site security, request management), provided it does not harm your fundamental rights and freedoms.",
            "KVKK Art. 5/1: your explicit consent (marketing; non-essential analytics/marketing cookies).",
          ],
        },
        {
          heading: "5. Transfers",
          paragraphs: [
            "Your data may be shared, limited to the purposes above, with service providers such as hosting, email, cloud storage and analytics partners.",
            "Transfers may also be made to competent public authorities where legally required.",
            "Where data is transferred abroad, the KVKK and Board decisions are observed; consent or other safeguards are used where required.",
          ],
        },
        {
          heading: "6. Collection method",
          paragraphs: [
            "Data may be collected via the website request form, contact form, cookies and similar electronic means, and also by email, phone or in-person communication.",
          ],
        },
        {
          heading: "7. Retention",
          paragraphs: [
            "Personal data is retained for as long as required by the processing purpose and applicable limitation/retention periods.",
            "Request and contact records and uploaded files are kept for assessment, quoting and potential disputes; they are deleted, destroyed or anonymised when the purpose ends or the period expires.",
            "Cookie retention periods are set out in the Cookie Policy.",
          ],
        },
        {
          heading: "8. Your rights (KVKK Art. 11)",
          paragraphs: [
            "To learn whether your personal data is processed and to request information.",
            "To learn the purpose of processing and whether it is used accordingly.",
            "To know the third parties to whom data is transferred in Türkiye or abroad.",
            "To request correction of incomplete or inaccurate data.",
            "To request deletion or destruction under the conditions in KVKK Art. 7.",
            "To request that correction/deletion be notified to third parties to whom data was transferred.",
            "To object to results against you arising from analysis by automated systems.",
            "To claim compensation if you suffer damage due to unlawful processing.",
          ],
        },
        {
          heading: "9. How to apply",
          paragraphs: [
            "You may submit requests regarding your rights to info@rdhtekstil.com or via the channels on the Contact page, in accordance with the KVKK and the Communiqué on Application Procedures.",
            "Your request should include information sufficient to identify you and a clear description of your demand. Requests are handled within the periods set by the KVKK.",
            "You may lodge a complaint with the Personal Data Protection Board if your request is rejected, the answer is insufficient, or no answer is given in time.",
          ],
        },
      ],
    },
  },
  {
    id: "disclosure",
    navLabel: { tr: "Aydınlatma Metni", en: "Information Notice" },
    version: "1.0",
    updatedAt: "2026-10-06",
    contentStatus: "final",
    seo: {
      tr: {
        slug: "aydinlatma-metni",
        title: "Aydınlatma Metni | RDH Tekstil",
        description:
          "Talep ve iletişim formları aracılığıyla paylaştığınız kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
        h1: "Aydınlatma Metni",
      },
      en: {
        slug: "information-notice",
        title: "Information Notice | RDH Tekstil",
        description:
          "Information notice on how personal data you share through our request and contact forms is processed.",
        h1: "Information Notice",
      },
    },
    intro: {
      tr: "6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 10. maddesi ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca; RDH Tekstil olarak talep formu ve iletişim formu üzerinden elde ettiğimiz kişisel verilerinize ilişkin sizi bilgilendiriyoruz.",
      en: "Pursuant to Article 10 of the KVKK and the Communiqué on the Procedures and Principles of the Obligation to Inform, RDH Tekstil informs you about personal data obtained through the request form and the contact form.",
    },
    sections: {
      tr: [
        {
          heading: "1. Veri sorumlusu",
          paragraphs: [
            "Veri sorumlusu: RDH Tekstil.",
            "İletişim: info@rdhtekstil.com · +90 (212) 000 00 00.",
          ],
        },
        {
          heading: "2. Toplanan kişisel veriler",
          paragraphs: [
            "Talep formu: ad soyad, firma, e-posta, telefon/WhatsApp, ülke; ürün tipi, model/kalıp, renkler, slogan, tahmini adet, istenen teslim tarihi, ek not; yüklediğiniz logo ve örnek model dosyaları; dil tercihi; KVKK bilgilendirme onayı zamanı ve metin sürümü; isteğe bağlı pazarlama izni.",
            "İletişim formu: ad soyad, firma (opsiyonel), e-posta, telefon (opsiyonel), ülke (opsiyonel), ilgilendiğiniz ürün, tahmini adet, mesaj; KVKK bilgilendirme onayı zamanı ve metin sürümü.",
          ],
        },
        {
          heading: "3. İşleme amacı",
          paragraphs: [
            "Başvurunuzu almak, kaydetmek ve değerlendirmek.",
            "Sizinle iletişime geçmek; örnek model / tasarım önerisi ve fiyat teklifi süreçlerini yürütmek.",
            "Müşteri ilişkilerini yönetmek ve gerektiğinde sözleşmesel süreçleri ilerletmek.",
            "Yasal yükümlülükleri yerine getirmek ve haklarımızı korumak.",
            "Pazarlama izni vermeniz hâlinde ürün ve hizmetlerimiz hakkında bilgilendirme yapmak (zorunlu değildir; form gönderiminin ön şartı değildir).",
          ],
        },
        {
          heading: "4. Toplama yöntemi ve hukuki sebep",
          paragraphs: [
            "Veriler, web sitemizdeki elektronik formlar ve dosya yükleme alanları aracılığıyla otomatik yollarla toplanır.",
            "Hukuki sebepler: KVKK md. 5/2-c (sözleşmenin kurulması/ifası ile doğrudan ilgili olması), md. 5/2-f (meşru menfaat – talep yönetimi ve iletişim, temel haklarınıza zarar vermemek kaydıyla), md. 5/2-ç (hukuki yükümlülük); pazarlama iletişimi için md. 5/1 (açık rıza).",
            "Talep veya iletişim formunu doldurmanız, başvurunuzun değerlendirilmesi için gerekli verilerin işlenmesine dayanır. Pazarlama amacıyla işleme, ayrı ve önceden işaretlenmemiş bir onay ile alınır.",
          ],
        },
        {
          heading: "5. Aktarım",
          paragraphs: [
            "Verileriniz; barındırma, e-posta ve dosya depolama hizmeti sağlayan tedarikçilerimize, talebinizin karşılanması amacıyla ve gerektiği ölçüde aktarılabilir.",
            "Yasal zorunluluk hâlinde yetkili mercilere aktarım yapılabilir.",
          ],
        },
        {
          heading: "6. Saklama süresi",
          paragraphs: [
            "Form kayıtları ve yüklenen dosyalar, başvurunun değerlendirilmesi, teklif süreci ve olası uyuşmazlıkların takibi için gerekli süre boyunca; bu süre sonunda silinir, yok edilir veya anonimleştirilir.",
            "Pazarlama iznine ilişkin kayıtlar, izninizi geri çekene veya saklama süresinin dolmasına kadar tutulur.",
          ],
        },
        {
          heading: "7. Haklarınız ve başvuru",
          paragraphs: [
            "KVKK md. 11 kapsamındaki haklarınız (bilgi alma, düzeltme, silme, itiraz, zarar giderimi vb.) saklıdır. Ayrıntılar için KVKK Bilgilendirmesi sayfasına bakınız.",
            "Başvurularınızı info@rdhtekstil.com adresine iletebilirsiniz.",
          ],
        },
      ],
      en: [
        {
          heading: "1. Data controller",
          paragraphs: [
            "Data controller: RDH Tekstil.",
            "Contact: info@rdhtekstil.com · +90 (212) 000 00 00.",
          ],
        },
        {
          heading: "2. Personal data collected",
          paragraphs: [
            "Request form: full name, company, email, phone/WhatsApp, country; product type, model/shape, colours, slogan, estimated quantity, desired delivery date, notes; uploaded logo and reference files; locale; privacy consent time and text version; optional marketing consent.",
            "Contact form: full name, company (optional), email, phone (optional), country (optional), product interest, estimated quantity, message; privacy consent time and text version.",
          ],
        },
        {
          heading: "3. Purpose of processing",
          paragraphs: [
            "Receiving, recording and assessing your enquiry.",
            "Contacting you and handling design proposals and quotes.",
            "Managing customer relations and progressing contractual steps where applicable.",
            "Meeting legal obligations and protecting our rights.",
            "If you opt in, sending information about our products and services (optional; not a condition of submitting the form).",
          ],
        },
        {
          heading: "4. Collection method and legal basis",
          paragraphs: [
            "Data is collected automatically via electronic forms and file uploads on our website.",
            "Legal bases: KVKK Art. 5/2-c (contract-related processing), Art. 5/2-f (legitimate interests – request handling, without harming your rights), Art. 5/2-ç (legal obligation); for marketing, Art. 5/1 (explicit consent).",
            "Submitting a request or contact form is based on processing needed to handle your enquiry. Marketing processing requires a separate, unticked consent.",
          ],
        },
        {
          heading: "5. Transfers",
          paragraphs: [
            "Your data may be shared with hosting, email and file-storage providers to the extent needed to handle your request.",
            "Transfers to competent authorities may occur where legally required.",
          ],
        },
        {
          heading: "6. Retention period",
          paragraphs: [
            "Form records and uploaded files are kept for as long as needed to assess the request, prepare quotes and follow potential disputes; they are then deleted, destroyed or anonymised.",
            "Marketing consent records are kept until you withdraw consent or the retention period ends.",
          ],
        },
        {
          heading: "7. Your rights and how to apply",
          paragraphs: [
            "Your rights under KVKK Art. 11 (access, correction, deletion, objection, compensation, etc.) remain available. See the KVKK notice for details.",
            "You may send requests to info@rdhtekstil.com.",
          ],
        },
      ],
    },
  },
  {
    id: "privacy",
    navLabel: { tr: "Gizlilik Politikası", en: "Privacy Policy" },
    version: "1.0",
    updatedAt: "2026-10-06",
    contentStatus: "final",
    seo: {
      tr: {
        slug: "gizlilik-politikasi",
        title: "Gizlilik Politikası | RDH Tekstil",
        description:
          "RDH Tekstil web sitesini kullanırken paylaştığınız bilgilerin nasıl korunduğunu anlatan gizlilik politikası.",
        h1: "Gizlilik Politikası",
      },
      en: {
        slug: "privacy-policy",
        title: "Privacy Policy | RDH Tekstil",
        description:
          "Our privacy policy explains how the information you share while using the RDH Tekstil website is protected.",
        h1: "Privacy Policy",
      },
    },
    intro: {
      tr: "Bu Gizlilik Politikası, rdhtekstil.com alan adlı web sitesini ziyaret eden ve formlarımızı kullanan kişilerin kişisel verilerinin RDH Tekstil tarafından nasıl işlendiğini, korunduğunu ve haklarınızı özetler. Kanunî ayrıntılar için KVKK Bilgilendirmesi ve Aydınlatma Metni de geçerlidir.",
      en: "This Privacy Policy summarises how RDH Tekstil processes and protects personal data of visitors and form users of rdhtekstil.com. The KVKK notice and Information Notice also apply for statutory detail.",
    },
    sections: {
      tr: [
        {
          heading: "1. Kapsam",
          paragraphs: [
            "Politika; web sitesi ziyareti, talep formu, iletişim formu, çerezler ve site üzerinden yürütülen iletişimleri kapsar.",
            "Çocuklara yönelik bilerek veri toplamayız. 18 yaşından küçük kişilerden ebeveyn/veli onayı olmadan kişisel veri talep etmeyiniz.",
          ],
        },
        {
          heading: "2. Topladığımız bilgiler",
          paragraphs: [
            "Bize ilettiğiniz bilgiler: ad, firma, iletişim bilgileri, proje detayları ve yüklediğiniz dosyalar.",
            "Otomatik toplanan bilgiler: IP, tarayıcı türü, ziyaret edilen sayfalar, çerez tanımlayıcıları ve benzeri teknik kayıtlar.",
            "Ayrıntılı kategori ve amaç listesi KVKK Bilgilendirmesi’nde yer alır.",
          ],
        },
        {
          heading: "3. Bilgi güvenliği",
          paragraphs: [
            "Kişisel verilere yetkisiz erişimi, kaybı veya ifşayı önlemek için teknik ve idari tedbirler uygularız (erişim kontrolü, güvenli bağlantı, özel depolama alanları, yetki sınırlaması vb.).",
            "Talep kapsamında yüklediğiniz marka dosyaları kamuya açık olarak erişilemez; yalnızca yetkili ekibimizin değerlendirmesi için kullanılır.",
            "Hiçbir yöntem %100 güvenlik garanti etmez; olası bir ihlalde mevzuatın gerektirdiği bildirimleri yaparız.",
          ],
        },
        {
          heading: "4. Üçüncü taraflar ve bağlantılar",
          paragraphs: [
            "Hizmet aldığımız altyapı ve analitik sağlayıcıları, yalnızca sözleşmesel yükümlülükleri ve amaçla sınırlı olarak veri işleyebilir.",
            "Sitemizdeki üçüncü taraf bağlantıları kendi gizlilik uygulamalarına tabidir; bu sitelerin içeriklerinden sorumlu değiliz.",
          ],
        },
        {
          heading: "5. Çerezler",
          paragraphs: [
            "Çerez kullanımı Çerez Politikası’nda açıklanmıştır. Zorunlu çerezler site işlevi için kullanılır; analitik ve pazarlama çerezleri yalnızca onayınızla yüklenir.",
          ],
        },
        {
          heading: "6. Haklarınız",
          paragraphs: [
            "KVKK md. 11’deki haklarınızı kullanmak için info@rdhtekstil.com adresine başvurabilirsiniz. Başvuru usulü KVKK Bilgilendirmesi’nde açıklanmıştır.",
          ],
        },
        {
          heading: "7. Değişiklikler",
          paragraphs: [
            "Bu politikayı güncelleyebiliriz. Güncel sürüm ve tarih bu sayfada yayımlanır. Önemli değişikliklerde site üzerinden bilgilendirme yapılabilir.",
          ],
        },
      ],
      en: [
        {
          heading: "1. Scope",
          paragraphs: [
            "This policy covers website visits, the request form, the contact form, cookies and communications via the site.",
            "We do not knowingly collect data from children. Persons under 18 should not submit personal data without parental/guardian consent.",
          ],
        },
        {
          heading: "2. Information we collect",
          paragraphs: [
            "Information you provide: name, company, contact details, project details and uploaded files.",
            "Automatically collected information: IP address, browser type, pages visited, cookie identifiers and similar technical logs.",
            "A detailed list of categories and purposes is in the KVKK notice.",
          ],
        },
        {
          heading: "3. Information security",
          paragraphs: [
            "We apply technical and organisational measures to reduce unauthorised access, loss or disclosure (access control, secure connections, private storage, least privilege, etc.).",
            "Brand files uploaded with a request are not publicly accessible; they are used only for our team’s assessment.",
            "No method is 100% secure; we will make notifications required by law in the event of a breach.",
          ],
        },
        {
          heading: "4. Third parties and links",
          paragraphs: [
            "Infrastructure and analytics providers may process data only as needed under their contracts and for stated purposes.",
            "Third-party links on our site have their own privacy practices; we are not responsible for those sites.",
          ],
        },
        {
          heading: "5. Cookies",
          paragraphs: [
            "Cookie use is explained in the Cookie Policy. Necessary cookies support site functions; analytics and marketing cookies load only with your consent.",
          ],
        },
        {
          heading: "6. Your rights",
          paragraphs: [
            "To exercise your rights under KVKK Art. 11, contact info@rdhtekstil.com. The application process is described in the KVKK notice.",
          ],
        },
        {
          heading: "7. Changes",
          paragraphs: [
            "We may update this policy. The current version and date are published on this page. Material changes may be announced on the site.",
          ],
        },
      ],
    },
  },
  {
    id: "cookies",
    navLabel: { tr: "Çerez Politikası", en: "Cookie Policy" },
    version: "1.0",
    updatedAt: "2026-10-06",
    contentStatus: "final",
    seo: {
      tr: {
        slug: "cerez-politikasi",
        title: "Çerez Politikası | RDH Tekstil",
        description:
          "RDH Tekstil web sitesinde kullanılan zorunlu, analitik ve pazarlama çerezleri ile tercihlerinizi nasıl yönetebileceğiniz.",
        h1: "Çerez Politikası",
      },
      en: {
        slug: "cookie-policy",
        title: "Cookie Policy | RDH Tekstil",
        description:
          "The necessary, analytics and marketing cookies used on the RDH Tekstil website, and how to manage your preferences.",
        h1: "Cookie Policy",
      },
    },
    intro: {
      tr: "Bu Çerez Politikası, KVKK ve Kişisel Verileri Koruma Kurumu’nun Çerez Uygulamaları Hakkında Rehberi doğrultusunda; sitemizde kullanılan çerezleri, amaçlarını ve tercihlerinizi nasıl yönetebileceğinizi açıklar. Zorunlu çerezler site işlevi için kullanılır. Analitik ve pazarlama çerezleri varsayılan olarak kapalıdır; yalnızca açık rızanızla etkinleşir.",
      en: "This Cookie Policy explains, in line with the KVKK and the Board’s Guide on Cookie Practices, which cookies we use, why, and how you can manage preferences. Necessary cookies support site functions. Analytics and marketing cookies are off by default and activate only with your explicit consent.",
    },
    sections: {
      tr: [
        {
          heading: "1. Çerez nedir?",
          paragraphs: [
            "Çerezler; bir internet sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Oturum çerezleri tarayıcı kapanınca silinir; kalıcı çerezler belirlenen süre boyunca cihazınızda kalabilir.",
            "Birinci taraf çerezler sitemiz tarafından; üçüncü taraf çerezler ise analitik veya reklam ortaklarımız tarafından yerleştirilebilir.",
          ],
        },
        {
          heading: "2. Zorunlu çerezler (rıza gerektirmez)",
          paragraphs: [
            "Bu çerezler, talep ettiğiniz bilgisayar hizmetinin sunulması için zorunludur (ör. dil tercihi, çerez onay tercihinin hatırlanması, güvenlik ve oturum bütünlüğü). Engellenmesi sitenin bazı bölümlerinin çalışmamasına yol açabilir.",
            "Örnekler: dil / yerel ayar çerezi (birinci taraf; tercihiniz süresince veya makul bir süre); çerez onay tercihi çerezi (birinci taraf; tercihinizi saklamak için, genellikle 6–12 ay).",
          ],
        },
        {
          heading: "3. Analitik çerezler (açık rıza ile)",
          paragraphs: [
            "Site trafiğini ve kullanımını ölçmek için kullanılır. Google Tag Manager ve Google Analytics 4 yalnızca analitik kategorisine onay vermeniz hâlinde yüklenir.",
            "Üçüncü taraf analitik çerezler (ör. Google Analytics tanımlayıcıları) genelde birinci taraf alan adına yazılsa da veriler Google’a aktarılabilir; saklama süreleri Google’ın ayarlarına ve yapılandırmamıza göre değişir (ör. _ga benzeri tanımlayıcılar için aylar–yıllar mertebesinde).",
            "Onay vermezseniz bu çerezler yüklenmez.",
          ],
        },
        {
          heading: "4. Pazarlama çerezleri (açık rıza ile)",
          paragraphs: [
            "Reklamların ölçülmesi, yeniden pazarlama veya benzeri amaçlarla kullanılabilir. Bu kategorideki çerezler yalnızca pazarlama onayınız varsa etkinleşir.",
            "Şu an sitemizde pazarlama çerezleri kullanılıyorsa banner üzerinden ayrıca onayınız istenir; kullanılmıyorsa bu kategori boş kalır / etkinleştirilmez.",
          ],
        },
        {
          heading: "5. Tercihlerinizi yönetme",
          paragraphs: [
            "İlk ziyaretinizde çerez bildiriminden tercihlerinizi seçebilirsiniz. Daha sonra sayfanın altındaki “Çerez Tercihleri” bağlantısından istediğiniz zaman değiştirebilir veya geri çekebilirsiniz.",
            "Tarayıcı ayarlarından çerezleri silebilir veya engelleyebilirsiniz; zorunlu çerezlerin engellenmesi site deneyimini bozabilir.",
          ],
        },
        {
          heading: "6. Veri sorumlusu ve haklarınız",
          paragraphs: [
            "Çerezler yoluyla işlenen kişisel veriler bakımından veri sorumlusu RDH Tekstil’dir. İletişim: info@rdhtekstil.com.",
            "KVKK md. 11 kapsamındaki haklarınız ve başvuru yolu KVKK Bilgilendirmesi’nde açıklanmıştır.",
          ],
        },
      ],
      en: [
        {
          heading: "1. What are cookies?",
          paragraphs: [
            "Cookies are small text files stored in your browser when you visit a website. Session cookies are deleted when you close the browser; persistent cookies may remain for a set period.",
            "First-party cookies are set by our site; third-party cookies may be set by analytics or advertising partners.",
          ],
        },
        {
          heading: "2. Necessary cookies (no consent required)",
          paragraphs: [
            "These cookies are strictly necessary to provide a service you request (e.g. language preference, remembering cookie choices, security and session integrity). Blocking them may break parts of the site.",
            "Examples: language/locale cookie (first-party; for your preference period or a reasonable duration); cookie-consent preference cookie (first-party; typically 6–12 months).",
          ],
        },
        {
          heading: "3. Analytics cookies (with explicit consent)",
          paragraphs: [
            "Used to measure traffic and usage. Google Tag Manager and Google Analytics 4 load only if you consent to analytics.",
            "Third-party analytics identifiers (e.g. Google Analytics) may send data to Google; retention depends on Google’s settings and our configuration (often months to years for identifiers such as _ga).",
            "If you do not consent, these cookies are not loaded.",
          ],
        },
        {
          heading: "4. Marketing cookies (with explicit consent)",
          paragraphs: [
            "May be used for ad measurement, remarketing or similar purposes. Cookies in this category activate only with marketing consent.",
            "If marketing cookies are used on our site, consent is requested via the banner; otherwise this category remains inactive.",
          ],
        },
        {
          heading: "5. Managing your preferences",
          paragraphs: [
            "On your first visit you can set preferences in the cookie notice. Later you can change or withdraw them anytime via “Cookie Preferences” in the footer.",
            "You may also delete or block cookies in your browser; blocking necessary cookies may impair the site.",
          ],
        },
        {
          heading: "6. Data controller and your rights",
          paragraphs: [
            "For personal data processed via cookies, the data controller is RDH Tekstil. Contact: info@rdhtekstil.com.",
            "Your rights under KVKK Art. 11 and how to apply are explained in the KVKK notice.",
          ],
        },
      ],
    },
  },
];
