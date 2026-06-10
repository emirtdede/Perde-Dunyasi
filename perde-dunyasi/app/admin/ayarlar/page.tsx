import { AdminSettingsManager } from "@/src/components/admin-settings-manager";
import { getSettings } from "@/src/lib/supabase/db";

// Next.js page runs as a Server Component by default
export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Site ayarları</p>
        <h1 className="text-3xl font-semibold">Ayarlar</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          WhatsApp numarası, telefon, adres, sosyal medya linkleri ve SEO başlıklarını buradan güncelleyin.
        </p>
      </div>

      <AdminSettingsManager initialSettings={settings} />
    </div>
  );
}
