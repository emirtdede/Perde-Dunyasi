import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/src/lib/supabase/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category") || undefined;
    const featuredParam = searchParams.get("featured");
    const search = searchParams.get("search") || undefined;

    let isFeatured: boolean | undefined = undefined;
    if (featuredParam === "true") isFeatured = true;
    if (featuredParam === "false") isFeatured = false;

    const list = await getProducts({
      categorySlug,
      isFeatured,
      search,
    });

    return NextResponse.json({ products: list });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
