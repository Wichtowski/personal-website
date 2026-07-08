"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

export type ThemeMode = "light" | "dark";

function isThemeMode(value: string | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useThemeMode(fallbackMode: ThemeMode | null = null): ThemeMode | null {
  const mounted = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);
  const { theme, resolvedTheme, systemTheme } = useTheme();

  if (!mounted) {
    return fallbackMode;
  }

  if (isThemeMode(resolvedTheme)) {
    return resolvedTheme;
  }

  if (isThemeMode(theme)) {
    return theme;
  }

  if (isThemeMode(systemTheme)) {
    return systemTheme;
  }

  return null;
}
