import { NextResponse } from "next/server";
import JSZip from "jszip";
import { requireAdmin } from "@/lib/auth/admin";
import { getRequest } from "@/lib/admin/requests";
import { createAdminClient } from "@/lib/supabase/admin";
import { REQUEST_FILES_BUCKET } from "@/lib/uploads/config";

type Params = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const requestRow = await getRequest(id);
  if (!requestRow) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!requestRow.files.length) {
    return NextResponse.json({ error: "no_files" }, { status: 404 });
  }

  const admin = createAdminClient();
  const zip = new JSZip();

  for (const file of requestRow.files) {
    const { data, error } = await admin.storage
      .from(REQUEST_FILES_BUCKET)
      .download(file.storage_key);
    if (error || !data) continue;
    const buffer = Buffer.from(await data.arrayBuffer());
    const folder = file.kind.toLowerCase();
    zip.file(`${folder}/${file.original_name}`, buffer);
  }

  const content = await zip.generateAsync({ type: "nodebuffer" });
  const filename = `${requestRow.number}-dosyalar.zip`;

  return new NextResponse(new Uint8Array(content), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
