import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeProviderContext = createContext<
  { theme: Theme; setTheme: (theme: Theme) => void } | undefined
>(undefined);

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* storage blocked */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Resolved during the first client render so the correct theme is applied
  // before paint, rather than flashing light and then correcting in an effect.
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage blocked */
    }
    // Enable colour transitions only after the first paint, so switching
    // themes animates but the initial load does not.
    const id = requestAnimationFrame(() => root.classList.add("theme-ready"));
    return () => cancelAnimationFrame(id);
  }, [theme]);

  // Follow the OS while the user has not made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem("theme")) return;
      } catch {
        /* storage blocked */
      }
      setThemeState(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
