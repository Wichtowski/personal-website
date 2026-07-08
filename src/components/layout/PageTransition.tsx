"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getRouteDirection } from "@lib/navigation";
import { Footer } from "./Footer";

const pageVariants = {
  initial: (direction: number) => ({ x: `${direction * 100}vw` }),
  animate: { x: "0vw" },
  exit: (direction: number) => ({ x: `${direction * -100}vw` }),
};

export function PageTransition({
  children,
  withFooter = true,
}: {
  children: ReactNode;
  withFooter?: boolean;
}) {
  const pathname = usePathname() ?? "/";
  const [transitionState, setTransitionState] = useState({
    direction: 1,
    pathname,
  });
  let activeTransitionState = transitionState;

  if (pathname !== transitionState.pathname) {
    activeTransitionState = {
      direction: getRouteDirection(transitionState.pathname, pathname),
      pathname,
    };
    setTransitionState(activeTransitionState);
  }

  return (
    <AnimatePresence mode="popLayout" initial={false} custom={activeTransitionState.direction}>
      <motion.div
        key={pathname}
        custom={activeTransitionState.direction}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-20 md:top-0 inset-x-0 bottom-0 overflow-y-auto no-scrollbar flex flex-col"
      >
        <div className="flex-1 w-full flex flex-col">{children}</div>
        {withFooter && <Footer />}
      </motion.div>
    </AnimatePresence>
  );
}
