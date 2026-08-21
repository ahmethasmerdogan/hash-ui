#!/usr/bin/env node
/**
 * Copy the UICean source into another project, without npm or the CLI.
 *
 *   node scripts/export-ui.mjs ../my-app/src/ui
 *
 * Copies packages/core/src/** (components, icons, theme, uicean.css) and
 * prints the wiring you still have to add by hand. Pass --blocks to bring
 * the twenty-one page blocks along too, into a sibling blocks/ folder.
 *
 * Prefer `npx shadcn@latest add https://uicean.vercel.app/r/uicean.json` if
 * the target project is already shadcn-initialised.
 */
import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "..", "packages", "core", "src");
const BLOCKS_SRC = resolve(HERE, "..", "packages", "blocks", "src");
const withBlocks = process.argv.includes("--blocks");

const target = process.argv[2];
if (!target) {
  console.error(
    "usage: node scripts/export-ui.mjs <target-dir> [--blocks] [--force]\n" +
      "   e.g. node scripts/export-ui.mjs ../my-app/src/ui --blocks",
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

/* the blocks sit beside the core rather than inside it: they import from it,
   and nesting them would make that import path a lie */
let blockFiles = 0;
if (withBlocks) {
  const BLOCK_DEST = resolve(DEST, "..", "blocks");
  await mkdir(BLOCK_DEST, { recursive: true });
  await cp(BLOCKS_SRC, BLOCK_DEST, { recursive: true });
  blockFiles = (await readdir(BLOCK_DEST)).length;
}

const files = await readdir(DEST);
let bytes = 0;
for (const f of files) bytes += (await stat(join(DEST, f))).size;

console.log(`✓ copied ${files.length} files (${(bytes / 1024).toFixed(0)} KB) → ${DEST}\n`);
console.log("next, in the consuming project:\n");
console.log("  1. npm i @fontsource-variable/geist @fontsource-variable/geist-mono");
console.log("  2. in your global stylesheet (Tailwind v4):\n");
console.log('       @import "tailwindcss";');
console.log('       @import "./ui/uicean.css";\n');
console.log("  3. in your entry file:\n");
console.log('       import "@fontsource-variable/geist";');
console.log('       import "@fontsource-variable/geist-mono";\n');
console.log("  4. wrap the app once:\n");
console.log("       <ThemeProvider><ToastProvider>{children}</ToastProvider></ThemeProvider>\n");
console.log("  optional: npm i three   (only if you use <ThreeOrb />)\n");
console.log("  server-rendering? put themeScript in <head> so the stored theme");
console.log("  is applied before the first paint:\n");
console.log('       <script dangerouslySetInnerHTML={{ __html: themeScript }} />\n');

if (withBlocks) {
  console.log(`  blocks: ${blockFiles} entries → ${resolve(DEST, "..", "blocks")}`);
  console.log("  they import from \"uicean\" — point that at ./ui, e.g. a");
  console.log("  tsconfig path or a bundler alias — and add the effects sheet");
  console.log("  AFTER the token sheet:\n");
  console.log('       @import "./ui/uicean.css";');
  console.log('       @import "./blocks/blocks.css";\n');
  console.log("  three blocks need an optional peer, each behind a dynamic import:");
  console.log("       @splinetool/react-spline   <SplineScene>");
  console.log("       cobe@^0.6.5                <GlobeFlights>");
  console.log("       maplibre-gl                <Map> and its markers");
} else {
  console.log("  page blocks (heroes, footers, app shells, effects) live in a");
  console.log("  second package — re-run with --blocks to bring them along.");
}
