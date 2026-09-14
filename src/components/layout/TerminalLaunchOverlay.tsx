"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const launchLines = ["> request /terminal", "> compiling interactive shell", "> access granted"];

export function TerminalLaunchOverlay({ open }: { open: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="terminal-launch"
          initial={
            shouldReduceMotion ? { opacity: 0 } : { clipPath: "circle(0% at 3.5rem 2.25rem)" }
          }
          animate={
            shouldReduceMotion ? { opacity: 1 } : { clipPath: "circle(160% at 3.5rem 2.25rem)" }
          }
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.15 : 0.82, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#030806] text-emerald-300"
          role="status"
          aria-live="assertive"
          aria-label="Opening interactive terminal"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: 0.45 }}
            className="w-full max-w-xl px-8 font-mono"
          >
            <pre
              className="mb-8 text-center text-sm leading-tight text-primary sm:text-lg"
              aria-hidden="true"
            >{String.raw`┌──────────────────────────┐
│  $ ./launch-terminal.sh  │
└──────────────────────────┘`}</pre>
            <div className="space-y-2 text-xs sm:text-sm">
              {launchLines.map((line, index) => (
                <motion.p
                  key={line}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.3 + index * 0.14 }}
                >
                  {line}
                  {index === launchLines.length - 1 ? (
                    <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-emerald-300 align-middle" />
                  ) : null}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
