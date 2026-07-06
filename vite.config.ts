import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Demo / playground build (not published). The library build lives in
// vite.lib.config.ts and outputs to ./dist.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "demo-dist",
  },
});
