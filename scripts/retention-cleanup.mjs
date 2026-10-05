/**
 * Saklama süresi dolmuş talepleri temizler.
 * Önce site_runtime_settings, yoksa RETENTION_* env.
 *
 *   node --env-file=.env.local scripts/retention-cleanup.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Supabase env eksik.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: settings } = await admin
  .from("site_runtime_settings")
  .select("retention_enabled, retention_days")
  .eq("id", "default")
  .maybeSingle();

const enabled =
  settings?.retention_enabled === true || process.env.RETENTION_ENABLED === "true";
const days =
  Number(settings?.retention_days ?? 0) || Number(process.env.RETENTION_DAYS || 0);

if (!enabled || days <= 0) {
  console.log("Retention kapalı. Çıkılıyor.");
  process.exit(0);
}

const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const { data: rows, error } = await admin
  .from("requests")
  .select("id, number")
  .lt("created_at", cutoff);

if (error) {
  console.error(error.message);
  process.exit(1);
}

if (!rows?.length) {
  console.log("Silinecek talep yok.");
  process.exit(0);
}

let deleted = 0;
for (const row of rows) {
  const { data: files } = await admin
    .from("request_files")
    .select("id, storage_key")
    .eq("request_id", row.id);

  for (const file of files ?? []) {
    await admin.storage.from("request-files").remove([file.storage_key]);
    await admin.from("request_files").delete().eq("id", file.id);
  }

  const { error: delErr } = await admin.from("requests").delete().eq("id", row.id);
  if (delErr) {
    console.error(`${row.number}: ${delErr.message}`);
    continue;
  }
  deleted += 1;
  console.log(`Silindi: ${row.number}`);
}

console.log(`Toplam silinen: ${deleted}`);
