export const RIPPLE_LIFETIME = 1600;
export const MAX_RIPPLES = 4;

export type DotPointer = { x: number; y: number; strength: number };
export type DotRipple = { x: number; y: number; born: number };

export function getDotDisplacement(
  x: number,
  y: number,
  pointer: DotPointer,
  ripples: readonly DotRipple[],
  now: number,
  scale: number,
) {
  if (scale <= 0) return { x: 0, y: 0 };

  const dx = x - pointer.x;
  const dy = y - pointer.y;
  const distance = Math.hypot(dx, dy);
  const hover = pointer.strength * Math.exp(-((distance / (scale * 0.14)) ** 2));
  let offsetX = (dx / Math.max(distance, 1)) * hover * scale * 0.07;
  let offsetY = (dy / Math.max(distance, 1)) * hover * scale * 0.07;

  for (const ripple of ripples) {
    const age = now - ripple.born;
    if (age < 0 || age >= RIPPLE_LIFETIME) continue;

    const rippleX = x - ripple.x;
    const rippleY = y - ripple.y;
    const rippleDistance = Math.hypot(rippleX, rippleY);
    const radius = (age / 1000) * scale * 0.7;
    const ring = Math.exp(-(((rippleDistance - radius) / (scale * 0.07)) ** 2));
    const push = ring * (1 - age / RIPPLE_LIFETIME) * scale * 0.1;
    offsetX += (rippleX / Math.max(rippleDistance, 1)) * push;
    offsetY += (rippleY / Math.max(rippleDistance, 1)) * push;
  }

  return { x: offsetX, y: offsetY };
}
