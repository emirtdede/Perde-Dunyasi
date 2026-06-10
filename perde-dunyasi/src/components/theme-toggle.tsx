"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/src/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium backdrop-blur transition hover:scale-[1.02] active:scale-95"
      >
        Koyu tema
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium backdrop-blur transition hover:scale-[1.02] active:scale-95"
    >
      {theme === "dark" ? "Açık tema" : "Koyu tema"}
    </button>
  );
}
