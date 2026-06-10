import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAnnouncement } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.title || !body.content) {
      return NextResponse.json({ error: "Duyuru başlığı ve içeriği gereklidir" }, { status: 400 });
    }

    const announcement = await createAnnouncement({
      title: body.title,
      content: body.content,
      isPublished: body.isPublished === true,
    });

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
