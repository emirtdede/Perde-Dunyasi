import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProductBySlug, getCategoryBySlug, getCampaigns } from "@/src/lib/supabase/db";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

function trSlugify(text: string) {
  const map: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  let str = text;
  Object.keys(map).forEach(key => {
    str = str.replace(new RegExp(key, 'g'), map[key]);
  });
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text") || "";
    const table = searchParams.get("table") || "products";

    if (!text) {
      return NextResponse.json({ error: "Text parametresi gereklidir" }, { status: 400 });
    }

    const baseSlug = trSlugify(text);
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;

    // Loop until unique slug is found
    while (!isUnique) {
      let exists = false;

      if (table === "products") {
        const product = await getProductBySlug(slug);
        exists = !!product;
      } else if (table === "categories") {
        const category = await getCategoryBySlug(slug);
        exists = !!category;
      } else if (table === "campaigns") {
        const campaigns = await getCampaigns(true);
        exists = campaigns.some(c => c.slug === slug);
      }

      if (!exists) {
        isUnique = true;
      } else {
        counter++;
        slug = `${baseSlug}-${counter}`;
      }
    }

    return NextResponse.json({ slug });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
