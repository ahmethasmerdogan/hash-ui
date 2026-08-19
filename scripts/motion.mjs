/* ------------------------------------------------------------------ */
/* Motion QA — does the thing that claims to move actually move?        */
/*                                                                      */
/*   npm run dev              # in one terminal                         */
/*   node scripts/motion.mjs  # in another                              */
/*   node scripts/motion.mjs globe   # one check by id                  */
/*                                                                      */
/* Screenshots alone cannot tell a working animation from a frozen one, */
/* which is exactly how a block ships looking finished and sitting      */
/* still. Every check below grabs two frames of one element — around a  */
/* wait, a hover, a click or a scroll — and reports the fraction of     */
/* pixels that changed between them.                                    */
/*                                                                      */
/* The comparison is done inside the page: the PNGs are decoded onto a  */
/* 2D canvas and diffed there, so this needs no image library.          */
/* ------------------------------------------------------------------ */

import { chromium } from "playwright";

const BASE = process.env.QA_URL ?? "http://localhost:5180";
const only = process.argv[2];

/* A check either passes `min` (it moved enough) or fails.
   `max` catches the opposite failure: something that should be still. */
const CHECKS = [
  /* ---------------------------------------------------------- effects */
  {
    id: "liquid-metal-sheen",
    route: "/docs/blocks/effects",
    sel: "button.group\\/lm",
    what: "the conic sheen keeps turning under the metal",
    kind: "idle",
    waitMs: 700,
    min: 0.01,
  },
  {
    id: "liquid-metal-ripple",
    route: "/docs/blocks/effects",
    sel: "button.group\\/lm",
    what: "clicking leaves a ripple from the click point",
    kind: "click",
    settleMs: 140,
    min: 0.02,
  },
  {
    id: "gemini-scroll",
    route: "/docs/blocks/effects",
    sel: "figure:has(svg path[stroke='#FFB7C5'])",
    what: "the five ribbons draw as its frame is scrolled",
    kind: "scrollInside",
    scrollSel: ".overflow-y-auto:has(svg path[stroke='#FFB7C5'])",
    by: 900,
    min: 0.005,
  },
  {
    id: "neural-vortex",
    route: "/docs/blocks/effects",
    sel: "canvas",
    what: "the vortex shader animates on its own",
    kind: "idle",
    waitMs: 700,
    min: 0.02,
  },
  {
    id: "neural-vortex-pointer",
    route: "/docs/blocks/effects",
    sel: "canvas",
    what: "the field leans towards the pointer",
    kind: "pointer",
    min: 0.02,
  },

  /* ------------------------------------------------------------ logos */
  {
    id: "integrations-marquee",
    route: "/docs/blocks/logos",
    sel: "figure:has(.fx-mask-radial)",
    what: "the three chip rows drift past each other",
    kind: "idle",
    waitMs: 900,
    min: 0.01,
  },
  {
    id: "logo-hover",
    route: "/docs/blocks/logos",
    sel: "figure:has(.group\\/logo)",
    what: "a logo cell lifts out of grayscale on hover",
    kind: "hoverChild",
    childSel: ".group\\/logo",
    min: 0.0008,
  },

  /* ----------------------------------------------------------- heroes */
  {
    id: "nexus-rotating-word",
    route: "/docs/blocks/heroes",
    sel: "figure:has(input[type='email'])",
    what: "the last word of the headline cycles",
    kind: "idle",
    waitMs: 2200,
    min: 0.0015,
  },
  {
    id: "nexus-dot-grid",
    route: "/docs/blocks/heroes",
    /* the hero section itself — the enclosing figure adds a dot-grid tile of
       its own, which would drown the effect being measured */
    /* the hero's own root — `section:has(input…)` also matches the docs
       page's <section>, whose dot-grid tile would drown the effect */
    sel: "section:has(> .dot-grid)",
    what: "the bright dot field follows the pointer",
    kind: "pointer",
    min: 0.002,
  },
  {
    id: "cinematic-reveal",
    route: "/docs/blocks/heroes",
    sel: "figure:has(.fx-aurora)",
    what: "the headline rises word by word once seen",
    kind: "enter",
    waitMs: 0,
    settleMs: 1600,
    min: 0.004,
  },
  {
    id: "cinematic-aurora",
    route: "/docs/blocks/heroes",
    /* the media layer alone; inside the whole figure a 22s drift behind a
       vignette is far below the per-pixel threshold */
    sel: ".fx-aurora",
    preScroll: "h1:text-is('HeroCinematic')",
    preScrollMs: 900,
    noScroll: true,
    what: "the aurora behind the cinematic hero drifts",
    kind: "idle",
    waitMs: 5000,
    min: 0.002,
  },
  {
    id: "spline-mounts",
    route: "/docs/blocks/heroes",
    /* the canvas only exists after the block is near the viewport, so the
       heading is the anchor we can actually scroll to first */
    preScroll: "h1:text-is('SplineScene')",
    preScrollMs: 1000,
    sel: "canvas[data-spline-canvas], .spline-host canvas, canvas",
    nth: 0,
    timeout: 25000,
    what: "the Spline canvas mounts at all",
    kind: "idle",
    waitMs: 1500,
    settleMs: 4000,
    min: 0,
  },
  {
    id: "spline-3d",
    route: "/docs/blocks/heroes",
    preScroll: "h1:text-is('SplineScene')",
    preScrollMs: 1000,
    sel: "canvas",
    timeout: 25000,
    what: "the Spline scene renders and keeps animating",
    kind: "pointer",
    waitMs: 4000,
    min: 0.004,
  },

  {
    id: "hero-terminal-enter",
    route: "/docs/blocks/heroes",
    sel: "section:has(> .fx-grid)",
    what: "HeroTerminal fades its content up on entry",
    kind: "load",
    waitMs: 0,
    settleMs: 1500,
    min: 0.01,
  },
  {
    id: "hero-split-enter",
    route: "/docs/blocks/heroes",
    sel: "figure:has(h1:text-is('Ship 10× faster with HashUI'))",
    what: "HeroSplit fades its headline and CTAs up",
    kind: "enter",
    waitMs: 0,
    settleMs: 1400,
    min: 0.004,
  },

  /* ---------------------------------------------------------- features */
  {
    id: "features-bento-enter",
    route: "/docs/blocks/features",
    sel: "figure:has(.grid.grid-cols-1.md\\:grid-cols-12)",
    what: "the bento cards stagger in",
    kind: "load",
    waitMs: 0,
    settleMs: 1500,
    min: 0.01,
  },
  {
    id: "features-terminal-enter",
    route: "/docs/blocks/features",
    sel: "figure:has(.grid.grid-cols-1.md\\:grid-cols-12)",
    nth: 1,
    what: "the terminal cards stagger in",
    kind: "enter",
    waitMs: 0,
    settleMs: 1500,
    min: 0.01,
  },
  {
    id: "features-crop-enter",
    route: "/docs/blocks/features",
    sel: "figure:has([data-fx-rise])",
    nth: 2,
    what: "the crop plates stagger in",
    kind: "enter",
    waitMs: 0,
    settleMs: 1500,
    min: 0.01,
  },

  /* ---------------------------------------------------------- footers */
  {
    id: "footer-marquee",
    route: "/docs/blocks/footers",
    /* the band itself. The first figure on the page is the reveal demo, whose
       footer sits below its own scroll box and is never in frame. */
    sel: "[data-fx-marquee]",
    nth: 1,
    what: "the tilted band scrolls its items",
    kind: "idle",
    waitMs: 1400,
    min: 0.02,
  },
  {
    id: "magnetic-pill",
    route: "/docs/blocks/footers",
    /* the standalone footer, not the one hidden inside the reveal demo */
    sel: "figure:has(footer) >> nth=1",
    what: "a CTA pill is pulled towards the cursor",
    kind: "hoverChild",
    childSel: "footer a.fx-glass",
    childNth: 2,
    nudge: [26, 14],
    min: 0.001,
  },

  {
    id: "footer-parallax",
    route: "/docs/blocks/footers",
    /* the standalone footer, whose content drifts against the page scroll */
    sel: "figure:has(footer) >> nth=1",
    what: "the band and the sign-off drift against the scroll",
    kind: "scrollPage",
    by: 420,
    min: 0.01,
  },
  {
    id: "cinematic-kenburns",
    route: "/docs/blocks/heroes",
    sel: ".fx-kenburns",
    preScroll: "h1:text-is('HeroCinematic')",
    preScrollMs: 900,
    noScroll: true,
    what: "the stand-in backdrop keeps pushing in",
    kind: "idle",
    waitMs: 4000,
    min: 0.004,
  },
  {
    id: "grid-footer-sweep",
    route: "/docs/blocks/footers",
    /* the cell, not the wash inside it: an absolutely-positioned span has no
       box of its own to scroll to */
    sel: "div:has(> .fx-sweep)",
    preScroll: "figure:has(.fx-sweep)",
    preScrollMs: 900,
    what: "the lit cell's wash drifts across",
    kind: "idle",
    waitMs: 3000,
    min: 0.01,
  },

  /* -------------------------------------------------------- app shell */
  {
    id: "sidebar-expand",
    route: "/docs/blocks/app-shell",
    sel: "figure:has(nav), figure:has([aria-expanded])",
    what: "a nav item expands its children",
    kind: "clickChild",
    childSel: "[aria-expanded='false']",
    settleMs: 420,
    min: 0.004,
  },
  {
    id: "workspace-menu",
    route: "/docs/blocks/app-shell",
    sel: "figure:has([aria-haspopup='listbox'])",
    what: "the workspace switcher opens its menu",
    kind: "clickChild",
    childSel: "[aria-haspopup='listbox']",
    settleMs: 260,
    min: 0.004,
  },

  /* -------------------------------------------------------------- geo */
  {
    id: "globe-rotation",
    route: "/docs/blocks/geo",
    /* the wrapper, not the canvas: cobe draws no landmasses under headless,
       so a rotating sphere is pixel-identical frame to frame. The arcs and
       their glyphs live in a sibling <svg>, and those do move. */
    sel: "div:has(> canvas[aria-label*='globe'])",
    what: "the globe keeps turning (measured on the arcs)",
    kind: "idle",
    waitMs: 1200,
    min: 0.001,
  },
  {
    id: "map-tooltip",
    route: "/docs/blocks/geo",
    sel: "figure:has(.maplibregl-canvas)",
    what: "hovering a marker shows its tooltip",
    kind: "hoverChild",
    childSel: "[class*='ring-white']",
    settleMs: 260,
    min: 0.0006,
  },
];

