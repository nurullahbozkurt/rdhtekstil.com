"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function DesktopNav({ items, label }: { items: NavItem[]; label: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        rootRef.current?.querySelector<HTMLButtonElement>(`[data-nav-trigger="${open}"]`)?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      ref={rootRef}
      aria-label={label}
      className="hidden xl:block"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(null);
      }}
    >
      <ul className="flex items-center gap-1 xl:gap-2">
        {items.map((item, index) => {
          const hasChildren = Boolean(item.children?.length);
          const expanded = open === index;
          const active =
            isActive(item.href) || Boolean(item.children?.some((child) => isActive(child.href)));
          const linkClass = cn(
            "inline-flex h-10 items-center gap-1 rounded-full px-3 text-[0.9rem] font-semibold whitespace-nowrap transition-colors hover:bg-navy-800/5",
            active ? "text-navy-900" : "text-navy-900/80",
          );

          if (!hasChildren) {
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={linkClass}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          return (
            <li
              key={item.href}
              className="relative"
              onPointerEnter={(event) => {
                if (event.pointerType !== "mouse") return;
                clearTimeout(closeTimer.current);
                setOpen(index);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== "mouse") return;
                closeTimer.current = setTimeout(() => setOpen(null), 150);
              }}
            >
              <button
                type="button"
                data-nav-trigger={index}
                aria-expanded={expanded}
                aria-controls={`nav-panel-${index}`}
                className={linkClass}
                onClick={() => setOpen(expanded ? null : index)}
              >
                {item.label}
                <ChevronDown
                  aria-hidden
                  className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
                />
              </button>
              <div
                id={`nav-panel-${index}`}
                hidden={!expanded}
                className="absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3"
              >
                <div
                  className={cn(
                    "rounded-2xl border border-cream-300 bg-cream-50 p-3 shadow-[0_30px_60px_-30px_rgba(11,20,40,0.45)]",
                    item.children?.some((c) => c.image) ? "w-[44rem]" : "w-[26rem]",
                  )}
                >
                  <ul
                    className={cn(
                      "grid gap-2",
                      item.children?.some((c) => c.image) ? "grid-cols-3" : "grid-cols-1",
                    )}
                  >
                    {item.children?.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="group flex h-full flex-col gap-1 rounded-xl p-3 transition-colors hover:bg-cream-200"
                        >
                          {child.image?.src ? (
                            <span className="relative mb-2 block aspect-[4/3] overflow-hidden rounded-lg bg-cream-200">
                              <Image
                                src={child.image.src}
                                alt=""
                                fill
                                sizes="220px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </span>
                          ) : null}
                          <span className="font-semibold text-navy-900">{child.label}</span>
                          {child.description ? (
                            <span className="text-sm leading-snug text-ink-600">
                              {child.description}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={item.href}
                    className="mt-2 flex items-center justify-between rounded-xl bg-cream-200/70 px-4 py-3 text-sm font-semibold text-navy-900 hover:bg-cream-300/60"
                  >
                    {item.overviewLabel ?? item.label}
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
