import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export async function listAdminUsers(): Promise<AdminUser[]> {
  const admin = createAdminClient();
  const { data: profiles, error } = await admin
    .from("admin_profiles")
    .select("id, name, created_at")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);

  const users: AdminUser[] = [];
  for (const profile of profiles ?? []) {
    const { data } = await admin.auth.admin.getUserById(profile.id as string);
    users.push({
      id: profile.id as string,
      name: profile.name as string,
      email: data.user?.email ?? "",
      created_at: profile.created_at as string,
    });
  }
  return users;
}

export async function createAdminUser(input: {
  email: string;
  password: string;
  name: string;
}) {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    app_metadata: { role: "admin" },
    user_metadata: { name: input.name },
  });
  if (error || !data.user) throw new Error(error?.message ?? "create_failed");

  const { error: profileError } = await admin.from("admin_profiles").insert({
    id: data.user.id,
    name: input.name,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    throw new Error(profileError.message);
  }
  return data.user.id;
}

export async function deleteAdminUser(id: string, actorId: string) {
  if (id === actorId) throw new Error("cannot_delete_self");
  const admin = createAdminClient();
  const { count, error: countError } = await admin
    .from("admin_profiles")
    .select("*", { count: "exact", head: true });
  if (countError) throw new Error(countError.message);
  if ((count ?? 0) <= 1) throw new Error("last_admin");

  const { error: profileError } = await admin.from("admin_profiles").delete().eq("id", id);
  if (profileError) throw new Error(profileError.message);

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
}

export async function updateAdminPassword(id: string, password: string) {
  if (password.length < 8) throw new Error("password_too_short");
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(id, { password });
  if (error) throw new Error(error.message);
}

export async function updateAdminName(id: string, name: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("admin_profiles").update({ name }).eq("id", id);
  if (error) throw new Error(error.message);
}
