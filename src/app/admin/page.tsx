import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/logout-button";
import { getAdminSession } from "@/lib/auth/admin";
import { getMessages } from "@/i18n/messages";

export default async function AdminHomePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const messages = getMessages("tr").admin;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight">
            {messages.placeholderTitle}
          </h1>
          <p className="mt-2 text-ink-600">Merhaba, {session.profile.name}</p>
        </div>
        <AdminLogoutButton label={messages.logout} />
      </div>
      <div className="rounded-2xl border-2 border-dashed border-gold-500/50 bg-cream-50 p-8">
        <p className="text-lg text-navy-900">{messages.placeholderText}</p>
      </div>
    </main>
  );
}
