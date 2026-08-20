/* ------------------------------------------------------------------ */
/* Reflow — no page may scroll sideways.                                */
/*                                                                      */
/*   node scripts/reflow.mjs                                            */
/*                                                                      */
/* WCAG 2.2 §1.4.10 asks that content reflow to 320 CSS px without a    */
/* horizontal scrollbar. Nothing was checking it, and every route       */
/* failed: 57 grids sized their single implicit column to their widest  */
/* child, block titles are unbreakable tokens 330px wide, and the       */
/* header turned on 274px of navigation at exactly the width that had   */
/* no room for it.                                                      */
/*                                                                      */
/* Screenshots do not catch this — the page looks correct, it just      */
/* happens to be wider than the window. The measurement is one number.  */
/* ------------------------------------------------------------------ */

import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASE = process.env.BASE_URL ?? "http://localhost:5180";

const routesSrc = await readFile(`${ROOT}apps/docs/src/lib/routes.ts`, "utf8");
const ALL = ["/", ...[...routesSrc.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1])];
/* REFLOW_ONLY=logos narrows the sweep while you are chasing one page —
   the full run is 198 navigations and too slow to iterate against */
const ROUTES = process.env.REFLOW_ONLY
  ? ALL.filter((r) => r.includes(process.env.REFLOW_ONLY))
  : ALL;

/* the narrow end is the WCAG floor and the common phones; 768 is the one
   that caught the header, because it is where `md:` turns on */
const WIDTHS = [320, 375, 414, 768, 1024, 1440];

async function goTo(page, url) {
  for (let attempt = 1; ; attempt++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      return;
    } catch (err) {
      if (attempt >= 3) throw err;
      console.log(`  … ${url} did not answer, retry ${attempt}`);
      await page.waitForTimeout(2000 * attempt);
    }
  }
}

const browser = await chromium.launch();
const failures = [];

for (const width of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    isMobile: width < 640,
    hasTouch: width < 640,
  });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    /* against a deployed URL rather than a local dev server, one cold
       navigation in a sweep of two hundred will occasionally exceed the
       default timeout. That is the network, not the page — retry once
       before treating it as a failure. */
    await goTo(page, BASE + route);
    await page.waitForTimeout(1100);

    const { vw, sw, culprit } = await page.evaluate(() => {
      const d = document.documentElement;
      if (d.scrollWidth <= d.clientWidth + 1) return { vw: d.clientWidth, sw: d.scrollWidth };

      /* name the widest thing that no ancestor clips — a rect alone is not
         evidence, since anything inside an overflow-hidden box reports its
         full width while contributing nothing to the page */
      let worst = null;
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.right <= d.clientWidth + 1) continue;
        if (getComputedStyle(el).position === "fixed") continue;
        let a = el.parentElement, clipped = false;
        while (a && a !== d) {
          if (getComputedStyle(a).overflowX !== "visible") { clipped = true; break; }
          a = a.parentElement;
        }
        if (clipped) continue;
        const pr = el.parentElement?.getBoundingClientRect();
        if (pr && pr.right > d.clientWidth + 1) continue;
        const over = r.right - d.clientWidth;
        if (!worst || over > worst.over)
          worst = {
            over: Math.round(over),
            tag: el.tagName.toLowerCase(),
            cls: String(el.className.baseVal ?? el.className ?? "").slice(0, 60),
          };
      }
      return { vw: d.clientWidth, sw: d.scrollWidth, culprit: worst };
    });

    if (sw > vw + 1) {
      failures.push({ width, route, over: sw - vw, culprit });
      console.log(
        `  ✗ ${String(width).padStart(4)}px ${route} — ${sw - vw}px too wide` +
          (culprit ? `\n      ${culprit.tag}.${culprit.cls}` : ""),
      );
    }
  }
  await ctx.close();
}

await browser.close();

const total = WIDTHS.length * ROUTES.length;
console.log(
  failures.length === 0
    ? `\n✓ ${total} route × width combinations, none scrolls sideways`
    : `\n${failures.length} of ${total} combinations overflow`,
);
process.exit(failures.length ? 1 : 0);
