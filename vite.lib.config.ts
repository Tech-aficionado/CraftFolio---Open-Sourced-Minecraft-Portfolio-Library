import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

// Library build: emits ESM + CJS bundles, a single style.css, and .d.ts types.
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["src"], exclude: ["src/main.tsx", "src/App.tsx"] }),
  ],
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MinecraftPortfolio",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    emptyOutDir: true,
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "framer-motion",
        "three",
      ],
      output: {
        assetFileNames: (asset) =>
          asset.name === "style.css" ? "style.css" : "assets/[name][extname]",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "framer-motion": "FramerMotion",
          three: "THREE",
        },
      },
    },
  },
});
