import Link from "next/link";
import { getAnnouncements, getCampaigns, getCategories, getProducts } from "@/src/lib/supabase/db";

export default async function AdminLandingPage() {
  const products = await getProducts({ includeInactive: true });
  const categories = await getCategories(true);
  const campaigns = await getCampaigns(true);
  const announcements = await getAnnouncements(true);

  const stats = [
    { label: "Ürün", value: products.filter((item) => item.isActive).length, total: products.length },
    { label: "Kategori", value: categories.filter((item) => item.isActive).length, total: categories.length },
    { label: "Kampanya", value: campaigns.filter((item) => item.isActive).length, total: campaigns.length },
    { label: "Duyuru", value: announcements.filter((item) => item.isPublished).length, total: announcements.length },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Dashboard</p>
        <h1 className="text-3xl font-semibold">Yönetim özeti</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Ürün, kategori, kampanya ve duyuru süreçleri burada yönetilir. Veriler Supabase veritabanından çekilmektedir.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-[var(--card-border)] bg-[var(--background)] p-5"
          >
            <p className="text-sm text-[var(--muted)]">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold">
              {item.value} <span className="text-sm font-normal text-[var(--muted)]">/ {item.total} toplam</span>
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[var(--card-border)] bg-[var(--background)] p-5">
          <p className="text-sm font-medium">Hızlı işlemler</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/urunler"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)]"
            >
              Ürünleri yönet
            </Link>
            <Link
              href="/admin/kampanyalar"
              className="rounded-full border border-[var(--card-border)] px-4 py-2 text-sm font-medium"
            >
              Kampanyaları düzenle
            </Link>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--card-border)] bg-[var(--background)] p-5">
          <p className="text-sm font-medium">Bilgi</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Supabase ortam değişkenleri mevcut olmadığında sistem otomatik olarak bellek içi mock verilere geri düşer, böylece geliştirme süreci aksamaz.
          </p>
        </div>
      </section>
    </div>
  );
}
