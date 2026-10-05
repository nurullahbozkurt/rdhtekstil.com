import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StickyCta } from "@/components/layout/sticky-cta";
import { JsonLd } from "@/components/site/json-ld";
import { MotionProvider } from "@/components/site/reveal";
import { isLocale, locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getSiteSettings } from "@/lib/content";
import { getNavigation } from "@/lib/navigation";
import { getLanguageMap, getLinks } from "@/lib/routing";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { gtmId, siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = await getSiteSettings(locale);
  return {
    metadataBase: new URL(siteUrl),
    applicationName: settings.brandName,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f7f2e8",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);
  const [settings, navigation, languageMap, links] = await Promise.all([
    getSiteSettings(locale),
    getNavigation(locale, {
      allProducts: messages.nav.allProducts,
      allIndustries: messages.nav.allIndustries,
    }),
    getLanguageMap(),
    getLinks(locale),
  ]);

  return (
    <html lang={locale} className={cn(manrope.variable, fraunces.variable)}>
      <body className="min-h-dvh bg-cream-100 font-sans text-navy-900 antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-navy-800 px-5 py-3 font-semibold text-cream-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {messages.a11y.skipToContent}
        </a>
        <ConsentProvider gtmId={gtmId} text={messages.consent} policyHref={links.legal("cookies")}>
          <MotionProvider>
            <SiteHeader
              locale={locale}
              navigation={navigation}
              languageMap={languageMap}
              messages={messages}
              brandName={settings.brandName}
            />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <SiteFooter
              locale={locale}
              navigation={navigation}
              languageMap={languageMap}
              messages={messages}
              settings={settings}
            />
            <StickyCta label={navigation.cta.label} href={navigation.requestPath} />
          </MotionProvider>
        </ConsentProvider>
        <JsonLd data={organizationJsonLd(settings, navigation.homeHref)} />
      </body>
    </html>
  );
}
