import { useMemo } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { FrontSide, DoubleSide, Color, Quaternion } from "three";
import { DieSpec } from "./types";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { createGeometry, extractD10Faces, extractFaces } from "./geometry";
import { FACE_VALUES, FORWARD } from "./consts";
import { useFaceTextures } from "@/hooks/useFaceTextures";

export function Die({
  spec,
  initialPosition,
  bodyRef,
  draggingId,
  dieId,
  onDragStart,
}: {
  spec: DieSpec;
  initialPosition: [number, number, number];
  bodyRef: (instance: RapierRigidBody | null) => void;
  draggingId: number | null;
  dieId: number;
  onDragStart: (id: number, event: ThreeEvent<PointerEvent>) => void;
}) {
  const isDragging = draggingId === dieId;
  const geometry = useMemo(() => createGeometry(spec.geometry), [spec.geometry]);
  const faces = useMemo(
    () => (spec.kind === "d10" ? extractD10Faces() : extractFaces(geometry)),
    [geometry, spec.kind],
  );
  const values = FACE_VALUES[spec.kind];
  const textures = useFaceTextures(values);

  return (
    <RigidBody
      ref={bodyRef}
      type={isDragging ? "kinematicPosition" : "dynamic"}
      colliders="hull"
      restitution={0.82}
      friction={0.76}
      linearDamping={0.08}
      angularDamping={0.06}
      canSleep={false}
      ccd
      mass={1.2}
      position={initialPosition}
    >
      <mesh
        castShadow
        receiveShadow
        scale={[spec.size, spec.size, spec.size]}
        onPointerDown={(event) => onDragStart(dieId, event)}
      >
        <primitive attach="geometry" object={geometry} />
        <meshStandardMaterial
          color={spec.color}
          roughness={spec.roughness}
          metalness={0.15}
          emissive={new Color(spec.color)}
          emissiveIntensity={isDragging ? 0.14 : 0.05}
        />

        {faces.slice(0, values.length).map((face, index) => {
          const labelOffset = spec.kind === "d10" ? 0.02 : 0.025;
          const labelPosition = face.center
            .clone()
            .add(face.normal.clone().multiplyScalar(labelOffset));
          const labelQuaternion = new Quaternion().setFromUnitVectors(FORWARD, face.normal);
          const texture = textures[index];

          if (!texture) {
            return null;
          }

          return (
            <mesh
              key={`${spec.kind}-${index}`}
              position={[labelPosition.x, labelPosition.y, labelPosition.z]}
              quaternion={labelQuaternion}
              renderOrder={2}
            >
              <planeGeometry args={[spec.labelSize, spec.labelSize]} />
              <meshBasicMaterial
                map={texture}
                side={spec.kind === "d10" ? FrontSide : DoubleSide}
                transparent
                opacity={0.98}
                depthWrite={false}
                toneMapped={false}
                polygonOffset
                polygonOffsetFactor={spec.kind === "d10" ? -2 : -8}
                polygonOffsetUnits={spec.kind === "d10" ? -2 : -8}
              />
            </mesh>
          );
        })}
      </mesh>
    </RigidBody>
  );
}
