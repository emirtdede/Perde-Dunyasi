import { AdminAnnouncementManager } from "@/src/components/admin-announcement-manager";
import { getAnnouncements } from "@/src/lib/supabase/db";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements(true);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Duyurular</p>
        <h1 className="text-3xl font-semibold">Duyuru yönetimi</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Taslak ve yayınlanan duyurular için yönetim işlemleri. Veriler Supabase veritabanından çekilmektedir.
        </p>
      </div>

      <AdminAnnouncementManager announcements={announcements} />
    </div>
  );
}
