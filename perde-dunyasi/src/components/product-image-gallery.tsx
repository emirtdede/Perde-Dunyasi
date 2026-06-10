"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/src/types";

type ProductImageGalleryProps = {
  images?: ProductImage[];
};

export function ProductImageGallery({ images = [] }: ProductImageGalleryProps) {
  const primaryIndex = images.findIndex((img) => img.isPrimary);
  const initialIndex = primaryIndex !== -1 ? primaryIndex : 0;
  const [activeIdx, setActiveIdx] = useState(initialIndex);

  // Sync index if images list changes
  const currentIdx = activeIdx >= images.length ? 0 : activeIdx;

  // Keypress event listener for Left and Right Arrow navigation
  useEffect(() => {
    if (images.length <= 1) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images]);

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

  const goPrev = () => setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="space-y-4">
      <div className="group/gallery relative aspect-square w-full overflow-hidden rounded-[2rem] border border-[var(--card-border)] bg-black/5 dark:bg-white/5 shadow-sm">
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

        {/* Hover Arrow Overlay */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 opacity-0 scale-90 group-hover/gallery:opacity-100 group-hover/gallery:scale-100 hover:bg-black/60 shadow-lg"
              title="Önceki (Sol Yön Tuşu)"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 opacity-0 scale-90 group-hover/gallery:opacity-100 group-hover/gallery:scale-100 hover:bg-black/60 shadow-lg"
              title="Sonraki (Sağ Yön Tuşu)"
            >
              →
            </button>
          </>
        )}
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
