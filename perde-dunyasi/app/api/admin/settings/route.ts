import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateSettings, getSettings } from "@/src/lib/supabase/db";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import fs from "fs";
import path from "path";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

const isSupabaseConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Geçersiz ayarlar formatı" }, { status: 400 });
    }

    // Get old settings to compare Hero image URLs
    const oldSettings = await getSettings();

    const success = await updateSettings(body);
    if (!success) {
      return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 });
    }

    // Clean up old Hero image from storage/disk if it changed
    if (oldSettings && oldSettings.hero_image_url && oldSettings.hero_image_url !== body.hero_image_url) {
      const oldUrl = oldSettings.hero_image_url;
      if (isSupabaseConfigured) {
        const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`;
        if (oldUrl.startsWith(bucketUrl)) {
          const oldStoragePath = oldUrl.replace(bucketUrl, "");
          try {
            const supabase = createSupabaseServerClient();
            await supabase.storage.from("product-images").remove([oldStoragePath]);
          } catch (err) {
            console.error("Eski hero görseli silinirken hata (Supabase):", err);
          }
        }
      } else if (oldUrl.startsWith("/uploads/settings/")) {
        try {
          const filePath = path.join(process.cwd(), "public", oldUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Eski hero görseli silinirken hata (Local):", err);
        }
      }
    }

    // Clean up old Logo image from storage/disk if it changed
    if (oldSettings && oldSettings.logo_url && oldSettings.logo_url !== body.logo_url) {
      const oldUrl = oldSettings.logo_url;
      if (isSupabaseConfigured) {
        const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`;
        if (oldUrl.startsWith(bucketUrl)) {
          const oldStoragePath = oldUrl.replace(bucketUrl, "");
          try {
            const supabase = createSupabaseServerClient();
            await supabase.storage.from("product-images").remove([oldStoragePath]);
          } catch (err) {
            console.error("Eski logo görseli silinirken hata (Supabase):", err);
          }
        }
      } else if (oldUrl.startsWith("/uploads/settings/")) {
        try {
          const filePath = path.join(process.cwd(), "public", oldUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Eski logo görseli silinirken hata (Local):", err);
        }
      }
    }

    // Clean up old Dark Logo image from storage/disk if it changed
    if (oldSettings && oldSettings.logo_dark_url && oldSettings.logo_dark_url !== body.logo_dark_url) {
      const oldUrl = oldSettings.logo_dark_url;
      if (isSupabaseConfigured) {
        const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`;
        if (oldUrl.startsWith(bucketUrl)) {
          const oldStoragePath = oldUrl.replace(bucketUrl, "");
          try {
            const supabase = createSupabaseServerClient();
            await supabase.storage.from("product-images").remove([oldStoragePath]);
          } catch (err) {
            console.error("Eski koyu logo görseli silinirken hata (Supabase):", err);
          }
        }
      } else if (oldUrl.startsWith("/uploads/settings/")) {
        try {
          const filePath = path.join(process.cwd(), "public", oldUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Eski koyu logo görseli silinirken hata (Local):", err);
        }
      }
    }

    // Revalidate all pages so they pick up the new settings (logo, hero, etc.)
    revalidatePath("/", "layout");

    return NextResponse.json({ message: "Ayarlar güncellendi" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}

