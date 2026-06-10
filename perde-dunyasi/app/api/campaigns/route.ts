import { NextRequest, NextResponse } from "next/server";
import { getCampaigns } from "@/src/lib/supabase/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "true";
    
    const list = await getCampaigns(includeInactive);
    return NextResponse.json({ campaigns: list });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
