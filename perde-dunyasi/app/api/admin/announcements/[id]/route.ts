import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateAnnouncement, deleteAnnouncement } from "@/src/lib/supabase/db";

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

    const updated = await updateAnnouncement(id, {
      title: body.title,
      content: body.content,
      isPublished: body.isPublished,
    });

    if (!updated) {
      return NextResponse.json({ error: "Duyuru bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ announcement: updated });
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
    const success = await deleteAnnouncement(id);
    if (!success) {
      return NextResponse.json({ error: "Duyuru bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Duyuru silindi" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
