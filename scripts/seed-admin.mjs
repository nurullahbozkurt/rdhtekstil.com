/**
 * İlk admin kullanıcıyı oluşturur / günceller.
 *
 * Kullanım:
 *   node --env-file=.env.local scripts/seed-admin.mjs
 *
 * Gerekli env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 *   ADMIN_NAME (opsiyonel)
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "RDH Admin";

if (!url || !serviceKey || !email || !password) {
  console.error(
    "Eksik env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD",
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD en az 8 karakter olmalı.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: listed, error: listError } = await admin.auth.admin.listUsers({ perPage: 200 });
if (listError) {
  console.error(listError.message);
  process.exit(1);
}

const existing = listed.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

let userId = existing?.id;
if (existing) {
  const { error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    app_metadata: { ...existing.app_metadata, role: "admin" },
    email_confirm: true,
  });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log("Mevcut kullanıcı güncellendi:", email);
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
    user_metadata: { name },
  });
  if (error || !data.user) {
    console.error(error?.message ?? "createUser failed");
    process.exit(1);
  }
  userId = data.user.id;
  console.log("Admin kullanıcı oluşturuldu:", email);
}

const { error: profileError } = await admin.from("admin_profiles").upsert({
  id: userId,
  name,
});

if (profileError) {
  console.error(profileError.message);
  process.exit(1);
}

console.log("admin_profiles kaydı hazır.");
