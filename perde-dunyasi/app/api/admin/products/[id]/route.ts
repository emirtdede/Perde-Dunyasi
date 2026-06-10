import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateProduct, deleteProduct } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "İstek gövdesi boş olamaz" }, { status: 400 });
    }

    const updated = await updateProduct(id, {
      categoryId: body.categoryId,
      name: body.name,
      slug: body.slug,
      shortDesc: body.shortDesc,
      description: body.description,
      price: body.price !== undefined ? (body.price ? parseFloat(body.price) : null) : undefined,
      priceUnit: body.priceUnit,
      isActive: body.isActive,
      isFeatured: body.isFeatured,
      sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder, 10) : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ product: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ürün silindi" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
