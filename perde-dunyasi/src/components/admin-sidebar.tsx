"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/urunler", label: "Ürünler" },
  { href: "/admin/kategoriler", label: "Kategoriler" },
  { href: "/admin/kampanyalar", label: "Kampanyalar" },
  { href: "/admin/duyurular", label: "Duyurular" },
  { href: "/admin/ziyaretciler", label: "Ziyaretçiler" },
  { href: "/admin/depolama", label: "Depolama" },
  { href: "/admin/ayarlar", label: "Site Ayarları" },
];

export function AdminSidebar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="glass-card flex h-full min-h-[500px] flex-col rounded-[2rem] p-5 justify-between">
      <div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Admin panel</p>
          <h2 className="mt-3 text-xl font-semibold">Perde Dünyası</h2>
        </div>

        <nav className="mt-8 space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl px-4 py-3 text-sm text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 px-4 py-3 text-sm font-medium transition active:scale-95 disabled:opacity-50"
        >
          {isLoggingOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
        </button>

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)] p-4 text-xs text-[var(--muted)]">
          <p className="font-medium text-[var(--foreground)]">Güvenli alan</p>
          <p className="mt-1">Proxy ile korunur. Oturum yoksa yönlenir.</p>
        </div>
      </div>
    </aside>
  );
}
