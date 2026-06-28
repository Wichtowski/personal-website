"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CatsModalProps {
  open: boolean;
  onClose: () => void;
}

export function CatsModal({ open, onClose }: CatsModalProps) {
  const { t } = useLanguage();

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Cats image"
            className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-[#06140d] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
            initial={{ scale: 0.96, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-emerald-100 transition hover:bg-white/10"
              aria-label="Close cats modal"
            >
              <X size={18} />
            </button>
            <div className="relative z-10 flex flex-col items-center gap-4 p-3 pt-12 sm:p-4 sm:pt-14">
              <motion.div
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="relative h-96 w-full overflow-hidden rounded-[1.5rem] border border-emerald-400/25 bg-emerald-400/10 sm:h-[32rem]"
              >
                <Image
                  src="/cats.png"
                  alt="Cats"
                  fill
                  sizes="(max-width: 640px) 100vw, 768px"
                  className="object-cover"
                />
              </motion.div>
              <div className="text-center">
                <p className="font-mono text-sm uppercase tracking-[0.24em] text-emerald-200/80">
                  {t.hero.listeningTo}
                </p>
                <h3 className="mt-2 font-mono text-xl font-semibold text-emerald-50">
                  {t.hero.idleTrack}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-200/70">
                  {t.hero.idleArtist}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
