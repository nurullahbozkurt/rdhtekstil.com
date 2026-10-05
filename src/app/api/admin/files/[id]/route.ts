import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSignedDownloadUrl } from "@/lib/uploads/storage";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ip = clientIp(request.headers);
  const rl = rateLimit(`admin-file:${session.user.id}:${ip}`, 60, 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { id } = await params;
  const admin = createAdminClient();
  const { data: file, error } = await admin
    .from("request_files")
    .select("id, storage_key, original_name, mime_type")
    .eq("id", id)
    .maybeSingle();

  if (error || !file) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const url = await createSignedDownloadUrl(file.storage_key as string, 120);
    return NextResponse.json({
      ok: true,
      url,
      originalName: file.original_name,
      mimeType: file.mime_type,
    });
  } catch {
    return NextResponse.json({ error: "signed_url_failed" }, { status: 500 });
  }
}
