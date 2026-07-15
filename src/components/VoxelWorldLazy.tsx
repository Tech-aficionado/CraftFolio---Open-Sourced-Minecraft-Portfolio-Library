import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";

const VoxelWorld = lazy(() => import("./VoxelWorld"));
type VoxelWorldProps = ComponentProps<typeof VoxelWorld>;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

/**
 * Loads Three.js only when a scene is close to the viewport. The generous
 * margin warms up terrain before it becomes visible without creating every
 * WebGL context on initial page load.
 */
export default function VoxelWorldLazy(props: VoxelWorldProps) {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary || !supportsWebGL()) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px", threshold: 0 }
    );

    observer.observe(boundary);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boundaryRef} className="pointer-events-none absolute inset-0" aria-hidden>
      {shouldLoad && (
        <Suspense fallback={null}>
          <VoxelWorld {...props} />
        </Suspense>
      )}
    </div>
  );
}
