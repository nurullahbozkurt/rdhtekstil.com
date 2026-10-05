/**
 * Dashboard’dan oluşturulan admin kullanıcıyı uygulamaya bağlar.
 *
 * 1) Supabase → Authentication → Users → Add user (email + password)
 * 2) User id’yi kopyala
 * 3) Bu scripti çalıştır:
 *      node --env-file=.env.local scripts/link-admin.mjs <user-uuid> "Admin Adı"
 *
 * Script: app_metadata.role=admin + admin_profiles satırı yazar.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.argv[2];
const name = process.argv[3] || "RDH Admin";

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
  process.exit(1);
}
if (!userId || !/^[0-9a-f-]{36}$/i.test(userId)) {
  console.error("Kullanım: node --env-file=.env.local scripts/link-admin.mjs <user-uuid> [isim]");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: userData, error: getError } = await admin.auth.admin.getUserById(userId);
if (getError || !userData.user) {
  console.error(getError?.message ?? "Kullanıcı bulunamadı");
  process.exit(1);
}

const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
  app_metadata: { ...userData.user.app_metadata, role: "admin" },
  email_confirm: true,
});
if (updateError) {
  console.error(updateError.message);
  process.exit(1);
}

const { error: profileError } = await admin.from("admin_profiles").upsert({
  id: userId,
  name,
});
if (profileError) {
  console.error(profileError.message);
  process.exit(1);
}

console.log("Admin bağlandı:", userData.user.email, "→", name);
