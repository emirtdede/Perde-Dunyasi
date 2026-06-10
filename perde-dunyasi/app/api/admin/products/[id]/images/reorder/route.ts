import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { reorderProductImages } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Check admin authentication
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.orders)) {
      return NextResponse.json({ error: "Sıralama listesi geçersiz" }, { status: 400 });
    }

    const success = await reorderProductImages(productId, body.orders);

    if (!success) {
      return NextResponse.json({ error: "Görsel sıralaması güncellenemedi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Görsel sıralaması başarıyla güncellendi" });
  } catch (error) {
    console.error("Görsel sıralama hatası:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Görsel sıralanırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
