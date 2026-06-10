import { PageHero } from "@/src/components/page-hero";
import { getCategories, getProducts } from "@/src/lib/supabase/db";
import { ProductsSearchAndFilter } from "@/src/components/products-search-and-filter";

export const revalidate = 3600; // Revalidate at most once per hour

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="page-shell px-6 py-10 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <PageHero
          eyebrow="Tüm Ürünler"
          title="Geniş perde koleksiyonumuzu inceleyin"
          description="Aradığınız modeli hızlıca bulun, kategorilere göre filtreleyin veya ekleme tarihine göre sıralayarak en yeni modellerimizi keşfedin."
        />

        <ProductsSearchAndFilter categories={categories} products={products} />
      </div>
    </div>
  );
}
