import { QrCode, Store } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import type { Navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ctaVariants } from "../site/button-link";
import { DesktopNav } from "./desktop-nav";
import { LanguageSwitcher, type LanguageMap } from "./language-switcher";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";

const headerIconClass =
  "inline-flex size-10 items-center justify-center rounded-xl border border-cream-300 bg-cream-50 text-navy-900 transition-colors hover:border-navy-800/30 hover:bg-cream-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-800";

export function SiteHeader({
  locale,
  navigation,
  languageMap,
  messages,
  brandName,
}: {
  locale: Locale;
  navigation: Navigation;
  languageMap: LanguageMap;
  messages: Messages;
  brandName: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-cream-300/80 bg-cream-100/90 backdrop-blur-md supports-[backdrop-filter]:bg-cream-100/80">
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Logo href={navigation.homeHref} label={brandName} className="h-9 lg:h-10" preload />
        <DesktopNav items={navigation.main} label={messages.a11y.mainNav} />
        <div className="flex items-center gap-2 lg:gap-4">
          <LanguageSwitcher
            locale={locale}
            map={languageMap}
            label={messages.a11y.languageSwitcher}
            className="hidden sm:flex"
          />
          <Link
            href={navigation.cta.href}
            data-testid="header-cta"
            className={cn(
              ctaVariants({ variant: "primary", size: "sm" }),
              "hidden text-[0.78rem] tracking-[0.08em] uppercase lg:inline-flex",
            )}
          >
            {navigation.cta.label}
          </Link>
          <Link
            href={navigation.fairHref}
            data-testid="header-fair"
            aria-label={messages.fair.iconLabel}
            title={messages.fair.iconLabel}
            className={headerIconClass}
          >
            <Store className="size-5" aria-hidden />
          </Link>
          <Link
            href={navigation.fairQrHref}
            data-testid="header-fair-qr"
            aria-label={messages.fair.qr.iconLabel}
            title={messages.fair.qr.iconLabel}
            className={headerIconClass}
          >
            <QrCode className="size-5" aria-hidden />
          </Link>
          <MobileNav
            items={navigation.main}
            cta={navigation.cta}
            locale={locale}
            languageMap={languageMap}
            labels={{
              open: messages.a11y.openMenu,
              menu: messages.nav.menu,
              language: messages.a11y.languageSwitcher,
            }}
          />
        </div>
      </div>
    </header>
  );
}
