import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { deleteFairVisitor, updateFairVisitorWithLog } from "@/lib/admin/fair-visitors";
import { assertSameOrigin } from "@/lib/security/origin";
import { FAIR_PRODUCT_GROUPS } from "@/lib/validation/fair-visitor";

type Params = { params: Promise<{ id: string }> };

const emptyToNull = (value: string | undefined) => {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const patchSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  jobTitle: z.string().max(120).optional(),
  country: z.string().max(40).optional(),
  email: z
    .string()
    .max(254)
    .optional()
    .refine((v) => !v?.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), {
      message: "invalidEmail",
    }),
  phone: z
    .string()
    .max(40)
    .optional()
    .refine((v) => !v?.trim() || /^\+?[0-9\s().-]{7,20}$/.test(v.trim()), {
      message: "invalidPhone",
    }),
  productGroup: z.enum(FAIR_PRODUCT_GROUPS),
  quantityRange: z.string().max(40).optional(),
  desiredDate: z
    .string()
    .optional()
    .refine((v) => !v?.trim() || /^\d{4}-\d{2}-\d{2}$/.test(v.trim()), {
      message: "invalidDate",
    }),
  notes: z.string().max(3000).optional(),
  status: z.enum(["NEW", "MET", "QUOTED", "FOLLOW_UP"]),
  internalNote: z.string().max(5000).optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const result = await updateFairVisitorWithLog(
      id,
      {
        full_name: parsed.data.fullName,
        company: parsed.data.company,
        job_title: emptyToNull(parsed.data.jobTitle),
        country: emptyToNull(parsed.data.country),
        email: emptyToNull(parsed.data.email),
        phone: emptyToNull(parsed.data.phone),
        product_group: parsed.data.productGroup,
        quantity_range: emptyToNull(parsed.data.quantityRange),
        desired_date: emptyToNull(parsed.data.desiredDate),
        notes: emptyToNull(parsed.data.notes),
        status: parsed.data.status,
        internal_note: emptyToNull(parsed.data.internalNote),
      },
      { id: session.profile.id, name: session.profile.name },
    );
    return NextResponse.json({ ok: true, changes: result.changes.length });
  } catch (e) {
    const message = e instanceof Error ? e.message : "update_failed";
    if (message === "not_found") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
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
    await deleteFairVisitor(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "delete_failed" },
      { status: 500 },
    );
  }
}
