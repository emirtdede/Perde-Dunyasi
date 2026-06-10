import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/src/lib/supabase/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = body.path || "/";
    const referrer = body.referrer || null;
    const userAgent = request.headers.get("user-agent") || null;
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0] || null;

    // Detect geolocation from Vercel headers or default
    const countryCode = request.headers.get("x-vercel-ip-country");
    const countryNames: Record<string, string> = { 
      TR: "Türkiye", 
      DE: "Almanya", 
      US: "ABD", 
      GB: "İngiltere", 
      FR: "Fransa", 
      AZ: "Azerbaycan", 
      NL: "Hollanda" 
    };
    const country = countryCode ? (countryNames[countryCode.toUpperCase()] || countryCode) : "Türkiye";
    const city = request.headers.get("x-vercel-ip-city") 
      ? decodeURIComponent(request.headers.get("x-vercel-ip-city") || "") 
      : "Adıyaman"; // Fallback locally to Adıyaman or Ankara/Istanbul

    // Manage visitor_id cookie
    let visitorId = request.cookies.get("visitor_id")?.value;
    const isNewVisitor = !visitorId;
    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    await recordVisit({
      visitorId,
      path,
      referrer,
      ipAddress,
      country,
      city,
      userAgent,
    });

    const response = NextResponse.json({ success: true });
    if (isNewVisitor) {
      // Set persistent cookie for 1 year
      response.cookies.set("visitor_id", visitorId, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
    }
    return response;
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ error: "Failed to log visit" }, { status: 500 });
  }
}
