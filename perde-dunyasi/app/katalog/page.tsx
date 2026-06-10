import { PageHero } from "@/src/components/page-hero";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/src/lib/supabase/db";

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const activeProducts = products.filter((product) => product.isActive);

  return (
    <div className="page-shell px-6 py-10 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <PageHero
          eyebrow="Ürün kataloğu"
          title="Kategoriye göre filtrelenecek ürün vitrini"
          description="Aşağıda tüm güncel ürünlerimiz yer almaktadır. Detay butonuna tıklayarak ürün özelliklerini görebilir ve WhatsApp üzerinden fiyat teklifi alabilirsiniz."
        />

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activeProducts.map((product, index) => {
            const category = categories.find(
              (item) => item.id === product.categoryId,
            );
            const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

            return (
              <article
                key={product.id}
                className={`glass-card hover-lift group flex flex-col rounded-[1.75rem] p-5 justify-between animate-fade-in-up delay-${((index % 3) + 1) * 100}`}
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)]">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.altText || product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-[var(--muted)]">
                        <svg
                          className="h-12 w-12 opacity-30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    {category?.name ?? "Kategori"}
                  </p>
                  <h2 className="mt-2.5 text-xl font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">{product.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)] line-clamp-3">
                    {product.shortDesc ?? product.description ?? "Ürün açıklaması yakında eklenecek."}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--card-border)] pt-4">
                  <span className="text-sm text-[var(--muted)] font-medium">
                    {product.price ? `${product.price.toLocaleString("tr-TR")} ${product.priceUnit}` : "Fiyat için iletişim"}
                  </span>
                  <Link
                    href={`/urunler/${product.slug}`}
                    className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--accent-foreground)] transition hover:scale-105 active:scale-95 shadow-md shadow-[var(--accent)]/10"
                  >
                    Detay
                  </Link>
                </div>
              </article>
            );
          })}
          {activeProducts.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-[var(--card-border)] p-8 text-center text-[var(--muted)]">
              Katalogda gösterilecek ürün bulunamadı.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
