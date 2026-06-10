import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProductImages, deleteProductImage } from "@/src/lib/supabase/db";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import fs from "fs";
import path from "path";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

const isSupabaseConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id: productId, imageId } = await params;

    // Check admin authentication
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Get all images for this product to find the target image
    const images = await getProductImages(productId);
    const targetImage = images.find(img => img.id === imageId);

    if (!targetImage) {
      return NextResponse.json({ error: "Görsel bulunamadı" }, { status: 404 });
    }

    // Delete from storage/disk
    if (isSupabaseConfigured) {
      const supabase = createSupabaseServerClient();
      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove([targetImage.storagePath]);
      
      if (storageError) {
        console.error("Supabase Storage deletion error:", storageError);
        // Continue database deletion even if storage deletion fails
      }
    } else {
      // Local file deletion
      if (targetImage.storagePath.startsWith("public/uploads/products/")) {
        const filePath = path.join(process.cwd(), targetImage.storagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Delete from database
    const success = await deleteProductImage(imageId);

    if (!success) {
      return NextResponse.json({ error: "Görsel veritabanından silinemedi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Görsel başarıyla silindi" });
  } catch (error) {
    console.error("Görsel silme hatası:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Görsel silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
