"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getNavDirection } from "@/lib/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
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
        className="absolute inset-0 overflow-hidden"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
