import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateCategory, deleteCategory, getCategoryById } from "@/src/lib/supabase/db";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import fs from "fs";
import path from "path";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

const isSupabaseConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "İstek gövdesi boş olamaz" }, { status: 400 });
    }

    // Get old category to compare image URLs
    const oldCategory = await getCategoryById(id);

    const updated = await updateCategory(id, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      imageUrl: body.imageUrl,
      sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder, 10) : undefined,
      isActive: body.isActive,
    });

    if (!updated) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }

    // If image changed, clean up the old file
    if (oldCategory && oldCategory.imageUrl && oldCategory.imageUrl !== updated.imageUrl) {
      const oldUrl = oldCategory.imageUrl;
      if (isSupabaseConfigured) {
        const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`;
        if (oldUrl.startsWith(bucketUrl)) {
          const oldStoragePath = oldUrl.replace(bucketUrl, "");
          try {
            const supabase = createSupabaseServerClient();
            await supabase.storage.from("product-images").remove([oldStoragePath]);
          } catch (err) {
            console.error("Eski kategori görseli silinirken hata (Supabase):", err);
          }
        }
      } else if (oldUrl.startsWith("/uploads/categories/")) {
        try {
          const filePath = path.join(process.cwd(), "public", oldUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Eski kategori görseli silinirken hata (Local):", err);
        }
      }
    }

    return NextResponse.json({ category: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await params;

    // Get category to delete its image file before removing the record
    const category = await getCategoryById(id);
    
    // Attempt database deletion
    const success = await deleteCategory(id);
    if (!success) {
      return NextResponse.json({ error: "Kategori bulunamadı veya silinemedi" }, { status: 404 });
    }

    // Clean up image file if database deletion was successful
    if (category && category.imageUrl) {
      const oldUrl = category.imageUrl;
      if (isSupabaseConfigured) {
        const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`;
        if (oldUrl.startsWith(bucketUrl)) {
          const oldStoragePath = oldUrl.replace(bucketUrl, "");
          try {
            const supabase = createSupabaseServerClient();
            await supabase.storage.from("product-images").remove([oldStoragePath]);
          } catch (err) {
            console.error("Kategori görseli silinirken hata (Supabase):", err);
          }
        }
      } else if (oldUrl.startsWith("/uploads/categories/")) {
        try {
          const filePath = path.join(process.cwd(), "public", oldUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Kategori görseli silinirken hata (Local):", err);
        }
      }
    }

    return NextResponse.json({ message: "Kategori silindi" });
  } catch (error) {
    // If it's the FK error we threw in db.ts
    const status = (error as Error).message.includes("ürünler var") ? 409 : 500;
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status });
  }
}
