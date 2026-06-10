import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStorageStats } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const stats = await getStorageStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Depolama bilgileri alınamadı" },
      { status: 500 }
    );
  }
}
