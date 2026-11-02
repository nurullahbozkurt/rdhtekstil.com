import "server-only";

import { PRIVACY_CONSENT_VERSION } from "@/lib/security/privacy";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FairVisitorFormData, FairVisitorSource } from "@/lib/validation/fair-visitor";
import type { Locale } from "@/i18n/config";

export async function createFairVisitor(
  locale: Locale,
  data: FairVisitorFormData,
  source: FairVisitorSource = "STAFF",
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("fair_visitors")
    .insert({
      locale,
      source,
      full_name: data.fullName,
      company: data.company,
      job_title: data.jobTitle ?? null,
      country: data.country ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      product_group: data.productGroup,
      quantity_range: data.quantityRange ?? null,
      desired_date: data.desiredDate ?? null,
      notes: data.notes ?? null,
      privacy_consent_at: new Date().toISOString(),
      privacy_consent_version: PRIVACY_CONSENT_VERSION,
    })
    .select("id")
    .single();

  if (error || !row) return { ok: false, error: error?.message ?? "insert_failed" };
  return { ok: true, id: row.id as string };
}
