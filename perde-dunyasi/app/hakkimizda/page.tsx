import { PageHero } from "@/src/components/page-hero";
import { getSettings } from "@/src/lib/supabase/db";

export default async function AboutPage() {
  const settings = await getSettings();

  const aboutText =
    settings.about_text ||
    "Perde Dünyası, kaliteli perde çözümleri sunan bir mağazadır.";
  const address = settings.address || "Adıyaman, Türkiye";

  return (
    <div className="page-shell px-6 py-10 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <PageHero
          eyebrow="Hakkımızda"
          title="Perde Dünyası"
          description="Kaliteli ürünler ve profesyonel hizmet anlayışıyla müşterilerimize en iyi perde çözümlerini sunuyoruz."
        />

        {/* About content */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card hover-lift rounded-[1.75rem] p-6 sm:p-8 animate-fade-in-up delay-100">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Hikayemiz</p>
            <h2 className="mt-3 text-2xl font-semibold">Biz Kimiz?</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{aboutText}</p>
          </div>

          <div className="glass-card hover-lift rounded-[1.75rem] p-6 sm:p-8 animate-fade-in-up delay-200">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Değerlerimiz</p>
            <h2 className="mt-3 text-2xl font-semibold">Neden Biz?</h2>
            <div className="mt-4 space-y-4">
              {[
                {
                  icon: "✨",
                  title: "Kaliteli Ürünler",
                  desc: "Seçkin kumaşlar ve güvenilir aksesuarlarla kaliteden ödün vermeden hizmet veriyoruz.",
                },
                {
                  icon: "🚀",
                  title: "Hızlı İletişim",
                  desc: "WhatsApp üzerinden anında fiyat teklifi alabilir, sorularınıza hızlı yanıt bulabilirsiniz.",
                },
                {
                  icon: "🎨",
                  title: "Geniş Ürün Yelpazesi",
                  desc: "Stor, tül, fon, jaluzi ve aksesuarlar — ihtiyacınıza uygun çözüm burada.",
                },
                {
                  icon: "🤝",
                  title: "Müşteri Memnuniyeti",
                  desc: "Satış öncesi ve sonrası destek ile her zaman yanınızdayız.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="mt-0.5 text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="glass-card hover-lift rounded-[1.75rem] p-6 sm:p-8 animate-fade-in-up delay-300">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Konum</p>
          <h2 className="mt-3 text-2xl font-semibold">Mağazamız</h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-lg">
                📍
              </span>
              <div>
                <p className="text-sm font-medium">Adres</p>
                <p className="text-sm text-[var(--muted)]">{address}</p>
              </div>
            </div>
            {settings.google_maps_url && (
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--accent-foreground)] transition hover:scale-105 active:scale-95 shadow-md shadow-[var(--accent)]/10"
              >
                Haritada Göster
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
