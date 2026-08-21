<div align="center">

# hash-ui-blocks

**Whole strips of a page, for [HashUI](https://hashui.vercel.app).**

Twenty-one section-sized blocks — heroes, feature grids, logo clouds, footers,
app shells, maps and scroll-driven effects — built out of the core primitives,
so they inherit your tokens rather than bringing their own.

[![npm](https://img.shields.io/npm/v/hash-ui-blocks?color=059669&label=npm&logo=npm&logoColor=white)](https://www.npmjs.com/package/hash-ui-blocks)
[![license](https://img.shields.io/badge/license-MIT-059669)](LICENSE)

### **[hashui.vercel.app/docs/blocks →](https://hashui.vercel.app/docs/blocks)**

</div>

---

## Install

```bash
npm install hash-ui hash-ui-blocks
```

```css
/* order matters — the effects layer reads the core tokens */
@import "tailwindcss";
@import "hash-ui/css";
@import "hash-ui-blocks/css";
```

```tsx
import { HeroTerminal, FeaturesBento, CinematicFooter } from "hash-ui-blocks";

export default function Page() {
  return (
    <>
      <HeroTerminal title="Build faster." titleTrail="Scale infinitely." />
      <FeaturesBento items={features} />
      <CinematicFooter headline="Ready to begin?" />
    </>
  );
}
```

Requires **Tailwind CSS v4** and `hash-ui` as a peer. Every block ships working
demo content, so it renders as itself before you pass it anything.

---

## What is in it

| Group | Blocks |
| --- | --- |
| **Heroes** | `HeroTerminal` · `HeroSplit` · `HeroNexus` · `HeroCinematic` · `SplineHero` |
| **Features** | `FeaturesBento` · `FeaturesTerminal` · `FeaturesCrop` |
| **Logos** | `LogoCloud` · `LogoCloudPlus` · `LogoCloudSection` · `IntegrationsMarquee` |
| **Footers** | `CinematicFooter` · `GridFooter` |
| **App shell** | `DashboardShell` · `SidebarNav` · `RailSidebar` |
| **Maps & globe** | `Map` · `MapMarker` · `MarkerTooltip` · `MarkerLabel` · `GlobeFlights` |
| **Effects** | `LiquidMetalButton` · `GeminiRibbon` · `NeuralVortex` |

Plus the pieces they are assembled from, exported because blocks are meant to
be taken apart: `useRise`, `useInView`, `useScrollProgress`, `useMagnetic`,
`usePointer`, `ActionButton`, `SplitHeadline`, `WindowFrame`, `TerminalMock`,
`Sparkline`, `CropMarks` and the rest.

---

## Optional peers

`hash-ui` itself imports nothing but React, and this package keeps that true
for everything it can. Three blocks genuinely need a library, and each loads
it through a dynamic import behind a fallback — so you only pay for the one
you use, and a missing peer renders a message instead of throwing the page
away.

| Block | Peer | Install |
| --- | --- | --- |
| `SplineScene` / `SplineHero` | `@splinetool/react-spline` | `npm i @splinetool/react-spline` |
| `GlobeFlights` | `cobe` | `npm i cobe@^0.6.5` |
| `Map` and its markers | `maplibre-gl` | `npm i maplibre-gl` |

`cobe` is pinned to `^0.6.5` deliberately. Version 2.x advertises native arc
support, which would replace most of `GlobeFlights`, but 2.0.1 draws the sphere
with no landmasses at all — verified against its own README configuration.

---

## The effects layer

HashUI is flat by rule: every `--sh-*` token is `none`, and depth comes from
stacked surfaces and hairlines. This package is the one sanctioned exception.
Glow lives on the `.fx-*` classes in `blocks.css` and nowhere else, so it is
always something you opted into by name. Nothing here restyles a core
component.

Two things to know if you build on it:

- **A `-z-*` backdrop needs `isolate` on its block.** `position: relative`
  alone does not create a stacking context, so the layer escapes and paints
  behind whatever ancestor background it finds.
- **Every animation honours `prefers-reduced-motion`**, including the ones
  driven by a timer or `requestAnimationFrame`, which a stylesheet cannot
  reach. `useReducedMotion` from `hash-ui` is how they ask.

---

## Copy it instead

Every block is also a registry item, so the shadcn CLI will drop the source
into your project — imports rewritten, dependencies resolved:

```bash
npx shadcn@latest add https://hashui.vercel.app/r/hero-terminal.json
```

---

MIT © [Ahmet Hâşim Erdoğan](https://github.com/ahmethasmerdogan)
