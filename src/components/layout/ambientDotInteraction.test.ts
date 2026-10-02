import assert from "node:assert/strict";
import { test } from "node:test";
import { getDotDisplacement, RIPPLE_LIFETIME } from "./ambientDotInteraction";

test("dots move away from the pointer and expanding ripples fade out", () => {
  const pointer = { x: 0, y: 0, strength: 1 };
  const idle = { ...pointer, strength: 0 };
  const ripple = { x: 0, y: 0, born: 1000 };
  const push = getDotDisplacement(70, 0, pointer, [], 1000, 1000);
  assert.ok(push.x > 0);
  assert.equal(push.y, 0);
  assert.ok(getDotDisplacement(-70, 0, pointer, [], 1000, 1000).x < 0);
  assert.ok(getDotDisplacement(700, 0, pointer, [], 1000, 1000).x < push.x / 100);
  assert.deepEqual(getDotDisplacement(0, 0, pointer, [ripple], 1000, 1000), { x: 0, y: 0 });
  assert.deepEqual(getDotDisplacement(70, 0, idle, [], 1000, 1000), { x: 0, y: 0 });

  const wave = getDotDisplacement(350, 0, idle, [ripple], 1500, 1000);
  assert.ok(wave.x > 60);
  assert.equal(wave.y, 0);
  assert.ok(getDotDisplacement(350, 0, idle, [ripple], 1000, 1000).x < wave.x / 100);
  assert.deepEqual(
    getDotDisplacement(350, 0, idle, [ripple], ripple.born + RIPPLE_LIFETIME, 1000),
    { x: 0, y: 0 },
  );
  assert.deepEqual(getDotDisplacement(350, 0, idle, [ripple], 999, 1000), { x: 0, y: 0 });
  assert.deepEqual(getDotDisplacement(70, 0, pointer, [ripple], 1500, 0), { x: 0, y: 0 });
});