/* ------------------------------------------------------------------ */

/**
 * Decode two PNGs in the page and report the fraction of changed pixels.
 *
 * This is passed to page.evaluate as a real function, not a string —
 * Playwright evaluates a string as an *expression*, so a stringified arrow
 * function is returned rather than called, and every reading comes back NaN.
 */
function diffInPage([a, b]) {
  return new Promise((resolve) => {
    const load = (src) =>
      new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = src;
      });
    Promise.all([load(a), load(b)])
      .then(([ia, ib]) => {
        const w = Math.min(ia.width, ib.width);
        const h = Math.min(ia.height, ib.height);
        if (!w || !h) return resolve(0);
        const data = (img) => {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          const g = c.getContext("2d");
          g.drawImage(img, 0, 0);
          return g.getImageData(0, 0, w, h).data;
        };
        const da = data(ia);
        const db = data(ib);
        let changed = 0;
        for (let i = 0; i < da.length; i += 4) {
          const d =
            Math.abs(da[i] - db[i]) +
            Math.abs(da[i + 1] - db[i + 1]) +
            Math.abs(da[i + 2] - db[i + 2]);
          if (d > 12) changed++;
        }
        resolve(changed / (w * h));
      })
      .catch(() => resolve(0));
  });
}

/**
 * Capture one element.
 *
 * Deliberately a clipped *page* screenshot rather than element.screenshot():
 * Playwright waits for an element to be stable before photographing it, and
 * a continuously animating layer is never stable — which is precisely the
 * case this tool exists to measure.
 */
