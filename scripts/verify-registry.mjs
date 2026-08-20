/* ------------------------------------------------------------------ */
/* Does the copy-paste route actually compile?                          */
/*                                                                      */
/*   npm run registry && node scripts/verify-registry.mjs               */
/*                                                                      */
/* `shadcn add` writes registry files into a project at the `target`     */
/* each item declares, and the imports inside them were rewritten by     */
/* build-registry.mjs — per symbol, from a map built by reading the      */
/* core sources. That rewriting has never been checked against a         */
/* compiler. One unmapped export and every consumer of that item gets    */
/* a file that does not build, while the npm route stays perfectly fine  */
/* and nothing here notices.                                             */
/*                                                                      */
/* So: lay every item out exactly as the CLI would, point `@/*` at the   */
/* result, and run tsc over it.                                          */
/* ------------------------------------------------------------------ */

import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = `${ROOT}.registry-check`;

const index = JSON.parse(
  await readFile(`${ROOT}apps/docs/public/r/registry.json`, "utf8"),
);

await rm(OUT, { recursive: true, force: true });
await mkdir(`${OUT}/src`, { recursive: true });

/* Lay the files out. The bundle item repeats every core file at the same
   target as its own item, which is what makes it a bundle — writing it twice
   is harmless, and skipping it would leave the bundle unchecked. */
let written = 0;
const seen = new Set();
for (const item of index.items) {
  const full = JSON.parse(
    await readFile(`${ROOT}apps/docs/public/r/${item.name}.json`, "utf8"),
  );
  for (const file of full.files) {
    const path = `${OUT}/src/${file.target}`;
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, file.content);
    if (!seen.has(file.target)) {
      seen.add(file.target);
      written++;
    }
  }
}

/* A file nobody imports is a file tsc will not look at, so pull them all in. */
const entries = [...seen]
  .filter((t) => /\.tsx?$/.test(t))
  .map((t) => `import "@/${t.replace(/\.tsx?$/, "")}";`)
  .join("\n");
await writeFile(`${OUT}/src/entry.ts`, `${entries}\n`);

await writeFile(
  `${OUT}/tsconfig.json`,
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "ESNext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        baseUrl: "src",
        paths: { "@/*": ["./*"] },
        /* the consumer's node_modules is the repo's, one level up */
        typeRoots: ["../node_modules/@types"],
      },
      include: ["src"],
    },
    null,
    2,
  ),
);

console.log(`laid out ${written} files as the CLI would, typechecking…`);

try {
  await run("npx", ["tsc", "-p", `${OUT}/tsconfig.json`], { cwd: ROOT });
  console.log(`✓ every registry item compiles once copied in`);
  await rm(OUT, { recursive: true, force: true });
} catch (e) {
  const out = `${e.stdout ?? ""}${e.stderr ?? ""}`.trim();
  console.log("✗ the copied source does not compile:\n");
  console.log(
    out
      .split("\n")
      .filter((l) => l.includes("error"))
      .slice(0, 40)
      .join("\n"),
  );
  console.log(`\nthe laid-out project is at ${OUT} if you want to poke at it`);
  process.exit(1);
}
