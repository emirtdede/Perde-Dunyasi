import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createProduct } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.name || !body.categoryId) {
      return NextResponse.json({ error: "Ürün adı ve kategori gereklidir" }, { status: 400 });
    }

    const product = await createProduct({
      categoryId: body.categoryId,
      name: body.name,
      slug: body.slug,
      shortDesc: body.shortDesc,
      description: body.description,
      price: body.price ? parseFloat(body.price) : null,
      priceUnit: body.priceUnit || "TL",
      isActive: body.isActive !== false,
      isFeatured: body.isFeatured === true,
      sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
