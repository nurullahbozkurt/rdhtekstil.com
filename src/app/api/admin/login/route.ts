import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSameOrigin } from "@/lib/security/origin";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";

const schema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = clientIp(request.headers);
  const rl = rateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("admin_profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "not_admin" }, { status: 403 });
  }

  if (data.user.app_metadata?.role !== "admin") {
    await admin.auth.admin.updateUserById(data.user.id, {
      app_metadata: { ...data.user.app_metadata, role: "admin" },
    });
  }

  return NextResponse.json({ ok: true });
}
