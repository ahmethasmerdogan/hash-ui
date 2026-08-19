/* ------------------------------------------------------------------ */
/* Filmstrip — see an animation instead of measuring it.                */
/*                                                                      */
/*   node scripts/filmstrip.mjs <route> <selector> [frames] [gapMs]     */
/*                                                                      */
/* Grabs N frames of one element and lays them out side by side in a    */
/* single PNG, so a still animation is obvious at a glance and a        */
/* working one can be read for timing and easing.                       */
/*                                                                      */
/* Optional flags:                                                      */
/*   --scroll <selector>   scroll this into view first                  */
/*   --hover  <selector>   hover this before capturing                  */
/*   --drag             sweep the pointer across the element as it runs */
/*   --scrollBy <px>     scroll the page by this much between frames    */
/*   --wait <ms>         settle before the first frame                  */
/*   --out <path>        default .shots/filmstrip.png                   */
/* ------------------------------------------------------------------ */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const [, , route, selector, framesArg, gapArg] = process.argv;
if (!route || !selector) {
  console.error(
    "usage: node scripts/filmstrip.mjs <route> <selector> [frames] [gapMs]",
  );
  process.exit(2);
}

const flag = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const has = (name) => process.argv.includes(`--${name}`);

const BASE = process.env.QA_URL ?? "http://localhost:5180";
const FRAMES = Number(framesArg ?? 6);
const GAP = Number(gapArg ?? 400);
const OUT = flag("out", ".shots/filmstrip.png");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
/* `--fresh` starts photographing as soon as the document commits, which is
   the only way to catch an entrance animation that plays on mount. */
const fresh = has("fresh");
await page.goto(BASE + route, { waitUntil: fresh ? "commit" : "domcontentloaded" });
if (!fresh) {
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  await page.waitForTimeout(900);
}

const scrollSel = flag("scroll");
if (scrollSel) {
  const anchor = page.locator(scrollSel).first();
  await anchor.waitFor({ state: "visible", timeout: 20000 });
  await anchor.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
}

const el = page.locator(selector).nth(Number(flag("nth", 0)));
await el.waitFor({ state: fresh ? "attached" : "visible", timeout: 25000 });
if (!fresh) await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(Number(flag("wait", fresh ? 0 : 600)));

const hoverSel = flag("hover");
if (hoverSel) {
  await page.locator(hoverSel).first().hover();
  await page.waitForTimeout(200);
}

const box = await el.boundingBox();
const shots = [];
for (let i = 0; i < FRAMES; i++) {
  if (has("drag") && box) {
    /* sweep left → right across the element while frames are taken */
    const t = i / Math.max(1, FRAMES - 1);
    await page.mouse.move(
      box.x + box.width * (0.12 + 0.76 * t),
      box.y + box.height * (0.25 + 0.5 * t),
      { steps: 4 },
    );
  }
  const by = Number(flag("scrollBy", 0));
  if (by && i > 0) {
    await page.mouse.wheel(0, by);
  }
  await page.waitForTimeout(i === 0 ? 0 : GAP);
  /* clipped page shot rather than element.screenshot(): Playwright waits for
     an element to be stable, and an animating one never is */
  const b2 = await el.boundingBox();
  const buf = b2
    ? await page.screenshot({
        clip: {
          x: Math.max(0, b2.x),
          y: Math.max(0, b2.y),
          width: Math.min(b2.width, 1440 - Math.max(0, b2.x)),
          height: Math.min(b2.height, 1000 - Math.max(0, b2.y)),
        },
        animations: "allow",
        timeout: 20000,
      })
    : await page.screenshot({ animations: "allow" });
  shots.push("data:image/png;base64," + buf.toString("base64"));
}

/* stitch inside the page — no image library needed on this side */
const stitched = await page.evaluate(async ([srcs, gap]) => {
  const load = (src) =>
    new Promise((res) => {
      const i = new Image();
      i.onload = () => res(i);
      i.src = src;
    });
  const imgs = await Promise.all(srcs.map(load));
  const w = imgs[0].width;
  const h = imgs[0].height;
  const label = 22;
  const c = document.createElement("canvas");
  c.width = w * imgs.length + gap * (imgs.length - 1);
  c.height = h + label;
  const g = c.getContext("2d");
  g.fillStyle = "#111";
  g.fillRect(0, 0, c.width, c.height);
  imgs.forEach((img, i) => {
    const x = i * (w + gap);
    g.drawImage(img, x, label);
    g.fillStyle = "#9ca3af";
    g.font = "13px ui-monospace, monospace";
    g.fillText(`frame ${i}`, x + 4, 15);
  });
  return c.toDataURL("image/png");
}, [shots, 10]);

await mkdir(".shots", { recursive: true });
await writeFile(OUT, Buffer.from(stitched.split(",")[1], "base64"));
console.log(`${FRAMES} frames × ${GAP}ms → ${OUT}`);

await browser.close();
