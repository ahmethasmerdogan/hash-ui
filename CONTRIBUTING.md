# Contributing

Thanks for looking. HashUI is a small, opinionated system, and most of what
makes it coherent is what it refuses to do — so the fastest way to get a change
merged is to know those rules before you write it.

If you are adding a component or a block, **open an issue first**. Every piece
here comes from a specific interface reference, and agreeing on which one takes
five minutes and saves a rewrite.

---

## Getting set up

```bash
npm install
npm run dev          # docs site on http://localhost:5180
```

The docs site imports the library from source, so editing a component
hot-reloads the page that documents it. There is no build step in between.

---

## The rules that do not bend

Break one of these and the components stop looking related to each other.

1. **No drop shadows.** Every `--sh-*` token is `none`. Depth is four stacked
   surfaces — `canvas › surface › elev › inset` — separated by a 1px hairline.
   `scripts/qa.mjs` fails the build on any blurred `box-shadow`.
2. **One button anatomy.** A vertical gradient, a 1px ring of the same hue, a
   hairline highlight on the top edge. `variant` only ever changes the colour.
3. **Fully rounded by default.** `shape="pill"`; `shape="rect"` opts into 12px.
4. **Two typographic voices.** Geist for the interface, Geist Mono with tabular
   numerals for every number, timestamp, ID and code sample.
5. **No neon, no glow.** Accent colour carries meaning, not decoration.

There is exactly one exception to (1) and (5): the `.fx-*` effects layer in
`@hash-ui/blocks`. It is opt-in by class name, never restyles a core component,
and the QA rule skips only elements that carry an `fx-*` class.

---

## Where things go

```
packages/core/     the published package `hash-ui` — primitives, tokens, icons.
                   Imports nothing but React. Keep it that way.

packages/blocks/   the published package `@hash-ui/blocks` — section-sized
                   pieces built out of core. Anything glowy, anything with a
                   heavy dependency, goes here and nowhere else.

apps/docs/         the site. One route documents one source file, which is one
                   registry item, so a page, a file and an install command
                   always line up.
```

A dependency in `packages/blocks` must be an **optional peer** behind a dynamic
import, with a fallback that renders something and logs the install line rather
than throwing the page away. See `SplineScene`, `GlobeFlights` and `Map`.

---

## Adding a block

1. Write it in `packages/blocks/src/<group>/`. Take content as props, and give
   every prop a working default — a block should render as itself before
   anyone passes it data.
2. Export it from `packages/blocks/src/index.ts`.
3. Add it to `BLOCK_ITEMS` in `scripts/build-registry.mjs`, then
   `npm run registry`. Dependencies are derived from your imports; you do not
   list them by hand.
4. Add a page under `apps/docs/src/pages/blocks/` and a route in
   `apps/docs/src/lib/routes.ts`.
5. If it moves, add a check to `scripts/motion.mjs`.

### Two traps worth knowing

**A `-z-*` backdrop needs `isolate` on its block.** `position: relative` alone
does not create a stacking context, so the layer escapes and paints behind
whatever ancestor background it finds. Three blocks shipped invisible this way.

**Anything gated on `IntersectionObserver` needs a fail-safe if it hides
content.** An observer that never fires — printing, `content-visibility`, a
screenshot tool that captures beyond the viewport — leaves a headline at
`opacity: 0` forever. `useInView` takes a timeout for exactly this. Leave it off
when the hook gates *loading* rather than *showing*.

---

## Before you open a pull request

```bash
npm run typecheck        # all three workspaces
npm run build:all        # both packages, then the registry and the site
node scripts/qa.mjs      # every route × both themes, in a real browser
node scripts/motion.mjs  # does each animation actually move?
```

CI runs all of these. Two more tools help while you work:

```bash
node scripts/shots.mjs blocks/heroes        # PNGs, light + dark
node scripts/filmstrip.mjs /docs/blocks/effects "button.group\/lm" 6 200
```

`filmstrip.mjs` lays N frames of one element side by side. Reach for it when a
number is not enough — a passing motion check tells you something moved, not
that it looks like anything.

---

## Commit messages

Say what changed and why it mattered. The subject is a sentence, not a label:
`Run the motion sweep in CI`, not `ci: add motion`. If the change fixes
something subtle, the body is the right place to explain what went wrong — the
next person to touch it will be reading your message, not your diff.

---

MIT licensed. By contributing you agree your work ships under the same terms.
