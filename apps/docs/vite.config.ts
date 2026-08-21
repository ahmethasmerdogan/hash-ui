import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      /* the docs site dogfoods the library from source: editing a component
         hot-reloads the page it documents, with no rebuild step in between */
      "hash-ui": r("../../packages/core/src/index.ts"),
      "hash-ui-blocks": r("../../packages/blocks/src/index.ts"),
      "@": r("./src"),
    },
  },
  server: { port: 5180 },

  /* maplibre-gl loads its tile decoder as a separate worker module. Vite's
     dependency pre-bundling rewrites the package but does not serve that
     worker alongside it, so the request 404s in dev, the library quietly
     falls back to decoding tiles on the main thread, and the console carries
     a failed request on every visit to /docs/blocks/geo. Excluding it from
     the optimizer leaves the package's own module graph intact. */
  optimizeDeps: { exclude: ["maplibre-gl"] },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("node_modules/react-router")) return "router";
        },
      },
    },
  },
});
