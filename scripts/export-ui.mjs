#!/usr/bin/env node
/**
 * Copy the HashUI source into another project, without npm or the CLI.
 *
 *   node scripts/export-ui.mjs ../my-app/src/ui
 *
 * Copies packages/core/src/** (components, icons, theme, hashui.css) and
 * prints the wiring you still have to add by hand. Prefer
 * `npx shadcn@latest add https://hash-ui.vercel.app/r/hashui.json` if the
 * target project is already shadcn-initialised.
 */
import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "..", "packages", "core", "src");

const target = process.argv[2];
if (!target) {
  console.error(
    "usage: node scripts/export-ui.mjs <target-dir>\n" +
      "   e.g. node scripts/export-ui.mjs ../my-app/src/ui",
  );
  process.exit(1);
}

const DEST = resolve(process.cwd(), target);

if (existsSync(DEST) && !process.argv.includes("--force")) {
  console.error(
    `refusing to overwrite existing directory:\n  ${DEST}\n` +
      "re-run with --force if that is what you want.",
  );
  process.exit(1);
}

await mkdir(DEST, { recursive: true });
await cp(SRC, DEST, { recursive: true });

const files = await readdir(DEST);
let bytes = 0;
for (const f of files) bytes += (await stat(join(DEST, f))).size;

console.log(`✓ copied ${files.length} files (${(bytes / 1024).toFixed(0)} KB) → ${DEST}\n`);
console.log("next, in the consuming project:\n");
console.log("  1. npm i @fontsource-variable/geist @fontsource-variable/geist-mono");
console.log("  2. in your global stylesheet (Tailwind v4):\n");
console.log('       @import "tailwindcss";');
console.log('       @import "./ui/hashui.css";\n');
console.log("  3. in your entry file:\n");
console.log('       import "@fontsource-variable/geist";');
console.log('       import "@fontsource-variable/geist-mono";\n');
console.log("  4. wrap the app once:\n");
console.log("       <ThemeProvider><ToastProvider>{children}</ToastProvider></ThemeProvider>\n");
console.log("  optional: npm i three   (only if you use <ThreeOrb />)");
