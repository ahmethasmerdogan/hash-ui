/* ------------------------------------------------------------------ */
/* Route-aware visual + behavioural QA.                                 */
/*                                                                      */
/*   npm run dev            # in one terminal                           */
/*   node scripts/qa.mjs    # in another                                */
/*                                                                      */
/* Walks every documented route in both themes and checks the rules the */
/* system claims to follow — no horizontal overflow, no drop shadows,   */
/* no invisible text — then drives the interactive surfaces.            */
/*                                                                      */
/* The one sanctioned exception to the shadow rule is hash-ui-blocks'   */
/* effects layer: elements carrying an `fx-*` class may glow. Anything   */
/* else that casts a blurred shadow is still a failure.                 */
/* ------------------------------------------------------------------ */

import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE = process.env.QA_URL ?? "http://localhost:5180";
const ROOT = fileURLToPath(new URL("..", import.meta.url));

/* read the routes straight out of the docs map so QA can never fall behind */
const routesSrc = await readFile(
  `${ROOT}apps/docs/src/lib/routes.ts`,
  "utf8",
);
const ROUTES = ["/", ...[...routesSrc.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1])];

const problems = [];
const checks = [];
const errors = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 950 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await ctx.newPage();

page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 160)}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 160)}`);
});
page.on("requestfailed", (r) =>
  errors.push(`request failed: ${r.url().slice(0, 100)}`),
);

/* Never `networkidle`.
 *
 * /docs/blocks/geo holds a live MapLibre canvas and a turning globe, so the
 * page keeps requesting tiles and never goes idle — the sweep hung there for
 * thirty seconds and then failed the build. `domcontentloaded` plus an
 * explicit settle is deterministic and takes about the same wall clock. */
const SETTLE = 550;

/** goto + settle. Every navigation in this file goes through it. */
const go = async (route) => {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(SETTLE);
};

/* ------------------------------------------------------------ sweep -- */

console.log(`sweeping ${ROUTES.length} routes × 2 themes …\n`);

for (const theme of ["light", "dark"]) {
  for (const route of ROUTES) {
    await go(route);
    await page.evaluate(
      (t) => document.documentElement.classList.toggle("dark", t === "dark"),
      theme,
    );
    await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await page.waitForTimeout(180);

    /* the page rendered something */
    const heading = await page.locator("h1").first().textContent().catch(() => null);
    if (!heading?.trim()) problems.push(`${theme}${route}: no <h1>`);

    /* horizontal overflow */
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return de.scrollWidth - de.clientWidth;
    });
    if (overflow > 1) problems.push(`${theme}${route}: ${overflow}px horizontal overflow`);

    /* text the same colour as the surface behind it */
    const invisible = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("h1,h2,h3,p,span,button,a,td,th")) {
        if (!el.textContent?.trim()) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.opacity === "0") continue;
        if (
          cs.color === cs.backgroundColor &&
          cs.backgroundColor !== "rgba(0, 0, 0, 0)"
        )
          out.push(`${el.tagName} ${el.textContent.trim().slice(0, 30)}`);
      }
      return out.slice(0, 3);
    });
    if (invisible.length)
      problems.push(`${theme}${route}: invisible text — ${invisible.join(" | ")}`);

    /* The no-drop-shadow rule: inset highlights and 0-blur rings are fine.
       So is anything opting into the blocks effects layer — a .fx-* class is
       the sanctioned, deliberate exception, and it is scoped to the element
       that asked for it rather than waived for the whole route. */
    const shadowed = await page.evaluate(() => {
      const bad = [];
      const isEffect = (el) =>
        typeof el.className === "string" &&
        /(^|\s)fx-[a-z-]+/.test(el.className);
      for (const el of document.querySelectorAll("*")) {
        if (isEffect(el)) continue;
        const bs = getComputedStyle(el).boxShadow;
        if (!bs || bs === "none") continue;
        for (const part of bs.split(/,(?![^(]*\))/)) {
          const p = part.trim();
          if (p.startsWith("inset") || p.endsWith("inset")) continue;
          const nums = p.match(/-?\d+(\.\d+)?px/g) || [];
          const blur = nums[2] ? parseFloat(nums[2]) : 0;
          if (blur > 0.5)
            bad.push(
              `${el.tagName}.${String(el.className).split(" ")[0]}: ${p.slice(0, 50)}`,
            );
        }
      }
      return [...new Set(bad)].slice(0, 3);
    });
    if (shadowed.length)
      problems.push(`${theme}${route}: drop shadow — ${shadowed.join(" | ")}`);
  }
}

await page.evaluate(() => document.documentElement.classList.remove("dark"));

/* ------------------------------------------------------ interaction -- */

await go("/");

await page.keyboard.press("Meta+k");
await page.waitForTimeout(350);
checks.push([
  "⌘K palette opens",
  await page.locator('input[placeholder*="Search components"]').isVisible(),
]);
await page.keyboard.type("tooltip");
await page.waitForTimeout(250);
checks.push([
  "⌘K searches by component name",
  (await page.locator("text=Feedback & overlays").count()) > 0,
]);
await page.keyboard.press("Enter");
await page.waitForTimeout(700);
checks.push([
  "⌘K navigates",
  page.url().includes("/docs/components/feedback"),
]);

await page.getByRole("button", { name: "Open dialog" }).click();
await page.waitForTimeout(350);
checks.push(["modal opens", await page.locator('[role="dialog"]').isVisible()]);
await page.keyboard.press("Escape");
await page.waitForTimeout(250);

await page.getByRole("button", { name: "Success toast" }).click();
await page.waitForTimeout(350);
checks.push([
  "toast fires",
  await page.getByText("Timesheet submitted").isVisible(),
]);
await page.waitForTimeout(4600);

await go("/docs/typography");
await page.getByRole("button", { name: /Inter/ }).first().click();
await page.waitForTimeout(300);
checks.push([
  "font switcher",
  (await page.evaluate(() => getComputedStyle(document.body).fontFamily)).includes(
    "Inter",
  ),
]);
await page.getByRole("button", { name: /Geist/ }).first().click();
await page.waitForTimeout(250);

await go("/docs/components/table");
await page.waitForTimeout(400);
const before = await page.locator(".hatch").count();
await page.getByRole("switch").first().click();
await page.waitForTimeout(400);
checks.push([
  "data-table change toggle",
  before > 0 && (await page.locator(".hatch").count()) < before,
]);

await go("/docs/patterns/templates");
await page.waitForTimeout(500);
await page.getByRole("button", { name: "Open preview" }).first().click();
await page.waitForTimeout(900);
checks.push([
  "template preview",
  await page.getByRole("button", { name: "Back to docs" }).isVisible(),
]);
await page.keyboard.press("Escape");

await go("/docs/components/icons");
await page.waitForTimeout(400);
const iconCount = await page.locator("button[title^='import']").count();
checks.push([`icon grid renders (${iconCount})`, iconCount > 60]);

await go("/docs/registry");
await page.waitForTimeout(300);
checks.push([
  "registry lists items",
  (await page.locator("code:text-is('button')").count()) > 0,
]);

/* the registry really is served as JSON */
const reg = await page.request.get(`${BASE}/r/registry.json`);
checks.push([`registry.json served (${reg.status()})`, reg.ok()]);
if (reg.ok()) {
  const json = await reg.json();
  checks.push([
    `registry.json has ${json.items?.length ?? 0} items`,
    (json.items?.length ?? 0) > 10,
  ]);
}

/* ---------------------------------------------------------- mobile -- */

await page.setViewportSize({ width: 390, height: 844 });
await go("/docs/components/button");
await page.waitForTimeout(500);
const mobileOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
if (mobileOverflow > 1)
  problems.push(`mobile: ${mobileOverflow}px horizontal overflow`);
await page.getByRole("button", { name: "Open navigation" }).click();
await page.waitForTimeout(400);
checks.push([
  "mobile drawer",
  await page.getByRole("link", { name: /Installation/ }).first().isVisible(),
]);

/* ---------------------------------------------------------- report -- */

console.log("interaction:");
for (const [name, ok] of checks) console.log(`  ${ok ? "✓" : "✗"} ${name}`);

console.log("\nlayout / style:");
if (!problems.length) console.log("  ✓ clean");
else problems.forEach((p) => console.log(`  ✗ ${p}`));

console.log(
  "\nconsole errors:",
  errors.length ? [...new Set(errors)].slice(0, 8) : "none ✓",
);

await browser.close();

const failed = problems.length + checks.filter(([, ok]) => !ok).length;
process.exit(failed ? 1 : 0);
