/* ------------------------------------------------------------------ */
/* Target size — WCAG 2.2 §2.5.8 (AA).                                  */
/*                                                                      */
/*   node scripts/targets.mjs                                           */
/*                                                                      */
/* Every pointer target must be at least 24×24 CSS px, unless one of    */
/* the exceptions applies. The exceptions are most of the rule, and     */
/* checking the size alone reports a page full of violations that are   */
/* not violations:                                                      */
/*                                                                      */
/*   spacing — a 24px circle centred on the target may not reach any    */
/*             other target's circle. Small buttons with room around    */
/*             them pass, and this is why a sparse toolbar is fine.     */
/*   inline  — a link inside a sentence is sized by the text.           */
/*   hidden  — an sr-only skip link measures 1×1 until it is focused.   */
/* ------------------------------------------------------------------ */

import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASE = process.env.BASE_URL ?? "http://localhost:5180";

const routesSrc = await readFile(`${ROOT}apps/docs/src/lib/routes.ts`, "utf8");
const ALL = ["/", ...[...routesSrc.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1])];
const ROUTES = process.env.TARGETS_ONLY
  ? ALL.filter((r) => r.includes(process.env.TARGETS_ONLY))
  : ALL;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

const offenders = new Map();

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const found = await page.evaluate(() => {
    const MIN = 24;
    const sel =
      "a[href],button,input:not([type=hidden]),select,summary,[role=button],[role=option],[role=tab],[role=switch],[role=checkbox]";

    const targets = [];
    for (const el of document.querySelectorAll(sel)) {
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden" || s.pointerEvents === "none") continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      /* sr-only: 1×1 clipped until focus, at which point it is full size */
      if (r.width <= 2 && r.height <= 2) continue;
      /* inline exception: a link flowing inside a block of text */
      if (el.tagName === "A" && s.display.startsWith("inline") && el.closest("p,li,td,figcaption,blockquote"))
        continue;
      targets.push({ el, r });
    }

    const out = [];
    for (const { el, r } of targets) {
      if (r.width >= MIN && r.height >= MIN) continue;

      /* spacing exception: no other target's 24px circle may overlap ours */
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let crowded = false;
      for (const other of targets) {
        if (other.el === el || el.contains(other.el) || other.el.contains(el)) continue;
        const o = other.r;
        const ox = o.left + o.width / 2, oy = o.top + o.height / 2;
        if (Math.hypot(cx - ox, cy - oy) < MIN) { crowded = true; break; }
      }
      if (!crowded) continue;

      out.push({
        w: Math.round(r.width), h: Math.round(r.height), tag: el.tagName.toLowerCase(),
        name: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30),
        cls: String(el.className.baseVal ?? el.className ?? "").slice(0, 52),
      });
    }
    return out;
  });

  for (const f of found) {
    const key = `${f.tag} ${f.w}×${f.h} "${f.name}"  ${f.cls}`;
    const rec = offenders.get(key) ?? { n: 0, routes: [] };
    rec.n++;
    if (rec.routes.length < 3 && !rec.routes.includes(route)) rec.routes.push(route);
    offenders.set(key, rec);
  }
}

await browser.close();

if (offenders.size === 0) {
  console.log(`\n✓ ${ROUTES.length} routes: every crowded target is at least 24×24`);
  process.exit(0);
}

console.log(`\n${offenders.size} target${offenders.size === 1 ? "" : "s"} under 24px with another target inside 24px of it:\n`);
for (const [k, v] of [...offenders].sort((a, z) => z[1].n - a[1].n))
  console.log(`  ${String(v.n).padStart(3)}×  ${k}\n        ${v.routes.join(", ")}`);
process.exit(1);
