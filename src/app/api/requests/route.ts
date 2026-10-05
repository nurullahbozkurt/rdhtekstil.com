import { NextResponse } from "next/server";
import { createRequest } from "@/lib/requests/create-request";
import { setRequestSuccessCookie } from "@/lib/requests/success-cookie";
import { assertSameOrigin } from "@/lib/security/origin";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { requestFormSchema } from "@/lib/validation/request";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = clientIp(request.headers);
  const rl = rateLimit(`request:${ip}`, 8, 15 * 60 * 1000);
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

  const parsed = requestFormSchema.safeParse(json);
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

  const result = await createRequest(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: "save_failed", detail: result.error }, { status: 500 });
  }

  await setRequestSuccessCookie(result.email);

  return NextResponse.json({
    ok: true,
    requestId: result.requestId,
    number: result.number,
    email: result.email,
    created: result.created,
  });
}
