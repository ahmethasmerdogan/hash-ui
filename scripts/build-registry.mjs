/* ------------------------------------------------------------------ */
/* Build the shadcn-compatible registry from the package source.        */
/*                                                                      */
/*   node scripts/build-registry.mjs                                    */
/*                                                                      */
/* Emits                                                                */
/*   apps/docs/public/r/<item>.json   one registry item per source file */
/*   apps/docs/public/r/registry.json the index                         */
/*   apps/docs/src/lib/registry-items.ts  typed list for the docs UI    */
/*                                                                      */
/* Once the site is deployed those files are a plain JSON API:          */
/*   npx shadcn@latest add https://hashui.vercel.app/r/button.json      */
/*   curl  https://hashui.vercel.app/r/registry.json                    */
/* ------------------------------------------------------------------ */

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = `${ROOT}packages/core/src`;
const BLOCKS_SRC = `${ROOT}packages/blocks/src`;
const OUT = `${ROOT}apps/docs/public/r`;
const LIB = `${ROOT}apps/docs/src/lib`;

const HOMEPAGE = "https://hashui.vercel.app";
const BASE = `${HOMEPAGE}/r`;

/** where copied files land in the consumer's project */
const UI_DIR = "components/hashui";
const LIB_DIR = "lib/hashui";
const CSS_DIR = "styles";

/* ------------------------------------------------------------------ */
/* Item table — one entry per source file                              */
/* ------------------------------------------------------------------ */

/** @type {Array<{name:string,file:string,title:string,description:string,deps?:string[],npm?:string[],lib?:boolean}>} */
const ITEMS = [
  {
    name: "cx",
    file: "cx.ts",
    lib: true,
    title: "cx",
    description:
      "The three-line class-name joiner every component uses. No clsx, no tailwind-merge.",
  },
  {
    name: "icons",
    file: "icons.tsx",
    title: "Icons",
    description:
      "83 hand-drawn SVG icons on a 24px grid with a shared 1.8 stroke. Tree-shakeable, no icon package.",
  },
  {
    name: "theme",
    file: "theme.tsx",
    title: "ThemeProvider",
    description:
      "light / dark / system with a persisted choice, plus the live sans-stack switcher behind useTheme().",
  },
  {
    name: "button",
    file: "Button.tsx",
    deps: ["cx"],
    title: "Button",
    description:
      "One anatomy — vertical gradient, 1px ring, hairline highlight — across eight faces. Plus ButtonGroup, IconButton and SplitButton.",
  },
  {
    name: "badge",
    file: "Badge.tsx",
    deps: ["cx"],
    title: "Badge & pill",
    description:
      "StatusPill, DotPill, OutlineBadge, GlowPill, GlowDot, AnnouncementPill, CountBadge and Kbd — the whole status vocabulary.",
  },
  {
    name: "avatar",
    file: "Avatar.tsx",
    deps: ["cx"],
    title: "Avatar",
    description:
      "Gradient-initial avatars with presence rings, overlapping AvatarGroup and the EntityChip company mark.",
  },
  {
    name: "card",
    file: "Card.tsx",
    deps: ["cx"],
    title: "Card",
    description:
      "Card, InsetPanel, StatTile, OverviewTile and MetaRow — the card-in-card layering the system uses instead of shadows.",
  },
  {
    name: "controls",
    file: "controls.tsx",
    deps: ["cx", "icons"],
    title: "Controls",
    description:
      "Switch, Checkbox, SegmentedControl and SearchField.",
  },
  {
    name: "inputs",
    file: "Inputs.tsx",
    deps: ["cx", "icons"],
    title: "Inputs & selection",
    description:
      "Slider, RadioGroup, RadioCards, SelectField, Accordion, Stepper, Pagination and Breadcrumbs.",
  },
  {
    name: "tabs",
    file: "Tabs.tsx",
    deps: ["cx"],
    title: "Tabs",
    description:
      "PillTabs, NotchTabs, DotTabs, UnderlineTabs and PillNav — five tab treatments on one item model.",
  },
  {
    name: "progress",
    file: "Progress.tsx",
    deps: ["cx"],
    title: "Progress & meters",
    description:
      "ProgressBar, TickBars, SignalBars, DottedMeter, GoalBar, RainbowMeter, RingProgress, RangeBar, CountdownLCD and LcdTimer.",
  },
  {
    name: "timeline",
    file: "Timeline.tsx",
    deps: ["cx", "badge", "icons"],
    title: "Timeline",
    description:
      "DeliveryTimeline for ordered steps and StageFlow for service pipelines with protocol connectors.",
  },
  {
    name: "commit-graph",
    file: "CommitGraph.tsx",
    deps: ["cx", "avatar", "icons"],
    title: "CommitGraph",
    description:
      "A branching git graph with a hover card and diff counts — built for event-sourced history.",
  },
  {
    name: "feedback",
    file: "Feedback.tsx",
    deps: ["cx", "icons"],
    title: "Feedback",
    description:
      "Alert, ToastProvider + useToast, Tooltip, Skeleton and EmptyState.",
  },
  {
    name: "overlay",
    file: "Overlay.tsx",
    deps: ["cx", "icons"],
    title: "Overlay",
    description:
      "Modal with focus and Esc handling, ModalClose, and the Dropdown menu.",
  },
  {
    name: "motion",
    file: "Motion.tsx",
    deps: ["cx"],
    title: "Motion",
    description:
      "NumberTicker, Typewriter, Marquee, ShimmerButton, BorderBeam, Spotlight, TiltCard, Reveal, Meteors and GradientText — all dependency-free.",
  },
  {
    name: "three-orb",
    file: "ThreeOrb.tsx",
    deps: ["cx"],
    npm: ["three"],
    title: "ThreeOrb",
    description:
      "A wireframe three.js scene that imports the library only once it scrolls into view.",
  },
];

