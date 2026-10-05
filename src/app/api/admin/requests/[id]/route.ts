import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import {
  updateRequestInternalNote,
  updateRequestStatus,
  type RequestStatus,
} from "@/lib/admin/requests";
import { deleteRequestWithFiles } from "@/lib/uploads/storage";
import { assertSameOrigin } from "@/lib/security/origin";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(["NEW", "IN_REVIEW", "REPLIED"]).optional(),
  internalNote: z.string().max(5000).optional(),
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
  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  try {
    if (parsed.data.status) {
      await updateRequestStatus(id, parsed.data.status as RequestStatus);
    }
    if (parsed.data.internalNote !== undefined) {
      await updateRequestInternalNote(id, parsed.data.internalNote);
    }
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
    await deleteRequestWithFiles(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "delete_failed" },
      { status: 500 },
    );
  }
}
