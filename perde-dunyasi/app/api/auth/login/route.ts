import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: "Email ve şifre gerekli" },
      { status: 400 },
    );
  }

  const expectedEmail = process.env.ADMIN_EMAIL ?? "admin@perdedunyasi.com";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "perde1234";

  if (body.email !== expectedEmail || body.password !== expectedPassword) {
    return NextResponse.json(
      { error: "Geçersiz email veya şifre" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    user: { id: "admin-local", email: expectedEmail },
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
