import { seed } from "./data";
import { contentStoreSchema, type ContentStore } from "./schema";
import { readCmsStore } from "./cms-store";

/**
 * İçerik kaynağı: Supabase CMS varsa onu kullanır, yoksa yerel seed'e düşer.
 */
let memory: ContentStore | undefined;

export async function loadContent(): Promise<ContentStore> {
  const fromCms = await readCmsStore();
  if (fromCms) {
    memory = fromCms;
    return fromCms;
  }
  memory ??= contentStoreSchema.parse(seed);
  return memory;
}

/** Admin kayıt sonrası in-memory cache'i temizler. */
export function clearContentCache() {
  memory = undefined;
}
