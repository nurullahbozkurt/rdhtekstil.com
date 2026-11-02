"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ctaVariants } from "../site/button-link";

function normalizePath(path: string) {
  const bare = (path.split("?")[0] || path).replace(/\/+$/, "");
  return bare || "/";
}

function pathMatches(pathname: string, href: string) {
  const current = normalizePath(pathname);
  const base = normalizePath(href);
  return current === base || current.startsWith(`${base}/`);
}

/** Mobilde ekranın altında sabit duran ana CTA. Form/fuar ekranlarında gösterilmez. */
export function StickyCta({
  label,
  href,
  hiddenHrefs = [],
}: {
  label: string;
  href: string;
  /** Bu yollarda da gizlenir (fuar, talep, iletişim vb.). */
  hiddenHrefs?: string[];
}) {
  const pathname = usePathname();
  const hideOn = [href, ...hiddenHrefs];
  if (hideOn.some((path) => pathMatches(pathname, path))) return null;

  return (
    <div
      data-testid="sticky-cta"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-300 bg-cream-50/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur lg:hidden"
    >
      <Link
        href={href}
        className={cn(ctaVariants({ variant: "primary", size: "md" }), "w-full uppercase")}
      >
        {label}
        <ArrowRight aria-hidden />
      </Link>
    </div>
  );
}
