import { useEffect, useMemo, useRef, useState } from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Physics, CuboidCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { MathUtils, Plane, PerspectiveCamera, Vector2, Vector3 } from "three";
import { DICE } from "../dice/consts";
import { ThemeMode, DragState } from "../dice/types";
import { Die } from "../dice/Die";
import { getTopValueForBody } from "./topValue";
import { useThemeColors } from "./diceThemeColors";

export function DiceStage({
  mode,
  colors,
  onTotalChange,
  onSettledChange,
  onValuesChange,
}: {
  mode: ThemeMode;
  colors: ReturnType<typeof useThemeColors>;
  onTotalChange?: (total: number | null) => void;
  onSettledChange?: (isSettled: boolean) => void;
  onValuesChange?: (values: number[] | null) => void;
}) {
  const bodyRefs = useRef<Record<number, RapierRigidBody | null>>({});
  const dragRef = useRef<DragState>({
    activeId: null,
    pointerId: null,
    offset: new Vector3(),
    plane: new Plane(),
    lastPoint: new Vector3(),
    lastTime: 0,
    velocity: new Vector3(),
  });
  const { camera, size, raycaster } = useThree();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const pointerNdc = useRef(new Vector2());
  const dragTarget = useRef(new Vector3());
  const stillSinceRef = useRef<number | null>(null);
  const settledRef = useRef(false);
  const totalRef = useRef<number | null>(null);
  const valuesRef = useRef<number[] | null>(null);
  const perspectiveCamera = camera as PerspectiveCamera;
  const distanceToOrigin = Math.abs(perspectiveCamera.position.z);
  const halfVisibleHeight = Math.tan((perspectiveCamera.fov * Math.PI) / 360) * distanceToOrigin;
  const playHalfWidth = Math.max(4.4, halfVisibleHeight * (size.width / size.height) * 0.86);
  const playBackDepth = Math.max(2.8, Math.min(playHalfWidth * 0.78, 4.2));
  const screenWallInset = 1.1;
  const playFrontDepth = Math.max(1.75, playBackDepth - screenWallInset);
  const playDepthCenter = (playFrontDepth - playBackDepth) / 2;
  const playDepthHalfExtent = (playBackDepth + playFrontDepth) / 2;
  const playFloor = -4.2;
  const playWallHeight = 6;
  const playCeiling = 9.2;
  const wallThickness = 0.4;
  const dragPadding = 0.85;
  const rollingLinearThreshold = 0.14;
  const rollingAngularThreshold = 0.55;
  const settleDelayMs = 240;
  const spawnPositions = useMemo<[number, number, number][]>(() => {
    const safeLeft = -playHalfWidth + 0.96;
    const safeRight = playHalfWidth - 1.0;
    const safeBack = -playBackDepth + 1.1;
    const safeFront = playFrontDepth - 1.1;
    const screenForwardBias = 0.12;
    const middleX = MathUtils.clamp(0, safeLeft, safeRight);
    const quarterLeftX = MathUtils.lerp(safeLeft, safeRight, 0.28);
    const quarterRightX = MathUtils.lerp(safeLeft, safeRight, 0.72);
    const backZ = MathUtils.lerp(safeBack, safeFront, 0.34 + screenForwardBias);
    const middleBackZ = MathUtils.lerp(safeBack, safeFront, 0.52 + screenForwardBias);
    const middleFrontZ = MathUtils.lerp(safeBack, safeFront, 0.7 + screenForwardBias);
    const frontZ = MathUtils.lerp(safeBack, safeFront, 0.88);

    return [
      [quarterLeftX, 4.2, backZ],
      [middleX, 5.0, middleBackZ],
      [quarterRightX, 5.8, backZ],
      [safeLeft + 0.45, 6.6, middleFrontZ],
      [safeRight - 0.45, 7.4, middleFrontZ],
      [middleX, 8.2, frontZ],
    ];
  }, [playBackDepth, playFrontDepth, playHalfWidth]);

  useFrame(() => {
    const bodies = DICE.reduce<Array<{ spec: (typeof DICE)[number]; body: RapierRigidBody }>>(
      (accumulator, spec, index) => {
        const body = bodyRefs.current[index];

        if (body) {
          accumulator.push({ spec, body });
        }

        return accumulator;
      },
      [],
    );

    if (bodies.length === 0) {
      return;
    }

    const isStill =
      draggingId === null &&
      bodies.every(({ body }) => {
        const linearVelocity = body.linvel();
        const angularVelocity = body.angvel();

        return (
          Math.hypot(linearVelocity.x, linearVelocity.y, linearVelocity.z) <=
            rollingLinearThreshold &&
          Math.hypot(angularVelocity.x, angularVelocity.y, angularVelocity.z) <=
            rollingAngularThreshold
        );
      });

    const now = performance.now();

    if (!isStill) {
      stillSinceRef.current = null;

      if (settledRef.current) {
        settledRef.current = false;
        onSettledChange?.(false);
      }

      if (totalRef.current !== null) {
        totalRef.current = null;
        onTotalChange?.(null);
      }

      if (valuesRef.current !== null) {
        valuesRef.current = null;
        onValuesChange?.(null);
      }

      return;
    }

    if (stillSinceRef.current === null) {
      stillSinceRef.current = now;
      return;
    }

    if (now - stillSinceRef.current < settleDelayMs) {
      return;
    }

    const nextValues = bodies.map(({ spec, body }) => getTopValueForBody(body, spec));
    const nextTotal = nextValues.reduce((sum, value) => sum + value, 0);

    if (!settledRef.current) {
      settledRef.current = true;
      onSettledChange?.(true);
    }

    if (totalRef.current !== nextTotal) {
      totalRef.current = nextTotal;
      onTotalChange?.(nextTotal);
    }

    if (
      valuesRef.current === null ||
      valuesRef.current.length !== nextValues.length ||
      valuesRef.current.some((value, index) => value !== nextValues[index])
    ) {
      valuesRef.current = nextValues;
      onValuesChange?.(nextValues);
    }
  });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.activeId === null) {
        return;
      }

      const body = bodyRefs.current[drag.activeId];
      if (!body) {
        return;
      }

      pointerNdc.current.set(
        (event.clientX / size.width) * 2 - 1,
        -(event.clientY / size.height) * 2 + 1,
      );

      raycaster.setFromCamera(pointerNdc.current, camera);
      if (!raycaster.ray.intersectPlane(drag.plane, dragTarget.current)) {
        return;
      }

      const next = dragTarget.current.clone().sub(drag.offset);
      next.x = MathUtils.clamp(next.x, -playHalfWidth + dragPadding, playHalfWidth - dragPadding);
      next.y = MathUtils.clamp(next.y, playFloor + 1.2, playCeiling - 1.1);
      next.z = MathUtils.clamp(next.z, -playBackDepth + dragPadding, playFrontDepth - dragPadding);
      body.setNextKinematicTranslation(next);

      const now = performance.now();
      const delta = Math.max(1, now - drag.lastTime);
      drag.velocity
        .copy(dragTarget.current)
        .sub(drag.lastPoint)
        .multiplyScalar(1000 / delta);
      drag.lastPoint.copy(dragTarget.current);
      drag.lastTime = now;
    };

    const handleWheel = (event: WheelEvent) => {
      const drag = dragRef.current;
      if (drag.activeId === null) {
        return;
      }

      const body = bodyRefs.current[drag.activeId];
      if (!body) {
        return;
      }

      event.preventDefault();

      const position = body.translation();
      const nextZ = MathUtils.clamp(
        position.z - event.deltaY * 0.005,
        -playBackDepth + dragPadding,
        playFrontDepth - dragPadding,
      );
      const currentZ = dragTarget.current.z;

      body.setNextKinematicTranslation({
        x: position.x,
        y: position.y,
        z: nextZ,
      });
      drag.offset.z = currentZ - nextZ;
      drag.lastPoint.copy(dragTarget.current);
      drag.lastTime = performance.now();
      drag.velocity.set(0, 0, 0);
    };

    const handleUp = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.activeId === null || drag.pointerId !== event.pointerId) {
        return;
      }

      const body = bodyRefs.current[drag.activeId];
      if (body) {
        body.setLinvel(
          {
            x: drag.velocity.x * 0.045,
            y: drag.velocity.y * 0.045,
            z: drag.velocity.z * 0.045,
          },
          true,
        );
        body.setAngvel(
          {
            x: drag.velocity.y * 0.018,
            y: drag.velocity.x * 0.018,
            z: (drag.velocity.x - drag.velocity.y) * 0.01,
          },
          true,
        );
      }

      dragRef.current = {
        activeId: null,
        pointerId: null,
        offset: new Vector3(),
        plane: new Plane(),
        lastPoint: new Vector3(),
        lastTime: 0,
        velocity: new Vector3(),
      };
      setDraggingId(null);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [
    camera,
    playBackDepth,
    playFloor,
    playFrontDepth,
    playHalfWidth,
    playCeiling,
    playWallHeight,
    raycaster,
    size.height,
    size.width,
  ]);

  const handleDragStart = (id: number, event: ThreeEvent<PointerEvent>) => {
    const body = bodyRefs.current[id];
    if (!body) {
      return;
    }

    event.stopPropagation();
    setDraggingId(id);

    const point = event.point.clone();
    const position = body.translation();
    const bodyCenter = new Vector3(position.x, position.y, position.z);
    const drag = dragRef.current;
    const cameraDirection = camera.getWorldDirection(new Vector3()).normalize();

    drag.activeId = id;
    drag.pointerId = event.pointerId;
    drag.offset.copy(point).sub(bodyCenter);
    drag.plane.setFromNormalAndCoplanarPoint(cameraDirection, point);
    drag.lastPoint.copy(point);
    drag.lastTime = performance.now();
    drag.velocity.set(0, 0, 0);
  };

  return (
    <>
      <color attach="background" args={[colors.background]} />
      <fog attach="fog" args={[colors.fog, 10, 28]} />

      <ambientLight intensity={mode === "dark" ? 1.25 : 1.5} />
      <directionalLight position={[8, 12, 10]} intensity={1.8} color={colors.foreground} />
      <directionalLight position={[-10, -2, 6]} intensity={0.8} color={colors.accent} />
      <pointLight position={[0, 6, 8]} intensity={1.6} color={colors.accent} distance={28} />

      <Physics gravity={[0, -10.8, 0]} colliders={false}>
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider
            args={[playHalfWidth, 0.4, playDepthHalfExtent]}
            position={[0, playFloor, playDepthCenter]}
          />
          <CuboidCollider
            args={[wallThickness, playWallHeight, playDepthHalfExtent]}
            position={[-playHalfWidth - wallThickness, 1.8, playDepthCenter]}
          />
          <CuboidCollider
            args={[wallThickness, playWallHeight, playDepthHalfExtent]}
            position={[playHalfWidth + wallThickness, 1.8, playDepthCenter]}
          />
          <CuboidCollider
            args={[playHalfWidth, playWallHeight, wallThickness]}
            position={[0, 1.8, -playBackDepth - wallThickness]}
          />
          <CuboidCollider
            args={[playHalfWidth, playWallHeight, wallThickness]}
            position={[0, 1.8, playFrontDepth + wallThickness]}
          />
          <CuboidCollider
            args={[playHalfWidth, wallThickness, playDepthHalfExtent]}
            position={[0, playCeiling + wallThickness, playDepthCenter]}
          />
        </RigidBody>

        {DICE.map((spec, index) => (
          <Die
            key={spec.kind}
            spec={spec}
            initialPosition={spawnPositions[index]}
            dieId={index}
            bodyRef={(instance) => {
              bodyRefs.current[index] = instance;
            }}
            draggingId={draggingId}
            onDragStart={handleDragStart}
          />
        ))}
      </Physics>
    </>
  );
}
