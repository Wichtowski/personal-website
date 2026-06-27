"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { CanvasTexture } from "three";

export function useFaceTextures(values: number[]) {
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === "light";

  return useMemo(
    () =>
      values.map((value) => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return undefined;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = isLightTheme ? "#fafafa" : "#111111";
        ctx.font = "bold 154px Geist, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(value), 128, 132);

        const texture = new CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
      }),
    [isLightTheme, values],
  );
}
