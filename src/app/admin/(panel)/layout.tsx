import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { HtmlLang } from "@/components/site/html-lang";
import { countUnreadContacts } from "@/lib/admin/contacts";
import { countUnreadRequests } from "@/lib/admin/requests";
import { getAdminSession } from "@/lib/auth/admin";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [unreadRequests, unreadMessages] = await Promise.all([
    countUnreadRequests().catch(() => 0),
    countUnreadContacts().catch(() => 0),
  ]);

  return (
    <>
      <HtmlLang lang="tr" />
      <AdminShell
        name={session.profile.name}
        unreadRequests={unreadRequests}
        unreadMessages={unreadMessages}
      >
        {children}
      </AdminShell>
    </>
  );
}
