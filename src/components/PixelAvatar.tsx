type Props = {
  className?: string;
  headOnly?: boolean;
};

const HAIR = "#4a3120";
const HAIR_HI = "#6b4a2e";
const SKIN = "#e8b48f";
const SKIN_SH = "#cf9a75";
const EYE_W = "#ffffff";
const EYE = "#3a2a5c";
const SHIRT = "#d9d2c5";
const SHIRT_SH = "#b3ab9c";
const PANTS = "#2c3a56";
const PANTS_SH = "#1e2940";

// A blocky, front-facing Minecraft-style character built from SVG pixels.
export default function PixelAvatar({ className = "", headOnly = false }: Props) {
  return (
    <svg
      viewBox={headOnly ? "0 0 16 16" : "0 0 16 34"}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {/* ================= HEAD ================= */}
      {/* hair cap */}
      <g fill={HAIR}>
        <rect x="4" y="0" width="8" height="3" />
        <rect x="3" y="1" width="1" height="9" />
        <rect x="12" y="1" width="1" height="9" />
        <rect x="4" y="3" width="1" height="4" />
        <rect x="11" y="3" width="1" height="4" />
      </g>
      <g fill={HAIR_HI}>
        <rect x="5" y="0" width="2" height="1" />
        <rect x="9" y="0" width="2" height="1" />
      </g>
      {/* face */}
      <g fill={SKIN}>
        <rect x="5" y="3" width="6" height="5" />
      </g>
      <g fill={SKIN_SH}>
        <rect x="5" y="7" width="6" height="1" />
      </g>
      {/* eyes */}
      <g fill={EYE_W}>
        <rect x="5" y="4" width="2" height="2" />
        <rect x="9" y="4" width="2" height="2" />
      </g>
      <g fill={EYE}>
        <rect x="6" y="4" width="1" height="2" />
        <rect x="9" y="4" width="1" height="2" />
      </g>
      {/* mouth / cheeks */}
      <rect x="6" y="7" width="4" height="1" fill={SKIN_SH} />

      {!headOnly && (
        <>
          {/* ================= BODY ================= */}
          {/* shirt torso */}
          <g fill={SHIRT}>
            <rect x="4" y="8" width="8" height="12" />
          </g>
          <g fill={SHIRT_SH}>
            <rect x="4" y="8" width="8" height="1" />
            <rect x="7" y="9" width="2" height="11" />
          </g>
          {/* arms */}
          <g fill={SHIRT}>
            <rect x="1" y="9" width="3" height="8" />
            <rect x="12" y="9" width="3" height="8" />
          </g>
          <g fill={SHIRT_SH}>
            <rect x="1" y="9" width="1" height="8" />
            <rect x="14" y="9" width="1" height="8" />
          </g>
          {/* hands */}
          <g fill={SKIN}>
            <rect x="1" y="17" width="3" height="2" />
            <rect x="12" y="17" width="3" height="2" />
          </g>
          {/* long hair over shoulders */}
          <g fill={HAIR}>
            <rect x="3" y="8" width="1" height="4" />
            <rect x="12" y="8" width="1" height="4" />
          </g>

          {/* ================= LEGS ================= */}
          <g fill={PANTS}>
            <rect x="4" y="20" width="8" height="13" />
          </g>
          <g fill={PANTS_SH}>
            <rect x="7" y="20" width="2" height="13" />
            <rect x="4" y="31" width="8" height="2" />
          </g>
        </>
      )}
    </svg>
  );
}
