import { redirect } from "next/navigation";

/** Saklama süresi paneldan yönetilmez; talepler yalnızca manuel silinir. */
export default function AdminSettingsPage() {
  redirect("/admin/requests");
}
