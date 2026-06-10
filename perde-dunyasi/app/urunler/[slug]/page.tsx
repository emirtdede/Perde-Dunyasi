import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getSettings } from "@/src/lib/supabase/db";
import { ProductImageGallery } from "@/src/components/product-image-gallery";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);

  if (!product || !product.isActive) {
    notFound();
  }

  const category = product.category;
  const whatsappNumber = settings.whatsapp_number;
  const whatsappMessage = [
    `Merhaba, ${product.name}${category ? ` (${category.name})` : ""} hakkında fiyat teklifi almak istiyorum.`,
    product.shortDesc ?? null,
    `Web: perdedunyasi.com/urunler/${product.slug}`
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <div className="page-shell px-6 py-10 sm:px-10 lg:px-12 overflow-hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <nav className="text-sm text-[var(--muted)] animate-fade-in-up">
          <Link href="/katalog" className="hover:text-[var(--foreground)] transition">
            Katalog
          </Link>{" "}
          / {product.name}
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:sticky lg:top-24 animate-fade-in-up delay-100">
            <ProductImageGallery images={product.images} />
          </div>

          {/* Right Column: Info & Action */}
          <div className="flex flex-col gap-6 w-full">
            <div className="glass-card rounded-[2rem] p-6 animate-fade-in-up delay-200">
              <div className="flex flex-col justify-between rounded-[1.5rem] border border-dashed border-[var(--card-border)] bg-black/5 dark:bg-white/5 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                    {category?.name ?? "Kategori"}
                  </p>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl text-[var(--foreground)]">
                    {product.name}
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)] whitespace-pre-wrap">
                    {product.description ?? product.shortDesc ?? "Ürün açıklaması yakında eklenecek."}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] font-medium">
                    {product.price ? `${product.price.toLocaleString("tr-TR")} ${product.priceUnit}` : "Fiyat için iletişim"}
                  </span>
                  <span className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)]">
                    WhatsApp teklif akışı
                  </span>
                </div>
              </div>
            </div>

            <aside className="glass-card rounded-[2rem] p-6 animate-fade-in-up delay-300">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                Hızlı teklif
              </p>
              <h2 className="mt-4 text-2xl font-semibold">WhatsApp ile fiyat alın</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Mesaj ürün adı ve kategoriyle otomatik hazırlanır.
              </p>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#20bd5a] transition duration-300 hover:scale-[1.03] active:scale-95 animate-whatsapp"
                >
                  Fiyat Teklifi Al
                </a>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-[var(--card-border)] p-4 text-sm text-[var(--muted)]">
                  WhatsApp numarası tanımlı değil.
                </div>
              )}

              <div className="mt-6 space-y-3 text-sm text-[var(--muted)] border-t border-[var(--card-border)] pt-5">
                <p>
                  <span className="font-medium text-[var(--foreground)]">Ürün:</span>{" "}
                  {product.name}
                </p>
                <p>
                  <span className="font-medium text-[var(--foreground)]">Kategori:</span>{" "}
                  {category?.name ?? "-"}
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
