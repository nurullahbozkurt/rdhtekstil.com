"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ctaVariants } from "../site/button-link";

/** Mobilde ekranın altında sabit duran ana CTA. Talep ekranının kendisinde gösterilmez. */
export function StickyCta({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  if (pathname === href || pathname.startsWith(`${href}/`)) return null;

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
