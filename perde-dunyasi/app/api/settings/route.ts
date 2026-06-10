import { NextResponse } from "next/server";
import { getSettings } from "@/src/lib/supabase/db";

export async function GET() {
  try {
    const data = await getSettings();
    return NextResponse.json({ settings: data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
