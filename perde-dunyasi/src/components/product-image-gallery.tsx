"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { ProductImage } from "@/src/types";

type ProductImageGalleryProps = {
  images?: ProductImage[];
};

export function ProductImageGallery({ images = [] }: ProductImageGalleryProps) {
  const primaryIndex = images.findIndex((img) => img.isPrimary);
  const initialIndex = primaryIndex !== -1 ? primaryIndex : 0;
  const [activeIdx, setActiveIdx] = useState(initialIndex);

  // Lightbox Zoom Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const swipeStartRef = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Automatically reset zoom when active index changes (e.g. thumbnail click or navigation)
  useEffect(() => {
    resetZoom();
  }, [activeIdx]);

  // Sync index if images list changes
  const currentIdx = activeIdx >= images.length ? 0 : activeIdx;

  // Keypress event listener for Left and Right Arrow navigation
  useEffect(() => {
    if (images.length <= 1) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        if (isModalOpen) {
          goPrev();
        } else {
          setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
      } else if (e.key === "ArrowRight") {
        if (isModalOpen) {
          goNext();
        } else {
          setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }
      } else if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images, isModalOpen]);

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

  const goPrev = () => {
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetZoom();
  };
  
  const goNext = () => {
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetZoom();
  };

  const openModal = () => {
    resetZoom();
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 4));
  const zoomOut = () => {
    setZoomLevel((prev) => {
      const nextZoom = Math.max(prev - 0.25, 0.5);
      if (nextZoom <= 1) {
        setPanPosition({ x: 0, y: 0 });
      }
      return nextZoom;
    });
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Dragging & Swiping event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (zoomLevel > 1) {
      dragStartRef.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y };
    } else {
      swipeStartRef.current = e.clientX;
      setSwipeOffset(0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    if (zoomLevel > 1) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      setPanPosition({ x: newX, y: newY });
    } else if (swipeStartRef.current !== null) {
      const diffX = e.clientX - swipeStartRef.current;
      setSwipeOffset(diffX);
    }
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (zoomLevel === 1 && swipeStartRef.current !== null) {
      const diffX = swipeOffset;
      swipeStartRef.current = null;
      setSwipeOffset(0);

      if (diffX > 60) {
        // Dragged right -> Show previous
        goPrev();
      } else if (diffX < -60) {
        // Dragged left -> Show next
        goNext();
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom in or out based on scroll direction
    if (e.deltaY < 0) {
      // Scroll Up -> Zoom In
      setZoomLevel((prev) => Math.min(prev + 0.15, 4));
    } else {
      // Scroll Down -> Zoom Out
      setZoomLevel((prev) => {
        const nextZoom = Math.max(prev - 0.15, 0.5);
        if (nextZoom <= 1) {
          setPanPosition({ x: 0, y: 0 });
        }
        return nextZoom;
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Active image container */}
      <div 
        onClick={openModal}
        className="group/gallery relative aspect-square w-full overflow-hidden rounded-[2rem] border border-[var(--card-border)] bg-black/5 dark:bg-white/5 shadow-sm cursor-zoom-in"
      >
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

        {/* Zoom Button in Corner */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openModal();
          }}
          className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 hover:scale-105 active:scale-95 shadow-lg"
          title="Görseli Büyüt"
        >
          🔍
        </button>

        {/* Hover Arrow Overlay */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 opacity-0 scale-90 group-hover/gallery:opacity-100 group-hover/gallery:scale-100 hover:bg-black/60 shadow-lg"
              title="Önceki (Sol Yön Tuşu)"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
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

      {/* Lightbox / Zoom Modal */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 text-white backdrop-blur-md animate-fade-in select-none">
          {/* Top Actions Panel */}
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-sm font-medium text-gray-300">
              {currentIdx + 1} / {images.length}
            </div>

            {/* Zoom & Action Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-lg font-bold border border-white/10 disabled:opacity-40 transition"
                title="Küçült (-)"
              >
                －
              </button>
              <span className="text-xs font-mono w-12 text-center bg-white/5 py-1 px-2 rounded-md border border-white/5">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomLevel >= 4}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-lg font-bold border border-white/10 disabled:opacity-40 transition"
                title="Büyüt (+)"
              >
                ＋
              </button>
              {zoomLevel !== 1 && (
                <button
                  type="button"
                  onClick={resetZoom}
                  className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20 text-xs font-medium border border-white/10 transition"
                  title="Sıfırla"
                >
                  Sıfırla
                </button>
              )}
              
              <div className="h-6 w-[1px] bg-white/20 mx-2" />

              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 hover:bg-white/35 text-white border border-white/20 transition text-lg"
                title="Kapat (ESC)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Zoom Workspace Area */}
          <div 
            className={`relative flex-1 w-full h-full flex items-center justify-center overflow-hidden ${
              zoomLevel > 1 
                ? (isDragging ? "cursor-grabbing" : "cursor-grab") 
                : (images.length > 1 ? "cursor-ew-resize" : "cursor-default")
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onWheel={handleWheel}
          >
            {/* Image Wrapper */}
            <div
              className={`relative w-[90vw] h-[75vh] max-w-[1200px] max-h-[800px] select-none pointer-events-none ${
                isDragging ? "transition-none" : "transition-transform duration-200 ease-out"
              }`}
              style={{
                transform: `translate(${zoomLevel > 1 ? panPosition.x : swipeOffset}px, ${zoomLevel > 1 ? panPosition.y : 0}px) scale(${zoomLevel})`,
              }}
            >
              <Image
                src={activeImage.url}
                alt={activeImage.altText || "Büyütülmüş ürün görseli"}
                fill
                priority
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Left and Right navigation inside Modal */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white text-xl backdrop-blur-md transition shadow-2xl"
                  title="Önceki (Sol Yön Tuşu)"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white text-xl backdrop-blur-md transition shadow-2xl"
                  title="Sonraki (Sağ Yön Tuşu)"
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* Instructions Overlay */}
          <div className="absolute bottom-6 text-center text-xs text-gray-400 bg-black/60 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-md pointer-events-none">
            {zoomLevel > 1 
              ? "Tutup sürükleyerek kaydırın | Tekerleği aşağı kaydırarak uzaklaştırın" 
              : images.length > 1
                ? "Sürükleyerek veya yön tuşlarıyla geçiş yapın | Tekerleği yukarı kaydırarak yakınlaştırın"
                : "Tekerleği yukarı kaydırarak yakınlaştırın"}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