const CSS_ITEM = {
  name: "tokens",
  file: "hashui.css",
  title: "Design tokens",
  description:
    "Every design token in one file: surfaces, ink, brand, the button-face palette, both themes and the utility classes. Import it after Tailwind.",
};


/* ------------------------------------------------------------------ */
/* Blocks — packages/blocks/src                                        */
/*                                                                     */
/* Section-sized pieces. They import from `hash-ui`, so copying one    */
/* into a project means also copying whichever core files it reaches   */
/* for; `rewriteBlockImports` below works that out per symbol rather   */
/* than making every block depend on the whole library.                */
/* ------------------------------------------------------------------ */

/** @type {Array<{name:string,file:string,title:string,description:string,deps?:string[],npm?:string[],lib?:boolean}>} */
const BLOCK_ITEMS = [
  {
    name: "blocks-hooks",
    file: "hooks.ts",
    lib: true,
    title: "Block hooks",
    description:
      "useInView, useScrollProgress, useMagnetic, usePointer and useReducedMotion — the jobs framer-motion would otherwise be installed for.",
  },
  {
    name: "blocks-parts",
    file: "parts.tsx",
    title: "Block parts",
    description:
      "ActionButton, Eyebrow, SplitHeadline, WindowFrame and WindowField — the small pieces every block is assembled from.",
  },
  {
    name: "block-visuals",
    file: "features/visuals.tsx",
    title: "Block visuals",
    description:
      "StatDial, FingerprintMark, Sparkline, AvatarStack, SetGlyph, IconTile and CropMarks — drawn illustrations, so a feature card never ships a stale PNG.",
  },
  {
    name: "logo-cloud",
    file: "logos/LogoCloud.tsx",
    title: "LogoCloud",
    description:
      "The social-proof grid in two treatments — plain rules, or plus marks on the interior crossings with a checkerboard tint.",
  },
  {
    name: "integrations-marquee",
    file: "logos/IntegrationsMarquee.tsx",
    title: "IntegrationsMarquee",
    description:
      "Three rows of integration chips drifting behind a radial mask, with your own mark held still in the middle.",
  },
  {
    name: "features-bento",
    file: "features/FeaturesBento.tsx",
    title: "FeaturesBento",
    description:
      "An uneven twelve-column feature grid: a wide claim across the top, then cards that change width as the row goes on.",
  },
  {
    name: "features-terminal",
    file: "features/FeaturesTerminal.tsx",
    title: "FeaturesTerminal",
    description:
      "The developer-platform grid — every card opens with a terminal or an API exchange, given as data rather than as a screenshot.",
  },
  {
    name: "features-crop",
    file: "features/FeaturesCrop.tsx",
    title: "FeaturesCrop",
    description:
      "Feature plates under printer's crop marks, closed by a full-width card with a row of captioned glyphs.",
  },
  {
    name: "hero-terminal",
    file: "heroes/HeroTerminal.tsx",
    title: "HeroTerminal",
    description:
      "The developer-tool opening: announcement chip, two-tone headline, two calls to action, and the install running underneath.",
  },
  {
    name: "hero-split",
    file: "heroes/HeroSplit.tsx",
    title: "HeroSplit",
    description:
      "A real navigation bar, a left-aligned headline and a client strip — the marketing-site opening rather than a launch page.",
  },
  {
    name: "hero-nexus",
    file: "heroes/HeroNexus.tsx",
    title: "HeroNexus",
    description:
      "The SaaS opening: grouped nav menus, an announcement pill, a headline whose last word cycles, and an inline capture form.",
  },
  {
    name: "hero-cinematic",
    file: "heroes/HeroCinematic.tsx",
    title: "HeroCinematic",
    description:
      "A full-bleed still or loop, a floating pill of navigation, and the brand set enormous and cropped along the bottom edge.",
  },
  {
    name: "spline-scene",
    file: "heroes/SplineScene.tsx",
    npm: ["@splinetool/react-spline"],
    title: "SplineScene",
    description:
      "A Spline 3D scene behind a dynamic import, so the runtime is fetched only once the block nears the viewport.",
  },
  {
    name: "cinematic-footer",
    file: "footers/CinematicFooter.tsx",
    title: "CinematicFooter",
    description:
      "A tilted marquee band, an enormous sign-off, magnetic pills and a watermark — revealed by two CSS declarations rather than a scroll library.",
  },
  {
    name: "grid-footer",
    file: "footers/GridFooter.tsx",
    title: "GridFooter",
    description:
      "A footer built as an exposed ruled grid rather than as stacked columns.",
  },
  {
    name: "dashboard-shell",
    file: "shell/SidebarNav.tsx",
    title: "DashboardShell",
    description:
      "A workspace switcher, a nested navigation tree and a pinned footer group, wrapped in a collapsible rail with a top bar and a search overlay.",
  },
  {
    name: "rail-sidebar",
    file: "shell/RailSidebar.tsx",
    title: "RailSidebar",
    description:
      "The two-part admin navigation: a narrow rail of destinations, and a searchable panel holding the tree for the selected one.",
  },
  {
    name: "map",
    file: "geo/Map.tsx",
    npm: ["maplibre-gl"],
    title: "Map",
    description:
      "A composable MapLibre surface whose markers are React children — Map, MapMarker, MarkerContent, MarkerDot, MarkerTooltip and MarkerLabel.",
  },
  {
    name: "globe-flights",
    file: "geo/GlobeFlights.tsx",
    npm: ["cobe"],
    title: "GlobeFlights",
    description:
      "A turning globe with great-circle routes and a glyph riding each arc, hidden as it passes behind the planet.",
  },
  {
    name: "liquid-metal-button",
    file: "effects/LiquidMetalButton.tsx",
    title: "LiquidMetalButton",
    description:
      "A brushed-metal pill with a turning sheen, a glowing rim and a ripple from wherever you clicked. No shader program.",
  },
  {
    name: "gemini-ribbon",
    file: "effects/GeminiRibbon.tsx",
    title: "GeminiRibbon",
    description:
      "Five ribbons that draw themselves as the page passes, each trailing a blurred copy of itself for the light.",
  },
  {
    name: "neural-vortex",
    file: "effects/NeuralVortex.tsx",
    title: "NeuralVortex",
    description:
      "A full-bleed WebGL backdrop of filaments that lean towards the pointer. One fragment shader, no dependencies.",
  },
];

