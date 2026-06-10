import { NextRequest, NextResponse } from "next/server";
import { getAnnouncements } from "@/src/lib/supabase/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    
    let list = await getAnnouncements();
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit)) {
        list = list.slice(0, limit);
      }
    }

    return NextResponse.json({ announcements: list });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
