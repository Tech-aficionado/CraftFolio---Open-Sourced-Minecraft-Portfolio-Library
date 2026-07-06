import { lazy, Suspense } from "react";
import type { ComponentProps } from "react";

const VoxelWorld = lazy(() => import("./VoxelWorld"));

// Lazy wrapper so Three.js loads in its own chunk, off the critical path.
export default function VoxelWorldLazy(props: ComponentProps<typeof VoxelWorld>) {
  return (
    <Suspense fallback={null}>
      <VoxelWorld {...props} />
    </Suspense>
  );
}
