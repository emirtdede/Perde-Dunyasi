"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string>("");

  useEffect(() => {
    // We only track public visitor pages (ignore admin dashboard & API hits for clean metrics)
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    if (lastPath.current === fullPath) return;
    lastPath.current = fullPath;

    const trackVisit = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: fullPath,
            referrer: document.referrer || null,
          }),
        });
      } catch (err) {
        // silent
      }
    };

    const timer = setTimeout(trackVisit, 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}
