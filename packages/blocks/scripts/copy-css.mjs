/* blocks.css is the consumer's `@import "uicean-blocks/css"` entry, never
   imported from TypeScript, so Vite never sees it. Copy it verbatim. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const pkg = fileURLToPath(new URL("..", import.meta.url));

/* Tailwind v4 skips node_modules when scanning for class names, so point it
   back at our own bundle — otherwise consumers get the keyframes and none of
   the classes that use them. */
const SOURCE_DIRECTIVE = `@source "./index.js";\n`;

const css = await readFile(`${pkg}src/blocks.css`, "utf8");

await mkdir(`${pkg}dist`, { recursive: true });
await writeFile(`${pkg}dist/blocks.css`, SOURCE_DIRECTIVE + css);

console.log("copied blocks.css (+ @source) → dist/");
