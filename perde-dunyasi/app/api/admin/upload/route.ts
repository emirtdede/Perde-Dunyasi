import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

const isSupabaseConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";
    // "logo" format keeps original PNG; everything else converts to WebP
    const keepOriginal = (formData.get("keepOriginal") as string) === "true";

    if (!file) {
      return NextResponse.json({ error: "Görsel dosyası gönderilmedi" }, { status: 400 });
    }

    // Validate type (accept all common image types)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Sadece görsel dosyaları yüklenebilir" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);
    let buffer: Buffer = rawBuffer;
    let contentType = file.type;
    let fileExt: string;

    if (keepOriginal) {
      // Keep original format (used for logo — stays as PNG)
      fileExt = file.name.split(".").pop() || "png";
    } else {
      // Convert to WebP with lossless quality
      buffer = await sharp(rawBuffer)
        .webp({ quality: 100, lossless: true })
        .toBuffer();
      fileExt = "webp";
      contentType = "image/webp";
    }

    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    let url = "";
    let storagePath = "";

    if (isSupabaseConfigured) {
      const supabase = createSupabaseServerClient();
      storagePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(storagePath, buffer, {
          contentType,
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
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const localFilePath = path.join(uploadDir, fileName);
      fs.writeFileSync(localFilePath, buffer);

      url = `/uploads/${folder}/${fileName}`;
      storagePath = `public/uploads/${folder}/${fileName}`;
    }

    return NextResponse.json({ url, storagePath }, { status: 201 });
  } catch (error) {
    console.error("Yükleme hatası:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
