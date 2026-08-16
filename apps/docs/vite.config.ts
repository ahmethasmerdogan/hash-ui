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
      "@": r("./src"),
    },
  },
  server: { port: 5180 },
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
