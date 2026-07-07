"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getNavDirection } from "@lib/navigation";
import { Footer } from "./Footer";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dir = getNavDirection();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ x: `${dir * 100}vw` }}
        animate={{ x: "0vw" }}
        exit={{ x: `${dir * -100}vw` }}
        transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-20 md:top-0 inset-x-0 bottom-0 overflow-y-auto no-scrollbar flex flex-col"
      >
        <div className="flex-1 w-full flex flex-col">{children}</div>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}
