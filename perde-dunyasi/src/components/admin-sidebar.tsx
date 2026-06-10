import Link from "next/link";

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
  return (
    <aside className="glass-card flex h-full flex-col rounded-[2rem] p-5">
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

      <div className="mt-auto rounded-2xl border border-[var(--card-border)] bg-[var(--background)] p-4 text-sm text-[var(--muted)]">
        <p className="font-medium text-[var(--foreground)]">Güvenli alan</p>
        <p className="mt-2">Middleware ile korunur. Oturum yoksa giriş sayfasına yönlenir.</p>
      </div>
    </aside>
  );
}
