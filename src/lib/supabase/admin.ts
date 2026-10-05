import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from "./env";

/** Yalnızca sunucu — service_role. İstemciye asla import edilmez. */
export function createAdminClient() {
  const { url } = getSupabasePublicEnv();
  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
