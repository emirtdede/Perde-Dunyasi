"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category, Product } from "@/src/types";

type ProductsSearchAndFilterProps = {
  categories: Category[];
  products: Product[];
};

type SortOption = "newest" | "oldest" | "category";

export function ProductsSearchAndFilter({ categories, products }: ProductsSearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.isActive);
  }, [products]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.shortDesc && product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategoryId === "all" || product.categoryId === selectedCategoryId;

      return matchesSearch && matchesCategory;
    });
  }, [activeProducts, searchQuery, selectedCategoryId]);

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    if (sortBy === "newest") {
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      return items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "category") {
      // Sort by category name, then by product name
      return items.sort((a, b) => {
        const catA = a.category?.name || "";
        const catB = b.category?.name || "";
        const catCompare = catA.localeCompare(catB, "tr");
        if (catCompare !== 0) return catCompare;
        return a.name.localeCompare(b.name, "tr");
      });
    }
    return items;
  }, [filteredProducts, sortBy]);

  // Grouped products for "Kategoriye Göre" visualization
  const groupedProducts = useMemo(() => {
    if (sortBy !== "category") return null;

    const groups: { [catId: string]: { category: Category | undefined; products: Product[] } } = {};
    
    // Initialize groups for current categories to preserve order, or dynamic grouping
    sortedProducts.forEach((product) => {
      const catId = product.categoryId;
      if (!groups[catId]) {
        groups[catId] = {
          category: categories.find((c) => c.id === catId) || product.category,
          products: [],
        };
      }
      groups[catId].products.push(product);
    });

    return Object.values(groups).sort((a, b) => {
      const nameA = a.category?.name || "";
      const nameB = b.category?.name || "";
      return nameA.localeCompare(nameB, "tr");
    });
  }, [sortedProducts, sortBy, categories]);

  // Product card renderer to avoid duplication
  const renderProductCard = (product: Product, index: number) => {
    const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
    const categoryName = product.category?.name || categories.find((c) => c.id === product.categoryId)?.name || "Kategori";

    return (
      <article
        key={product.id}
        className="glass-card hover-lift group flex flex-col rounded-[1.75rem] p-5 justify-between animate-fade-in-up"
        style={{ animationDelay: `${((index % 3) + 1) * 80}ms` }}
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
            {categoryName}
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
  };

  return (
    <div className="space-y-8">
      {/* Filters & Search section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[var(--card)] border border-[var(--card-border)] rounded-[2rem] p-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Ürün adı veya açıklama ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-[var(--card-border)] bg-[var(--background)] px-5 py-3 pl-12 text-sm outline-none focus:border-[var(--accent)] text-[var(--foreground)]"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--muted)]">🔍</span>
        </div>

        {/* Category Filter & Sorting Selects */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] ml-2">Kategori</span>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="rounded-full border border-[var(--card-border)] bg-[var(--background)] px-4 py-2.5 text-xs outline-none focus:border-[var(--accent)] text-[var(--foreground)] font-medium cursor-pointer"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] ml-2">Sıralama</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-[var(--card-border)] bg-[var(--background)] px-4 py-2.5 text-xs outline-none focus:border-[var(--accent)] text-[var(--foreground)] font-medium cursor-pointer"
            >
              <option value="newest">Son Eklenen</option>
              <option value="oldest">İlk Eklenen</option>
              <option value="category">Kategoriye Göre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products list */}
      {sortBy === "category" && groupedProducts ? (
        <div className="space-y-12">
          {groupedProducts.map((group, groupIdx) => (
            <div key={group.category?.id || groupIdx} className="space-y-6 animate-fade-in">
              <div className="border-b border-[var(--card-border)] pb-3 flex items-baseline justify-between">
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  {group.category?.name || "Diğer Ürünler"}
                </h2>
                <span className="text-xs text-[var(--muted)] font-medium">
                  {group.products.length} Ürün
                </span>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.products.map((product, index) => renderProductCard(product, index))}
              </div>
            </div>
          ))}
          {groupedProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--card-border)] p-12 text-center text-[var(--muted)]">
              Aradığınız kriterlere uygun ürün bulunamadı.
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product, index) => renderProductCard(product, index))}
          </div>
          {sortedProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--card-border)] p-12 text-center text-[var(--muted)]">
              Aradığınız kriterlere uygun ürün bulunamadı.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
