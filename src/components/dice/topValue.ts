import { Quaternion } from "three";
import { RapierRigidBody } from "@react-three/rapier";
import { DieSpec } from "./types";
import { FACE_VALUES, WORLD_UP } from "./consts";
import { createGeometry, extractD10Faces, extractFaces } from "./geometry";

const faceCache = new Map<DieSpec["kind"], ReturnType<typeof extractFaces>>();

export function getFacesForSpec(spec: DieSpec) {
  const cachedFaces = faceCache.get(spec.kind);
  if (cachedFaces) {
    return cachedFaces;
  }

  const faces =
    spec.kind === "d10"
      ? extractD10Faces()
      : (() => {
          const geometry = createGeometry(spec.geometry);
          const extractedFaces = extractFaces(geometry);

          geometry.dispose();
          return extractedFaces;
        })();

  faceCache.set(spec.kind, faces);

  return faces;
}

export function getTopValueForBody(body: RapierRigidBody, spec: DieSpec) {
  const rotation = body.rotation();
  const quaternion = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);

  const faces = getFacesForSpec(spec);
  const values = FACE_VALUES[spec.kind];
  const takeDownValue = spec.kind === "d4";

  let bestIndex = 0;
  let bestDot = takeDownValue ? Infinity : -Infinity;

  faces.slice(0, values.length).forEach((face, index) => {
    const worldNormal = face.normal.clone().applyQuaternion(quaternion);
    const dot = worldNormal.dot(WORLD_UP);

    if ((takeDownValue && dot < bestDot) || (!takeDownValue && dot > bestDot)) {
      bestDot = dot;
      bestIndex = index;
    }
  });

  return values[bestIndex];
}