const BLOCKS_CSS_ITEM = {
  name: "blocks-tokens",
  file: "blocks.css",
  title: "Effects tokens",
  description:
    "The .fx-* layer: the one place in HashUI where glow is allowed, plus the grid, aurora, metal and marquee utilities the blocks use.",
};

/* source file name → registry item name, used to rewrite imports */
const BY_FILE = new Map(
  [...ITEMS, CSS_ITEM].map((i) => [i.file.replace(/\.(tsx?|css)$/, ""), i]),
);

/* ------------------------------------------------------------------ */

const url = (name) => `${BASE}/${name}.json`;
const targetOf = (item) =>
  item.lib
    ? `${LIB_DIR}/${item.name}.ts`
    : `${UI_DIR}/${item.name}.tsx`;

/** `import { cx } from "./cx.js"` → `import { cx } from "@/lib/hashui/cx"` */
function rewriteImports(code) {
  return code.replace(/from "\.\/([A-Za-z]+)\.js"/g, (whole, base) => {
    const item = BY_FILE.get(base);
    if (!item) throw new Error(`unmapped internal import: ./${base}.js`);
    const dir = item.lib ? `@/${LIB_DIR}` : `@/${UI_DIR}`;
    return `from "${dir}/${item.name}"`;
  });
}

const BANNER = (item) =>
  `/* ${item.title} — HashUI\n` +
  ` * ${HOMEPAGE}/docs\n` +
  ` *\n` +
  ` * Copied into your project by the shadcn CLI. It is yours now: edit it,\n` +
  ` * rename it, delete the parts you do not use. MIT licensed.\n` +
  ` */\n\n`;

