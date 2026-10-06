import "server-only";

import { ON_REQUEST_STYLE } from "@/lib/catalog/styles";
import { getContentStore } from "@/lib/content";
import { PRIVACY_CONSENT_VERSION } from "@/lib/security/privacy";
import { createAdminClient } from "@/lib/supabase/admin";
import { mergeStyleNoteIntoNote, type RequestFormData } from "@/lib/validation/request";

export type CreateRequestResult =
  | { ok: true; requestId: string; number: string; email: string; created: boolean }
  | { ok: false; error: string };

export async function createRequest(data: RequestFormData): Promise<CreateRequestResult> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("requests")
    .select("id, number, email")
    .eq("idempotency_key", data.idempotencyKey)
    .maybeSingle();

  if (existing) {
    return {
      ok: true,
      requestId: existing.id as string,
      number: existing.number as string,
      email: existing.email as string,
      created: false,
    };
  }

  const { data: numberRow, error: numberError } = await admin.rpc("next_request_number");
  if (numberError || !numberRow) {
    return { ok: false, error: "number_failed" };
  }

  const note = mergeStyleNoteIntoNote(data.locale, data.styleNote, data.note);

  const row = {
    number: numberRow as string,
    locale: data.locale,
    product_type: data.productType,
    product_slug: data.productSlug ?? null,
    model_slug: data.modelSlug ?? null,
    industry: data.industry ?? null,
    color1: data.color1,
    color2: data.color2 ?? null,
    color3: data.color3 ?? null,
    slogan: data.slogan ?? null,
    quantity_range: data.quantityRange,
    desired_date: data.desiredDate ?? null,
    note: note ?? null,
    full_name: data.fullName,
    company: data.company ?? "",
    email: data.email,
    phone: data.phone,
    country: data.country,
    privacy_consent_at: new Date().toISOString(),
    privacy_consent_version: PRIVACY_CONSENT_VERSION,
    marketing_consent: data.marketingConsent ?? false,
    idempotency_key: data.idempotencyKey,
  };

  let { data: inserted, error } = await admin
    .from("requests")
    .insert({ ...row, style_slug: data.styleSlug })
    .select("id, number, email")
    .single();

  if (error && /style_slug/i.test(error.message)) {
    const label = await styleLabel(data.styleSlug, data.locale);
    const fallbackNote = [label, note].filter(Boolean).join("\n\n");
    ({ data: inserted, error } = await admin
      .from("requests")
      .insert({ ...row, note: fallbackNote || null })
      .select("id, number, email")
      .single());
  }

  if (error) {
    if (error.code === "23505") {
      const { data: again } = await admin
        .from("requests")
        .select("id, number, email")
        .eq("idempotency_key", data.idempotencyKey)
        .maybeSingle();
      if (again) {
        return {
          ok: true,
          requestId: again.id as string,
          number: again.number as string,
          email: again.email as string,
          created: false,
        };
      }
    }
    return { ok: false, error: error.message };
  }

  if (!inserted) return { ok: false, error: "insert_failed" };

  if (data.files.length) {
    const { error: filesError } = await admin.from("request_files").insert(
      data.files.map((f) => ({
        request_id: inserted.id,
        kind: f.kind,
        original_name: f.originalName,
        storage_key: f.storageKey,
        mime_type: f.mimeType,
        size_bytes: f.sizeBytes,
      })),
    );
    if (filesError) return { ok: false, error: filesError.message };
  }

  return {
    ok: true,
    requestId: inserted.id as string,
    number: inserted.number as string,
    email: inserted.email as string,
    created: true,
  };
}

async function styleLabel(slug: string, locale: "tr" | "en") {
  if (slug === ON_REQUEST_STYLE) {
    return locale === "en" ? "Upon your request" : "Talebinize göre";
  }
  const { categories } = await getContentStore();
  for (const category of categories) {
    const type = category.types.find((item) => item.id === slug);
    if (type) return type.label[locale];
  }
  return slug;
}
