import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { seed } from "@/lib/content/data";
import { contentStoreSchema, type ContentStore } from "@/lib/content/schema";
import { hasSupabaseConfig } from "@/lib/supabase/env";

const CMS_ID = "main";

function localSeedStore(): ContentStore {
  return contentStoreSchema.parse(seed);
}

/** Mevcut CMS kaydına yeni seed anahtarlarını (ör. pages.fair) ekler. */
function mergeCmsWithSeed(raw: unknown): ContentStore {
  const base = localSeedStore();
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Record<string, unknown>;
  const rawPages =
    data.pages && typeof data.pages === "object" ? (data.pages as Record<string, unknown>) : {};
  return contentStoreSchema.parse({
    ...base,
    ...data,
    pages: { ...base.pages, ...rawPages },
  });
}

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
    return mergeCmsWithSeed(data.data);
  } catch {
    return null;
  }
}

/**
 * Supabase yapılandırıldıysa CMS kaydını garanti eder.
 * Boşsa yerel başlangıç içeriğini bir kez yazar; doluysa dokunmaz.
 */
export async function ensureCmsStore(): Promise<ContentStore | null> {
  if (!hasSupabaseConfig()) return null;

  const existing = await readCmsStore();
  if (existing) return existing;

  const parsed = localSeedStore();
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("cms_documents").insert({
      id: CMS_ID,
      collection: "content_store",
      data: parsed,
      updated_at: new Date().toISOString(),
      updated_by: null,
    });

    // Paralel isteklerde çakışma: mevcut kaydı oku.
    if (error && error.code !== "23505") {
      const raced = await readCmsStore();
      if (raced) return raced;
      throw new Error(error.message);
    }
  } catch {
    const raced = await readCmsStore();
    if (raced) return raced;
    return null;
  }

  return (await readCmsStore()) ?? parsed;
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

export async function patchCmsStore(
  patcher: (current: ContentStore) => ContentStore,
  updatedBy?: string,
) {
  const current = (await ensureCmsStore()) ?? localSeedStore();
  const next = patcher(current);
  await writeCmsStore(next, updatedBy);
  return next;
}
