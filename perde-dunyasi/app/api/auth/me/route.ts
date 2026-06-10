import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "perde_admin_session";

export async function GET() {
  const session = (await cookies()).get(ADMIN_SESSION_COOKIE);

  if (!session?.value) {
    return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
  }

  return NextResponse.json({ user: { id: "admin-local", email: "admin@perdedunyasi.com" } });
}
