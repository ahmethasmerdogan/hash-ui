/* ------------------------------------------------------------------ */
/* Accessible-name sweep.                                              */
/*                                                                     */
/*   npm run dev                                                       */
/*   node scripts/a11y.mjs                                             */
/*                                                                     */
/* The narrowest useful checks, and the ones this repo kept failing: a  */
/* control that a screen reader announces as "button" and nothing else, */
/* and a page with no single heading. An icon is not a name, and a      */
/* <Switch> or <Checkbox> has no text of its own — both need one.       */
/*                                                                     */
/* Routes come from the docs map, so this can never fall behind it.     */
/* ------------------------------------------------------------------ */

import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE = process.env.QA_URL ?? "http://localhost:5180";
const ROOT = fileURLToPath(new URL("..", import.meta.url));

const routesSrc = await readFile(`${ROOT}apps/docs/src/lib/routes.ts`, "utf8");
const ROUTES = ["/", ...[...routesSrc.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1])];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

let total = 0;
for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(650);

  const issues = await page.evaluate(() => {
    const out = [];
    const name = (el) =>
      (
        el.getAttribute("aria-label") ||
        el.getAttribute("title") ||
        (el.getAttribute("aria-labelledby") &&
          document.getElementById(el.getAttribute("aria-labelledby"))?.textContent) ||
        el.textContent ||
        ""
      )
        .replace(/\s+/g, " ")
        .trim();

    document.querySelectorAll("button, a[href]").forEach((el) => {
      /* something inside an aria-hidden subtree is already out of the tree */
      if (el.closest("[aria-hidden='true']")) return;
      const labelledByImage = el.querySelector("img[alt]:not([alt=''])");
      if (!name(el) && !labelledByImage) {
        out.push(
          `${el.tagName.toLowerCase()}[role=${el.getAttribute("role") ?? "-"}] .${String(el.className).split(" ")[0]}`,
        );
      }
    });

    document.querySelectorAll("img:not([alt])").forEach((el) => {
      out.push(`img without alt: ${el.getAttribute("src")?.slice(-36)}`);
    });

    /* one h1 per page: it is the document's title, not a section heading.
       The blocks pages stack up to five Sections and each used to render
       its own h1, leaving the page with no single heading at all. */
    const h1s = document.querySelectorAll("h1").length;
    if (h1s !== 1) out.push(`${h1s} <h1> elements (expected exactly 1)`);

    document.querySelectorAll("input, select, textarea").forEach((el) => {
      const labelled =
        el.getAttribute("aria-label") ||
        el.getAttribute("aria-labelledby") ||
        (el.id && document.querySelector(`label[for="${el.id}"]`)) ||
        el.closest("label");
      if (!labelled) out.push(`unlabelled field: "${el.getAttribute("placeholder") ?? ""}"`);
    });

    return [...new Set(out)];
  });

  if (issues.length) {
    total += issues.length;
    console.log(`  ✗ ${route}`);
    issues.forEach((i) => console.log(`      ${i}`));
  }
}

console.log(
  total === 0
    ? `\n✓ ${ROUTES.length} routes: every control named, one h1 each`
    : `\n${total} problems across ${ROUTES.length} routes`,
);

await browser.close();
process.exit(total ? 1 : 0);
