import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/* ------------------------------------------------------------------ */
/* The docs map                                                        */
/*                                                                     */
/* One route documents one source file in packages/core/src, which is  */
/* also one registry item — so a page, a file and an install command   */
/* always line up. Everything else (sidebar, ⌘K, prev/next, sitemap)   */
/* is derived from this table.                                         */
/* ------------------------------------------------------------------ */

export type DocPage = {
  path: string;
  label: string;
  /** one-line summary — shown in ⌘K and on the components index */
  desc: string;
  badge?: string;
  /** extra ⌘K search terms: the components the page actually documents */
  keywords?: string;
  Component: LazyExoticComponent<ComponentType>;
};

export type NavGroup = { label: string; items: DocPage[] };

export const NAV: NavGroup[] = [
  {
    label: "Getting started",
    items: [
      {
        path: "/docs",
        label: "Introduction",
        desc: "What HashUI is, what it refuses to do, and how it is put together.",
        keywords: "about overview philosophy readme",
        Component: lazy(() => import("@/pages/docs/introduction")),
      },
      {
        path: "/docs/installation",
        label: "Installation",
        desc: "Add the package, wire the stylesheet, wrap the app in two providers.",
        keywords: "install setup npm pnpm vite next.js tailwind getting started",
        Component: lazy(() => import("@/pages/docs/installation")),
      },
      {
        path: "/docs/registry",
        label: "Registry & CLI",
        badge: "New",
        desc: "Copy any component into your repo with the shadcn CLI, or fetch it as JSON.",
        keywords: "shadcn cli registry json api copy paste",
        Component: lazy(() => import("@/pages/docs/registry")),
      },
      {
        path: "/docs/theming",
        label: "Theming & tokens",
        desc: "The token set both themes share, and how to point it at your brand.",
        keywords: "tokens colors css variables dark mode surfaces ink brand radius",
        Component: lazy(() => import("@/pages/docs/theming")),
      },
      {
        path: "/docs/typography",
        label: "Typography",
        desc: "Geist for the interface, Geist Mono for anything a machine produced.",
        keywords: "font geist inter type scale weights mono ThemeProvider useTheme",
        Component: lazy(() => import("@/pages/docs/typography")),
      },
    ],
  },
  {
    label: "Components",
    items: [
      {
        path: "/docs/components/button",
        label: "Button",
        desc: "One anatomy, eight faces — plus groups, split and icon buttons.",
        keywords: "Button ButtonGroup IconButton SplitButton cta variant pill",
        Component: lazy(() => import("@/pages/components/button")),
      },
      {
        path: "/docs/components/badge",
        label: "Badge & pill",
        desc: "The full status vocabulary: status pills, dots, counts and kbd keys.",
        keywords: "StatusPill DotPill OutlineBadge GlowPill GlowDot CountBadge Kbd AnnouncementPill tag",
        Component: lazy(() => import("@/pages/components/badge")),
      },
      {
        path: "/docs/components/avatar",
        label: "Avatar",
        desc: "Gradient initials with presence, overlapping groups and entity chips.",
        keywords: "Avatar AvatarGroup EntityChip presence online user",
        Component: lazy(() => import("@/pages/components/avatar")),
      },
      {
        path: "/docs/components/card",
        label: "Card",
        desc: "Card-in-card layering: white shells, inset wells, stat tiles, meta rows.",
        keywords: "Card InsetPanel StatTile OverviewTile MetaRow panel surface",
        Component: lazy(() => import("@/pages/components/card")),
      },
      {
        path: "/docs/components/controls",
        label: "Controls",
        desc: "Switch, checkbox, segmented control and the search field.",
        keywords: "Switch Checkbox SegmentedControl SearchField toggle form",
        Component: lazy(() => import("@/pages/components/controls")),
      },
      {
        path: "/docs/components/inputs",
        label: "Inputs & selection",
        desc: "Sliders, radios, selects, accordion, stepper, pagination, breadcrumbs.",
        keywords: "Slider RadioGroup RadioCards SelectField Accordion Stepper Pagination Breadcrumbs form",
        Component: lazy(() => import("@/pages/components/inputs")),
      },
      {
        path: "/docs/components/feedback",
        label: "Feedback & overlays",
        desc: "Alerts, a live toast queue, tooltips, modals, dropdowns, skeletons.",
        keywords: "Alert Toast useToast ToastProvider Tooltip Modal ModalClose Dropdown Skeleton EmptyState dialog",
        Component: lazy(() => import("@/pages/components/feedback")),
      },
      {
        path: "/docs/components/tabs",
        label: "Tabs & navigation",
        desc: "Raised pill, browser notch, accent dot, underline and pill nav.",
        keywords: "PillTabs NotchTabs DotTabs UnderlineTabs PillNav navigation",
        Component: lazy(() => import("@/pages/components/tabs")),
      },
      {
        path: "/docs/components/progress",
        label: "Progress & meters",
        desc: "Bars, ticks, signal bars, dotted meters, rings, LCD counters.",
        keywords: "ProgressBar TickBars SignalBars DottedMeter GoalBar RainbowMeter RingProgress RangeBar CountdownLCD LcdTimer",
        Component: lazy(() => import("@/pages/components/progress")),
      },
      {
        path: "/docs/components/timeline",
        label: "Timeline & flows",
        desc: "Delivery stepper, service-stage pipeline and the git commit graph.",
        keywords: "DeliveryTimeline StageFlow CommitGraph history activity log",
        Component: lazy(() => import("@/pages/components/timeline")),
      },
      {
        path: "/docs/components/table",
        label: "Data table",
        desc: "CRM grid, customer rows and a change-tracking diff table.",
        keywords: "table grid datatable crm rows diff revision sort filter",
        Component: lazy(() => import("@/pages/components/table")),
      },
      {
        path: "/docs/components/motion",
        label: "Motion & effects",
        desc: "Tickers, typewriters, marquees, beams, spotlights — no dependencies.",
        keywords: "NumberTicker Typewriter Marquee ShimmerButton BorderBeam Spotlight TiltCard Reveal Meteors GradientText ThreeOrb animation",
        Component: lazy(() => import("@/pages/components/motion")),
      },
      {
        path: "/docs/components/icons",
        label: "Icon library",
        badge: "New",
        desc: "All 83 hand-drawn SVG icons, searchable, with copyable imports.",
        keywords: "icons svg icon set lucide search",
        Component: lazy(() => import("@/pages/components/icons")),
      },
    ],
  },
  {
    label: "Blocks",
    items: [
      {
        path: "/docs/blocks",
        label: "Overview",
        badge: "New",
        desc: "Section-sized blocks built out of the core primitives, in their own package.",
        keywords: "blocks sections marketing landing page hero footer overview",
        Component: lazy(() => import("@/pages/blocks/overview")),
      },
      {
        path: "/docs/blocks/heroes",
        label: "Heroes",
        badge: "New",
        desc: "Five opening sections: terminal, split, nexus, cinematic and 3D.",
        keywords: "HeroTerminal HeroSplit HeroNexus HeroCinematic SplineScene hero landing above the fold",
        Component: lazy(() => import("@/pages/blocks/heroes")),
      },
      {
        path: "/docs/blocks/features",
        label: "Features",
        badge: "New",
        desc: "Three feature grids: bento, terminal cards and crop-marked cards.",
        keywords: "FeaturesBento FeaturesTerminal FeaturesCrop feature grid bento cards",
        Component: lazy(() => import("@/pages/blocks/features")),
      },
      {
        path: "/docs/blocks/logos",
        label: "Logos & integrations",
        badge: "New",
        desc: "Social-proof grids and the three-row integrations marquee.",
        keywords: "LogoCloud LogoCloudPlus LogoCloudSection IntegrationsMarquee social proof clients partners",
        Component: lazy(() => import("@/pages/blocks/logos")),
      },
      {
        path: "/docs/blocks/footers",
        label: "Footers",
        badge: "New",
        desc: "The scroll-revealed cinematic footer and the exposed-grid footer.",
        keywords: "CinematicFooter GridFooter footer marquee magnetic back to top",
        Component: lazy(() => import("@/pages/blocks/footers")),
      },
      {
        path: "/docs/blocks/app-shell",
        label: "App shell",
        badge: "New",
        desc: "Two sidebars: the nested workspace nav and the dual-rail panel.",
        keywords: "SidebarNav DashboardShell RailSidebar sidebar workspace navigation dashboard admin",
        Component: lazy(() => import("@/pages/blocks/app-shell")),
      },
      {
        path: "/docs/blocks/geo",
        label: "Maps & globe",
        badge: "New",
        desc: "MapLibre markers with tooltips and labels, and the flight-arc globe.",
        keywords: "Map MapMarker MarkerContent MarkerTooltip MarkerLabel GlobeFlights maplibre cobe geography",
        Component: lazy(() => import("@/pages/blocks/geo")),
      },
      {
        path: "/docs/blocks/effects",
        label: "Effects",
        badge: "New",
        desc: "The one layer where glow is allowed: liquid metal, ribbons, vortex.",
        keywords: "LiquidMetalButton GeminiRibbon NeuralVortex glow webgl shader scroll effect",
        Component: lazy(() => import("@/pages/blocks/effects")),
      },
    ],
  },
  {
    label: "Patterns",
    items: [
      {
        path: "/docs/patterns/app-shell",
        label: "App shell",
        desc: "Status bar, ops sidebar, kanban column and the account menu.",
        keywords: "sidebar topbar layout navigation shell dashboard kanban",
        Component: lazy(() => import("@/pages/patterns/app-shell")),
      },
      {
        path: "/docs/patterns/overlays",
        label: "Overlays & onboarding",
        desc: "Checklists, split success modals, gradient sheets and wizards.",
        keywords: "onboarding checklist modal wizard success install sheet",
        Component: lazy(() => import("@/pages/patterns/overlays")),
      },
      {
        path: "/docs/patterns/marketing",
        label: "Marketing sections",
        desc: "Landing hero widgets, trust strips and the audit feature block.",
        keywords: "landing hero marketing feature pricing cta",
        Component: lazy(() => import("@/pages/patterns/marketing")),
      },
      {
        path: "/docs/patterns/ai-command",
        label: "AI & command",
        desc: "Deal-insight panel with citations, command palette, deploy logs.",
        keywords: "ai chat command palette cmdk logs terminal console",
        Component: lazy(() => import("@/pages/patterns/ai-command")),
      },
      {
        path: "/docs/patterns/templates",
        label: "Templates",
        desc: "Three full-screen demo sites, openable like real products.",
        keywords: "template landing dashboard auth login demo site",
        Component: lazy(() => import("@/pages/patterns/templates")),
      },
    ],
  },
  {
    label: "Brand",
    items: [
      {
        path: "/docs/brand/app-icons",
        label: "App icons",
        desc: "Squircle icon treatments and the working appearance sheet.",
        keywords: "app icon squircle logo appearance theme switcher brand",
        Component: lazy(() => import("@/pages/brand/app-icons")),
      },
    ],
  },
];

export const PAGES: DocPage[] = NAV.flatMap((g) => g.items);

export const COMPONENT_PAGES: DocPage[] =
  NAV.find((g) => g.label === "Components")?.items ?? [];

/** every Blocks page except its own overview — what the index lists */
export const BLOCK_PAGES: DocPage[] = (
  NAV.find((g) => g.label === "Blocks")?.items ?? []
).filter((p) => p.path !== "/docs/blocks");

export function groupOf(path: string) {
  return NAV.find((g) => g.items.some((i) => i.path === path))?.label;
}

export function pageAt(path: string) {
  return PAGES.find((p) => p.path === path);
}

/** previous / next page in reading order, for the footer pager */
export function neighbours(path: string) {
  const i = PAGES.findIndex((p) => p.path === path);
  return { prev: i > 0 ? PAGES[i - 1] : undefined, next: PAGES[i + 1] };
}
