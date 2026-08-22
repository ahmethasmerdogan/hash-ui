import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto("http://localhost:5180/docs/blocks/heroes", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(() =>
  [...document.querySelectorAll("figure :is(h1,h2)")].map(h => h.textContent)
), null, 1));
