import Link from "next/link";
import { FormOptionsEditor } from "@/components/admin/form-options-editor";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Form seçenekleri" };

export default async function AdminFormOptionsPage() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("form_options")
    .select("id, type, value, label_tr, label_en, sort_order, is_active")
    .order("type")
    .order("sort_order");
  if (error) throw new Error(error.message);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-sm font-semibold text-ink-600">
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">Form seçenekleri</h1>
      </div>
      <FormOptionsEditor
        options={(data ?? []).map((row) => ({
          id: row.id as string,
          type: row.type as "quantity" | "country",
          value: row.value as string,
          label_tr: row.label_tr as string,
          label_en: row.label_en as string,
          sort_order: row.sort_order as number,
          is_active: row.is_active as boolean,
        }))}
      />
    </div>
  );
}
