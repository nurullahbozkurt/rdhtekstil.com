import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/security/origin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
