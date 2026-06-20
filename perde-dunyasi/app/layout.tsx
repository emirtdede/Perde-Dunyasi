import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/src/components/footer";
import { Header } from "@/src/components/header";
import { ThemeProvider } from "@/src/components/theme-provider";
import { getSettings } from "@/src/lib/supabase/db";
import { AnalyticsTracker } from "@/src/components/analytics-tracker";
import { cookies } from "next/headers";

// System fonts fallback used to avoid next/font/google Turbo compiler resolution errors in Windows environment

export const metadata: Metadata = {
  title: "Perde Dünyası",
  description:
    "Perde, tül, stor ve jaluzi ürünleri için vitrin sitesi.",
};

// Force the root layout to be dynamic so settings (logo, hero, etc.) are always fresh
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const logoUrl = settings?.logo_url;
  const logoDarkUrl = settings?.logo_dark_url;
  
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "tr";

  return (
    <html
      lang={lang}
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to apply the correct theme class before React hydrates, preventing FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("perde-dunyasi-theme");if(!t){t=matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}if(t==="dark"){document.documentElement.classList.add("dark");document.documentElement.dataset.theme="dark"}else{document.documentElement.classList.remove("dark");document.documentElement.dataset.theme="light"}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]" suppressHydrationWarning>
        <ThemeProvider>
          <AnalyticsTracker />
          <div className="flex min-h-screen flex-col">
            <Header logoUrl={logoUrl} logoDarkUrl={logoDarkUrl} lang={lang} />
            <main className="flex-1">{children}</main>
            <Footer lang={lang} settings={settings} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
