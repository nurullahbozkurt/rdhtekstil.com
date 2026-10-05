import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { seed } from "@/lib/content/data";
import { contentStoreSchema, type ContentStore } from "@/lib/content/schema";
import { hasSupabaseConfig } from "@/lib/supabase/env";

const CMS_ID = "main";

export async function readCmsStore(): Promise<ContentStore | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("cms_documents")
      .select("data")
      .eq("id", CMS_ID)
      .maybeSingle();
    if (error || !data?.data) return null;
    return contentStoreSchema.parse(data.data);
  } catch {
    return null;
  }
}

export async function writeCmsStore(store: ContentStore, updatedBy?: string) {
  const admin = createAdminClient();
  const parsed = contentStoreSchema.parse(store);
  const { error } = await admin.from("cms_documents").upsert({
    id: CMS_ID,
    collection: "content_store",
    data: parsed,
    updated_at: new Date().toISOString(),
    updated_by: updatedBy ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function seedCmsFromLocal(updatedBy?: string) {
  const parsed = contentStoreSchema.parse(seed);
  await writeCmsStore(parsed, updatedBy);
  return parsed;
}

export async function patchCmsStore(
  patcher: (current: ContentStore) => ContentStore,
  updatedBy?: string,
) {
  const current = (await readCmsStore()) ?? contentStoreSchema.parse(seed);
  const next = patcher(current);
  await writeCmsStore(next, updatedBy);
  return next;
}
