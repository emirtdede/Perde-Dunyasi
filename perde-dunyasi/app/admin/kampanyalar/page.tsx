import { AdminCampaignManager } from "@/src/components/admin-campaign-manager";
import { getCampaigns } from "@/src/lib/supabase/db";

export default async function AdminCampaignsPage() {
  const campaigns = await getCampaigns(true);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Kampanyalar</p>
        <h1 className="text-3xl font-semibold">Kampanya yönetimi</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Kampanya listeleme, tarih ve aktiflik kontrolü işlemleri. Veriler Supabase veritabanından çekilmektedir.
        </p>
      </div>

      <AdminCampaignManager campaigns={campaigns} />
    </div>
  );
}
