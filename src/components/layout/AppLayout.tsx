"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@lib/navigation";
import { PageTransition } from "./PageTransition";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname() ?? "/";
  const isMainRoute = ROUTES.includes(pathname);

  // Main-route sections (LandingPage, Portfolio, Blog, GitHub, Contact) render
  // their own Footer, so we skip a duplicate one here. Only the current route
  // is mounted, which keeps navigation in sync and avoids mounting every
  // section at once.
  return <PageTransition withFooter={!isMainRoute}>{children}</PageTransition>;
}
