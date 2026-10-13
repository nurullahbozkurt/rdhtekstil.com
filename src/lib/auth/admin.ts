import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { ADMIN_USER_HEADER } from "@/lib/auth/access-token";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const USER_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function profileFor(userId: string) {
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("admin_profiles")
    .select("id, name")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return null;
  return {
    user: { id: userId },
    profile: { id: profile.id as string, name: profile.name as string },
  };
}

export const getAdminSession = cache(async () => {
  const headerStore = await headers();
  const hinted = headerStore.get(ADMIN_USER_HEADER);
  if (hinted && USER_ID.test(hinted)) return profileFor(hinted);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (error || !userId) return null;
  return profileFor(userId);
});

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("unauthorized");
  return session;
}
