import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/logout-button";

const links = [
  { href: "/admin/requests", label: "Talepler" },
  { href: "/admin/messages", label: "İletişim" },
  { href: "/admin/users", label: "Kullanıcılar" },
  { href: "/admin/content", label: "İçerik" },
  { href: "/admin/settings", label: "Ayarlar" },
] as const;

export function AdminShell({
  children,
  name,
  unreadRequests,
  unreadMessages,
}: {
  children: React.ReactNode;
  name: string;
  unreadRequests: number;
  unreadMessages: number;
}) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-cream-300 bg-navy-900 text-cream-50 lg:min-h-dvh lg:border-r lg:border-b-0">
        <div className="px-5 py-6">
          <p className="font-heading text-xl font-medium tracking-tight">RDH Admin</p>
          <p className="mt-1 text-sm text-cream-50/70">{name}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {links.map((link) => {
            const badge =
              link.href === "/admin/requests"
                ? unreadRequests
                : link.href === "/admin/messages"
                  ? unreadMessages
                  : 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-cream-50/85 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
              >
                <span>{link.label}</span>
                {badge > 0 ? (
                  <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-navy-900">
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-5 pb-6 lg:block">
          <AdminLogoutButton label="Çıkış" />
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-end border-b border-cream-300 px-4 py-3 lg:hidden">
          <AdminLogoutButton label="Çıkış" />
        </div>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
