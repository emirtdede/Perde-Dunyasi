"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/src/types";
import { AdminProductImages } from "./admin-product-images";

type AdminProductManagerProps = {
  categories: Category[];
  products: Product[];
};

const initialForm = {
  name: "",
  slug: "",
  categoryId: "",
  shortDesc: "",
  price: "",
  priceUnit: "TL",
  isActive: true,
  isFeatured: false,
  sortOrder: "0",
};

function trSlugify(text: string) {
  const map: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  let str = text;
  Object.keys(map).forEach(key => {
    str = str.replace(new RegExp(key, 'g'), map[key]);
  });
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminProductManager({
  categories,
  products,
}: AdminProductManagerProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(products[0]?.id ?? null);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? null,
    [products, selectedId],
  );

  const [form, setForm] = useState(() => ({
    ...initialForm,
    name: selectedProduct?.name ?? "",
    slug: selectedProduct?.slug ?? "",
    categoryId: selectedProduct?.categoryId ?? categories[0]?.id ?? "",
    shortDesc: selectedProduct?.shortDesc ?? "",
    price: selectedProduct?.price?.toString() ?? "",
    priceUnit: selectedProduct?.priceUnit ?? "TL",
    isActive: selectedProduct?.isActive ?? true,
    isFeatured: selectedProduct?.isFeatured ?? false,
    sortOrder: selectedProduct?.sortOrder?.toString() ?? "0",
  }));

  const [prevSelectedId, setPrevSelectedId] = useState<string | null>(null);

  if (selectedId !== prevSelectedId) {
    setPrevSelectedId(selectedId);
    setForm({
      ...initialForm,
      name: selectedProduct?.name ?? "",
      slug: selectedProduct?.slug ?? "",
      categoryId: selectedProduct?.categoryId ?? categories[0]?.id ?? "",
      shortDesc: selectedProduct?.shortDesc ?? "",
      price: selectedProduct?.price?.toString() ?? "",
      priceUnit: selectedProduct?.priceUnit ?? "TL",
      isActive: selectedProduct?.isActive ?? true,
      isFeatured: selectedProduct?.isFeatured ?? false,
      sortOrder: selectedProduct?.sortOrder?.toString() ?? "0",
    });
    setIsSlugManual(!!selectedProduct);
    setMessage(null);
    setError(null);
  }

  function handleSelect(product: Product) {
    setSelectedId(product.id);
  }

  function handleNameChange(val: string) {
    setForm(current => {
      const updated = { ...current, name: val };
      if (!isSlugManual) {
        updated.slug = trSlugify(val);
      }
      return updated;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Ürün adı boş olamaz");
      return;
    }
    if (!form.categoryId) {
      setError("Bir kategori seçmelisiniz");
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const url = selectedId 
        ? `/api/admin/products/${selectedId}` 
        : "/api/admin/products";
      
      const method = selectedId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Bir hata oluştu");
      }

      setMessage(selectedId ? "Ürün başarıyla güncellendi." : "Ürün başarıyla oluşturuldu.");
      
      router.refresh();
      
      if (!selectedId && result.product) {
        setSelectedId(result.product.id);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Kaydetme sırasında bir hata oluştu";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    
    const confirmed = confirm("Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.");
    if (!confirmed) return;

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${selectedId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ürün silinemedi");
      }

      setMessage("Ürün başarıyla silindi.");
      setSelectedId(products[0]?.id !== selectedId ? (products[0]?.id ?? null) : (products[1]?.id ?? null));
      router.refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Silme işlemi sırasında bir hata oluştu";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Product List */}
        <div className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Ürün listesi</p>
              <h2 className="mt-2 text-2xl font-semibold">Mevcut ürünler</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
              }}
              className="rounded-full border border-[var(--card-border)] px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
            >
              Yeni ürün
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {products.map((product) => {
              const category = categories.find((item) => item.id === product.categoryId);

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelect(product)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                    selectedId === product.id
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-[var(--muted)]">{category?.name ?? "Kategori"}</p>
                  </div>
                  <div className="text-right text-sm text-[var(--muted)]">
                    <p>{product.isActive ? "Aktif" : "Pasif"}</p>
                    <p>{product.price ? `${product.price} ${product.priceUnit}` : "Fiyat yok"}</p>
                  </div>
                </button>
              );
            })}
            {products.length === 0 && (
              <p className="text-sm text-[var(--muted)] text-center py-4">Ürün bulunamadı.</p>
            )}
          </div>
        </div>

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Hızlı form</p>
            <h2 className="mt-2 text-2xl font-semibold">
              {selectedId ? "Ürün düzenle" : "Yeni ürün ekle"}
            </h2>

            {/* Feedback Messages */}
            {message && (
              <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-sm text-emerald-500 font-medium">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-sm text-rose-500 font-medium">
                {error}
              </div>
            )}

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Ad</span>
                <input
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Örn: Zebra Stor Perde"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) => {
                    setIsSlugManual(true);
                    setForm((current) => ({ ...current, slug: trSlugify(event.target.value) }));
                  }}
                  placeholder="Örn: zebra-stor-perde"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Kategori</span>
                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, categoryId: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Kısa açıklama</span>
                <textarea
                  value={form.shortDesc}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, shortDesc: event.target.value }))
                  }
                  placeholder="WhatsApp yönlendirme mesajına eklenecek kısa açıklama..."
                  rows={2}
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Fiyat (Boş bırakılabilir)</span>
                  <input
                    value={form.price}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, price: event.target.value }))
                    }
                    inputMode="decimal"
                    placeholder="Örn: 1250"
                    className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    disabled={isLoading}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Para birimi</span>
                  <input
                    value={form.priceUnit}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, priceUnit: event.target.value }))
                    }
                    placeholder="TL"
                    className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    disabled={isLoading}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Sıra</span>
                  <input
                    value={form.sortOrder}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, sortOrder: event.target.value }))
                    }
                    inputMode="numeric"
                    placeholder="0"
                    className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    disabled={isLoading}
                  />
                </label>
                <div className="flex flex-wrap gap-4 self-end pb-3">
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, isActive: event.target.checked }))
                      }
                      disabled={isLoading}
                      className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    Aktif
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, isFeatured: event.target.checked }))
                      }
                      disabled={isLoading}
                      className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    Öne çıkar
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-4 border-t border-[var(--card-border)] flex items-center justify-between gap-3 flex-wrap">
            <div>
              {selectedId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="rounded-full border border-rose-500/30 text-rose-500 px-5 py-2.5 text-sm font-medium transition hover:bg-rose-500/10 disabled:opacity-50"
                >
                  Sil
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] px-6 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </section>

      {selectedId && selectedProduct && (
        <AdminProductImages productId={selectedId} images={selectedProduct.images} />
      )}
    </div>
  );
}
