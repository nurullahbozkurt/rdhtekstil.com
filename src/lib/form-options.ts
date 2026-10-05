import "server-only";

import type { Locale } from "@/i18n/config";
import { getFormOptions as getContentFormOptions } from "@/lib/content";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseConfig } from "@/lib/supabase/env";

export type FormOption = {
  value: string;
  label: string;
};

/** Supabase `form_options` — yoksa içerik katmanı seed'ine düşer. */
export async function getDbFormOptions(
  type: "quantity" | "country",
  locale: Locale,
): Promise<FormOption[]> {
  if (!hasSupabaseConfig()) {
    return getContentFormOptions(type, locale);
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("form_options")
      .select("value, label_tr, label_en, sort_order")
      .eq("type", type)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return getContentFormOptions(type, locale);
    }

    return data.map((row) => ({
      value: row.value as string,
      label: (locale === "en" ? row.label_en : row.label_tr) as string,
    }));
  } catch {
    return getContentFormOptions(type, locale);
  }
}
