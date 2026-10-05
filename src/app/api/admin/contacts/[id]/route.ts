import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import {
  deleteContactMessage,
  updateContactStatus,
  type ContactStatus,
} from "@/lib/admin/contacts";
import { assertSameOrigin } from "@/lib/security/origin";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(["NEW", "READ", "ARCHIVED"]),
});

export async function PATCH(request: Request, { params }: Params) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "validation" }, { status: 400 });
  try {
    await updateContactStatus(id, parsed.data.status as ContactStatus);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "update_failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteContactMessage(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "delete_failed" },
      { status: 500 },
    );
  }
}
