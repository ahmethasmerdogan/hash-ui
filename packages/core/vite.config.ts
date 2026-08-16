import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* Library build: one tree-shakeable ESM file. Everything the consumer already
   has — React and the optional three.js peer — stays external. Types come from
   `tsc -p tsconfig.build.json`, the stylesheet from scripts/copy-css.mjs. */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "three"],
    },
    sourcemap: true,
    target: "es2022",
    minify: false,
  },
});
