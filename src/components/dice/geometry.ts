import {
  BoxGeometry,
  BufferGeometry,
  DodecahedronGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
  PolyhedronGeometry,
  TetrahedronGeometry,
  Vector3,
} from "three";
import { DieGeometry } from "./types";
import { D10_FACE_INDICES, D10_RADIUS } from "./consts";

export function createD10Points(radius = D10_RADIUS) {
  const raw = [new Vector3(0, 1, 0), new Vector3(0, -1, 0)];

  for (let index = 0; index < 10; index += 1) {
    const angle = (index * Math.PI * 2) / 10;

    raw.push(new Vector3(-Math.cos(angle), 0.105 * (index % 2 ? 1 : -1), -Math.sin(angle)));
  }

  return raw.map((point) => point.normalize().multiplyScalar(radius));
}

export function createPentagonalTrapezohedronGeometry() {
  const vertices = createD10Points(1).flatMap((point) => [point.x, point.y, point.z]);

  return new PolyhedronGeometry(vertices, [...D10_FACE_INDICES], D10_RADIUS, 0);
}

export function createGeometry(kind: DieGeometry) {
  switch (kind) {
    case "tetra":
      return new TetrahedronGeometry(0.82, 0);
    case "box":
      return new BoxGeometry(1, 1, 1);
    case "octa":
      return new OctahedronGeometry(0.84, 0);
    case "pentagonalTrapezohedron":
      return createPentagonalTrapezohedronGeometry();
    case "dodeca":
      return new DodecahedronGeometry(0.86, 0);
    case "icosa":
      return new IcosahedronGeometry(0.88, 0);
  }
}

export function extractFaces(geometry: BufferGeometry) {
  const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const positions = nonIndexed.getAttribute("position");
  const faces = new Map<string, { normal: Vector3; centerSum: Vector3; count: number }>();
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  const normal = new Vector3();
  const center = new Vector3();

  for (let index = 0; index < positions.count; index += 3) {
    a.fromBufferAttribute(positions, index);
    b.fromBufferAttribute(positions, index + 1);
    c.fromBufferAttribute(positions, index + 2);

    normal.subVectors(b, a).cross(new Vector3().subVectors(c, a)).normalize();
    center
      .copy(a)
      .add(b)
      .add(c)
      .multiplyScalar(1 / 3);

    const planeDistance = normal.dot(a);
    const key = [
      Math.round(normal.x * 1000),
      Math.round(normal.y * 1000),
      Math.round(normal.z * 1000),
      Math.round(planeDistance * 1000),
    ].join(":");

    const existing = faces.get(key);
    if (existing) {
      existing.centerSum.add(center);
      existing.count += 1;
    } else {
      faces.set(key, {
        normal: normal.clone(),
        centerSum: center.clone(),
        count: 1,
      });
    }
  }

  return Array.from(faces.values())
    .map((face) => ({
      center: face.centerSum.multiplyScalar(1 / face.count),
      normal: face.normal.clone().normalize(),
    }))
    .sort((left, right) => {
      if (Math.abs(left.center.y - right.center.y) > 0.08) {
        return right.center.y - left.center.y;
      }

      const leftAngle = Math.atan2(left.center.z, left.center.x);
      const rightAngle = Math.atan2(right.center.z, right.center.x);
      return leftAngle - rightAngle;
    });
}

export function extractD10Faces() {
  const points = createD10Points(D10_RADIUS);
  function createTriangleFace(first: Vector3, second: Vector3, third: Vector3) {
    const center = first
      .clone()
      .add(second)
      .add(third)
      .multiplyScalar(1 / 3);
    const normal = second.clone().sub(first).cross(third.clone().sub(first)).normalize();

    if (normal.dot(center) < 0) {
      normal.multiplyScalar(-1);
    }

    return { center, normal };
  }

  const topFaces = Array.from({ length: 10 }, (_, index) =>
    createTriangleFace(points[0], points[2 + index], points[2 + ((index + 1) % 10)]),
  );

  const bottomFaces = Array.from({ length: 10 }, (_, index) =>
    createTriangleFace(points[1], points[2 + ((index + 1) % 10)], points[2 + index]),
  );

  return Array.from({ length: 10 }, (_, index) =>
    index % 2 === 0 ? topFaces[index] : bottomFaces[index],
  );
}
