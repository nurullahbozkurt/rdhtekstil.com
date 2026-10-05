import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type RuntimeSettings = {
  retention_enabled: boolean;
  retention_days: number;
  updated_at: string | null;
};

export async function getRuntimeSettings(): Promise<RuntimeSettings> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_runtime_settings")
    .select("retention_enabled, retention_days, updated_at")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return {
    retention_enabled: Boolean(data?.retention_enabled),
    retention_days: Number(data?.retention_days ?? 0),
    updated_at: (data?.updated_at as string | null) ?? null,
  };
}

export async function updateRuntimeSettings(
  input: { retention_enabled: boolean; retention_days: number },
  updatedBy: string,
) {
  const admin = createAdminClient();
  const { error } = await admin.from("site_runtime_settings").upsert({
    id: "default",
    retention_enabled: input.retention_enabled,
    retention_days: Math.max(0, input.retention_days),
    updated_at: new Date().toISOString(),
    updated_by: updatedBy,
  });
  if (error) throw new Error(error.message);
}
