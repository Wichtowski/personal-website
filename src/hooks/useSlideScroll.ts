"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES, setNavDirection } from "@/lib/navigation";

function findScrollableParent(el: HTMLElement | null): HTMLElement | null {
  while (el && el !== document.documentElement) {
    const { overflowY } = window.getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

function isAtScrollBoundary(el: HTMLElement, deltaY: number): boolean {
  if (deltaY < 0) return el.scrollTop <= 0;
  return el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
}

export function useSlideScroll() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    let lastFlip = 0;

    const navigate = (dir: number) => {
      const now = Date.now();
      if (now - lastFlip < 150) return;

      const currentIdx = ROUTES.indexOf(pathname);
      if (currentIdx === -1) return;

      const nextIdx = Math.max(0, Math.min(currentIdx + dir, ROUTES.length - 1));
      if (nextIdx === currentIdx) return;

      lastFlip = now;
      setNavDirection(dir);
      router.push(ROUTES[nextIdx]);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      const currentIdx = ROUTES.indexOf(pathname);
      if (currentIdx === -1) return;

      const scrollable = findScrollableParent(e.target as HTMLElement);
      if (scrollable && !isAtScrollBoundary(scrollable, e.deltaY)) return;

      e.preventDefault();
      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigate(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(-1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname, router]);
}
