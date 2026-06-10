"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type HeroCarouselProps = {
  images: string[];
  heroTitle: string;
};

export function HeroCarousel({ images, heroTitle }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [images.length, next]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0">
      {images.map((url, index) => (
        <div
          key={url}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === current ? 1 : 0 }}
        >
          <Image
            src={url}
            alt={`${heroTitle} - ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover select-none pointer-events-none"
            unoptimized
          />
        </div>
      ))}

      {/* Lighter gradient overlay — just enough for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Navigation dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Görsel ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
