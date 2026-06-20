"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AdminSettingsManagerProps = {
  initialSettings: Record<string, string | null>;
};

const settingGroups = [
  { id: "contact", label: "İletişim" },
  { id: "social", label: "Sosyal Medya" },
  { id: "content", label: "İçerik & Hero" },
  { id: "seo", label: "SEO Ayarları" },
];

export function AdminSettingsManager({
  initialSettings,
}: AdminSettingsManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("contact");
  // Parse hero_images from JSON string
  const parseHeroImages = (raw: string | null | undefined): string[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch { /* ignore */ }
    return [];
  };

  const [form, setForm] = useState(() => ({
    whatsapp_number: initialSettings.whatsapp_number ?? "",
    whatsapp_greeting: initialSettings.whatsapp_greeting ?? "",
    phone: initialSettings.phone ?? "",
    email: initialSettings.email ?? "",
    address: initialSettings.address ?? "",
    google_maps_url: initialSettings.google_maps_url ?? "",
    instagram_url: initialSettings.instagram_url ?? "",
    facebook_url: initialSettings.facebook_url ?? "",
    hero_title: initialSettings.hero_title ?? "",
    hero_subtitle: initialSettings.hero_subtitle ?? "",
    hero_image_url: initialSettings.hero_image_url ?? "",
    logo_url: initialSettings.logo_url ?? "",
    logo_dark_url: initialSettings.logo_dark_url ?? "",
    about_text: initialSettings.about_text ?? "",
    meta_title: initialSettings.meta_title ?? "",
    meta_description: initialSettings.meta_description ?? "",
  }));

  // Separate state for the hero images array
  const [heroImages, setHeroImages] = useState<string[]>(() => {
    const fromArray = parseHeroImages(initialSettings.hero_images);
    if (fromArray.length > 0) return fromArray;
    // Backward compat: use single hero_image_url if no array
    if (initialSettings.hero_image_url) return [initialSettings.hero_image_url];
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, key: "hero_image_url" | "logo_url" | "logo_dark_url" | "hero_images") {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Sadece görsel dosyaları yüklenebilir.");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "settings");
    // Logo stays as PNG (keepOriginal), everything else converts to WebP
    if (key === "logo_url" || key === "logo_dark_url") {
      fd.append("keepOriginal", "true");
    }
    
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Görsel yüklenirken bir hata oluştu.");
      }

      if (key === "hero_images") {
        setHeroImages((prev) => [...prev, data.url]);
      } else {
        setForm((current) => ({ ...current, [key]: data.url }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme sırasında hata oluştu.");
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  }

  function handleRemoveImage(key: "hero_image_url" | "logo_url" | "logo_dark_url") {
    setForm((current) => ({ ...current, [key]: "" }));
  }

  function handleRemoveHeroImage(index: number) {
    setHeroImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChange(key: keyof typeof form, val: string) {
    setForm((current) => ({
      ...current,
      [key]: val,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Build save payload: include hero_images as JSON string
      const payload = {
        ...form,
        hero_images: JSON.stringify(heroImages),
        // Keep hero_image_url as the first image for backward compat
        hero_image_url: heroImages.length > 0 ? heroImages[0] : "",
      };

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ayarlar kaydedilirken bir hata oluştu.");
      }

      setMessage("Site ayarları başarıyla güncellendi.");
      router.refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Kaydetme sırasında bir hata oluştu.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--background)] p-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--card-border)] pb-4">
        {settingGroups.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "border border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--muted)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feedback Messages */}
      {message && (
        <div className="mt-6 rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-sm text-emerald-500 font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-sm text-rose-500 font-medium">
          {error}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {activeTab === "contact" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">İletişim & WhatsApp Ayarları</h3>
            <p className="text-xs text-[var(--muted)] leading-5">
              Müşterilerin size ulaşacağı WhatsApp hattını ve otomatik teklif mesajı şablonunu buradan belirleyebilirsiniz.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">WhatsApp Numarası</span>
                <input
                  value={form.whatsapp_number}
                  onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                  placeholder="Örn: 905551234567"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
                <span className="mt-1 block text-xs text-[var(--muted)]">Ülke kodu dahil (başında sıfır veya + olmadan) yazın.</span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Görünen Telefon</span>
                <input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Örn: 0555 123 45 67"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">WhatsApp Karşılama Mesajı Şablonu</span>
              <input
                value={form.whatsapp_greeting}
                onChange={(e) => handleChange("whatsapp_greeting", e.target.value)}
                placeholder="Merhaba, {urun} hakkında fiyat teklifi almak istiyorum."
                className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                disabled={isLoading}
              />
              <span className="mt-1 block text-xs text-[var(--muted)]">{"`{urun}`"} parametresi otomatik olarak tıklanan ürünün adıyla değiştirilecektir.</span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">E-posta Adresi</span>
                <input
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  type="email"
                  placeholder="info@perdedunyasi.com"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Google Maps URL</span>
                <input
                  value={form.google_maps_url}
                  onChange={(e) => handleChange("google_maps_url", e.target.value)}
                  placeholder="https://www.google.com/maps/embed?..."
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Açık Adres</span>
              <input
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Örn: Adıyaman, Türkiye"
                className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                disabled={isLoading}
              />
            </label>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Sosyal Medya Linkleri</h3>
            <p className="text-xs text-[var(--muted)] leading-5">
              Footer alanında veya iletişim sayfasında görünecek sosyal medya hesaplarınızın linklerini buraya ekleyebilirsiniz.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Instagram URL</span>
                <input
                  value={form.instagram_url}
                  onChange={(e) => handleChange("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/perdedunyasi"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Facebook URL</span>
                <input
                  value={form.facebook_url}
                  onChange={(e) => handleChange("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/perdedunyasi"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Ana Sayfa Hero, Logo & Hakkımızda Metinleri</h3>
            <p className="text-xs text-[var(--muted)] leading-5">
              Ziyaretçiyi karşılayan ana görsel, site logosu ve mağaza hakkında tanıtım yazısı.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 items-end">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Hero Başlığı</span>
                <input
                  value={form.hero_title}
                  onChange={(e) => handleChange("hero_title", e.target.value)}
                  placeholder="Hayalinizdeki Perdeler"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>

              <div className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium">Hero Görselleri (Slayt)</span>
                <p className="mb-3 text-xs text-[var(--muted)]">
                  Birden fazla görsel ekleyerek otomatik kayan slayt oluşturabilirsiniz.
                </p>

                {/* Existing hero images grid */}
                {heroImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                    {heroImages.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="relative group rounded-2xl border border-[var(--card-border)] bg-black/5 dark:bg-white/5 overflow-hidden"
                      >
                        <div className="relative aspect-[16/9]">
                          <Image
                            src={url}
                            alt={`Hero görseli ${index + 1}`}
                            fill
                            sizes="200px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                          <button
                            type="button"
                            onClick={() => handleRemoveHeroImage(index)}
                            disabled={isLoading || isUploading}
                            className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 transition"
                          >
                            Kaldır
                          </button>
                        </div>
                        <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-2xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new hero image button */}
                <label className="relative flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[var(--card-border)] bg-black/5 dark:bg-white/5 px-4 py-3.5 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition w-full">
                  <span className="text-[var(--accent)]">
                    {isUploading ? "Yükleniyor..." : heroImages.length > 0 ? "+ Yeni Görsel Ekle" : "Hero Görseli Seç"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "hero_images")}
                    disabled={isLoading || isUploading}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Hero Alt Başlığı</span>
                <input
                  value={form.hero_subtitle}
                  onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                  placeholder="En kaliteli ürünler ve hızlı WhatsApp iletişimi."
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  disabled={isLoading}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Light Mode Logo */}
              <div className="block">
                <span className="mb-2 block text-sm font-medium">Açık Tema Logosu (Koyu Renkli Yazı)</span>
                {form.logo_url ? (
                  <div className="relative flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-white p-2">
                    <div className="relative h-12 w-24 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-1">
                      <Image
                        src={form.logo_url}
                        alt="Açık Tema Logo"
                        fill
                        sizes="96px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 truncate">Görsel yüklendi</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("logo_url")}
                      disabled={isLoading || isUploading}
                      className="rounded-lg border border-rose-500/20 px-2.5 py-1.5 text-2xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
                    >
                      Kaldır
                    </button>
                  </div>
                ) : (
                  <label className="relative flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[var(--card-border)] bg-black/5 dark:bg-white/5 px-4 py-3.5 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition w-full">
                    <span className="text-[var(--accent)]">
                      {isUploading ? "Yükleniyor..." : "Logo Seç"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "logo_url")}
                      disabled={isLoading || isUploading}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>

              {/* Dark Mode Logo */}
              <div className="block">
                <span className="mb-2 block text-sm font-medium">Koyu Tema Logosu (Açık Renkli/Beyaz Yazı)</span>
                {form.logo_dark_url ? (
                  <div className="relative flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-slate-900 p-2">
                    <div className="relative h-12 w-24 overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center p-1">
                      <Image
                        src={form.logo_dark_url}
                        alt="Koyu Tema Logo"
                        fill
                        sizes="96px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 truncate">Görsel yüklendi</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("logo_dark_url")}
                      disabled={isLoading || isUploading}
                      className="rounded-lg border border-rose-500/20 px-2.5 py-1.5 text-2xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
                    >
                      Kaldır
                    </button>
                  </div>
                ) : (
                  <label className="relative flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[var(--card-border)] bg-black/5 dark:bg-white/5 px-4 py-3.5 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition w-full">
                    <span className="text-[var(--accent)]">
                      {isUploading ? "Yükleniyor..." : "Logo Seç"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "logo_dark_url")}
                      disabled={isLoading || isUploading}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Hakkımızda Sayfası Tanıtım Metni</span>
              <textarea
                value={form.about_text}
                onChange={(e) => handleChange("about_text", e.target.value)}
                placeholder="Hakkımızda sayfası metni..."
                rows={6}
                className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)] leading-6"
                disabled={isLoading}
              />
            </label>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">SEO (Arama Motoru Optimizasyonu) Ayarları</h3>
            <p className="text-xs text-[var(--muted)] leading-5">
              Google aramalarında sitenizin nasıl görüneceğini belirler.
            </p>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Arama Motoru Başlığı (Meta Title)</span>
              <input
                value={form.meta_title}
                onChange={(e) => handleChange("meta_title", e.target.value)}
                placeholder="Perde Dünyası - Adıyaman"
                className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                disabled={isLoading}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Arama Motoru Açıklaması (Meta Description)</span>
              <textarea
                value={form.meta_description}
                onChange={(e) => handleChange("meta_description", e.target.value)}
                placeholder="En kaliteli perde, stor, tül modelleri..."
                rows={4}
                className="w-full rounded-2xl border border-[var(--card-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)] leading-6"
                disabled={isLoading}
              />
            </label>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 pt-4 border-t border-[var(--card-border)] flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] px-6 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Ayarlar Kaydediliyor..." : "Ayarları Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