async function buildItem(item) {
  const raw = await readFile(`${SRC}/${item.file}`, "utf8");
  const content = BANNER(item) + rewriteImports(raw);
  const target = targetOf(item);

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.lib ? "registry:lib" : "registry:ui",
    title: item.title,
    description: item.description,
    author: "Ahmet Hâşim Erdoğan <a.erdogan6868@gmail.com>",
    dependencies: item.npm ?? [],
    registryDependencies: [
      url(CSS_ITEM.name),
      ...(item.deps ?? []).map(url),
    ],
    files: [
      {
        path: `registry/hashui/${item.name}${item.lib ? ".ts" : ".tsx"}`,
        content,
        type: item.lib ? "registry:lib" : "registry:ui",
        target,
      },
    ],
  };
}

async function buildCssItem() {
  const raw = await readFile(`${SRC}/${CSS_ITEM.file}`, "utf8");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: CSS_ITEM.name,
    type: "registry:theme",
    title: CSS_ITEM.title,
    description: CSS_ITEM.description,
    author: "Ahmet Hâşim Erdoğan <a.erdogan6868@gmail.com>",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "registry/hashui/hashui.css",
        content: raw,
        type: "registry:file",
        target: `${CSS_DIR}/hashui.css`,
      },
    ],
  };
}


/* ------------------------------------------------------------------ */
/* Blocks: import rewriting                                            */
/*                                                                     */
/* A block says `import { cx, Button, IZap } from "hash-ui"`. Copied   */
/* into someone's project those three live in three different files,   */
/* so the specifier has to be split per symbol. The map is built by    */
/* reading the core sources rather than being maintained by hand — a   */
/* new export in Button.tsx must not silently break a block.           */
/* ------------------------------------------------------------------ */

/** exported symbol → core registry item name */
async function buildSymbolMap() {
  const map = new Map();
  for (const item of ITEMS) {
    const code = await readFile(`${SRC}/${item.file}`, "utf8");
    for (const m of code.matchAll(
      /export\s+(?:async\s+)?(?:function|const|class)\s+([A-Za-z0-9_$]+)/g,
    )) {
      map.set(m[1], item.name);
    }
    /* types are erased at runtime but still have to resolve at build time */
    for (const m of code.matchAll(/export\s+type\s+([A-Za-z0-9_$]+)/g)) {
      map.set(m[1], item.name);
    }
  }
  return map;
}

/** relative specifier inside packages/blocks → its registry item */
function blockItemForPath(fromFile, specifier) {
  const clean = specifier.replace(/\.js$/, "");
  const dir = fromFile.includes("/")
    ? fromFile.slice(0, fromFile.lastIndexOf("/"))
    : "";
  const parts = (dir ? dir.split("/") : []).concat(clean.split("/"));
  const stack = [];
  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  const resolved = stack.join("/");
  const hit = BLOCK_ITEMS.find(
    (b) => b.file.replace(/\.(tsx?|css)$/, "") === resolved,
  );
  if (!hit) throw new Error(`unmapped block import: ${specifier} from ${fromFile}`);
  return hit;
}

const blockTargetOf = (item) =>
  item.lib ? `${LIB_DIR}/${item.name}.ts` : `${UI_DIR}/${item.name}.tsx`;

/**
 * Rewrites one block's imports and reports which registry items it needs.
 * Returns { code, deps } so the manifest is derived from the source rather
 * than declared alongside it and left to drift.
 */
function rewriteBlockImports(code, file, symbolMap) {
  const deps = new Set();

  /* `import { a, b } from "hash-ui"` → one import per core item */
  code = code.replace(
    /import\s+(type\s+)?\{([^}]+)\}\s+from\s+"hash-ui";/g,
    (_whole, typeOnly, body) => {
      const names = body
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      const byItem = new Map();
      for (const name of names) {
        const bare = name.replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
        const item = symbolMap.get(bare);
        if (!item) throw new Error(`unmapped hash-ui symbol: ${bare} (${file})`);
        deps.add(item);
        if (!byItem.has(item)) byItem.set(item, []);
        byItem.get(item).push(name);
      }
      return [...byItem.entries()]
        .map(([item, list]) => {
          /* cx lands in lib/, everything else in components/ */
          const core = ITEMS.find((i) => i.name === item);
          const dir = core?.lib ? LIB_DIR : UI_DIR;
          return `import ${typeOnly ?? ""}{ ${list.join(", ")} } from "@/${dir}/${item}";`;
        })
        .join("\n");
    },
  );

  /* relative imports between blocks */
  code = code.replace(/from\s+"(\.[^"]+)"/g, (_whole, spec) => {
    const item = blockItemForPath(file, spec);
    deps.add(item.name);
    const dir = item.lib ? `@/${LIB_DIR}` : `@/${UI_DIR}`;
    return `from "${dir}/${item.name}"`;
  });

  return { code, deps: [...deps] };
}

