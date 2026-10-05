"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Locale } from "@/i18n/config";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ctaVariants } from "../site/button-link";
import { LanguageSwitcher, type LanguageMap } from "./language-switcher";

export function MobileNav({
  items,
  cta,
  locale,
  languageMap,
  labels,
}: {
  items: NavItem[];
  cta: { label: string; href: string };
  locale: Locale;
  languageMap: LanguageMap;
  labels: { open: string; menu: string; language: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-11 items-center justify-center rounded-full text-navy-900 hover:bg-navy-800/5 xl:hidden"
        aria-label={labels.open}
      >
        <Menu aria-hidden className="size-6" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-sm overflow-y-auto border-cream-300 bg-cream-50 p-0"
      >
        <div className="flex items-center border-b border-cream-300 px-6 py-5">
          <SheetTitle className="font-sans text-sm font-bold tracking-[0.18em] text-ink-600 uppercase">
            {labels.menu}
          </SheetTitle>
        </div>
        <nav aria-label={labels.menu} className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-12 items-center rounded-xl px-3 font-heading text-xl text-navy-900 hover:bg-cream-200",
                    pathname === item.href && "bg-cream-200",
                  )}
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="mb-2 ml-3 border-l border-cream-300 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center rounded-lg px-3 text-[0.95rem] text-ink-600 hover:bg-cream-200 hover:text-navy-900"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-4 border-t border-cream-300 px-6 py-6">
          <Link
            href={cta.href}
            onClick={() => setOpen(false)}
            className={cn(ctaVariants({ variant: "primary", size: "lg" }), "w-full uppercase")}
          >
            {cta.label}
          </Link>
          <LanguageSwitcher locale={locale} map={languageMap} label={labels.language} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
