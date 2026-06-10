import type { Metadata } from "next";
import { AdminLoginForm } from "@/src/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Giriş | Perde Dünyası",
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string }>;
}) {
  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
      <div className="glass-card w-full max-w-md rounded-[2rem] p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Admin login</p>
        <h1 className="mt-4 text-3xl font-semibold">Giriş ekranı</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Yönetim alanına erişmek için email ve şifrenizi girin.
        </p>
        <AdminLoginForm searchParams={searchParams} />
      </div>
    </div>
  );
}
