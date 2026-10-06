"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, FileText, Mail, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/requests", label: "Talepler", icon: ClipboardList },
  { href: "/admin/messages", label: "İletişim", icon: Mail },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
  { href: "/admin/content", label: "İçerik", icon: FileText },
] as const;

export function AdminNav({
  unreadRequests,
  unreadMessages,
  variant,
}: {
  unreadRequests: number;
  unreadMessages: number;
  variant: "side" | "bottom";
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin menü"
      className={cn(
        variant === "side" && "flex flex-col gap-1 px-3 pb-4",
        variant === "bottom" &&
          "grid grid-cols-4 border-t border-cream-300 bg-cream-50/95 px-1 pt-1 backdrop-blur-md supports-backdrop-filter:bg-cream-50/85",
      )}
      style={
        variant === "bottom"
          ? { paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }
          : undefined
      }
    >
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        const badge =
          link.href === "/admin/requests"
            ? unreadRequests
            : link.href === "/admin/messages"
              ? unreadMessages
              : 0;
        const Icon = link.icon;

        if (variant === "bottom") {
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] font-semibold transition-colors",
                active
                  ? "text-navy-900"
                  : "text-ink-500 active:bg-cream-200/80 active:text-navy-900",
              )}
            >
              <span
                className={cn(
                  "relative inline-flex size-8 items-center justify-center rounded-xl transition-colors",
                  active && "bg-navy-800 text-cream-50",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {badge > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-navy-900">
                    {badge > 99 ? "99+" : badge}
                  </span>
                ) : null}
              </span>
              <span className="truncate">{link.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-cream-50/15 text-cream-50"
                : "text-cream-50/85 hover:bg-cream-50/10 hover:text-cream-50",
            )}
          >
            <span className="flex items-center gap-2.5">
              <Icon className="size-4 opacity-80" aria-hidden />
              {link.label}
            </span>
            {badge > 0 ? (
              <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-navy-900">
                {badge > 99 ? "99+" : badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
