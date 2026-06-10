"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/src/types";

type ProductImageGalleryProps = {
  images?: ProductImage[];
};

export function ProductImageGallery({ images = [] }: ProductImageGalleryProps) {
  const primaryIndex = images.findIndex((img) => img.isPrimary);
  const initialIndex = primaryIndex !== -1 ? primaryIndex : 0;
  const [activeIdx, setActiveIdx] = useState(initialIndex);

  // If productId changed but indices stayed, make sure to sync active index
  // We can just rely on the component re-mounting or reset via key, but
  // safe fallback in case activeIdx gets out of bounds
  const currentIdx = activeIdx >= images.length ? 0 : activeIdx;

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-[2rem] border border-[var(--card-border)] bg-black/5 dark:bg-white/5 p-6">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-[var(--muted)]"
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
          <p className="mt-3 text-sm text-[var(--muted)] font-medium">Görsel bulunmuyor</p>
        </div>
      </div>
    );
  }

  const activeImage = images[currentIdx] || images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-[var(--card-border)] bg-black/5 dark:bg-white/5 shadow-sm">
        <Image
          key={activeImage.id}
          src={activeImage.url}
          alt={activeImage.altText || "Ürün görseli"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-all duration-500 animate-fade-in"
          unoptimized
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-2xl border transition ${
                currentIdx === idx
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                  : "border-[var(--card-border)] hover:opacity-85"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `Ürün görseli ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
