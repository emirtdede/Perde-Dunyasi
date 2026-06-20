"use client";

import Link from "next/link";

type FooterProps = {
  settings?: Record<string, string | null>;
};

const quickLinks = [
  { href: "/katalog", label: "Ürün Kataloğu" },
  { href: "/urunler", label: "Tüm Ürünler" },
  { href: "/kampanyalar", label: "Kampanyalar" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Fallbacks from settings
  const phone = settings?.phone || "0555 123 45 67";
  const email = settings?.email || "info@perdedunyasi.com";
  const address = settings?.address || "Adıyaman, Türkiye";
  const whatsappNumber = settings?.whatsapp_number || "905551234567";

  // Map settings
  const defaultTrMap = "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d197.07737510102345!2d38.623752663694326!3d37.78446175719392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1za2FodGEgc2HEn2zEsWsgb2NhxJ_EsQ!5e0!3m2!1str!2str!4v1781944670932!5m2!1str!2str";
  const mapSrc = settings?.google_maps_url || defaultTrMap;

  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--background)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-12 items-start">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--foreground)] opacity-90">
            Perde Dünyası
          </h3>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              Perde, tül, stor ve jaluzi ürünlerinde kaliteli çözümler.
            </p>
            <p className="text-sm leading-6 text-[var(--muted)]">
              WhatsApp üzerinden hızlıca fiyat teklifi alabilir, mağazamızı ziyaret edebilirsiniz.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4 lg:pl-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--foreground)] opacity-90">
            Hızlı Linkler
          </h3>
          <nav className="flex flex-col gap-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--foreground)] opacity-90">
            İletişim
          </h3>
          <div className="flex flex-col gap-2.5 text-sm text-[var(--muted)]">
            <p className="flex items-center gap-2"><span>📍</span> {address}</p>
            <p className="flex items-center gap-2"><span>📞</span> {phone}</p>
            <p className="flex items-center gap-2"><span>✉️</span> {email}</p>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90 self-start"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp ile İletişim
          </a>
        </div>

        {/* Map Location */}
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--foreground)] opacity-90">
            Mağaza Konumu
          </h3>
          <div className="relative h-40 w-full overflow-hidden rounded-xl border border-[var(--card-border)] shadow-sm bg-[var(--card)] hover:border-[var(--accent)] transition duration-300">
            {mapSrc ? (
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-iframe absolute inset-0"
                title="Perde Dünyası Harita Konumu"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--muted)]">
                Harita Tanımlanmadı
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--card-border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-[var(--muted)] sm:flex-row sm:px-10 lg:px-12">
          <p>© {currentYear} Perde Dünyası. Tüm hakları saklıdır.</p>
          <Link href="/admin" className="transition hover:text-[var(--foreground)]">
            Yönetim Paneli
          </Link>
        </div>
      </div>
    </footer>
  );
}
