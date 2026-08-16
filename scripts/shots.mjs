/* Screenshot every documented route in both themes.
 *
 *   npm run dev
 *   node scripts/shots.mjs [route-substring]
 *
 * Output goes to SHOT_DIR (default ./.shots), one PNG per route per theme.
 */
import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE = process.env.QA_URL ?? "http://localhost:5180";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = process.env.SHOT_DIR ?? `${ROOT}.shots`;

const routesSrc = await readFile(`${ROOT}apps/docs/src/lib/routes.ts`, "utf8");
const all = ["/", ...[...routesSrc.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1])];
const filter = process.argv[2];
const routes = filter ? all.filter((r) => r.includes(filter)) : all;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1.5,
    colorScheme: scheme,
  });
  const page = await ctx.newPage();

  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await page.waitForTimeout(500);

    const slug = route === "/" ? "landing" : route.replace(/^\/docs\/?/, "").replace(/\//g, "-") || "docs";
    const file = `${OUT}/${slug}.${scheme}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`${scheme.padEnd(5)} ${route.padEnd(32)} → ${file}`);
  }
  await ctx.close();
}

await browser.close();
