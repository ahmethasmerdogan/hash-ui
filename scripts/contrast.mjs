/* ------------------------------------------------------------------ */
/* Contrast sweep — every accent, both themes.                          */
/*                                                                      */
/*   npm run dev                                                        */
/*   node scripts/contrast.mjs                                          */
/*                                                                      */
/* v0.6 added five accent presets in two themes: ten palettes, none of  */
/* them checked. An accent is used for text on the canvas, for text on  */
/* the tinted surface, and as a solid fill under white — and a hue that */
/* passes in one of those can fail badly in another. Amber is the       */
/* classic offender.                                                    */
/*                                                                      */
/* Checks the WCAG AA thresholds: 4.5 for body text, 3.0 for large text */
/* and for the boundary of a UI component.                              */
/* ------------------------------------------------------------------ */

import { chromium } from "playwright";

const BASE = process.env.QA_URL ?? "http://localhost:5180";
const ACCENTS = ["emerald", "blue", "violet", "amber", "rose"];
const THEMES = ["light", "dark"];

/* WCAG relative luminance, then the contrast ratio between two colours. */
const SRGB = `
function lum(c) {
  const a = c.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
/* keep the alpha: a translucent tint has to be composited over whatever it
   actually sits on before its contrast means anything */
function parse(s) {
  const m = s.match(/rgba?\\(([^)]+)\\)/);
  if (!m) return null;
  const p = m[1].split(/[,\\s/]+/).filter(Boolean).map((x) => parseFloat(x));
  return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
}
function over(fg, bg) {
  return fg.rgb.map((c, i) => c * fg.a + bg.rgb[i] * (1 - fg.a));
}
function ratio(fgRaw, bgRaw) {
  /* both sides are flattened onto the page canvas first */
  const bg = Array.isArray(bgRaw) ? bgRaw : over(bgRaw, PAGE);
  const fg = Array.isArray(fgRaw) ? fgRaw : over(fgRaw, { rgb: bg, a: fgRaw.a });
  const a = lum(fg), b = lum(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}
`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const failures = [];
const rows = [];

for (const accent of ACCENTS) {
  for (const theme of THEMES) {
    await page.goto(`${BASE}/docs/theming`, { waitUntil: "domcontentloaded" });
    await page.evaluate(
      ([a, t]) => {
        localStorage.setItem("hashui-accent", a);
        localStorage.setItem("hashui-theme", t);
      },
      [accent, theme],
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);

    const readings = await page.evaluate(
      `(() => {
        ${SRGB}
        const cs = getComputedStyle(document.documentElement);
        const v = (n) => cs.getPropertyValue(n).trim();

        /* resolve a token to rgb by painting it on a throwaway node */
        const probe = document.createElement("div");
        document.body.appendChild(probe);
        const rgb = (value, prop) => {
          probe.style.cssText = "";
          probe.style[prop] = value;
          const out = getComputedStyle(probe)[prop];
          return parse(out);
        };

        const canvas = rgb(v("--canvas"), "backgroundColor");
        /* everything ultimately sits on the canvas */
        globalThis.PAGE = { rgb: canvas.rgb, a: 1 };
        const surface = rgb(v("--surface"), "backgroundColor");
        const brand = rgb(v("--brand"), "color");
        const brandInk = rgb(v("--brand-ink"), "color");
        const brandSoft = rgb(v("--brand-soft"), "backgroundColor");
        const btnA = rgb(v("--btn-brand-a"), "backgroundColor");
        const btnB = rgb(v("--btn-brand-b"), "backgroundColor");
        const btnFg = rgb(v("--btn-brand-fg") || "#fff", "color");
        /* the label is vertically centred, so it sits on the middle of the
           gradient — not on either stop */
        const btnMid = btnA.rgb.map((c, i) => (c + btnB.rgb[i]) / 2);
        const ink = rgb(v("--ink"), "color");
        const ink2 = rgb(v("--ink2"), "color");
        probe.remove();

        return {
          "brand text on canvas": ratio(brand, canvas.rgb),
          "brand text on surface": ratio(brand, surface.rgb),
          "brand-ink on brand-soft": ratio(brandInk, over(brandSoft, surface)),
          "label on the button face": ratio(btnFg, btnMid),
          "ink on canvas": ratio(ink, canvas.rgb),
          "ink-2 on canvas": ratio(ink2, canvas.rgb),
        };
      })()`,
    );

    for (const [what, r] of Object.entries(readings)) {
      /* the button face carries a label, the rest is text or a boundary */
      const min =
        what.includes("ink on canvas") || what.includes("label on") ? 4.5 : 3.0;
      const ok = r >= min;
      rows.push({ accent, theme, what, ratio: r.toFixed(2), min, ok });
      if (!ok) failures.push(`${accent}/${theme}: ${what} = ${r.toFixed(2)} (needs ${min})`);
    }
  }
}

const worst = new Map();
for (const r of rows) {
  const k = r.what;
  if (!worst.has(k) || Number(r.ratio) < Number(worst.get(k).ratio)) worst.set(k, r);
}

console.log(`${ACCENTS.length} accents × ${THEMES.length} themes\n`);
console.log("worst reading per surface:");
for (const [what, r] of worst) {
  console.log(
    `  ${r.ok ? "✓" : "✗"} ${what.padEnd(26)} ${String(r.ratio).padStart(6)}  (min ${r.min})  ← ${r.accent}/${r.theme}`,
  );
}

if (failures.length) {
  console.log(`\n${failures.length} below threshold:`);
  failures.forEach((f) => console.log("   " + f));
} else {
  console.log(`\n✓ every accent clears WCAG AA in both themes`);
}

await browser.close();
process.exit(failures.length ? 1 : 0);
