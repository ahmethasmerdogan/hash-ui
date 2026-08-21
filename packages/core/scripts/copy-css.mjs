/* The stylesheet is never imported from TypeScript — it is the consumer's
   `@import "uicean/css"` entry — so Vite does not see it. Copy it verbatim. */
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const pkg = fileURLToPath(new URL("..", import.meta.url));

/* Tailwind v4 skips node_modules when it looks for class names, so the shipped
   stylesheet points it at our own bundle. Without this line a consumer who
   installs from npm gets the tokens but none of the component utilities. */
const SOURCE_DIRECTIVE = `@source "./index.js";\n`;

const css = await readFile(`${pkg}src/uicean.css`, "utf8");

await mkdir(`${pkg}dist/presets`, { recursive: true });
await writeFile(`${pkg}dist/uicean.css`, SOURCE_DIRECTIVE + css);
await cp(`${pkg}src/presets`, `${pkg}dist/presets`, { recursive: true });

console.log("copied uicean.css (+ @source) + presets/ → dist/");
