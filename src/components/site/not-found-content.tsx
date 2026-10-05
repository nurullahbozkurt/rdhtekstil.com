"use client";

import { usePathname } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { ButtonLink } from "./button-link";

type Texts = {
  title: string;
  text: string;
  home: string;
  products: string;
  homeHref: string;
  productsHref: string;
};

export function NotFoundContent({ texts }: { texts: Partial<Record<Locale, Texts>> }) {
  const segment = usePathname().split("/")[1] ?? "";
  const t = texts[isLocale(segment) ? segment : defaultLocale] ?? texts[defaultLocale];
  if (!t) return null;

  return (
    <section className="bg-cream-100 py-24 sm:py-32">
      <div className="container-site max-w-3xl text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="text-h2 font-medium text-navy-900">{t.title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-600">{t.text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href={t.homeHref} variant="primary" size="lg">
            {t.home}
          </ButtonLink>
          <ButtonLink href={t.productsHref} variant="outline" size="lg">
            {t.products}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
