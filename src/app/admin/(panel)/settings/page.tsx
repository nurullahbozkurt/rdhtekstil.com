import { SettingsForm } from "@/components/admin/settings-form";
import { getRuntimeSettings } from "@/lib/admin/settings";

export const metadata = { title: "Ayarlar" };

export default async function AdminSettingsPage() {
  let settings = { retention_enabled: false, retention_days: 0, updated_at: null as string | null };
  try {
    settings = await getRuntimeSettings();
  } catch {
    // tablo henüz migrate edilmemiş olabilir
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight">Ayarlar</h1>
        <p className="mt-1 text-sm text-ink-600">Saklama süresi ve operasyon ayarları</p>
      </div>
      <SettingsForm
        retentionEnabled={settings.retention_enabled}
        retentionDays={settings.retention_days}
      />
    </div>
  );
}
