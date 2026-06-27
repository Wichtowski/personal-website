import { Quaternion } from "three";
import { RapierRigidBody } from "@react-three/rapier";
import { DieSpec } from "./types";
import { FACE_VALUES, WORLD_UP } from "./consts";
import { createGeometry, extractD10Faces, extractFaces } from "./geometry";

export function getFacesForSpec(spec: DieSpec) {
  const geometry = createGeometry(spec.geometry);

  return spec.kind === "d10" ? extractD10Faces() : extractFaces(geometry);
}

export function getTopValueForBody(body: RapierRigidBody, spec: DieSpec) {
  const rotation = body.rotation();
  const quaternion = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);

  const faces = getFacesForSpec(spec);
  const values = FACE_VALUES[spec.kind];

  let bestIndex = 0;
  let bestDot = -Infinity;

  faces.slice(0, values.length).forEach((face, index) => {
    const worldNormal = face.normal.clone().applyQuaternion(quaternion);
    const dot = worldNormal.dot(WORLD_UP);

    if (dot > bestDot) {
      bestDot = dot;
      bestIndex = index;
    }
  });

  return values[bestIndex];
}
