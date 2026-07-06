type HeartProps = {
  filled?: boolean;
  half?: boolean;
  size?: number;
};

// Pixel-art Minecraft heart rendered with SVG rects.
export default function Heart({ filled = true, half = false, size = 16 }: HeartProps) {
  const red = "#e4222b";
  const redDark = "#8a1119";
  const shine = "#ff7d84";
  const empty = "#3a1416";
  const base = filled ? red : empty;
  const dark = filled ? redDark : "#25090b";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 9 9"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* heart shape rows */}
      <g fill={base}>
        <rect x="1" y="1" width="2" height="1" />
        <rect x="6" y="1" width="2" height="1" />
        <rect x="0" y="2" width="9" height="2" />
        <rect x="1" y="4" width="7" height="1" />
        <rect x="2" y="5" width="5" height="1" />
        <rect x="3" y="6" width="3" height="1" />
        <rect x="4" y="7" width="1" height="1" />
      </g>
      {/* shading */}
      <g fill={dark}>
        <rect x="0" y="3" width="1" height="1" />
        <rect x="8" y="1" width="1" height="3" />
        <rect x="7" y="4" width="1" height="1" />
        <rect x="6" y="5" width="1" height="1" />
        <rect x="5" y="6" width="1" height="1" />
        <rect x="4" y="7" width="1" height="1" />
      </g>
      {filled && (
        <g fill={shine}>
          <rect x="1" y="2" width="2" height="1" />
          <rect x="2" y="1" width="1" height="1" />
        </g>
      )}
      {/* right-half emptied for a half heart */}
      {half && filled && (
        <g fill={empty}>
          <rect x="5" y="2" width="4" height="2" />
          <rect x="5" y="4" width="3" height="1" />
          <rect x="5" y="5" width="2" height="1" />
        </g>
      )}
    </svg>
  );
}
