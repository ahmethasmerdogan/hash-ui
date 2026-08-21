/* ------------------------------------------------------------------ */
/* Counts — the numbers in the prose have to match the source.          */
/*                                                                      */
/*   node scripts/counts.mjs                                            */
/*                                                                      */
/* Every README, the site description, the OG card and both package     */
/* manifests state how many components, blocks and icons there are.     */
/* Those numbers were wrong three times: "70+ components" survived the  */
/* arrival of forms, tables and the whole overlay family, and a "23     */
/* page blocks" I wrote from memory was never true at all.              */
/*                                                                      */
/* A number in prose is a claim. This counts the source and fails when  */
/* the claim and the code disagree.                                     */
/* ------------------------------------------------------------------ */

import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

/* components: a top-level `export function Xyz`, minus the icons, which
   live in one file and are counted separately */
const coreFiles = await walk(`${ROOT}packages/core/src`);
const exported = [];
for (const f of coreFiles) {
  const src = await readFile(f, "utf8");
  for (const m of src.matchAll(/^export function ([A-Z]\w+)/gm)) exported.push(m[1]);
}
/* the icons are arrow functions assigned to consts, not declarations —
   counting them as `export function` returns zero, which is how "82" got
   written into six files in the first place */
const icons = new Set(
  [
    ...(await readFile(`${ROOT}packages/core/src/icons.tsx`, "utf8")).matchAll(
      /^export const (I[A-Z]\w*)/gm,
    ),
  ].map((m) => m[1]),
).size;
const components = exported.filter((n) => !/^I[A-Z]/.test(n)).length;

/* blocks: the registry knows, and it is generated from the source. Its
   library entries are not blocks — hooks, parts, the shader runner, the
   token sheet — so they come off. */
const registry = JSON.parse(await readFile(`${ROOT}apps/docs/public/r/registry.json`, "utf8"));
const NOT_A_BLOCK = new Set([
  "blocks-tokens", "blocks-hooks", "blocks-parts", "blocks-gl", "block-visuals",
]);
const blockish = new Set(
  registry.items
    .filter((i) => /hero|feature|logo|footer|auth|sidebar|shell|map|globe|metal|ribbon|vortex|marquee|spline/.test(i.name))
    .map((i) => i.name),
);
const blocks = [...blockish].filter((n) => !NOT_A_BLOCK.has(n)).length;

const TRUTH = { components, blocks, icons };

/* where the claims live, and the shape each states them in */
const CLAIMS = [
  ["README.md", /(\d+) components/, "components"],
  ["README.md", /(\d+) page blocks/, "blocks"],
  ["README.md", /(\d+) hand-drawn icons/, "icons"],
  ["packages/core/README.md", /(\d+) components/, "components"],
  ["packages/core/README.md", /(\d+) hand-drawn icons/, "icons"],
  ["apps/docs/src/lib/site.ts", /(\d+) components/, "components"],
  ["apps/docs/src/lib/site.ts", /(\d+) page blocks/, "blocks"],
  ["apps/docs/src/lib/site.ts", /(\d+) hand-drawn icons/, "icons"],
  ["apps/docs/index.html", /(\d+) components/, "components"],
  ["apps/docs/index.html", /(\d+) page blocks/, "blocks"],
  ["packages/core/package.json", /(\d+) components/, "components"],
  ["packages/core/package.json", /(\d+) icons/, "icons"],
];

console.log(`counted from source: ${components} components, ${blocks} blocks, ${icons} icons\n`);

let bad = 0;
for (const [file, re, key] of CLAIMS) {
  const src = await readFile(`${ROOT}${file}`, "utf8");
  const m = re.exec(src);
  if (!m) {
    console.log(`  ? ${file} — no "${key}" claim found; the wording changed`);
    bad++;
    continue;
  }
  const claimed = Number(m[1]);
  const ok = claimed === TRUTH[key];
  if (!ok) console.log(`  ✗ ${file} says ${claimed} ${key}, source has ${TRUTH[key]}`);
  if (!ok) bad++;
}

console.log(
  bad === 0
    ? `✓ ${CLAIMS.length} claims across ${new Set(CLAIMS.map((c) => c[0])).size} files, all true`
    : `\n${bad} of ${CLAIMS.length} claims disagree with the source`,
);
process.exit(bad ? 1 : 0);
