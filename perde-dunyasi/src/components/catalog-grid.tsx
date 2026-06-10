"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category, Product } from "@/src/types";

type CatalogGridProps = {
  categories: Category[];
  products: Product[];
};

export function CatalogGrid({ categories, products }: CatalogGridProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeProducts = products.filter((product) => product.isActive);

  // Filter categories by search query
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

  // Products in the currently selected category
  const categoryProducts = selectedCategoryId
    ? activeProducts.filter((product) => product.categoryId === selectedCategoryId)
    : [];

  return (
    <div className="space-y-8">
      {selectedCategoryId === null ? (
        // --- 1. CATEGORIES DIRECTORY VIEW ---
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md animate-fade-in-up">
            <input
              type="text"
              placeholder="Katalog ara (Örn: Stor Perdeler)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 pl-12 text-sm outline-none focus:border-[var(--accent)] text-[var(--foreground)]"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--muted)]">🔍</span>
          </div>

          {/* Categories grid */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCategories.map((category, index) => {
              const productCount = activeProducts.filter((p) => p.categoryId === category.id).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className="glass-card hover-lift flex flex-col text-left rounded-[1.75rem] p-5 w-full justify-between animate-fade-in-up border border-[var(--card-border)] group"
                  style={{ animationDelay: `${((index % 4) + 1) * 80}ms` }}
                >
                  <div className="w-full">
                    {/* Thumbnail */}
                    <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)]">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-4 text-[var(--muted)]">
                          📂
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                      {category.description || "Kategori açıklaması bulunmuyor."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--muted)] w-full">
                    <span>{productCount} Ürün</span>
                    <span className="font-semibold text-[var(--accent)] group-hover:underline">Kataloğu Aç →</span>
                  </div>
                </button>
              );
            })}
            {filteredCategories.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-[var(--card-border)] p-10 text-center text-[var(--muted)]">
                Aradığınız kriterlere uygun katalog bulunamadı.
              </div>
            )}
          </section>
        </div>
      ) : (
        // --- 2. CATEGORY PRODUCTS DETAIL VIEW ---
        <div className="space-y-6">
          {/* Back Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 animate-fade-in-up">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-5 py-2.5 text-xs font-semibold text-[var(--foreground)] transition hover:bg-black/5 dark:hover:bg-white/5"
            >
              ← Katalog Listesine Dön
            </button>
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Seçilen Katalog</span>
              <h2 className="text-xl font-bold">{selectedCategory?.name}</h2>
            </div>
          </div>

          {/* Product grid list */}
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categoryProducts.map((product, index) => {
              const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

              return (
                <article
                  key={product.id}
                  className="glass-card hover-lift group flex flex-col rounded-[1.75rem] p-5 justify-between animate-fade-in-up"
                  style={{ animationDelay: `${((index % 3) + 1) * 100}ms` }}
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

                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                      {selectedCategory?.name}
                    </p>
                    <h3 className="mt-2.5 text-xl font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)] line-clamp-3">
                      {product.shortDesc ?? product.description ?? "Ürün açıklaması yakında eklenecek."}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--card-border)] pt-4">
                    <span className="text-sm text-[var(--muted)] font-medium">
                      {product.price ? `${product.price.toLocaleString("tr-TR")} ${product.priceUnit} / m²` : "Fiyat için iletişim"}
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
            {categoryProducts.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-[var(--card-border)] p-12 text-center text-[var(--muted)]">
                Bu katalogda henüz ürün bulunmamaktadır.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
