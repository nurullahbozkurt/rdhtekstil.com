import "server-only";

import type { CaseStudyCardData } from "@/components/cards/case-study-card";
import type { ProductCardData } from "@/components/cards/product-card";
import type { Messages } from "@/i18n/messages";
import type { CaseStudyView, ProductView } from "@/lib/content";
import type { Links } from "@/lib/routing";

export function toProductCard(product: ProductView, links: Links): ProductCardData {
  const firstImage = product.images[0];
  const secondImage = product.images[1];
  const hoverImage =
    secondImage?.src && secondImage.src !== firstImage?.src
      ? { src: secondImage.src, alt: secondImage.alt }
      : undefined;
  return {
    id: product.id,
    name: product.name,
    summary: product.summary,
    href: links.product(product.id),
    image: firstImage ?? { src: null, alt: product.name },
    hoverImage,
    isPlaceholder: product.contentStatus === "placeholder",
  };
}

export function toCaseStudyCard(
  caseStudy: CaseStudyView,
  links: Links,
  messages: Messages,
  clientName: string,
): CaseStudyCardData {
  return {
    id: caseStudy.id,
    title: caseStudy.title,
    summary: caseStudy.summary,
    href: links.caseStudy(caseStudy.id),
    client: clientName,
    categories: caseStudy.categories,
    categoryLabels: caseStudy.categories.map((c) => messages.references.categories[c]),
    image: caseStudy.finalImage.src
      ? caseStudy.finalImage
      : (caseStudy.images[0] ?? caseStudy.finalImage),
  };
}

export function gridLabels(messages: Messages) {
  return {
    all: messages.common.all,
    filter: messages.catalog.filterLabel,
    noResults: messages.catalog.noResults,
    placeholderImage: messages.common.placeholderImage,
    placeholderBadge: messages.common.placeholderBadge,
  };
}
