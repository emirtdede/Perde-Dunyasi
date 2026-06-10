"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Reads the actual theme preference from localStorage / media query.
 * Only call on the client side.
 */
function getClientTheme(): Theme {
  try {
    const stored = window.localStorage.getItem("perde-dunyasi-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage may throw in private browsing */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with "light" so server and client initial render match.
  // The inline script in <head> already applies the correct class to <html>,
  // so users won't see a flash of wrong theme.
  const [theme, setTheme] = useState<Theme>("light");

  // After mount, read the real theme and sync React state.
  useEffect(() => {
    const real = getClientTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(real);
  }, []);

  // Keep DOM and localStorage in sync whenever the theme changes.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem("perde-dunyasi-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
