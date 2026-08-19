## What changed

<!-- One or two sentences. If it fixes something subtle, say what went wrong —
     the next person to touch this will read your description, not the diff. -->

## Checks

- [ ] `npm run typecheck` — all three workspaces
- [ ] `npm run build:all` — both packages, the registry and the site
- [ ] `node scripts/qa.mjs` — every route × both themes
- [ ] `node scripts/motion.mjs` — if anything here is supposed to move

## If this adds a component or a block

- [ ] There is an issue agreeing on the reference it comes from
- [ ] Every prop has a working default, so it renders as itself with none
- [ ] Added to `scripts/build-registry.mjs` and `npm run registry` re-run
- [ ] A docs page and a route
- [ ] Nothing new in `packages/core`'s dependencies

<!-- The five rules that do not bend are in CONTRIBUTING.md. The one exception
     is the .fx-* effects layer in blocks, which may glow, opt-in by class. -->
