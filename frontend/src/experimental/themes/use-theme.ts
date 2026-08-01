import { useContext } from "react";

import {
  ThemeContext,
  ThemeContextProps,
} from "@/experimental/themes/theme-provider";

export function useTheme(): ThemeContextProps {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("useTheme must be inside ThemeProvider");

  return context;
}
