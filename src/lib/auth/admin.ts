import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAdminSession() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("admin_profiles")
    .select("id, name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;
  return { user, profile: { id: profile.id as string, name: profile.name as string } };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("unauthorized");
  return session;
}
