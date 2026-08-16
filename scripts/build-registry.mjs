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
const bundle = await buildBundle(built, cssItem);

const all = [cssItem, ...built, bundle];

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
