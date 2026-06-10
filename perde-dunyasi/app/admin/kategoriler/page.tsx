import { AdminCategoryManager } from "@/src/components/admin-category-manager";
import { getCategories } from "@/src/lib/supabase/db";

export default async function AdminCategoriesPage() {
  const categories = await getCategories(true);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Kategoriler</p>
        <h1 className="text-3xl font-semibold">Kategori yönetimi</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Kategori listeleme, düzenleme ve hızlı ekleme işlemleri. Veriler Supabase veritabanından çekilmektedir.
        </p>
      </div>

      <AdminCategoryManager categories={categories} />
    </div>
  );
}
