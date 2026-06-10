import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCategory } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.name) {
      return NextResponse.json({ error: "Kategori adı gereklidir" }, { status: 400 });
    }

    const category = await createCategory({
      name: body.name,
      slug: body.slug,
      description: body.description,
      imageUrl: body.imageUrl,
      sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
      isActive: body.isActive !== false,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