async function buildBlockItem(item, symbolMap) {
  const raw = await readFile(`${BLOCKS_SRC}/${item.file}`, "utf8");
  const { code, deps } = rewriteBlockImports(raw, item.file, symbolMap);

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.lib ? "registry:lib" : "registry:ui",
    title: item.title,
    description: item.description,
    author: "Ahmet Hâşim Erdoğan <a.erdogan6868@gmail.com>",
    dependencies: item.npm ?? [],
    registryDependencies: [
      url(CSS_ITEM.name),
      url(BLOCKS_CSS_ITEM.name),
      ...deps.map(url),
    ],
    files: [
      {
        path: `registry/hashui/${item.name}${item.lib ? ".ts" : ".tsx"}`,
        content: BANNER(item) + code,
        type: item.lib ? "registry:lib" : "registry:ui",
        target: blockTargetOf(item),
      },
    ],
  };
}

async function buildBlocksCssItem() {
  const raw = await readFile(`${BLOCKS_SRC}/${BLOCKS_CSS_ITEM.file}`, "utf8");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: BLOCKS_CSS_ITEM.name,
    type: "registry:theme",
    title: BLOCKS_CSS_ITEM.title,
    description: BLOCKS_CSS_ITEM.description,
    author: "Ahmet Hâşim Erdoğan <a.erdogan6868@gmail.com>",
    dependencies: [],
    registryDependencies: [url(CSS_ITEM.name)],
    files: [
      {
        path: "registry/hashui/blocks.css",
        content: raw,
        type: "registry:file",
        target: `${CSS_DIR}/hashui-blocks.css`,
      },
    ],
  };
}

/** the everything item: one command, whole library */
async function buildBundle(items, cssItem) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "hashui",
    type: "registry:ui",
    title: "HashUI — the whole library",
    description:
      "Every HashUI component, the icon set, the theme provider and the token stylesheet, copied into your project in one command.",
    author: "Ahmet Hâşim Erdoğan <a.erdogan6868@gmail.com>",
    dependencies: [],
    registryDependencies: [],
    files: [...cssItem.files, ...items.flatMap((i) => i.files)],
  };
}

/* ------------------------------------------------------------------ */

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const cssItem = await buildCssItem();
const built = await Promise.all(ITEMS.map(buildItem));

const symbolMap = await buildSymbolMap();
const blocksCssItem = await buildBlocksCssItem();
const blocksBuilt = await Promise.all(
  BLOCK_ITEMS.map((i) => buildBlockItem(i, symbolMap)),
);

const bundle = await buildBundle(built, cssItem);

const all = [cssItem, ...built, bundle, blocksCssItem, ...blocksBuilt];

for (const item of all) {
  await writeFile(`${OUT}/${item.name}.json`, JSON.stringify(item, null, 2));
}

/* the index — what `registry.json` is for */
const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "hash-ui",
  homepage: HOMEPAGE,
  items: all.map((i) => ({
    name: i.name,
    type: i.type,
    title: i.title,
    description: i.description,
    registryDependencies: i.registryDependencies,
    files: i.files.map(({ path, type, target }) => ({ path, type, target })),
  })),
};
await writeFile(`${OUT}/registry.json`, JSON.stringify(index, null, 2));

/* the docs page lists the registry — generate it so the two never drift */
const ts =
  `/* GENERATED by scripts/build-registry.mjs — do not edit by hand. */\n\n` +
  `export type RegistryItem = {\n` +
  `  name: string;\n  title: string;\n  description: string;\n` +
  `  type: string;\n  target: string;\n  dependencies: string[];\n` +
  `  registryDependencies: string[];\n};\n\n` +
  `export const REGISTRY_ITEMS: RegistryItem[] = ${JSON.stringify(
    all.map((i) => ({
      name: i.name,
      title: i.title,
      description: i.description,
      type: i.type,
      target: i.files[0].target,
      dependencies: i.dependencies,
      registryDependencies: i.registryDependencies.map((u) =>
        u.replace(`${BASE}/`, "").replace(".json", ""),
      ),
    })),
    null,
    2,
  )};\n`;
await writeFile(`${LIB}/registry-items.ts`, ts);

console.log(
  `registry: ${all.length} items → apps/docs/public/r/ (+ registry.json, registry-items.ts)`,
);
