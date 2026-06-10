import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  const message = searchParams.get("message");

  if (!phone || !message) {
    return NextResponse.json(
      { error: "phone and message are required" },
      { status: 400 },
    );
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return NextResponse.json({ url });
}
