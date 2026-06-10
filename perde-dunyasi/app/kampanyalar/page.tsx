import { PageHero } from "@/src/components/page-hero";
import { getCampaigns } from "@/src/lib/supabase/db";

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="page-shell px-6 py-10 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <PageHero
          eyebrow="Kampanyalar"
          title="Aktif İndirim ve Teklifler"
          description="Özel kampanyalarımızdan yararlanarak perde ve tül ürünlerimizi avantajlı fiyatlarla edinebilirsiniz."
        />

        {campaigns.length === 0 ? (
          <div className="glass-card rounded-[1.75rem] p-8 text-center">
            <p className="text-4xl">🎉</p>
            <p className="mt-3 text-lg font-medium">Şu an aktif kampanya bulunmuyor</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Yeni kampanyalar eklendiğinde burada görüntülenecektir.
            </p>
          </div>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <article
                key={campaign.id}
                className="glass-card group relative flex flex-col overflow-hidden rounded-[1.75rem] transition hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/5"
              >
                {/* Image area */}
                <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--accent)]/10 to-transparent">
                  <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">
                    🎁
                  </div>
                  {campaign.badgeText && (
                    <span className="absolute left-4 top-4 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white shadow-md">
                      {campaign.badgeText}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-semibold">{campaign.title}</h2>

                  {campaign.description && (
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)] line-clamp-3">
                      {campaign.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4">
                    {(campaign.startDate || campaign.endDate) && (
                      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                        <span>
                          {campaign.startDate &&
                            new Date(campaign.startDate).toLocaleDateString("tr-TR")}
                          {campaign.startDate && campaign.endDate && " – "}
                          {campaign.endDate &&
                            new Date(campaign.endDate).toLocaleDateString("tr-TR")}
                          {!campaign.endDate && campaign.startDate && " – Süresiz"}
                          {!campaign.startDate && !campaign.endDate && "Süresiz kampanya"}
                        </span>
                      </div>
                    )}

                    {!campaign.startDate && !campaign.endDate && (
                      <p className="text-xs text-[var(--muted)]">Süresiz kampanya</p>
                    )}
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
