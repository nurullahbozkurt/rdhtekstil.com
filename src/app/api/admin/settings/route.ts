import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { assertSameOrigin } from "@/lib/security/origin";

/** Saklama süresi paneldan yönetilmez; talepler yalnızca manuel silinir. */
export async function PATCH(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ error: "disabled" }, { status: 410 });
}
