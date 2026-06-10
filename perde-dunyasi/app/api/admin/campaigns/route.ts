import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCampaign } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.title) {
      return NextResponse.json({ error: "Kampanya başlığı gereklidir" }, { status: 400 });
    }

    const campaign = await createCampaign({
      title: body.title,
      slug: body.slug,
      description: body.description,
      badgeText: body.badgeText,
      imageUrl: body.imageUrl,
      storagePath: body.storagePath,
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      isActive: body.isActive !== false,
      sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
