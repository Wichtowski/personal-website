import { useMemo } from "react";
import { ThemeMode } from "./types";

export function useThemeColors(mode: ThemeMode) {
  return useMemo(() => {
    if (mode === "dark") {
      return {
        background: "#050507",
        fog: "#09090f",
        foreground: "#fafafa",
        accent: "#8b5cf6",
      };
    }

    return {
      background: "#eee5f6",
      fog: "#e3d7f3",
      foreground: "#16111f",
      accent: "#6d28d9",
    };
  }, [mode]);
}
