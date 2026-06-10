"use client";

import { useEffect, useState } from "react";

type AnalyticsData = {
  totalPageViews: number;
  uniqueVisitors: number;
  topPaths: { path: string; count: number }[];
  topLocations: { country: string; city: string; count: number }[];
  chartData: { date: string; pageViews: number; uniqueVisitors: number }[];
};

type FilterType = "day" | "month" | "year";

export function AdminAnalyticsManager() {
  const [filter, setFilter] = useState<FilterType>("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAnalytics() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics-stats?filter=${filter}`);
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Ziyaretçi verileri alınamadı");
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, [filter]);

  // Find max value in chart data to scale the CSS bar chart properly
  const maxPageViews = data?.chartData?.length
    ? Math.max(...data.chartData.map((d) => d.pageViews), 1)
    : 1;

  return (
    <div className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">İstatistikler</p>
          <h2 className="mt-2 text-2xl font-semibold">Ziyaretçi Analizi</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Sitenizin ziyaretçi sayısı, tekil ziyaretçi oranı ve coğrafi dağılımı.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 rounded-full border border-[var(--card-border)] p-1 bg-black/5 dark:bg-white/5">
          {(
            [
              { id: "day", label: "Son 24 Saat" },
              { id: "month", label: "Son 30 Gün" },
              { id: "year", label: "Son 1 Yıl" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === item.id
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-sm text-rose-500 font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center text-sm text-[var(--muted)] animate-pulse">
          Ziyaretçi verileri analiz ediliyor, lütfen bekleyin...
        </div>
      ) : data ? (
        <div className="space-y-8 animate-fade-in">
          {/* Top Metrics Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--card-border)] bg-black/5 dark:bg-white/5 p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Toplam Sayfa Görüntüleme</p>
                <p className="mt-2 text-4xl font-bold">{data.totalPageViews}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xl font-bold">
                👁️
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--card-border)] bg-black/5 dark:bg-white/5 p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Tekil Ziyaretçi Sayısı</p>
                <p className="mt-2 text-4xl font-bold">{data.uniqueVisitors}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl font-bold">
                👤
              </div>
            </div>
          </div>

          {/* Premium CSS-based Bar Chart */}
          {data.chartData.length > 0 ? (
            <div className="rounded-2xl border border-[var(--card-border)] p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold">Günlük Ziyaret Grafiği</h3>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Seçilen tarih aralığındaki günlük toplam sayfa görüntüleme (sütun yüksekliği) ve tekil ziyaretçi sayıları.
                </p>
              </div>
              <div className="h-48 w-full flex items-end justify-between gap-1 pt-6 overflow-x-auto">
                {data.chartData.map((d, index) => {
                  const heightPercentage = Math.round((d.pageViews / maxPageViews) * 100);
                  return (
                    <div key={`${d.date}-${index}`} className="flex flex-col items-center flex-1 min-w-[20px] group relative h-full justify-end">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 transition origin-bottom bg-slate-950 text-white text-[10px] rounded px-2 py-1 z-10 whitespace-nowrap shadow-lg">
                        {d.pageViews} Görüntüleme<br/>
                        {d.uniqueVisitors} Tekil
                      </div>
                      {/* Bar */}
                      <div 
                        style={{ height: `${heightPercentage}%` }} 
                        className="w-full bg-[var(--accent)] hover:opacity-85 transition rounded-t-sm"
                      />
                      {/* Date label */}
                      <span className="text-[9px] text-[var(--muted)] mt-2 font-medium transform rotate-45 sm:rotate-0 whitespace-nowrap">
                        {d.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--card-border)] p-8 text-center text-sm text-[var(--muted)]">
              Bu zaman aralığında henüz veri bulunmamaktadır.
            </div>
          )}

          {/* Breakdown Tables */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Pages */}
            <div className="rounded-2xl border border-[var(--card-border)] p-5 space-y-4">
              <h3 className="font-semibold text-sm">En Çok Ziyaret Edilen Sayfalar</h3>
              <div className="space-y-3">
                {data.topPaths.map((item, index) => (
                  <div key={item.path} className="flex items-center justify-between text-xs py-1 border-b border-[var(--card-border)]/50 last:border-0">
                    <span className="font-medium text-[var(--foreground)] truncate max-w-[200px] sm:max-w-xs" title={item.path}>
                      {index + 1}. <code className="bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">{item.path}</code>
                    </span>
                    <span className="font-semibold text-[var(--muted)]">{item.count} Kez</span>
                  </div>
                ))}
                {data.topPaths.length === 0 && (
                  <p className="text-xs text-[var(--muted)] text-center py-4">Veri bulunmamaktadır.</p>
                )}
              </div>
            </div>

            {/* Top Locations */}
            <div className="rounded-2xl border border-[var(--card-border)] p-5 space-y-4">
              <h3 className="font-semibold text-sm">Ziyaretçi Konumları</h3>
              <div className="space-y-3">
                {data.topLocations.map((item, index) => (
                  <div key={`${item.country}-${item.city}-${index}`} className="flex items-center justify-between text-xs py-1 border-b border-[var(--card-border)]/50 last:border-0">
                    <span className="font-medium text-[var(--foreground)]">
                      📍 {item.country}, {item.city}
                    </span>
                    <span className="font-semibold text-[var(--muted)]">{item.count} Kişi</span>
                  </div>
                ))}
                {data.topLocations.length === 0 && (
                  <p className="text-xs text-[var(--muted)] text-center py-4">Veri bulunmamaktadır.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
