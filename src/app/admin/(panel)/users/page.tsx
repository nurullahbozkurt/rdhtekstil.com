import { UsersManager } from "@/components/admin/users-manager";
import { listAdminUsers } from "@/lib/admin/users";
import { getAdminSession } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

export const metadata = { title: "Kullanıcılar" };

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const users = await listAdminUsers();

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900 sm:text-3xl">
          Kullanıcılar
        </h1>
        <p className="mt-1 text-sm text-ink-600">Admin ekleme, silme ve parola değiştirme</p>
      </div>
      <UsersManager users={users} currentUserId={session.user.id} />
    </div>
  );
}
