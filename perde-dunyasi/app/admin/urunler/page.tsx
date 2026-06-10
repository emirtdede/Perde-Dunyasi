import { AdminProductManager } from "@/src/components/admin-product-manager";
import { getCategories, getProducts } from "@/src/lib/supabase/db";

export default async function AdminProductsPage() {
  const products = await getProducts({ includeInactive: true });
  const categories = await getCategories(true);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Ürünler</p>
        <h1 className="text-3xl font-semibold">Ürün yönetimi</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Ürün listeleme, düzenleme ve hızlı ekleme işlemleri. Veriler Supabase veritabanından çekilmektedir.
        </p>
      </div>

      <AdminProductManager categories={categories} products={products} />
    </div>
  );
}
