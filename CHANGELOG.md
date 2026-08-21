# Changelog

All notable changes to UICean. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the packages
follow [semantic versioning](https://semver.org/spec/v2.0.0.html).

`uicean` and `uicean-blocks` are versioned together.

---

## [0.6.2] — 2026-08-21

### Fixed

- **The npm description was cut off mid-word.** npm truncates at 255
  characters and 0.6.1's was 270, so the package page ended on "No runtime
  depend". It is 226 now.

- **`uicean-blocks` asked for `uicean@^0.5.0 || ^0.6.0`.** The `^0.5.0` half
  was carried over verbatim from the old scoped name and points at a version
  that has never existed under this one.

- The terminal in `HeroTerminal` typed `npx create-hash-app@latest`. The
  rename swept every spelling of the package name and missed this, because it
  is not the package name.

---

## [0.6.1] — 2026-08-21

### Changed

- **The mark is three waves, not a hash.** The hash belonged to the old name.
  The tile is unchanged — it still carries the button-face recipe, so the
  logo is a spec of the design language — and the glyph now says what the
  name says. Three waves rather than four, at this amplitude rather than
  more, because at 16px in a browser tab any tighter and they merge.

- **The package descriptions say what is actually in here.** The published
  0.6.0 said "70+ components and 83 hand-drawn icons", which was written
  before forms, tables and the whole overlay family landed. It is 96
  components and 83 icons, counted rather than remembered.

---

## [0.6.0] — 2026-08-21

### Added

- **The overlay family.** `Popover`, `HoverCard`, `Sheet`, `AlertDialog`,
  `Combobox`, `Command`, `Calendar`, `DatePicker`, `Collapsible`,
  `ScrollArea`, `AspectRatio` and `InputOTP` — the structural half of shadcn's
  set, which UICean had none of.

  `overlay-primitives.ts` holds the four jobs every one of them has:
  dismissing, trapping focus, locking the scroll and standing next to
  something. Anchoring is a rect, a flip and a clamp — no floating-ui, which
  is 30 kB and most of this package.

  No date library either. `Intl` supplies the month and weekday names, so the
  calendar speaks the reader's language without shipping a locale table, and
  dates are local midnight throughout.

- **The form parts that were missing.** `Label`, `Textarea`, `Field`,
  `Separator`, `Toggle`, `ToggleGroup` and `Spinner`. The system was rich in
  expressive pieces — meters, glow pills, commit graphs — and had no label, no
  textarea, and no way to attach a description or an error to a control.

  `Field` is the one that matters: it generates the ids and wires
  `aria-describedby` and `aria-invalid` itself, so a hint and an error are
  announced rather than merely displayed. shadcn solves this with a Form built
  on react-hook-form; this needs no form library. The control arrives as a
  function of the props it has to carry, so they are visible at the call site
  instead of being applied by `cloneElement` behind your back.

- **`Table` and `DataTable`.** UICean documented a data table and shipped no
  table — the demo was hand-written markup, so anyone who liked it had to copy
  the markup rather than the component. The primitives carry the house style
  and nothing else; `DataTable` sits on top for columns-in-rows-out, with
  sorting that reports itself in `aria-sort` on the header cell rather than
  only in an arrow glyph.

- **`LiquidMetalButton` is a fragment shader**, and looks like metal. What it
  was before was a rotating conic gradient that read as a dark pinwheel.
  `runShader` in `effects/gl.ts` is the shared WebGL plumbing, and a registry
  item in its own right.

### Changed

- **Buttons are squared, not pills.** `Button` now defaults to
  `shape="rect"`. The recipe is untouched — same vertical gradient, same 1px
  ring, same inset top highlight, still no shadow — what changed is the
  corner. `shape="pill"` gives the original back per button.

- **Corner radius is a token.** `--radius` governs the button family, with
  every step derived from it by `calc()`, the way shadcn exposes it. The
  radii were previously written out in eight places across `Button.tsx`, so
  changing the shape of the system meant eight edits and a chance to miss
  one. At the shipped `--radius: 10px` the derived values reproduce the old
  hard-coded numbers exactly, so adopting the token changed nothing by
  itself.

  `ButtonGroup`, `SplitButton` and `IconButton` all read it, which is why
  they moved together rather than leaving a pill wrapper around square
  buttons.

### Fixed

- `ThreeOrb` reported a missing `three` instead of showing "loading three.js
  scene…" for ever. It takes a `fallback` prop now, matching the three blocks
  that already handled their optional peers this way.

- The emerald button face measured 3.10:1 against its white label. It is
  4.54:1, which clears WCAG AA. Emerald was the only accent of the five that
  needed it.

- Every route reflows to 320px without a horizontal scrollbar (WCAG 1.4.10).

### Added

**`uicean-blocks`** — a second package of section-sized pieces, built out of
the core primitives so they inherit your tokens rather than bringing their own.
Twenty-one blocks in seven groups:

| Group | Blocks |
| --- | --- |
| Heroes | `HeroTerminal` · `HeroSplit` · `HeroNexus` · `HeroCinematic` · `SplineHero` |
| Features | `FeaturesBento` · `FeaturesTerminal` · `FeaturesCrop` |
| Logos | `LogoCloud` · `LogoCloudPlus` · `LogoCloudSection` · `IntegrationsMarquee` |
| Footers | `CinematicFooter` · `GridFooter` |
| App shell | `DashboardShell` · `SidebarNav` · `RailSidebar` |
| Maps & globe | `Map` and its markers · `GlobeFlights` |
| Effects | `LiquidMetalButton` · `GeminiRibbon` · `NeuralVortex` |

Core stays dependency-free. The three blocks that genuinely need a library
declare it as an **optional peer** behind a dynamic import, so a project only
pays for the one it uses: `@splinetool/react-spline`, `cobe` (pinned to
`^0.6.5`) and `maplibre-gl`.

**Five accent presets** — Emerald, Blue, Violet, Amber, Rose. Set with
`[data-accent]` on `<html>`, or through `useTheme().setAccent()`, which
persists the choice. Each supplies the same four tokens, so a preset is a
palette swap and never a change in contrast, spacing or layout.

**`scripts/motion.mjs`** — twenty-seven checks that photograph one element
twice, around a wait, hover, click or scroll, and fail on too few changed
pixels. It exists because screenshots cannot tell a working animation from a
frozen one.

**`scripts/filmstrip.mjs`** — N frames of one element laid out side by side,
for when a number is not enough to judge timing or easing.

### Changed

- `variant="green"` now reads the accent rather than a fixed hue. The class
  name `.btn-green` is historical; it is the brand face.
- The blocks' glow and aurora are `color-mix`ed from `--brand`, so the effects
  layer follows the accent along with everything else.
- `scripts/shots.mjs` walks the page before capturing, so anything gated on
  `IntersectionObserver` is photographed revealed rather than mid-hide.
- `scripts/qa.mjs` skips elements carrying an `fx-*` class in the no-shadow
  rule — the one sanctioned exception, scoped to the element that opted in.

### Fixed

- Three blocks (`HeroTerminal`, `HeroNexus`, `IntegrationsMarquee`) drew their
  backdrops at a negative z-index without a stacking context, so the layers
  escaped and painted behind an ancestor's background. They now `isolate`.
- `HeroCinematic`'s headline could stay invisible where `IntersectionObserver`
  never fires — printing, `content-visibility`, screenshot tools that capture
  beyond the viewport. `useInView` takes a fail-safe timeout.
- `SplineScene` spun forever when the runtime or the scene failed to arrive.
  It now warms both while the page is idle, starts 600px earlier, shows a
  designed plate instead of a bare spinner, and offers a retry after
  `timeoutMs`.
- `packages/blocks` emitted its type declarations to the wrong path, so the
  published package would have shipped without usable types.

### Notes

- `cobe` is pinned to `^0.6.5`. Version 2.x advertises native `arcs`, which
  would replace most of `GlobeFlights`, but 2.0.1 draws the sphere with no
  landmasses at all — verified against its own README configuration.

---

## [0.5.0] — 2026-08-16

### Added

- Published as an npm package, with a shadcn-compatible registry at
  `/r/*.json` — every component is both an import and a copy-paste.
- A page per component family, replacing the single-page showcase.
- The icon library page: all 83 icons, searchable, with copyable imports.

### Changed

- The canonical URL is `uicean.vercel.app`.
