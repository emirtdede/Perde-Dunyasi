"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { ProductImage } from "@/src/types";

type AdminProductImagesProps = {
  productId: string;
  images?: ProductImage[];
  onImagesChange?: () => void;
};

export function AdminProductImages({
  productId,
  images = [],
  onImagesChange,
}: AdminProductImagesProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  async function uploadFiles(files: FileList) {
    setIsLoading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} bir görsel dosyası değil.`);
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/admin/products/${productId}/images`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || `${file.name} yüklenirken bir hata oluştu.`);
        }
      }
      router.refresh();
      if (onImagesChange) onImagesChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görsel yükleme hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(e.dataTransfer.files);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(e.target.files);
      e.target.value = ""; // reset input
    }
  }

  async function handleDelete(imageId: string) {
    const confirmed = confirm("Bu görseli silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Görsel silinemedi.");
      }

      router.refresh();
      if (onImagesChange) onImagesChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silme işlemi başarısız.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSetPrimary(imageId: string) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${productId}/images/${imageId}/primary`, {
        method: "PUT",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Kapak görseli seçilemedi.");
      }

      router.refresh();
      if (onImagesChange) onImagesChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kapak görseli ayarlanırken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMove(index: number, direction: "prev" | "next") {
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setIsLoading(true);
    setError(null);

    const reorderedList = [...images];
    const temp = reorderedList[index];
    reorderedList[index] = reorderedList[targetIndex];
    reorderedList[targetIndex] = temp;

    const orders = reorderedList.map((img, idx) => ({
      id: img.id,
      sortOrder: idx,
    }));

    try {
      const response = await fetch(`/api/admin/products/${productId}/images/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Sıralama güncellenemedi.");
      }

      router.refresh();
      if (onImagesChange) onImagesChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sıralama kaydedilirken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Görseller</p>
        <h2 className="mt-2 text-2xl font-semibold">Ürün görselleri</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          İstediğiniz kadar görsel ekleyebilirsiniz. İlk yüklenen görsel otomatik olarak kapak görseli olur. Görseller otomatik olarak WebP formatına dönüştürülür.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-sm text-rose-500 font-medium">
          {error}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
          isDragging
            ? "border-[var(--accent)] bg-[var(--accent)]/5"
            : "border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5"
        }`}
      >
        <svg
          className="mx-auto h-12 w-12 text-[var(--muted)]"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-4 flex text-sm text-[var(--muted)] justify-center">
          <label className="relative cursor-pointer rounded-md font-semibold text-[var(--accent)] hover:opacity-85 focus-within:outline-none">
            <span>Dosya yükleyin</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
              className="sr-only"
            />
          </label>
          <p className="pl-1">veya sürükleyip bırakın</p>
        </div>
        <p className="text-xs text-[var(--muted)] mt-1">Tüm görsel formatları desteklenir — otomatik WebP dönüşümü yapılır</p>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="mt-4 text-center text-sm font-medium text-[var(--accent)] animate-pulse">
          İşlem gerçekleştiriliyor, lütfen bekleyin...
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={`group relative flex flex-col rounded-2xl border overflow-hidden bg-[var(--background)] transition ${
                img.isPrimary
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                  : "border-[var(--card-border)]"
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-square w-full overflow-hidden bg-black/5 dark:bg-white/5">
                <Image
                  src={img.url}
                  alt={img.altText || "Ürün görseli"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                
                {img.isPrimary && (
                  <span className="absolute left-2 top-2 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-2xs font-semibold text-[var(--accent-foreground)] shadow-sm">
                    Kapak
                  </span>
                )}
              </div>

              {/* Card Controls */}
              <div className="flex flex-col p-2 space-y-1.5 border-t border-[var(--card-border)] bg-black/5 dark:bg-white/5">
                <div className="flex items-center justify-between gap-1">
                  {/* Left / Up Arrow */}
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "prev")}
                    disabled={isLoading || idx === 0}
                    className="rounded-lg p-1.5 text-xs text-[var(--muted)] hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-35"
                    title="Sola Taşı"
                  >
                    ←
                  </button>

                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      disabled={isLoading}
                      className="text-xs font-semibold text-[var(--accent)] px-2 py-1 hover:underline disabled:opacity-50"
                    >
                      Kapak Yap
                    </button>
                  )}

                  {/* Right / Down Arrow */}
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "next")}
                    disabled={isLoading || idx === images.length - 1}
                    className="rounded-lg p-1.5 text-xs text-[var(--muted)] hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-35"
                    title="Sağa Taşı"
                  >
                    →
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  disabled={isLoading}
                  className="w-full text-center text-xs font-semibold text-rose-500 py-1 rounded-lg border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 transition disabled:opacity-50"
                >
                  Görseli Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 text-center py-10 rounded-2xl border border-[var(--card-border)] border-dashed">
          <p className="text-sm text-[var(--muted)]">Henüz ürün görseli eklenmemiş.</p>
        </div>
      )}
    </div>
  );
}
