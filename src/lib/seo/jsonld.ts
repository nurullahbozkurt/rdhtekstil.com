import type { FaqView, ProductView, SiteSettingsView } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

type Thing = Record<string, unknown>;

export function organizationJsonLd(settings: SiteSettingsView, homeUrl: string): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: settings.brandName,
    legalName: settings.legalName,
    slogan: settings.slogan,
    description: settings.tagline,
    url: absoluteUrl(homeUrl),
    logo: absoluteUrl(settings.logo.dark),
    email: settings.contact.email,
    telephone: settings.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: settings.contact.country,
    },
    sameAs: settings.social.map((s) => s.url),
  };
}

export type BreadcrumbItem = { name: string; href: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function itemListJsonLd(
  name: string,
  items: { name: string; href: string; image?: string | null }[],
): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.href),
      name: item.name,
      ...(item.image ? { image: absoluteUrl(item.image) } : {}),
    })),
  };
}

export function productJsonLd(
  product: ProductView,
  href: string,
  categoryName: string,
  brandName: string,
): Thing {
  const images = product.images.flatMap((i) => (i.src ? [absoluteUrl(i.src)] : []));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    sku: product.id,
    category: categoryName,
    url: absoluteUrl(href),
    ...(images.length ? { image: images } : {}),
    brand: { "@type": "Brand", name: brandName },
    manufacturer: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

export function faqJsonLd(faqs: FaqView[]): Thing | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
