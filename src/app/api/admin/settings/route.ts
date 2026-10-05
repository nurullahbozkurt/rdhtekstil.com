import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { updateRuntimeSettings } from "@/lib/admin/settings";
import { assertSameOrigin } from "@/lib/security/origin";

const schema = z.object({
  retention_enabled: z.boolean(),
  retention_days: z.number().int().min(0).max(3650),
});

export async function PATCH(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "validation" }, { status: 400 });
  try {
    await updateRuntimeSettings(parsed.data, session.user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "update_failed" },
      { status: 500 },
    );
  }
}
