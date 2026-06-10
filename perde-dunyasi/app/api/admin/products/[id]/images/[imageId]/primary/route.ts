import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setPrimaryImage } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id: productId, imageId } = await params;

    // Check admin authentication
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const success = await setPrimaryImage(productId, imageId);

    if (!success) {
      return NextResponse.json({ error: "Kapak görseli ayarlanamadı" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Kapak görseli başarıyla güncellendi" });
  } catch (error) {
    console.error("Kapak görseli ayarlama hatası:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Kapak görseli ayarlanırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
