import { Plane, Vector3 } from "three";

export type ThemeMode = "light" | "dark";
export type DieKind = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";
export type DieGeometry = "tetra" | "box" | "octa" | "pentagonalTrapezohedron" | "dodeca" | "icosa";

export type DieSpec = {
  kind: DieKind;
  size: number;
  color: string;
  roughness: number;
  geometry: DieGeometry;
  labelSize: number;
};

export type DragState = {
  activeId: number | null;
  pointerId: number | null;
  offset: Vector3;
  plane: Plane;
  lastPoint: Vector3;
  lastTime: number;
  velocity: Vector3;
};
