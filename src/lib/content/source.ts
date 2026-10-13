import { seed } from "./data";
import { contentStoreSchema, type ContentStore } from "./schema";
import { ensureCmsStore } from "./cms-store";
import { hasSupabaseConfig } from "@/lib/supabase/env";

/**
 * İçerik kaynağı: Supabase yapılandırıldıysa CMS (yoksa otomatik bootstrap),
 * aksi halde yerel seed.
 */
const CMS_TTL_MS = 60_000;
let memory: ContentStore | undefined;
let memoryAt = 0;

export async function loadContent(): Promise<ContentStore> {
  const fresh = memory && Date.now() - memoryAt < CMS_TTL_MS;
  if (memory && (!hasSupabaseConfig() || fresh)) return memory;

  if (hasSupabaseConfig()) {
    const fromCms = await ensureCmsStore();
    if (fromCms) {
      memory = fromCms;
      memoryAt = Date.now();
      return fromCms;
    }
  }
  memory ??= contentStoreSchema.parse(seed);
  memoryAt = Date.now();
  return memory;
}

/** Admin kayıt sonrası in-memory cache'i temizler. */
export function clearContentCache() {
  memory = undefined;
  memoryAt = 0;
}
