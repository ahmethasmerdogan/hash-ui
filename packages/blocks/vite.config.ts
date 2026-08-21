import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* Library build, same shape as packages/core: one tree-shakeable ESM file.
   Everything the consumer already has stays external — React, the uicean
   core, and the three optional peers that only some blocks reach for. */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "uicean",
        "@splinetool/react-spline",
        "cobe",
        "maplibre-gl",
      ],
    },
    sourcemap: true,
    target: "es2022",
    minify: false,
  },
});
