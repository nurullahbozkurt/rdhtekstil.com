import { NextResponse } from "next/server";
import { clearRequestSuccessCookie } from "@/lib/requests/success-cookie";
import { assertSameOrigin } from "@/lib/security/origin";

/** Başarı sayfası görüntülendikten sonra tek kullanımlık cookie'yi temizler. */
export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  await clearRequestSuccessCookie();
  return NextResponse.json({ ok: true });
}
