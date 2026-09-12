"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TAU = Math.PI * 2;
const MAX_DEVICE_PIXEL_RATIO = 1.5;

function parseHexColor(color: string) {
  const normalized = color.trim().replace("#", "");
  const hex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized;

  if (!/^[\da-f]{6}$/i.test(hex)) return [139, 92, 246] as const;

  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ] as const;
}

export function AmbientDotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let reducedMotion = reducedMotionQuery.matches;
    let primaryColor = parseHexColor(
      getComputedStyle(document.documentElement).getPropertyValue("--primary"),
    );

    const draw = (elapsed = 0) => {
      const time = reducedMotion ? 2.4 : elapsed / 1000;
      const isDark = document.documentElement.classList.contains("dark");
      const spacing = width < 640 ? 13 : 16;
      const columns = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const centerX = width * 0.5;
      const centerY = Math.min(height * 0.32, 330);
      const [red, green, blue] = primaryColor;

      context.clearRect(0, 0, width, height);
      context.fillStyle = `rgb(${red} ${green} ${blue})`;

      for (let row = -1; row < rows; row += 1) {
        for (let column = -1; column < columns; column += 1) {
          const baseX = column * spacing;
          const baseY = row * spacing;
          const normalizedX = baseX / Math.max(width, 1);
          const normalizedY = baseY / Math.max(height, 1);
          const wave =
            Math.sin(normalizedX * 8.5 + time * 0.42) * 0.55 +
            Math.cos(normalizedY * 7 - time * 0.31) * 0.45;
          const sweep = Math.sin((normalizedX + normalizedY) * 5.5 - time * 0.48);
          const offsetX = Math.sin(normalizedY * 7.5 + time * 0.34) * spacing * 0.7;
          const offsetY = Math.cos(normalizedX * 6 - time * 0.28) * spacing * 0.55;
          const x = baseX + offsetX;
          const y = baseY + offsetY;
          const distanceFromContent = Math.hypot(
            (x - centerX) / Math.max(width * 0.48, 1),
            (y - centerY) / 270,
          );
          const contentFade = Math.min(Math.max((distanceFromContent - 0.38) / 0.72, 0), 1);
          const edgeFade = Math.min(x / 100, (width - x) / 100, y / 90, (height - y) / 140, 1);
          const energy = Math.max(0, 0.5 + wave * 0.32 + sweep * 0.18);
          const opacity = energy * contentFade * Math.max(edgeFade, 0) * (isDark ? 0.42 : 0.24);

          if (opacity < 0.018) continue;

          const radius = 0.7 + energy * (isDark ? 1.15 : 0.9);
          context.globalAlpha = opacity;
          context.beginPath();
          context.arc(x, y, radius, 0, TAU);
          context.fill();
        }
      }

      context.globalAlpha = 1;
    };

    const render = (elapsed: number) => {
      draw(elapsed);
      if (!reducedMotion && !document.hidden) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    const start = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(render);
    };

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio, MAX_DEVICE_PIXEL_RATIO);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      start();
    };

    const handleMotionPreference = () => {
      reducedMotion = reducedMotionQuery.matches;
      start();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
      } else {
        start();
      }
    };

    const themeObserver = new MutationObserver(() => {
      primaryColor = parseHexColor(
        getComputedStyle(document.documentElement).getPropertyValue("--primary"),
      );
      start();
    });
    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    reducedMotionQuery.addEventListener("change", handleMotionPreference);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    resize();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", handleMotionPreference);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden="true"
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.025 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-0 z-0 size-full"
    />
  );
}
