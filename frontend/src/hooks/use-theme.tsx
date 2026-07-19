"use client";

import { useContext } from "react";

import {
  ThemeContext,
  ThemeContextProps,
} from "@/components/providers/theme-provider";

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("useTheme must be inside ThemeProvider");

  return context;
};
