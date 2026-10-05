/**
 * Saklama süresi dolmuş talep dosyalarını silmeye hazır job (varsayılan kapalı).
 *
 * RETENTION_DAYS > 0 ve RETENTION_ENABLED=true iken çalışır.
 *   node --env-file=.env.local scripts/retention-cleanup.mjs
 */
import { createClient } from "@supabase/supabase-js";

const enabled = process.env.RETENTION_ENABLED === "true";
const days = Number(process.env.RETENTION_DAYS || 0);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!enabled || days <= 0) {
  console.log("Retention kapalı (RETENTION_ENABLED/RETENTION_DAYS). Çıkılıyor.");
  process.exit(0);
}

if (!url || !serviceKey) {
  console.error("Supabase env eksik.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const { data: rows, error } = await admin.from("requests").select("id").lt("created_at", cutoff);

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(
  `${rows?.length ?? 0} talep saklama süresini aştı (silme bu scriptte bilinçli olarak yorum satırıdır).`,
);
console.log(
  "Kalıcı silme için Faz 3 admin silme servisini veya bu scriptteki delete bloğunu etkinleştirin.",
);
