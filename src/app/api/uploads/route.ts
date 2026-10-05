import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/security/origin";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { MAX_FILE_BYTES } from "@/lib/uploads/config";
import { storeValidatedUpload } from "@/lib/uploads/storage";
import { validateUpload } from "@/lib/uploads/validate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = clientIp(request.headers);
  const rl = rateLimit(`upload:${ip}`, 30, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const honeypot = String(form.get("website") ?? "");
  if (honeypot) return NextResponse.json({ ok: true, skipped: true });

  const turnstile = await verifyTurnstile(String(form.get("turnstileToken") ?? ""), ip);
  if (!turnstile.ok) {
    return NextResponse.json({ error: "turnstile" }, { status: 400 });
  }

  const kindRaw = String(form.get("kind") ?? "OTHER");
  const kind = kindRaw === "LOGO" ? "logo" : kindRaw === "REFERENCE" ? "reference" : "other";
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 400 });
  }

  const validated = await validateUpload(file);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const { storageKey } = await storeValidatedUpload(validated.data, kind);
    return NextResponse.json({
      ok: true,
      file: {
        kind: kindRaw === "LOGO" || kindRaw === "REFERENCE" ? kindRaw : "OTHER",
        originalName: validated.data.originalName,
        storageKey,
        mimeType: validated.data.mime,
        sizeBytes: validated.data.sizeBytes,
      },
    });
  } catch {
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
