/* ------------------------------------------------------------------ */
/* Packaging — install what npm would actually publish.                 */
/*                                                                      */
/*   node scripts/pack-test.mjs                                         */
/*                                                                      */
/* Everything else in this repo runs inside the workspace, where the    */
/* packages resolve through symlinks and every optional peer happens to */
/* be installed. A consumer gets neither. This packs both tarballs, in- */
/* stalls them into an empty project with nothing but React, and checks */
/* what a real user would hit:                                          */
/*                                                                      */
/*   - the exports map resolves, under `bundler` and under `node16`     */
/*   - the types come with it                                           */
/*   - a build succeeds with none of the optional peers present         */
/*   - the components that need them say so, and the app still runs     */
/*                                                                      */
/* This found ThreeOrb loading for ever instead of reporting a missing  */
/* `three`, which nothing inside the workspace could have found.        */
/* ------------------------------------------------------------------ */

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const dir = mkdtempSync(join(tmpdir(), "uicean-pack-"));
const run = (cmd, args, cwd = dir) =>
  execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

let failed = 0;
const check = (label, ok, detail = "") => {
  console.log(`  ${ok ? "✓" : "✗"} ${label}${detail && !ok ? `\n      ${detail}` : ""}`);
  if (!ok) failed++;
};

try {
  console.log("building and packing…");
  run("npm", ["run", "build:all"], ROOT);
  for (const w of ["uicean", "uicean-blocks"])
    run("npm", ["pack", "-w", w, "--pack-destination", dir], ROOT);
  const tarballs = readdirSync(dir).filter((f) => f.endsWith(".tgz")).map((f) => `./${f}`);
  check(`packed ${tarballs.length} tarballs`, tarballs.length === 2);

  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "c", private: true, type: "module" }));
  console.log("installing into an empty project (no optional peers)…");
  run("npm", ["install", "--silent", ...tarballs, "react@19", "react-dom@19"]);
  run("npm", ["install", "--silent", "-D", "typescript@5.8", "@types/react@19", "@types/react-dom@19"]);

  writeFileSync(join(dir, "app.tsx"), `
import { Button, Card, ThemeProvider, ThreeOrb, EmptyState, ICompass } from "uicean";
import { HeroTerminal, FeaturesBento, CinematicFooter, GlobeFlights, DashboardShell } from "uicean-blocks";
import "uicean/css";
import "uicean-blocks/css";
export const App = () => (
  <ThemeProvider>
    <HeroTerminal /><FeaturesBento /><GlobeFlights /><ThreeOrb />
    <Card><Button variant="green">Go</Button><EmptyState icon={<ICompass />} title="x" titleAs="h1" /></Card>
    <DashboardShell /><CinematicFooter />
  </ThemeProvider>
);`);

  const tsconfig = (res) => ({
    compilerOptions: {
      target: "ES2022", lib: ["ES2022", "DOM"], module: res === "node16" ? "node16" : "ESNext",
      moduleResolution: res, jsx: "react-jsx", strict: true, noEmit: true, skipLibCheck: true,
    },
    include: ["app.tsx"],
  });

  for (const res of ["bundler", "node16"]) {
    writeFileSync(join(dir, `ts.${res}.json`), JSON.stringify(tsconfig(res)));
    let ok = true, out = "";
    try { run("npx", ["tsc", "-p", `ts.${res}.json`, "--noEmit"]); }
    catch (e) { ok = false; out = String(e.stdout ?? e.message).split("\n").slice(0, 3).join(" "); }
    check(`types resolve under moduleResolution: ${res}`, ok, out);
  }
} catch (err) {
  console.log(`\n✗ ${String(err.stdout ?? err.message).split("\n").slice(0, 6).join("\n")}`);
  failed++;
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log(failed === 0 ? "\n✓ the published packages install and typecheck in an empty project" : `\n${failed} packaging problem(s)`);
process.exit(failed ? 1 : 0);
