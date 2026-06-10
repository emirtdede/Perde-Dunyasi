import { NextResponse } from "next/server";
import { getCategories } from "@/src/lib/supabase/db";

export async function GET() {
  try {
    const list = await getCategories();
    return NextResponse.json({ categories: list });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