async function shot(el, page) {
  const box = await el.boundingBox();
  if (!box || box.width < 1 || box.height < 1) return null;
  const clip = {
    x: Math.max(0, box.x),
    y: Math.max(0, box.y),
    width: Math.min(box.width, 1440 - Math.max(0, box.x)),
    height: Math.min(box.height, 1000 - Math.max(0, box.y)),
  };
  if (clip.width < 1 || clip.height < 1) return null;
  const buf = await page.screenshot({ clip, animations: "allow", timeout: 15000 });
  return "data:image/png;base64," + buf.toString("base64");
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (e) => console.log("    ! pageerror:", String(e).slice(0, 120)));

const results = [];
const checks = only ? CHECKS.filter((c) => c.id.includes(only)) : CHECKS;

for (const c of checks) {
  let note = "";
  let ratio = 0;
  try {
    await page.goto(BASE + c.route, { waitUntil: "domcontentloaded" });
    await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await page.waitForTimeout(900);

    /* Some blocks only mount once they are near the viewport, so the thing
       we want to measure cannot be waited for until something else has been
       scrolled to. `preScroll` is that something else. */
    if (c.preScroll) {
      const anchor = page.locator(c.preScroll).first();
      await anchor.waitFor({ state: "visible", timeout: 15000 });
      await anchor.scrollIntoViewIfNeeded();
      await page.waitForTimeout(c.preScrollMs ?? 600);
    }

    const el = page.locator(c.sel).nth(c.nth ?? 0);
    await el.waitFor({ state: "visible", timeout: c.timeout ?? 15000 });
    /* an absolutely-positioned layer inside an overflow-hidden box cannot be
       scrolled to on its own — `preScroll` has already put it in frame */
    if (!c.noScroll) await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(c.waitMs ?? 500);

    if (c.kind === "idle") {
      if (c.settleMs) await page.waitForTimeout(c.settleMs);
      const a = await shot(el, page);
      await page.waitForTimeout(c.waitMs ?? 600);
      const b = await shot(el, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }

    if (c.kind === "load") {
      /* For a block that sits at the top of its page there is no "scroll it
         into view" moment — its entrance plays on mount. Reload and start
         photographing as early as the element exists. */
      await page.goto(BASE + c.route, { waitUntil: "commit" });
      const fresh = page.locator(c.sel).nth(c.nth ?? 0);
      await fresh.waitFor({ state: "attached", timeout: c.timeout ?? 15000 });
      const a = await shot(fresh, page);
      await page.waitForTimeout(c.settleMs ?? 1500);
      const b = await shot(fresh, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }

    if (c.kind === "enter") {
      /* park at the top so the element is genuinely off screen, then bring it
         in and photograph the transition from its first frame */
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(350);
      await el.scrollIntoViewIfNeeded();
      const a = await shot(el, page);
      await page.waitForTimeout(c.settleMs ?? 1500);
      const b = await shot(el, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }

    if (c.kind === "reload-then-settle") {
      /* re-enter the page so the reveal has not already played */
      await page.goto(BASE + c.route, { waitUntil: "domcontentloaded" });
      await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
      const el2 = page.locator(c.sel).first();
      await el2.waitFor({ state: "visible", timeout: 15000 });
      const a = await shot(el2, page);
      await el2.scrollIntoViewIfNeeded();
      await page.waitForTimeout(c.settleMs ?? 1200);
      const b = await shot(el2, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }

    if (c.kind === "click") {
      const a = await shot(el, page);
      const box = await el.boundingBox();
      await page.mouse.click(box.x + box.width * 0.35, box.y + box.height * 0.5);
      await page.waitForTimeout(c.settleMs ?? 150);
      const b = await shot(el, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }

    if (c.kind === "clickChild") {
      const child = page.locator(c.childSel).nth(c.childNth ?? 0);
      await child.waitFor({ state: "visible", timeout: 10000 });
      const a = await shot(el, page);
      await child.click({ force: true });
      await page.waitForTimeout(c.settleMs ?? 350);
      const b = await shot(el, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }

    if (c.kind === "hoverChild") {
      const child = page.locator(c.childSel).nth(c.childNth ?? 0);
      await child.waitFor({ state: "visible", timeout: 10000 });
      const a = await shot(el, page);
      const box = await child.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      if (c.nudge) {
        await page.mouse.move(
          box.x + box.width / 2 + c.nudge[0],
          box.y + box.height / 2 + c.nudge[1],
          { steps: 6 },
        );
      }
      await page.waitForTimeout(c.settleMs ?? 320);
      const b = await shot(el, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }

    if (c.kind === "pointer") {
      const box = await el.boundingBox();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3);
      await page.waitForTimeout(320);
      const a = await shot(el, page);
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.7, {
        steps: 10,
      });
      await page.waitForTimeout(320);
      const b = await shot(el, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }

    if (c.kind === "scrollPage") {
      const a = await shot(el, page);
      await page.mouse.wheel(0, c.by ?? 500);
      await page.waitForTimeout(c.settleMs ?? 450);
      const b = await shot(el, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }

    if (c.kind === "scrollInside") {
      const a = await shot(el, page);
      await page.evaluate(
        ([sel, by]) => {
          const box = document.querySelector(sel);
          if (box) box.scrollTop += by;
        },
        [c.scrollSel, c.by ?? 600],
      );
      await page.waitForTimeout(450);
      const b = await shot(el, page);
      ratio = a && b ? await page.evaluate(diffInPage, [a, b]) : -1;
    }
  } catch (e) {
    note = String(e.message ?? e).split("\n")[0].slice(0, 90);
  }

  const ok = !note && ratio >= (c.min ?? 0.01);
  results.push({ ...c, ratio, ok, note });
  console.log(
    `${ok ? "  ✓" : "  ✗"} ${c.id.padEnd(24)} ${(ratio * 100).toFixed(2).padStart(6)}% changed  ${note || c.what}`,
  );
}

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} moving.` +
    (failed.length ? `  still: ${failed.map((f) => f.id).join(", ")}` : ""),
);

await browser.close();
process.exit(failed.length ? 1 : 0);
