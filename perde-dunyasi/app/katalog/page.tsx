import { PageHero } from "@/src/components/page-hero";
import { getCategories, getProducts } from "@/src/lib/supabase/db";
import { CatalogGrid } from "@/src/components/catalog-grid";

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="page-shell px-6 py-10 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <PageHero
          eyebrow="Ürün kataloğu"
          title="Kategoriye göre filtrelenecek ürün vitrini"
          description="Aşağıda tüm güncel ürünlerimiz yer almaktadır. Detay butonuna tıklayarak ürün özelliklerini görebilir ve WhatsApp üzerinden fiyat teklifi alabilirsiniz."
        />

        <CatalogGrid categories={categories} products={products} />
      </div>
    </div>
  );
}
