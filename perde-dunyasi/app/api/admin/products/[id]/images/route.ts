import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createProductImage } from "@/src/lib/supabase/db";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

const isSupabaseConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Check admin authentication
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Görsel dosyası gönderilmedi" }, { status: 400 });
    }

    // Validate type (accept all common image types)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Sadece görsel dosyaları yüklenebilir" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // Convert to WebP with lossless quality
    const buffer = await sharp(rawBuffer)
      .webp({ quality: 100, lossless: true })
      .toBuffer();

    const fileName = `${crypto.randomUUID()}.webp`;

    let url = "";
    let storagePath = "";

    if (isSupabaseConfigured) {
      const supabase = createSupabaseServerClient();
      storagePath = `${productId}/${fileName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(storagePath, buffer, {
          contentType: "image/webp",
          duplex: "half",
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(storagePath);

      url = urlData.publicUrl;
    } else {
      // Local fallback
      const uploadDir = path.join(process.cwd(), "public", "uploads", "products", productId);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const localFilePath = path.join(uploadDir, fileName);
      fs.writeFileSync(localFilePath, buffer);

      url = `/uploads/products/${productId}/${fileName}`;
      storagePath = `public/uploads/products/${productId}/${fileName}`;
    }

    // Save image to database
    const productImage = await createProductImage(productId, url, storagePath);

    return NextResponse.json({ image: productImage }, { status: 201 });
  } catch (error) {
    console.error("Görsel yükleme hatası:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Görsel yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
