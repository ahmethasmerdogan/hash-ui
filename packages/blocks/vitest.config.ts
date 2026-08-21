import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      /* Resolve the core from source, the same way tsconfig's `paths` does.
         Without this the tests import `uicean` through the workspace link,
         which points at a dist/ that has not been built yet — so they pass
         locally after a build and fail on a clean checkout. */
      "uicean": fileURLToPath(new URL("../core/src/index.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["test/**/*.test.tsx", "test/**/*.test.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
