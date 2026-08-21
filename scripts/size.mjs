/* ------------------------------------------------------------------ */
/* Size budget.                                                         */
/*                                                                      */
/*   npm run build:lib && node scripts/size.mjs                         */
/*   node scripts/size.mjs --update    # accept the current sizes       */
/*                                                                      */
/* Both packages are published, and the pitch for the core one is that  */
/* it imports nothing but React. That claim has a weight attached to it */
/* and nothing was watching the number: a stray import of a date library */
/* or an icon set would land silently and only show up in someone       */
/* else's bundle analyser.                                              */
/*                                                                      */
/* Gzip, because that is what a browser actually downloads. The budgets  */
/* live in size-budget.json next to this file, with headroom — this is   */
/* meant to catch a step change, not to argue about a hundred bytes.     */
/* ------------------------------------------------------------------ */

import { gzipSync } from "node:zlib";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BUDGETS = `${ROOT}scripts/size-budget.json`;
const update = process.argv.includes("--update");

const TARGETS = [
  { name: "hash-ui", file: "packages/core/dist/index.js" },
  { name: "hash-ui/css", file: "packages/core/dist/hashui.css" },
  { name: "hash-ui-blocks", file: "packages/blocks/dist/index.js" },
  { name: "hash-ui-blocks/css", file: "packages/blocks/dist/blocks.css" },
];

/** 15% of headroom over the measured size, rounded to a readable number */
const budgetFor = (kb) => Math.ceil((kb * 1.15) / 5) * 5;

let budgets = {};
try {
  budgets = JSON.parse(await readFile(BUDGETS, "utf8"));
} catch {
  /* first run */
}

const measured = {};
const rows = [];
let failed = 0;

for (const { name, file } of TARGETS) {
  let raw;
  try {
    raw = await readFile(`${ROOT}${file}`);
  } catch {
    console.log(`  ? ${name.padEnd(20)} not built — run npm run build:lib`);
    process.exit(2);
  }
  const kb = gzipSync(raw).length / 1024;
  measured[name] = Number(kb.toFixed(1));

  const budget = budgets[name];
  const over = budget !== undefined && kb > budget;
  if (over) failed++;
  rows.push(
    `  ${over ? "✗" : "✓"} ${name.padEnd(20)} ${kb.toFixed(1).padStart(6)} kB gzip` +
      (budget !== undefined ? `   budget ${budget} kB` : "   (no budget yet)"),
  );
}

console.log(rows.join("\n"));

if (update) {
  const next = Object.fromEntries(
    Object.entries(measured).map(([k, v]) => [k, budgetFor(v)]),
  );
  await writeFile(BUDGETS, JSON.stringify(next, null, 2) + "\n");
  console.log(`\nbudgets written to scripts/size-budget.json`);
  process.exit(0);
}

if (failed) {
  console.log(
    `\n${failed} over budget. If the growth is intended, ` +
      `run \`node scripts/size.mjs --update\` and say why in the commit.`,
  );
  process.exit(1);
}

console.log(`\n✓ both packages inside their budget`);
