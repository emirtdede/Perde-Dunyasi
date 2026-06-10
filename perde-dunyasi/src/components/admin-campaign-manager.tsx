"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Campaign } from "@/src/types";

type AdminCampaignManagerProps = {
  campaigns: Campaign[];
};

const initialForm = {
  title: "",
  slug: "",
  description: "",
  badgeText: "",
  imageUrl: "",
  storagePath: "",
  startDate: "",
  endDate: "",
  sortOrder: "0",
  isActive: true,
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

export function AdminCampaignManager({ campaigns }: AdminCampaignManagerProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(campaigns[0]?.id ?? null);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedId) ?? null,
    [campaigns, selectedId],
  );

  const [form, setForm] = useState(() => ({
    ...initialForm,
    title: selectedCampaign?.title ?? "",
    slug: selectedCampaign?.slug ?? "",
    description: selectedCampaign?.description ?? "",
    badgeText: selectedCampaign?.badgeText ?? "",
    imageUrl: selectedCampaign?.imageUrl ?? "",
    storagePath: selectedCampaign?.storagePath ?? "",
    startDate: selectedCampaign?.startDate ?? "",
    endDate: selectedCampaign?.endDate ?? "",
    sortOrder: selectedCampaign?.sortOrder?.toString() ?? "0",
    isActive: selectedCampaign?.isActive ?? true,
  }));

  const [prevSelectedId, setPrevSelectedId] = useState<string | null>(null);

  if (selectedId !== prevSelectedId) {
    setPrevSelectedId(selectedId);
    setForm({
      ...initialForm,
      title: selectedCampaign?.title ?? "",
      slug: selectedCampaign?.slug ?? "",
      description: selectedCampaign?.description ?? "",
      badgeText: selectedCampaign?.badgeText ?? "",
      imageUrl: selectedCampaign?.imageUrl ?? "",
      storagePath: selectedCampaign?.storagePath ?? "",
      startDate: selectedCampaign?.startDate ?? "",
      endDate: selectedCampaign?.endDate ?? "",
      sortOrder: selectedCampaign?.sortOrder?.toString() ?? "0",
      isActive: selectedCampaign?.isActive ?? true,
    });
    setIsSlugManual(!!selectedCampaign);
    setMessage(null);
    setError(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Sadece görsel dosyaları yüklenebilir.");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "campaigns");
    
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Görsel yüklenirken bir hata oluştu.");
      }
      setForm((current) => ({ ...current, imageUrl: data.url, storagePath: data.storagePath }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme sırasında hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemoveImage() {
    setForm((current) => ({ ...current, imageUrl: "", storagePath: "" }));
  }

  function handleSelect(campaign: Campaign) {
    setSelectedId(campaign.id);
  }

  function handleTitleChange(val: string) {
    setForm(current => {
      const updated = { ...current, title: val };
      if (!isSlugManual) {
        updated.slug = trSlugify(val);
      }
      return updated;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Kampanya başlığı boş olamaz");
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const url = selectedId 
        ? `/api/admin/campaigns/${selectedId}` 
        : "/api/admin/campaigns";
      
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

      setMessage(selectedId ? "Kampanya başarıyla güncellendi." : "Kampanya başarıyla oluşturuldu.");
      
      router.refresh();
      
      if (!selectedId && result.campaign) {
        setSelectedId(result.campaign.id);
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
    
    const confirmed = confirm("Bu kampanyayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.");
    if (!confirmed) return;

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/campaigns/${selectedId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kampanya silinemedi");
      }

      setMessage("Kampanya başarıyla silindi.");
      setSelectedId(campaigns[0]?.id !== selectedId ? (campaigns[0]?.id ?? null) : (campaigns[1]?.id ?? null));
      router.refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Silme işlemi sırasında bir hata oluştu";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    if (isLoading) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= campaigns.length) return;

    const reordered = [...campaigns];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    const payload = reordered.map((camp, idx) => ({
      id: camp.id,
      sortOrder: idx + 1,
    }));

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/campaigns/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Sıralama güncellenemedi");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sıralama güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Campaign List */}
      <div className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Kampanya listesi</p>
            <h2 className="mt-2 text-2xl font-semibold">Mevcut kampanyalar</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedId(null);
            }}
            className="rounded-full border border-[var(--card-border)] px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
          >
            Yeni kampanya
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {campaigns.map((campaign, index) => (
            <div key={campaign.id} className="flex gap-2 w-full group/item">
              <button
                type="button"
                onClick={() => handleSelect(campaign)}
                className={`flex-1 flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                  selectedId === campaign.id
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <div>
                  <p className="font-medium">{campaign.title}</p>
                  <p className="text-sm text-[var(--muted)]">{campaign.slug}</p>
                </div>
                <div className="text-right text-sm text-[var(--muted)] mr-2">
                  <p>{campaign.isActive ? "Aktif" : "Pasif"}</p>
                  <p>Sıra {campaign.sortOrder}</p>
                </div>
              </button>
              
              <div className="flex flex-col gap-1 justify-center shrink-0">
                <button
                  type="button"
                  disabled={index === 0 || isLoading}
                  onClick={() => handleMove(index, "up")}
                  title="Yukarı Taşı"
                  className="p-1.5 rounded-lg border border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition text-xs font-semibold"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === campaigns.length - 1 || isLoading}
                  onClick={() => handleMove(index, "down")}
                  title="Aşağı Taşı"
                  className="p-1.5 rounded-lg border border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition text-xs font-semibold"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <p className="text-sm text-[var(--muted)] text-center py-4">Kampanya bulunamadı.</p>
          )}
        </div>
      </div>

      {/* Campaign Form */}
      <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-5 flex flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Hızlı form</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {selectedId ? "Kampanya düzenle" : "Yeni kampanya ekle"}
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
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Örn: Haziran Stor İndirimi"
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
                placeholder="Örn: haziran-stor-indirimi"
                className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                disabled={isLoading}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Açıklama</span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Kampanya detayları ve kuralları..."
                rows={3}
                className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                disabled={isLoading}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2 items-end">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Rozet (Badge)</span>
                <input
                  value={form.badgeText}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, badgeText: event.target.value }))
                  }
                  placeholder="Örn: %20 İndirim"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>
              <div className="block">
                <span className="mb-2 block text-sm font-medium">Kampanya Görseli</span>
                {form.imageUrl ? (
                  <div className="relative flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-black/5 dark:bg-white/5 p-2">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-black/10">
                      <Image
                        src={form.imageUrl}
                        alt="Kampanya görseli"
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--muted)] truncate">Görsel yüklendi</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isLoading || isUploading}
                      className="rounded-lg border border-rose-500/20 px-2.5 py-1.5 text-2xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
                    >
                      Kaldır
                    </button>
                  </div>
                ) : (
                  <label className="relative flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[var(--card-border)] bg-black/5 dark:bg-white/5 px-4 py-3.5 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition w-full">
                    <span className="text-[var(--accent)]">
                      {isUploading ? "Yükleniyor..." : "Görsel Seç"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isLoading || isUploading}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Başlangıç Tarihi</span>
                <input
                  value={form.startDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startDate: event.target.value }))
                  }
                  type="date"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Bitiş Tarihi</span>
                <input
                  value={form.endDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, endDate: event.target.value }))
                  }
                  type="date"
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
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none self-end pb-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, isActive: event.target.checked }))
                  }
                  disabled={isLoading}
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                Aktif (Sitede yayınlansın)
              </label>
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
  );
}
