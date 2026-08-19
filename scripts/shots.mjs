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
    /* not `networkidle`: the geo route keeps fetching map tiles and never
       goes idle, which used to hang the capture until it timed out */
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });

    /* Chromium captures fullPage beyond the viewport without scrolling, so
       anything gated on IntersectionObserver would photograph un-revealed.
       Walk the page once to arm them, then go back to the top. */
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(r));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);

    const slug = route === "/" ? "landing" : route.replace(/^\/docs\/?/, "").replace(/\//g, "-") || "docs";
    const file = `${OUT}/${slug}.${scheme}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`${scheme.padEnd(5)} ${route.padEnd(32)} → ${file}`);
  }
  await ctx.close();
}

await browser.close();
