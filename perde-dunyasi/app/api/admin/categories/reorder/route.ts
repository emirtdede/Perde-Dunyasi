import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { reorderCategories } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.orders)) {
      return NextResponse.json({ error: "Sıralama verisi geçersiz" }, { status: 400 });
    }

    const success = await reorderCategories(body.orders);
    if (!success) {
      return NextResponse.json({ error: "Kategori sıralaması güncellenemedi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Kategori sıralaması güncellendi" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Kategori sıralanırken hata oluştu" },
      { status: 500 }
    );
  }
}
