import type { CSSProperties, ReactNode } from "react";

type Props = {
  size?: number;
  /** lightest color — used for the top face */
  top: string;
  /** darkest color — used for the side faces */
  side: string;
  /** optional front color; defaults to a blend of top/side */
  front?: string;
  icon?: ReactNode;
  spin?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * A real 3D cube rendered with CSS transforms (transform-style: preserve-3d).
 * Six pixel-shaded faces give it that blocky Minecraft-ore look.
 */
export default function Cube3D({
  size = 72,
  top,
  side,
  front,
  icon,
  spin = false,
  className = "",
  style,
}: Props) {
  const half = size / 2;
  const frontColor = front ?? top;

  const face = (transform: string, bg: string): CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    background: bg,
    transform,
    boxShadow:
      "inset -6px -6px 0 rgba(0,0,0,0.28), inset 5px 5px 0 rgba(255,255,255,0.18)",
    imageRendering: "pixelated",
  });

  return (
    <div
      className={`scene-3d ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <div
        className={`preserve-3d relative h-full w-full ${
          spin ? "animate-spin3d" : ""
        }`}
        style={
          spin ? undefined : { transform: "rotateX(-22deg) rotateY(38deg)" }
        }
      >
        {/* front */}
        <div style={face(`translateZ(${half}px)`, frontColor)}>
          {icon && (
            <span
              className="flex h-full w-full items-center justify-center"
              style={{ fontSize: size * 0.42 }}
            >
              {icon}
            </span>
          )}
        </div>
        {/* back */}
        <div style={face(`rotateY(180deg) translateZ(${half}px)`, side)} />
        {/* right */}
        <div style={face(`rotateY(90deg) translateZ(${half}px)`, side)} />
        {/* left */}
        <div style={face(`rotateY(-90deg) translateZ(${half}px)`, side)} />
        {/* top */}
        <div style={face(`rotateX(90deg) translateZ(${half}px)`, top)} />
        {/* bottom */}
        <div
          style={face(
            `rotateX(-90deg) translateZ(${half}px)`,
            "rgba(0,0,0,0.6)"
          )}
        />
      </div>
    </div>
  );
}
