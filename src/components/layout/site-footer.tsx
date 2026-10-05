import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import type { SiteSettingsView } from "@/lib/content";
import type { Navigation } from "@/lib/navigation";
import { TrackedLink } from "../analytics/tracked-link";
import { CookiePreferencesButton } from "../consent/cookie-preferences-button";
import { LanguageSwitcher, type LanguageMap } from "./language-switcher";
import { Logo } from "./logo";

export function SiteFooter({
  locale,
  navigation,
  languageMap,
  messages,
  settings,
}: {
  locale: Locale;
  navigation: Navigation;
  languageMap: LanguageMap;
  messages: Messages;
  settings: SiteSettingsView;
}) {
  const year = new Date().getFullYear();
  const linkClass = "text-cream-50/75 transition-colors hover:text-cream-50";

  return (
    <footer className="on-dark relative overflow-hidden bg-navy-900 pb-28 text-cream-50 lg:pb-0">
      <div aria-hidden className="bg-weave pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="container-site relative pt-16 pb-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo
              href={navigation.homeHref}
              label={settings.brandName}
              variant="light"
              className="h-10"
            />
            <p className="mt-6 text-xs font-bold tracking-[0.28em] text-gold-400">
              {settings.tagline}
            </p>
            <p className="mt-4 max-w-xs font-heading text-2xl leading-snug">{settings.slogan}</p>
            <ul className="mt-8 space-y-2 text-sm">
              <li>
                <TrackedLink
                  event="email_click"
                  location="footer"
                  href={`mailto:${settings.contact.email}`}
                  className={linkClass}
                >
                  {settings.contact.email}
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  event="whatsapp_click"
                  location="footer"
                  href={`https://wa.me/${settings.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {messages.contact.whatsapp}: {settings.contact.phoneDisplay}
                  <span className="sr-only"> ({messages.a11y.external})</span>
                </TrackedLink>
              </li>
            </ul>
          </div>

          <nav
            aria-label={messages.a11y.footerNav}
            className="grid grid-cols-2 gap-10 sm:grid-cols-4"
          >
            {navigation.footer.map((group) => (
              <div key={group.title}>
                <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-gold-400 uppercase">
                  {group.title}
                </h2>
                <ul className="mt-5 space-y-3 text-sm">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-cream-50/15 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <LanguageSwitcher
              locale={locale}
              map={languageMap}
              label={messages.a11y.languageSwitcher}
              tone="light"
            />
            <ul className="flex items-center gap-4">
              {settings.social.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {social.label}
                    <span className="sr-only"> ({messages.a11y.external})</span>
                  </a>
                </li>
              ))}
            </ul>
            <CookiePreferencesButton
              label={messages.consent.manage}
              className="text-cream-50/75 underline-offset-4 hover:text-cream-50 hover:underline"
            />
          </div>
          <p className="text-cream-50/60">
            © {year} {settings.legalName}. {messages.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
