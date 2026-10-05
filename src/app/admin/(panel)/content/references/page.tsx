import Link from "next/link";
import { ReferencesEditor } from "@/components/admin/references-editor";
import { getContentStore } from "@/lib/content";

export const metadata = { title: "Referanslar" };

export default async function AdminReferencesPage() {
  const store = await getContentStore();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-sm font-semibold text-ink-600">
          ← İçerik
        </Link>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">Referanslar</h1>
      </div>
      <ReferencesEditor
        items={store.references.map((ref) => ({
          id: ref.id,
          name: ref.name,
          permissionConfirmed: ref.permissionConfirmed,
          sortOrder: ref.sortOrder,
        }))}
      />
    </div>
  );
}
