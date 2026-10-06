import { AdminLogoutButton } from "@/components/admin/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";

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
    <div className="admin-app min-h-dvh bg-cream-100 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-cream-300 bg-navy-900 text-cream-50 lg:flex lg:min-h-dvh lg:flex-col lg:border-r">
        <div className="px-5 py-6">
          <p className="font-heading text-xl font-medium tracking-tight">RDH Admin</p>
          <p className="mt-1 truncate text-sm text-cream-50/70">{name}</p>
        </div>
        <div className="flex-1">
          <AdminNav
            unreadRequests={unreadRequests}
            unreadMessages={unreadMessages}
            variant="side"
          />
        </div>
        <div className="px-5 pb-6">
          <AdminLogoutButton label="Çıkış" />
        </div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-cream-300 bg-navy-900 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 text-cream-50 lg:hidden">
          <div className="min-w-0">
            <p className="font-heading text-lg font-medium tracking-tight">RDH Admin</p>
            <p className="truncate text-xs text-cream-50/70">{name}</p>
          </div>
          <AdminLogoutButton label="Çıkış" tone="light" />
        </header>

        <div className="min-w-0 flex-1 px-4 py-5 pb-[calc(5.25rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
          <AdminNav
            unreadRequests={unreadRequests}
            unreadMessages={unreadMessages}
            variant="bottom"
          />
        </div>
      </div>
    </div>
  );
}
