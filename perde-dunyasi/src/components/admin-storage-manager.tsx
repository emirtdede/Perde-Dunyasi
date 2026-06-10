"use client";

import { useEffect, useState } from "react";

type StorageStats = {
  codeSizeMb: number;
  mediaSizeMb: number;
  totalSizeMb: number;
};

export function AdminStorageManager() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/storage-stats");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Depolama bilgileri alınamadı");
      }
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const codePercentage = stats
    ? Math.max(5, Math.round((stats.codeSizeMb / stats.totalSizeMb) * 100))
    : 50;
  const mediaPercentage = 100 - codePercentage;

  return (
    <div className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-6 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Sistem Analizi</p>
        <h2 className="mt-2 text-2xl font-semibold">Depolama Alanı Durumu</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Web sitenizin ve yüklenen görsellerin sunucuda ve veritabanında kapladığı toplam alan.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-sm text-rose-500 font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-sm text-[var(--muted)] animate-pulse">
          Depolama alanları hesaplanıyor, lütfen bekleyin...
        </div>
      ) : stats ? (
        <div className="space-y-8 animate-fade-in">
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--card-border)] bg-black/5 dark:bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium">Uygulama Kodları</p>
              <p className="mt-2 text-3xl font-bold">{stats.codeSizeMb} MB</p>
              <p className="mt-1 text-2xs text-[var(--muted)]">Next.js derleme dosyaları ve public varlıklar.</p>
            </div>

            <div className="rounded-2xl border border-[var(--card-border)] bg-black/5 dark:bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium">Medya ve Görseller</p>
              <p className="mt-2 text-3xl font-bold">{stats.mediaSizeMb} MB</p>
              <p className="mt-1 text-2xs text-[var(--muted)]">Kategoriler, ürünler ve logoların toplam boyutu.</p>
            </div>

            <div className="rounded-2xl border border-[var(--accent)] bg-[var(--accent)]/10 p-5">
              <p className="text-xs uppercase tracking-wider text-[var(--accent)] font-semibold">Toplam Kullanım</p>
              <p className="mt-2 text-3xl font-bold text-[var(--accent)]">{stats.totalSizeMb} MB</p>
              <p className="mt-1 text-2xs text-[var(--accent)]/80">Kullanılan toplam bulut ve disk alanı.</p>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold px-1">
              <span>Uygulama Kodları ({codePercentage}%)</span>
              <span>Medya Dosyaları ({mediaPercentage}%)</span>
            </div>
            <div className="h-6 w-full rounded-full overflow-hidden flex bg-black/10 dark:bg-white/10 p-1">
              <div 
                style={{ width: `${codePercentage}%` }} 
                className="h-full rounded-l-full bg-slate-400 dark:bg-slate-500 transition-all duration-500"
              />
              <div 
                style={{ width: `${mediaPercentage}%` }} 
                className="h-full rounded-r-full bg-[var(--accent)] transition-all duration-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end pt-4 border-t border-[var(--card-border)]">
            <button
              type="button"
              onClick={fetchStats}
              className="rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] px-5 py-2 text-sm font-medium transition hover:opacity-90"
            >
              Yeniden Hesapla
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
