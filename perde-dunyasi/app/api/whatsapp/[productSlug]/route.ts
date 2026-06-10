import { NextResponse } from "next/server";
import { getProductBySlug, getSettings } from "@/src/lib/supabase/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productSlug: string }> },
) {
  try {
    const { productSlug } = await params;
    const product = await getProductBySlug(productSlug);

    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    const settings = await getSettings();
    const whatsappNumber = settings.whatsapp_number;

    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp numarası tanımlanmamış" },
        { status: 503 },
      );
    }

    const parts = [
      `Merhaba, ${product.name}${product.category ? ` (${product.category.name})` : ""} hakkında fiyat teklifi almak istiyorum.`,
      product.shortDesc ?? null,
      `Web: perdedunyasi.com/urunler/${product.slug}`,
    ].filter(Boolean);

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(parts.join("\n"))}`;

    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
