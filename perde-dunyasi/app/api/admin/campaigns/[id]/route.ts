import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateCampaign, deleteCampaign, getCampaignById } from "@/src/lib/supabase/db";
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

    // Fetch old campaign details for comparison
    const oldCampaign = await getCampaignById(id);

    const updated = await updateCampaign(id, {
      title: body.title,
      slug: body.slug,
      description: body.description,
      badgeText: body.badgeText,
      imageUrl: body.imageUrl,
      storagePath: body.storagePath,
      startDate: body.startDate !== undefined ? (body.startDate || null) : undefined,
      endDate: body.endDate !== undefined ? (body.endDate || null) : undefined,
      isActive: body.isActive,
      sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder, 10) : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Kampanya bulunamadı" }, { status: 404 });
    }

    // Clean up old image from storage/disk if it changed
    if (oldCampaign && oldCampaign.imageUrl && oldCampaign.imageUrl !== updated.imageUrl) {
      if (isSupabaseConfigured && oldCampaign.storagePath) {
        try {
          const supabase = createSupabaseServerClient();
          await supabase.storage.from("product-images").remove([oldCampaign.storagePath]);
        } catch (err) {
          console.error("Eski kampanya görseli silinirken hata (Supabase):", err);
        }
      } else if (oldCampaign.imageUrl.startsWith("/uploads/campaigns/")) {
        try {
          const filePath = path.join(process.cwd(), "public", oldCampaign.imageUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Eski kampanya görseli silinirken hata (Local):", err);
        }
      }
    }

    return NextResponse.json({ campaign: updated });
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
    
    // Fetch campaign details before deleting
    const campaign = await getCampaignById(id);
    
    const success = await deleteCampaign(id);
    if (!success) {
      return NextResponse.json({ error: "Kampanya bulunamadı" }, { status: 404 });
    }

    // Clean up campaign image file from storage/disk
    if (campaign) {
      if (isSupabaseConfigured && campaign.storagePath) {
        try {
          const supabase = createSupabaseServerClient();
          await supabase.storage.from("product-images").remove([campaign.storagePath]);
        } catch (err) {
          console.error("Kampanya görseli silinirken hata (Supabase):", err);
        }
      } else if (campaign.imageUrl && campaign.imageUrl.startsWith("/uploads/campaigns/")) {
        try {
          const filePath = path.join(process.cwd(), "public", campaign.imageUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Kampanya görseli silinirken hata (Local):", err);
        }
      }
    }

    return NextResponse.json({ message: "Kampanya silindi" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Bir hata oluştu" }, { status: 500 });
  }
}
