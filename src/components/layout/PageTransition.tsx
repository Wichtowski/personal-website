"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  consumeNavTransitionKind,
  getRouteDirection,
  PAGE_FADE_DURATION_MS,
  PAGE_FADE_OUT_EVENT,
  type RouteTransitionKind,
} from "@lib/navigation";
import { Footer } from "./Footer";

interface PageTransitionSnapshot {
  direction: number;
  kind: RouteTransitionKind;
  pathname: string;
}

const pageVariants = {
  initial: ({ direction, kind }: PageTransitionSnapshot) =>
    kind === "fade" ? { opacity: 0, x: "0vw" } : { opacity: 1, x: `${direction * 100}vw` },
  animate: { opacity: 1, x: "0vw" },
  fadeOut: { opacity: 0, x: "0vw" },
  exit: ({ direction, kind }: PageTransitionSnapshot) =>
    kind === "fade" ? { opacity: 0, x: "0vw" } : { opacity: 1, x: `${direction * -100}vw` },
};

export function PageTransition({
  children,
  withFooter = true,
}: {
  children: ReactNode;
  withFooter?: boolean;
}) {
  const pathname = usePathname() ?? "/";
  const [fadeOutPathname, setFadeOutPathname] = useState<string | null>(null);
  const [transitionState, setTransitionState] = useState({
    direction: 1,
    kind: "slide" as RouteTransitionKind,
    pathname,
  });
  let activeTransitionState = transitionState;

  if (pathname !== transitionState.pathname) {
    activeTransitionState = {
      direction: getRouteDirection(transitionState.pathname, pathname),
      kind: consumeNavTransitionKind(),
      pathname,
    };
    setTransitionState(activeTransitionState);
  }

  useEffect(() => {
    const handleFadeOut = () => setFadeOutPathname(pathname);

    window.addEventListener(PAGE_FADE_OUT_EVENT, handleFadeOut);
    return () => window.removeEventListener(PAGE_FADE_OUT_EVENT, handleFadeOut);
  }, [pathname]);

  return (
    <AnimatePresence mode="popLayout" initial={false} custom={activeTransitionState}>
      <motion.div
        key={pathname}
        custom={activeTransitionState}
        variants={pageVariants}
        initial="initial"
        animate={fadeOutPathname === pathname ? "fadeOut" : "animate"}
        exit="exit"
        onAnimationComplete={() => {
          if (fadeOutPathname && fadeOutPathname !== pathname) {
            setFadeOutPathname(null);
          }
        }}
        transition={
          activeTransitionState.kind === "fade"
            ? { type: "tween", duration: PAGE_FADE_DURATION_MS / 1000, ease: "easeOut" }
            : { type: "tween", duration: PAGE_FADE_DURATION_MS / 1000, ease: [0.25, 0.1, 0.25, 1] }
        }
        className="absolute top-20 md:top-0 inset-x-0 bottom-0 overflow-y-auto no-scrollbar flex flex-col"
      >
        <div className="flex-1 w-full flex flex-col">{children}</div>
        {withFooter && <Footer />}
      </motion.div>
    </AnimatePresence>
  );
}
