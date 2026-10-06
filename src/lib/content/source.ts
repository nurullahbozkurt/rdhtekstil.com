import { seed } from "./data";
import { contentStoreSchema, type ContentStore } from "./schema";
import { ensureCmsStore } from "./cms-store";
import { hasSupabaseConfig } from "@/lib/supabase/env";

/**
 * İçerik kaynağı: Supabase yapılandırıldıysa CMS (yoksa otomatik bootstrap),
 * aksi halde yerel seed.
 */
let memory: ContentStore | undefined;

export async function loadContent(): Promise<ContentStore> {
  if (hasSupabaseConfig()) {
    const fromCms = await ensureCmsStore();
    if (fromCms) {
      memory = fromCms;
      return fromCms;
    }
  }
  memory ??= contentStoreSchema.parse(seed);
  return memory;
}

/** Admin kayıt sonrası in-memory cache'i temizler. */
export function clearContentCache() {
  memory = undefined;
}
