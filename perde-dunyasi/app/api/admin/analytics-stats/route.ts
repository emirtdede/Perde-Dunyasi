import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getVisitStats } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = (searchParams.get("filter") as "day" | "month" | "year") || "month";

    const stats = await getVisitStats(filter);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Ziyaretçi istatistikleri alınamadı" },
      { status: 500 }
    );
  }
}
