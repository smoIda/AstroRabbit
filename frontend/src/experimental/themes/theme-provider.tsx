"use client";

import { createContext, useEffect, useMemo, useState } from "react";

import {
  faMoon,
  faSun,
  IconDefinition,
} from "@fortawesome/free-regular-svg-icons";

export const themes: Record<
  ThemeProps,
  { id: ThemeProps; icon: IconDefinition }
> = {
  LIGHT: { id: "LIGHT", icon: faSun },
  DARK: { id: "DARK", icon: faMoon },
};

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined,
);

type ThemeProps = "LIGHT" | "DARK";

export type ThemeContextProps = {
  theme: ThemeProps;
  setTheme: React.Dispatch<React.SetStateAction<ThemeProps>>;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeProps>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("THEME");

      if (stored === "LIGHT" || stored === "DARK") return stored;
    }

    return "LIGHT";
  });

  useEffect(() => {
    localStorage.setItem("THEME", theme);
  }, [theme]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "THEME" && e.newValue) {
        const newValue = e.newValue as ThemeProps;

        if (newValue === "LIGHT" || newValue === "DARK") setTheme(newValue);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const values = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
}
