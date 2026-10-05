import "server-only";

import type { Locale } from "@/i18n/config";
import { getCategories, getIndustries, getLegalPages, getSiteSettings } from "@/lib/content";
import { getLinks } from "@/lib/routing";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  image?: { src: string | null; alt: string };
};

export type NavItem = {
  label: string;
  href: string;
  /** Alt menüdeki "tümünü gör" bağlantısının metni */
  overviewLabel?: string;
  children?: NavLink[];
};

export type FooterGroup = { title: string; links: NavLink[] };

export async function getNavigation(
  locale: Locale,
  labels: { allProducts: string; allIndustries: string },
) {
  const [settings, categories, industries, legalPages, links] = await Promise.all([
    getSiteSettings(locale),
    getCategories(locale),
    getIndustries(locale),
    getLegalPages(locale),
    getLinks(locale),
  ]);
  const nav = settings.navigation;

  const main: NavItem[] = [
    {
      label: nav.products,
      href: links.page("products"),
      overviewLabel: labels.allProducts,
      children: categories.map((c) => ({
        label: c.name,
        href: links.category(c.id),
        description: c.cardText,
        image: c.image,
      })),
    },
    {
      label: nav.industries,
      href: links.page("industries"),
      overviewLabel: labels.allIndustries,
      children: industries.map((i) => ({
        label: i.name,
        href: links.industry(i.id),
        description: i.cardText,
      })),
    },
    { label: nav.customProduction, href: links.page("customProduction") },
    { label: nav.references, href: links.page("references") },
    { label: nav.about, href: links.page("about") },
    { label: nav.contact, href: links.page("contact") },
  ];

  const legalOrder = ["kvkk", "privacy", "cookies", "disclosure"] as const;

  const footer: FooterGroup[] = [
    {
      title: nav.footerProducts,
      links: categories.map((c) => ({ label: c.shortName, href: links.category(c.id) })),
    },
    {
      title: nav.footerIndustries,
      links: industries.map((i) => ({ label: i.shortName, href: links.industry(i.id) })),
    },
    {
      title: nav.footerCompany,
      links: [
        { label: nav.about, href: links.page("about") },
        { label: nav.customProduction, href: links.page("customProduction") },
        { label: nav.references, href: links.page("references") },
        { label: nav.faq, href: links.page("faq") },
        { label: nav.contact, href: links.page("contact") },
      ],
    },
    {
      title: nav.footerLegal,
      links: legalOrder.flatMap((id) => {
        const page = legalPages.find((p) => p.id === id);
        return page ? [{ label: page.navLabel, href: links.legal(id) }] : [];
      }),
    },
  ];

  return {
    main,
    footer,
    cta: { label: settings.ctas.designRequest, href: links.request() },
    requestPath: links.request(),
    homeHref: links.home(),
  };
}

export type Navigation = Awaited<ReturnType<typeof getNavigation>>;
