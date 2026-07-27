"use client";

import { lazy, Suspense } from "react";

const NotFoundScene = lazy(() =>
  import("./NotFoundScene").then((module) => ({ default: module.NotFoundScene })),
);

export function NotFoundSceneLazy() {
  return (
    <Suspense fallback={<div className="h-screen w-screen" />}>
      <NotFoundScene />
    </Suspense>
  );
}
