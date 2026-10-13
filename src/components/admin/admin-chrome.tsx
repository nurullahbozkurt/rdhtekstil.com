import { cache } from "react";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { countUnreadContacts } from "@/lib/admin/contacts";
import { countUnreadRequests } from "@/lib/admin/requests";
import { getAdminSession } from "@/lib/auth/admin";

const loadAdminChrome = cache(async () => {
  const sessionPromise = getAdminSession();
  const countsPromise = Promise.all([
    countUnreadRequests().catch(() => 0),
    countUnreadContacts().catch(() => 0),
  ]);
  const session = await sessionPromise;
  if (!session) redirect("/admin/login");
  const [unreadRequests, unreadMessages] = await countsPromise;
  return { name: session.profile.name, unreadRequests, unreadMessages };
});

export async function AdminSideChrome() {
  const chrome = await loadAdminChrome();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-5 py-6">
        <p className="font-heading text-xl font-medium tracking-tight">RDH Admin</p>
        <p className="mt-1 truncate text-sm text-cream-50/70">{chrome.name}</p>
      </div>
      <div className="flex-1">
        <AdminNav
          unreadRequests={chrome.unreadRequests}
          unreadMessages={chrome.unreadMessages}
          variant="side"
        />
      </div>
    </div>
  );
}

export function AdminSideFallback() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-5 py-6">
        <p className="font-heading text-xl font-medium tracking-tight">RDH Admin</p>
        <p className="mt-2 h-4 w-28 animate-pulse rounded bg-cream-50/20 motion-reduce:animate-none" />
      </div>
      <div className="flex-1">
        <AdminNav unreadRequests={0} unreadMessages={0} variant="side" />
      </div>
    </div>
  );
}

export async function AdminMobileTitle() {
  const chrome = await loadAdminChrome();
  return (
    <div className="min-w-0">
      <p className="font-heading text-lg font-medium tracking-tight">RDH Admin</p>
      <p className="truncate text-xs text-cream-50/70">{chrome.name}</p>
    </div>
  );
}

export function AdminMobileTitleFallback() {
  return (
    <div className="min-w-0">
      <p className="font-heading text-lg font-medium tracking-tight">RDH Admin</p>
      <p className="mt-1 h-3 w-24 animate-pulse rounded bg-cream-50/20 motion-reduce:animate-none" />
    </div>
  );
}

export async function AdminBottomChrome() {
  const chrome = await loadAdminChrome();
  return (
    <AdminNav
      unreadRequests={chrome.unreadRequests}
      unreadMessages={chrome.unreadMessages}
      variant="bottom"
    />
  );
}
