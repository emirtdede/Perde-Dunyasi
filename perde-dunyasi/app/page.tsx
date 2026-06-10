import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts, getCampaigns, getAnnouncements, getSettings } from "@/src/lib/supabase/db";
import { HeroCarousel } from "@/src/components/hero-carousel";

export default async function Home() {
  const [categories, featuredProducts, campaigns, announcements, settings] = await Promise.all([
    getCategories(),
    getProducts({ isFeatured: true }),
    getCampaigns(),
    getAnnouncements(),
    getSettings(),
  ]);

  const allProducts = await getProducts();
  const whatsappNumber = settings.whatsapp_number;
  const heroTitle = settings.hero_title || "Hayalinizdeki Perdeler";
  const heroSubtitle = settings.hero_subtitle || "En kaliteli ürünler ve hızlı WhatsApp iletişimi.";

  // Support multiple hero images (JSON array) with fallback to single hero_image_url
  let heroImages: string[] = [];
  if (settings.hero_images) {
    try {
      const parsed = JSON.parse(settings.hero_images);
      if (Array.isArray(parsed)) heroImages = parsed.filter(Boolean);
    } catch { /* ignore parse errors */ }
  }
  // Backward compatibility: if no hero_images array but hero_image_url exists, use it
  if (heroImages.length === 0 && settings.hero_image_url) {
    heroImages = [settings.hero_image_url];
  }

  return (
    <div>
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#1f2937_0%,_#09090b_50%,_#000_100%)] text-white">
        {heroImages.length > 0 ? (
          <HeroCarousel images={heroImages} heroTitle={heroTitle} />
        ) : (
          /* Decorative gradient orbs when no image */
          <>
            <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[var(--accent)] opacity-[0.08] blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-amber-500 opacity-[0.06] blur-[100px]" />
          </>
        )}

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-24 sm:px-10 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80 animate-fade-in-up">
              Perde Dünyası
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up delay-100">
              {heroTitle}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg animate-fade-in-up delay-200">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 animate-fade-in-up delay-300">
              <Link
                href="/katalog"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40"
              >
                Ürünleri İncele
              </Link>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:scale-105 active:scale-95"
                >
                  WhatsApp ile İletişim
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      {categories.length > 0 && (
        <section className="page-shell px-6 py-16 sm:px-10 lg:px-12 overflow-hidden">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="animate-fade-in-up">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Kategoriler</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Ürün Kategorilerimiz</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {categories.map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/katalog?kategori=${cat.slug}`}
                  className={`glass-card hover-lift group flex flex-col items-center rounded-[1.5rem] p-6 text-center animate-fade-in-up delay-${((index % 5) + 1) * 100}`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-2xl transition duration-300 group-hover:bg-[var(--accent)]/20 group-hover:scale-110">
                    🪟
                  </div>
                  <p className="mt-3 text-sm font-medium transition-colors group-hover:text-[var(--accent)]">{cat.name}</p>
                  {cat.description && (
                    <p className="mt-1 text-xs text-[var(--muted)] line-clamp-2">{cat.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURED PRODUCTS ─── */}
      {featuredProducts.length > 0 && (
        <section className="px-6 py-16 sm:px-10 lg:px-12 overflow-hidden">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex items-end justify-between gap-4 animate-fade-in-up">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Öne Çıkanlar</p>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Popüler Ürünler</h2>
              </div>
              <Link
                href="/katalog"
                className="hidden text-sm text-[var(--muted)] transition hover:text-[var(--foreground)] sm:block"
              >
                Tümünü gör →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product, index) => {
                const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
                return (
                  <article
                    key={product.id}
                    className={`glass-card hover-lift group flex flex-col overflow-hidden rounded-[1.75rem] animate-fade-in-up delay-${((index % 4) + 1) * 100}`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-[var(--accent)]/10 to-transparent overflow-hidden border-b border-[var(--card-border)]">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.altText || product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
                          🪟
                        </div>
                      )}
                      {product.isFeatured && (
                        <span className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-white shadow-sm z-10">
                          Öne Çıkan
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                        {product.category?.name ?? "Kategori"}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold transition-colors group-hover:text-[var(--accent)]">{product.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)] line-clamp-2">
                        {product.shortDesc ?? "Detay için tıklayın."}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                        <span className="text-sm font-medium text-[var(--muted)]">
                          {product.price
                            ? `${product.price.toLocaleString("tr-TR")} ${product.priceUnit}`
                            : "Fiyat için iletişim"}
                        </span>
                        <Link
                          href={`/urunler/${product.slug}`}
                          className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-[var(--accent-foreground)] transition hover:scale-105 active:scale-95 shadow-md shadow-[var(--accent)]/10"
                        >
                          Detay
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="text-center sm:hidden">
              <Link
                href="/katalog"
                className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                Tüm ürünleri gör →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── ALL PRODUCTS (if no featured) ─── */}
      {featuredProducts.length === 0 && allProducts.length > 0 && (
        <section className="px-6 py-16 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-6xl space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Ürünler</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Ürünlerimiz</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allProducts.slice(0, 6).map((product) => (
                <article
                  key={product.id}
                  className="glass-card flex flex-col rounded-[1.75rem] p-5 transition hover:border-[var(--accent)]"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                    {product.category?.name ?? "Kategori"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)] line-clamp-2">
                    {product.shortDesc ?? "Detay için tıklayın."}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <span className="text-sm text-[var(--muted)]">
                      {product.price
                        ? `${product.price.toLocaleString("tr-TR")} ${product.priceUnit}`
                        : "Fiyat için iletişim"}
                    </span>
                    <Link
                      href={`/urunler/${product.slug}`}
                      className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-[var(--accent-foreground)]"
                    >
                      Detay
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CAMPAIGNS ─── */}
      {campaigns.length > 0 && (
        <section className="page-shell px-6 py-16 sm:px-10 lg:px-12 overflow-hidden">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex items-end justify-between gap-4 animate-fade-in-up">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Kampanyalar</p>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Aktif Kampanyalarımız</h2>
              </div>
              <Link
                href="/kampanyalar"
                className="hidden text-sm text-[var(--muted)] transition hover:text-[var(--foreground)] sm:block"
              >
                Tümünü gör →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.slice(0, 3).map((campaign, index) => (
                <article
                  key={campaign.id}
                  className={`glass-card hover-lift group relative overflow-hidden rounded-[1.75rem] p-6 animate-fade-in-up delay-${((index % 3) + 1) * 100}`}
                >
                  {campaign.badgeText && (
                    <span className="mb-3 inline-block rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-white transition-transform group-hover:scale-105">
                      {campaign.badgeText}
                    </span>
                  )}
                  <h3 className="text-xl font-semibold transition-colors group-hover:text-[var(--accent)]">{campaign.title}</h3>
                  {campaign.description && (
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)] line-clamp-3">
                      {campaign.description}
                    </p>
                  )}
                  {(campaign.startDate || campaign.endDate) && (
                    <p className="mt-3 text-xs text-[var(--muted)]">
                      {campaign.startDate && `${new Date(campaign.startDate).toLocaleDateString("tr-TR")}`}
                      {campaign.startDate && campaign.endDate && " – "}
                      {campaign.endDate && `${new Date(campaign.endDate).toLocaleDateString("tr-TR")}`}
                      {!campaign.endDate && " – Süresiz"}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ANNOUNCEMENTS ─── */}
      {announcements.length > 0 && (
        <section className="px-6 py-16 sm:px-10 lg:px-12 overflow-hidden">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex items-end justify-between gap-4 animate-fade-in-up">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Duyurular</p>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Son Haberler</h2>
              </div>
              <Link
                href="/duyurular"
                className="hidden text-sm text-[var(--muted)] transition hover:text-[var(--foreground)] sm:block"
              >
                Tümünü gör →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.slice(0, 3).map((ann, index) => (
                <article
                  key={ann.id}
                  className={`glass-card hover-lift group rounded-[1.75rem] p-6 animate-fade-in-up delay-${((index % 3) + 1) * 100}`}
                >
                  <p className="text-xs text-[var(--muted)]">
                    {ann.publishedAt
                      ? new Date(ann.publishedAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Taslak"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold transition-colors group-hover:text-[var(--accent)]">{ann.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)] line-clamp-3">
                    {ann.content}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── WHATSAPP CTA ─── */}
      {whatsappNumber && (
        <section className="px-6 py-16 sm:px-10 lg:px-12 animate-fade-in-up">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1a130d] to-[#2d1f14] p-8 text-white sm:p-12 transition hover:scale-[1.01] duration-500">
              <div className="pointer-events-none absolute -right-16 -top-16 h-[300px] w-[300px] rounded-full bg-[var(--accent)] opacity-[0.12] blur-[80px]" />
              <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-lg space-y-3">
                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Fiyat Teklifi Almak İster Misiniz?
                  </h2>
                  <p className="text-sm leading-6 text-zinc-300">
                    WhatsApp üzerinden hızlıca iletişime geçin. Ürünlerimiz hakkında detaylı bilgi ve
                    özel fiyat teklifleri için bizi arayın.
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
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
