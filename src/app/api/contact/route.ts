import { NextResponse } from "next/server";
import { z } from "zod";
import { createContactMessage } from "@/lib/contact/create-message";
import { assertSameOrigin } from "@/lib/security/origin";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { contactFormSchema } from "@/lib/validation/contact";
import { isLocale } from "@/i18n/config";

const bodySchema = contactFormSchema.extend({
  locale: z.enum(["tr", "en"]),
  website: z.string().max(0).optional(),
  turnstileToken: z.string().optional(),
});

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = clientIp(request.headers);
  const rl = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
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

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", issues: parsed.error.issues }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const turnstile = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json({ error: "turnstile" }, { status: 400 });
  }

  const { locale, turnstileToken, website, ...form } = parsed.data;
  void turnstileToken;
  void website;
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  const result = await createContactMessage(locale, form);
  if (!result.ok) {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
