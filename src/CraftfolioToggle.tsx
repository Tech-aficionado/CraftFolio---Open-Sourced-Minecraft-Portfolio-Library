import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Craftfolio from "./Craftfolio";
import type { DeepPartial, PortfolioData, PortfolioOptions } from "./types";

type Position = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type CraftfolioToggleProps = {
  /**
   * Your normal site. It renders by default; the button switches to the
   * Minecraft version and back. Omit it to just get the floating button
   * (e.g. when your normal UI lives elsewhere on the page).
   */
  children?: ReactNode;
  /** Your portfolio content (same shape as `<Craftfolio data>`). */
  data?: DeepPartial<PortfolioData>;
  /** Craftfolio rendering options. */
  options?: Partial<PortfolioOptions>;
  /** Label on the button when the theme is OFF. */
  label?: string;
  /** Label on the button when the theme is ON. */
  exitLabel?: string;
  /** Corner to anchor the floating button. */
  position?: Position;
  /** Start with the Minecraft theme already on. */
  defaultActive?: boolean;
  /** Remember the on/off choice in localStorage. */
  persist?: boolean;
  storageKey?: string;
  /** Called whenever the theme is toggled. */
  onChange?: (active: boolean) => void;
  /** Base z-index for the overlay (button sits one above). */
  zIndex?: number;
  /** Hide the built-in floating button (drive it yourself via `onChange`/state). */
  hideButton?: boolean;
};

const POS: Record<Position, React.CSSProperties> = {
  "bottom-right": { bottom: 20, right: 20 },
  "bottom-left": { bottom: 20, left: 20 },
  "top-right": { top: 20, right: 20 },
  "top-left": { top: 20, left: 20 },
};

/**
 * Drop-in theme toggle for an existing site. Renders a floating button; when
 * clicked it overlays a full-screen Minecraft-themed portfolio (built from your
 * data) on top of the current page. Click again to exit.
 *
 * ```tsx
 * import { CraftfolioToggle } from "craftfolio";
 * import "craftfolio/styles.css";
 *
 * <CraftfolioToggle data={myData} />
 * ```
 */
export default function CraftfolioToggle({
  children,
  data,
  options,
  label = "Minecraft Mode",
  exitLabel = "Exit Minecraft",
  position = "bottom-right",
  defaultActive = false,
  persist = false,
  storageKey = "craftfolio:active",
  onChange,
  zIndex = 2147483000,
  hideButton = false,
}: CraftfolioToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(defaultActive);

  // Avoid SSR hydration mismatch: only portal after mount.
  useEffect(() => {
    setMounted(true);
    if (persist && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved === "1") setActive(true);
    }
  }, [persist, storageKey]);

  const setActivePersisted = useCallback(
    (next: boolean) => {
      setActive(next);
      onChange?.(next);
      if (persist && typeof localStorage !== "undefined") {
        localStorage.setItem(storageKey, next ? "1" : "0");
      }
    },
    [onChange, persist, storageKey]
  );

  const toggle = useCallback(() => setActivePersisted(!active), [active, setActivePersisted]);

  // Lock body scroll + Escape-to-exit while the overlay is open.
  useEffect(() => {
    if (!active || typeof document === "undefined") return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePersisted(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, setActivePersisted]);

  const fab: React.CSSProperties = {
    position: "fixed",
    ...POS[position],
    zIndex: zIndex + 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 16px",
    fontFamily:
      'ui-monospace, "Press Start 2P", "Segoe UI", system-ui, sans-serif',
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "0.02em",
    color: active ? "#fff" : "#0f2a06",
    textShadow: active ? "1px 1px 0 rgba(0,0,0,.5)" : "none",
    background: active
      ? "linear-gradient(#c0392b,#8a1f16)"
      : "linear-gradient(#7cb518,#5b8731)",
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: active
      ? "#e57368 #5a130d #5a130d #e57368"
      : "#a4de3a #2f4718 #2f4718 #a4de3a",
    boxShadow: active
      ? "0 4px 0 0 #5a130d, 0 6px 14px rgba(0,0,0,.45)"
      : "0 4px 0 0 #2f4718, 0 6px 14px rgba(0,0,0,.45)",
    cursor: "pointer",
    imageRendering: "pixelated",
    userSelect: "none",
  };

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex,
    overflowY: "auto",
    overflowX: "hidden",
    background: "#0d0f12",
    WebkitOverflowScrolling: "touch",
  };

  return (
    <>
      {/* Your normal site (rendered in place) */}
      {children}

      {/* Button + overlay live at the top of the DOM, above everything */}
      {mounted &&
        createPortal(
          <>
            {active && (
              <div
                style={overlay}
                role="dialog"
                aria-modal="true"
                aria-label="Minecraft themed portfolio"
              >
                <Craftfolio data={data} options={options} />
              </div>
            )}

            {!hideButton && (
              <button
                type="button"
                onClick={toggle}
                style={fab}
                aria-pressed={active}
                title={active ? exitLabel : label}
              >
                <span aria-hidden style={{ fontSize: 16 }}>
                  {active ? "✕" : "⛏️"}
                </span>
                {active ? exitLabel : label}
              </button>
            )}
          </>,
          document.body
        )}
    </>
  );
}
