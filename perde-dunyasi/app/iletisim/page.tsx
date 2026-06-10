import { PageHero } from "@/src/components/page-hero";
import { getSettings } from "@/src/lib/supabase/db";

export default async function ContactPage() {
  const settings = await getSettings();

  const phone = settings.phone || "0555 123 45 67";
  const email = settings.email || "info@perdedunyasi.com";
  const address = settings.address || "Adıyaman, Türkiye";
  const whatsappNumber = settings.whatsapp_number;
  const instagramUrl = settings.instagram_url;
  const facebookUrl = settings.facebook_url;

  const contactCards = [
    {
      icon: "📞",
      label: "Telefon",
      value: phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
      action: "Ara",
    },
    {
      icon: "✉️",
      label: "E-posta",
      value: email,
      href: `mailto:${email}`,
      action: "Mail Gönder",
    },
    {
      icon: "📍",
      label: "Adres",
      value: address,
      href: settings.google_maps_url || null,
      action: "Haritada Göster",
    },
  ];

  return (
    <div className="page-shell px-6 py-10 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <PageHero
          eyebrow="İletişim"
          title="Bize Ulaşın"
          description="WhatsApp, telefon veya e-posta ile bize ulaşabilirsiniz. En kısa sürede size dönüş yapıyoruz."
        />

        {/* Contact cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contactCards.map((card, index) => (
            <div
              key={card.label}
              className={`glass-card hover-lift flex flex-col rounded-[1.75rem] p-6 animate-fade-in-up delay-${((index % 3) + 1) * 100}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-2xl">
                {card.icon}
              </span>
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                {card.label}
              </p>
              <p className="mt-1 text-sm font-medium">{card.value}</p>
              {card.href && (
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                  className="mt-auto pt-4 text-sm font-medium text-[var(--accent)] transition hover:opacity-80 hover:translate-x-1 duration-200"
                >
                  {card.action} →
                </a>
              )}
            </div>
          ))}
        </section>

        {/* WhatsApp CTA */}
        {whatsappNumber && (
          <section className="glass-card hover-lift rounded-[1.75rem] p-6 sm:p-8 animate-fade-in-up delay-400">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">WhatsApp ile Hızlı İletişim</h2>
                <p className="text-sm text-[var(--muted)]">
                  Ürünler hakkında bilgi almak veya fiyat teklifi istemek için WhatsApp&apos;tan yazabilirsiniz.
                </p>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#20bd5a] animate-whatsapp hover:scale-105 active:scale-95 shadow-lg shadow-[#25D366]/20"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp ile Yazın
              </a>
            </div>
          </section>
        )}

        {/* Social Media */}
        {(instagramUrl || facebookUrl) && (
          <section className="glass-card hover-lift rounded-[1.75rem] p-6 sm:p-8 animate-fade-in-up delay-500">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Sosyal Medya</p>
            <h2 className="mt-3 text-xl font-semibold">Bizi Takip Edin</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] px-5 py-2 text-sm transition hover:scale-105 active:scale-95 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  📸 Instagram
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] px-5 py-2 text-sm transition hover:scale-105 active:scale-95 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  📘 Facebook
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
