import "server-only";

import { PRIVACY_CONSENT_VERSION } from "@/lib/security/privacy";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactFormData } from "@/lib/validation/contact";
import type { Locale } from "@/i18n/config";

export async function createContactMessage(
  locale: Locale,
  data: ContactFormData,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("contact_messages")
    .insert({
      locale,
      full_name: data.fullName,
      company: data.company ?? null,
      email: data.email,
      phone: data.phone ?? null,
      country: data.country ?? null,
      product_interest: data.productInterest ?? null,
      quantity_range: data.quantityRange ?? null,
      message: data.message,
      privacy_consent_at: new Date().toISOString(),
      privacy_consent_version: PRIVACY_CONSENT_VERSION,
    })
    .select("id")
    .single();

  if (error || !row) return { ok: false, error: error?.message ?? "insert_failed" };
  return { ok: true, id: row.id as string };
}
