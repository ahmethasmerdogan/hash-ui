/* Rasterise the brand SVGs the social crawlers cannot read.
 *
 *   node scripts/make-og.mjs
 *
 * og.svg           → og.png (1200×630, the Open Graph card)
 * favicon.svg      → apple-touch-icon.png (180×180)
 */
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PUBLIC = fileURLToPath(new URL("../apps/docs/public/", import.meta.url));

const JOBS = [
  { svg: "og.svg", png: "og.png", w: 1200, h: 630 },
  { svg: "favicon.svg", png: "apple-touch-icon.png", w: 180, h: 180 },
];

const browser = await chromium.launch();

for (const { svg, png, w, h } of JOBS) {
  const markup = await readFile(PUBLIC + svg, "utf8");
  const page = await browser.newPage({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<!doctype html><style>
       html,body{margin:0;padding:0;width:${w}px;height:${h}px;overflow:hidden}
       svg{display:block;width:${w}px;height:${h}px}
     </style>${markup}`,
    { waitUntil: "networkidle" },
  );
  /* let the webfont fall back deterministically before we shoot */
  await page.waitForTimeout(300);
  await page.screenshot({ path: PUBLIC + png });
  await page.close();
  console.log(`${svg} → ${png} (${w}×${h})`);
}

await browser.close();
