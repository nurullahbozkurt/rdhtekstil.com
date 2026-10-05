import { seed } from "./data";
import { contentStoreSchema, type ContentStore } from "./schema";

/**
 * İçerik kaynağı. Faz 1'de yerel seed verisi; Faz 3'te bu fonksiyonun gövdesi
 * Supabase sorgularıyla değiştirilecek. Getter'lar ve UI bileşenleri etkilenmez.
 */
let store: ContentStore | undefined;

export async function loadContent(): Promise<ContentStore> {
  store ??= contentStoreSchema.parse(seed);
  return store;
}
