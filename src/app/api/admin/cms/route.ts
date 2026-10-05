import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { seedCmsFromLocal, writeCmsStore, readCmsStore } from "@/lib/content/cms-store";
import { clearContentCache } from "@/lib/content/source";
import { contentStoreSchema } from "@/lib/content/schema";
import { assertSameOrigin } from "@/lib/security/origin";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const store = await readCmsStore();
  return NextResponse.json({ ok: true, seeded: Boolean(store) });
}

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  try {
    if (body?.action === "seed") {
      await seedCmsFromLocal(session.user.id);
    } else if (body?.store) {
      await writeCmsStore(contentStoreSchema.parse(body.store), session.user.id);
    } else {
      return NextResponse.json({ error: "invalid_action" }, { status: 400 });
    }
    clearContentCache();
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "cms_failed" },
      { status: 500 },
    );
  }
}
