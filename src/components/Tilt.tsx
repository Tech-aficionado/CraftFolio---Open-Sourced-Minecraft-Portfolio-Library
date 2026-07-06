import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
  /** how far the content pops toward the viewer on hover */
  pop?: number;
};

/**
 * Wraps content in a perspective scene and tilts it in 3D toward the cursor.
 * Adds a subtle "lift" (translateZ) so cards feel like they have depth.
 */
export default function Tilt({ children, className = "", max = 10, pop = 30 }: Props) {
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg) translateZ(${pop}px)`;
  };

  const reset = () => {
    const el = innerRef.current;
    if (el) el.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  return (
    <div className={`scene-3d ${className}`}>
      <div
        ref={innerRef}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className="preserve-3d h-full transition-transform duration-200 ease-out"
      >
        {children}
      </div>
    </div>
  );
}
