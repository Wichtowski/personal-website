"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useLanguage } from "@/context/LanguageContext";
import { DICE, TICKER_SEPARATOR } from "../dice/consts";
import { ThemeMode } from "../dice/types";
import { DiceStage } from "../dice/DiceStage";
import { useThemeColors } from "../dice/diceThemeColors";

export function NotFoundScene() {
  const [mode, setMode] = useState<ThemeMode | null>(null);
  const [diceTotal, setDiceTotal] = useState<number | null>(null);
  const [diceSettled, setDiceSettled] = useState(false);
  const [diceValues, setDiceValues] = useState<number[] | null>(null);
  const colors = useThemeColors(mode ?? "dark");
  const { t } = useLanguage();

  useEffect(() => {
    const syncMode = () => {
      setMode(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    const syncFooterVisibility = () => {
      document.body.classList.add("not-found-page");
    };

    const timeout = setTimeout(syncMode, 0);
    syncFooterVisibility();
    const observer = new MutationObserver(syncMode);

    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      document.body.classList.remove("not-found-page");
    };
  }, []);

  return (
    <div className="not-found-scene relative h-full w-full overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-85">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/14 blur-3xl dark:bg-primary/12" />
        <div className="absolute right-0 top-32 h-64 w-64 rounded-full bg-black/4 blur-3xl dark:bg-white/6" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/10" />
      </div>

      <div className="absolute inset-x-0 top-[12%] z-20 overflow-hidden pointer-events-none select-none">
        <div className="flex w-max animate-[ticker_64s_linear_infinite] will-change-transform">
          {Array.from({ length: 2 }).map((_, trackIndex) => (
            <div key={trackIndex} className="flex w-max items-center">
              {Array.from({ length: 12 }).map((__, itemIndex) => (
                <span key={`${trackIndex}-${itemIndex}`} className="flex items-center">
                  <span className="px-4 text-[clamp(3.6rem,18vh,12rem)] font-black uppercase tracking-[0.08em] leading-none text-foreground/82 [text-shadow:0_0_18px_color-mix(in_srgb,var(--foreground)_8%,transparent)] dark:[text-shadow:0_0_24px_color-mix(in_srgb,var(--foreground)_14%,transparent)]">
                    {t.notFound.ticker}
                  </span>
                  <span className="px-1 text-[clamp(1.2rem,5vh,3rem)] font-black leading-none text-foreground/30">
                    {TICKER_SEPARATOR}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-30 flex h-full flex-col items-center justify-center px-6 pt-32 pointer-events-none sm:pt-36 md:pt-28">
        <div className="max-w-2xl text-center pointer-events-auto select-text">
          <p className="text-xs font-mono uppercase tracking-[0.45em] text-primary/80 select-none">
            {t.notFound.eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground select-none sm:text-4xl md:text-5xl">
            {t.notFound.title}
          </h1>
          <p className="mt-4 text-sm leading-6 text-foreground/72 select-none sm:text-base">
            {t.notFound.description}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="select-none pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/72 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-md transition hover:border-primary/40 hover:bg-primary/10 dark:bg-white/8 dark:hover:bg-primary/15"
            >
              <ArrowLeft size={16} />
              {t.notFound.backHome}
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-4 top-1/2 z-30 w-[min(11rem,calc(100vw-2rem))] -translate-y-1/2 sm:left-6 lg:left-8">
        <div className="rounded-[1.25rem] border border-white/10 bg-black/52 px-3 py-3 text-left shadow-[0_14px_42px_rgba(0,0,0,0.24)] backdrop-blur-xl dark:bg-white/8">
          <p className="text-[0.56rem] font-mono uppercase tracking-[0.38em] text-primary/80">
            {t.notFound.rollBreakdown}
          </p>
          <div className="mt-2 space-y-1.5">
            {DICE.map((die, index) => {
              const value = diceSettled && diceValues ? diceValues[index] : null;

              return (
                <div
                  key={die.kind}
                  className="flex items-center justify-between gap-2 text-[0.7rem]"
                >
                  <span className="font-mono text-foreground/62">{die.kind.toUpperCase()}</span>
                  <span className="text-sm font-semibold tracking-tight text-foreground">
                    {value ?? "…"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-2 rounded-[1.25rem] border border-white/10 bg-black/52 px-3 py-3 text-left shadow-[0_14px_42px_rgba(0,0,0,0.24)] backdrop-blur-xl dark:bg-white/8">
          <p className="text-[0.56rem] font-mono uppercase tracking-[0.38em] text-primary/80">
            {t.notFound.rollLabel}
          </p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <span className="text-[0.68rem] leading-4 text-foreground/62">
              {diceSettled ? "" : t.notFound.rollPending}
            </span>
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              {diceSettled && diceTotal !== null ? diceTotal : "…"}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        {mode ? (
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 1.5, 13], fov: 38, near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => {
              gl.setClearColor(mode === "dark" ? "#050507" : "#eee5f6", 1);
            }}
            style={{ backgroundColor: mode === "dark" ? "#050507" : "#eee5f6" }}
          >
            <DiceStage
              mode={mode}
              colors={colors}
              onTotalChange={setDiceTotal}
              onSettledChange={setDiceSettled}
              onValuesChange={setDiceValues}
            />
          </Canvas>
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
    </div>
  );
}
