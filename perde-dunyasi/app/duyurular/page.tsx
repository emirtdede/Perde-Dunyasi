import { PageHero } from "@/src/components/page-hero";
import { getAnnouncements } from "@/src/lib/supabase/db";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="page-shell px-6 py-10 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <PageHero
          eyebrow="Duyurular"
          title="Mağaza Haberleri"
          description="Yeni koleksiyonlar, çalışma saatleri ve önemli duyurularımızı buradan takip edebilirsiniz."
        />

        {announcements.length === 0 ? (
          <div className="glass-card rounded-[1.75rem] p-8 text-center">
            <p className="text-4xl">📢</p>
            <p className="mt-3 text-lg font-medium">Henüz yayınlanmış duyuru yok</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Yeni duyurular eklendiğinde burada görüntülenecektir.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            {announcements.map((ann) => (
              <article
                key={ann.id}
                className="glass-card rounded-[1.75rem] p-6 transition hover:border-[var(--accent)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <h2 className="text-xl font-semibold">{ann.title}</h2>
                    <p className="text-sm leading-7 text-[var(--muted)]">{ann.content}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <time className="inline-block rounded-full border border-[var(--card-border)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--muted)]">
                      {ann.publishedAt
                        ? new Date(ann.publishedAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Taslak"}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
