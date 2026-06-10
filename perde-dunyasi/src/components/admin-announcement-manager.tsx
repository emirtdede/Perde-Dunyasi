"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Announcement } from "@/src/types";

type AdminAnnouncementManagerProps = {
  announcements: Announcement[];
};

const initialForm = {
  title: "",
  content: "",
  isPublished: true,
};

export function AdminAnnouncementManager({
  announcements,
}: AdminAnnouncementManagerProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(announcements[0]?.id ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedAnnouncement = useMemo(
    () => announcements.find((announcement) => announcement.id === selectedId) ?? null,
    [announcements, selectedId],
  );

  const [form, setForm] = useState(() => ({
    ...initialForm,
    title: selectedAnnouncement?.title ?? "",
    content: selectedAnnouncement?.content ?? "",
    isPublished: selectedAnnouncement?.isPublished ?? true,
  }));

  const [prevSelectedId, setPrevSelectedId] = useState<string | null>(null);

  if (selectedId !== prevSelectedId) {
    setPrevSelectedId(selectedId);
    setForm({
      ...initialForm,
      title: selectedAnnouncement?.title ?? "",
      content: selectedAnnouncement?.content ?? "",
      isPublished: selectedAnnouncement?.isPublished ?? true,
    });
    setMessage(null);
    setError(null);
  }

  function handleSelect(announcement: Announcement) {
    setSelectedId(announcement.id);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Duyuru başlığı boş olamaz");
      return;
    }
    if (!form.content.trim()) {
      setError("Duyuru içeriği boş olamaz");
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const url = selectedId 
        ? `/api/admin/announcements/${selectedId}` 
        : "/api/admin/announcements";
      
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

      setMessage(selectedId ? "Duyuru başarıyla güncellendi." : "Duyuru başarıyla oluşturuldu.");
      
      router.refresh();
      
      if (!selectedId && result.announcement) {
        setSelectedId(result.announcement.id);
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
    
    const confirmed = confirm("Bu duyuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.");
    if (!confirmed) return;

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/announcements/${selectedId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Duyuru silinemedi");
      }

      setMessage("Duyuru başarıyla silindi.");
      setSelectedId(announcements[0]?.id !== selectedId ? (announcements[0]?.id ?? null) : (announcements[1]?.id ?? null));
      router.refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Silme işlemi sırasında bir hata oluştu";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Announcement List */}
      <div className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Duyuru listesi</p>
            <h2 className="mt-2 text-2xl font-semibold">Yayınlanan duyurular</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedId(null);
            }}
            className="rounded-full border border-[var(--card-border)] px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
          >
            Yeni duyuru
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {announcements.map((announcement) => (
            <button
              key={announcement.id}
              type="button"
              onClick={() => handleSelect(announcement)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                selectedId === announcement.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/10"
                  : "border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <div>
                <p className="font-medium">{announcement.title}</p>
                <p className="text-sm text-[var(--muted)]">
                  {announcement.isPublished ? "Yayınlanmış" : "Taslak"}
                </p>
              </div>
              <div className="text-right text-sm text-[var(--muted)]">
                <p>{announcement.isPublished ? "Aktif" : "Pasif"}</p>
                <p>
                  {announcement.createdAt 
                    ? new Date(announcement.createdAt).toLocaleDateString("tr-TR") 
                    : "Tarih yok"}
                </p>
              </div>
            </button>
          ))}
          {announcements.length === 0 && (
            <p className="text-sm text-[var(--muted)] text-center py-4">Duyuru bulunamadı.</p>
          )}
        </div>
      </div>

      {/* Announcement Form */}
      <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-5 flex flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Hızlı form</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {selectedId ? "Duyuru düzenle" : "Yeni duyuru ekle"}
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
              <span className="mb-2 block text-sm font-medium">Başlık</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Örn: Yeni Sezon Tül Perdelerimiz Mağazada"
                className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                disabled={isLoading}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">İçerik</span>
              <textarea
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({ ...current, content: event.target.value }))
                }
                placeholder="Duyuru içeriği, detaylı açıklama..."
                rows={6}
                className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                disabled={isLoading}
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) =>
                  setForm((current) => ({ ...current, isPublished: event.target.checked }))
                }
                disabled={isLoading}
                className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              Yayınla (Taslak olarak kalmasın, hemen sitede görünsün)
            </label>
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
  );
}
