import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { breadcrumbJsonLd, type BreadcrumbItem } from "@/lib/seo/jsonld";
import { cn } from "@/lib/utils";
import { JsonLd } from "./json-ld";

export function Breadcrumbs({
  items,
  label,
  tone = "dark",
}: {
  items: BreadcrumbItem[];
  label: string;
  tone?: "dark" | "light";
}) {
  return (
    <>
      <nav aria-label={label} className="mb-8">
        <ol
          className={cn(
            "flex flex-wrap items-center gap-1.5 text-sm",
            tone === "light" ? "text-cream-50/75" : "text-ink-600",
          )}
        >
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {last ? (
                  <span
                    aria-current="page"
                    className={tone === "light" ? "text-cream-50" : "text-navy-900"}
                  >
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="underline-offset-4 hover:underline">
                      {item.name}
                    </Link>
                    <ChevronRight aria-hidden className="size-3.5 opacity-60" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}
