import { Vector3 } from "three";
import { DieKind, DieSpec } from "./types";

export const TICKER_SEPARATOR = "✦";
export const FORWARD = new Vector3(0, 0, 1);
export const D10_RADIUS = 0.48;
export const D10_FACE_INDICES = [
  0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 7, 0, 7, 8, 0, 8, 9, 0, 9, 10, 0, 10, 11, 0, 11, 2, 1,
  3, 2, 1, 4, 3, 1, 5, 4, 1, 6, 5, 1, 7, 6, 1, 8, 7, 1, 9, 8, 1, 10, 9, 1, 11, 10, 1, 2, 11,
] as const;

export const FACE_VALUES: Record<DieKind, number[]> = {
  d4: [1, 2, 3, 4],
  d6: [1, 2, 3, 4, 5, 6],
  d8: [1, 2, 3, 4, 5, 6, 7, 8],
  d10: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  d12: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  d20: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
};

export const WORLD_UP = new Vector3(0, 1, 0);

export const DICE: DieSpec[] = [
  { kind: "d4", size: 0.95, color: "#2563eb", roughness: 0.36, geometry: "tetra", labelSize: 0.4 },
  { kind: "d6", size: 1.05, color: "#dc2626", roughness: 0.22, geometry: "box", labelSize: 0.45 },
  { kind: "d8", size: 1.02, color: "#059669", roughness: 0.34, geometry: "octa", labelSize: 0.4 },
  {
    kind: "d10",
    size: 1.25,
    color: "#d97706",
    roughness: 0.3,
    geometry: "pentagonalTrapezohedron",
    labelSize: 0.32,
  },
  {
    kind: "d12",
    size: 1.0,
    color: "#7c3aed",
    roughness: 0.34,
    geometry: "dodeca",
    labelSize: 0.4,
  },
  {
    kind: "d20",
    size: 1.14,
    color: "#0f766e",
    roughness: 0.28,
    geometry: "icosa",
    labelSize: 0.32,
  },
];
