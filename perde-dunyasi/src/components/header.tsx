"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { useTheme } from "@/src/components/theme-provider";

const navItemsDict = {
  tr: [
    { href: "/", label: "Ana Sayfa" },
    { href: "/katalog", label: "Katalog" },
    { href: "/urunler", label: "Ürünler" },
    { href: "/kampanyalar", label: "Kampanyalar" },
    { href: "/duyurular", label: "Duyurular" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ],
  en: [
    { href: "/", label: "Home" },
    { href: "/katalog", label: "Catalog" },
    { href: "/urunler", label: "Products" },
    { href: "/kampanyalar", label: "Campaigns" },
    { href: "/duyurular", label: "Announcements" },
    { href: "/hakkimizda", label: "About Us" },
    { href: "/iletisim", label: "Contact" },
  ],
};

const brandSubtitles = {
  tr: "WhatsApp teklif vitrini",
  en: "WhatsApp quote showcase",
};

const adminPanelLabels = {
  tr: "Yönetim Paneli",
  en: "Admin Panel",
};

export function Header({
  logoUrl,
  logoDarkUrl,
  lang = "tr",
}: {
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  lang?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  
  const activeLang = lang === "en" ? "en" : "tr";
  const navItems = navItemsDict[activeLang];
  const brandSubtitle = brandSubtitles[activeLang];
  const adminLabel = adminPanelLabels[activeLang];

  // Use logoDarkUrl in dark mode, fallback to logoUrl if dark logo is not uploaded
  const activeLogoUrl = theme === "dark" ? (logoDarkUrl || logoUrl) : logoUrl;

  const toggleLanguage = () => {
    const nextLang = activeLang === "tr" ? "en" : "tr";
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000`;
    window.location.reload();
  };

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
              <span className="text-sm font-medium">{brandSubtitle}</span>
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
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex h-9 px-3 items-center justify-center rounded-xl border border-[var(--card-border)] text-xs font-semibold uppercase transition hover:bg-black/5 dark:hover:bg-white/5 tracking-wider"
            title={activeLang === "tr" ? "Switch to English" : "Türkçe'ye geç"}
          >
            {activeLang === "tr" ? "EN" : "TR"}
          </button>

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
              {adminLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
