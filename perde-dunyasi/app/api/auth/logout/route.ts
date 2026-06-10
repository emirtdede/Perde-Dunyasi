import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function POST() {
  const response = NextResponse.json({ message: "Çıkış başarılı" });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
