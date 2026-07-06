/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Preflight is off so the compiled CSS never resets the host app's styles.
  // Equivalent resets are re-added, scoped to `.mcp-root`, in src/index.css.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        mc: ['"VT323"', "monospace"],
      },
      colors: {
        grass: {
          light: "#7cb518",
          DEFAULT: "#5b8731",
          dark: "#3d5c1f",
        },
        dirt: {
          light: "#9c6b43",
          DEFAULT: "#79553a",
          dark: "#4b3421",
        },
        stone: {
          light: "#9d9d9d",
          DEFAULT: "#7f7f7f",
          dark: "#565656",
        },
        gold: {
          light: "#ffd75e",
          DEFAULT: "#f0a815",
          dark: "#c07f0a",
        },
        nether: {
          light: "#a24bff",
          DEFAULT: "#6a0dad",
          dark: "#3b0764",
        },
        night: "#0d0f12",
        panel: "#1a1d23",
      },
      boxShadow: {
        block:
          "inset -4px -4px 0 0 rgba(0,0,0,0.45), inset 4px 4px 0 0 rgba(255,255,255,0.18)",
        "block-pressed":
          "inset 4px 4px 0 0 rgba(0,0,0,0.45), inset -4px -4px 0 0 rgba(255,255,255,0.10)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        spin3d: {
          "0%": { transform: "rotateX(-18deg) rotateY(0deg)" },
          "100%": { transform: "rotateX(-18deg) rotateY(360deg)" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-24px)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        bob: "bob 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        spin3d: "spin3d 14s linear infinite",
        drift: "drift 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
