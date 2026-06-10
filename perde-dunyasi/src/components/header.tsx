"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { useTheme } from "@/src/components/theme-provider";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/katalog", label: "Katalog" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/kampanyalar", label: "Kampanyalar" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header({ logoUrl, logoDarkUrl }: { logoUrl?: string | null; logoDarkUrl?: string | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  
  // Use logoDarkUrl in dark mode, fallback to logoUrl if dark logo is not uploaded
  const activeLogoUrl = theme === "dark" ? (logoDarkUrl || logoUrl) : logoUrl;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[color-mix(in_srgb,var(--background)_82%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {activeLogoUrl ? (
            <div className="relative h-9 w-32 transition duration-300 group-hover:scale-[1.02]">
              <Image
                src={activeLogoUrl}
                alt="Logo"
                fill
                priority
                className="object-contain object-left"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                Perde Dünyası
              </span>
              <span className="text-sm font-medium">WhatsApp teklif vitrini</span>
            </div>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-6 text-sm text-[var(--muted)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link transition hover:text-[var(--foreground)] py-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--card-border)] transition hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
            aria-label="Menüyü aç/kapat"
          >
            <div className="flex flex-col gap-[5px]">
              <span
                className={`block h-[2px] w-4 rounded-full bg-[var(--foreground)] transition-all duration-300 ${
                  mobileOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-4 rounded-full bg-[var(--foreground)] transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-4 rounded-full bg-[var(--foreground)] transition-all duration-300 ${
                  mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-[var(--card-border)] bg-[var(--background)] lg:hidden animate-fade-in">
          <nav className="mx-auto flex max-w-6xl flex-col px-6 py-4 sm:px-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl border border-[var(--card-border)] px-4 py-3 text-center text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              Admin Panel
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
