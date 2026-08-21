import { Link } from "react-router-dom";
import {
  Card,
  InsetPanel,
  StatusPill,
  cx,
  IArrowRight,
  IArrowUpRight,
  ICheck,
  ICube,
  ILayers,
  IPencil,
  ISparkleFill,
  IX,
} from "uicean";
import { Section, Demo } from "@/components/Section";
import { CodeBlock } from "@/components/Code";
import { SITE } from "@/lib/site";
import { COMPONENT_PAGES } from "@/lib/routes";

const RULES: Array<{ ok: boolean; title: string; body: string }> = [
  {
    ok: false,
    title: "No drop shadows",
    body: "Every --sh-* token is none. Depth is four stacked surfaces — canvas › surface › elev › inset — separated by a 1px hairline.",
  },
  {
    ok: true,
    title: "One button anatomy",
    body: "A vertical gradient, a 1px ring of the same hue, a hairline highlight on the top edge. variant only ever changes the colour.",
  },
  {
    ok: true,
    title: "Fully rounded by default",
    body: 'shape="pill" is the default; shape="rect" opts into a 12px radius where a corporate square is wanted.',
  },
  {
    ok: true,
    title: "Two typographic voices",
    body: "Geist for the interface, Geist Mono with tabular numerals for every number, timestamp, ID and code sample. No exceptions.",
  },
  {
    ok: false,
    title: "No neon, no glow",
    body: "Accent colour carries meaning, not decoration: emerald for brand, blue for primary actions, a fixed status vocabulary for the rest.",
  },
];

const LAYERS: Array<[string, string, string]> = [
  [
    "Primitives",
    "Button · ButtonGroup · SplitButton · IconButton · Badge family · Avatar · Card · InsetPanel · StatTile · Switch · Checkbox · SegmentedControl · SearchField",
    "/docs/components/button",
  ],
  [
    "Inputs",
    "Slider · RadioGroup · RadioCards · SelectField · Accordion · Stepper · Pagination · Breadcrumbs",
    "/docs/components/inputs",
  ],
  [
    "Feedback",
    "Alert · Toast + useToast · Tooltip · Modal · Dropdown · Skeleton · EmptyState",
    "/docs/components/feedback",
  ],
  [
    "Data",
    "Tabs family · Progress family · DeliveryTimeline · StageFlow · CommitGraph · table patterns",
    "/docs/components/table",
  ],
  [
    "Motion",
    "NumberTicker · Typewriter · Marquee · ShimmerButton · BorderBeam · Spotlight · TiltCard · Reveal · Meteors · GradientText · ThreeOrb",
    "/docs/components/motion",
  ],
];

const REFERENCES: Array<[string, string]> = [
  ["button-001 · button-0002", "Button faces, invite card, order tracker"],
  ["datatable-0001 · 0002 · 003", "CRM grid, customer rows, credit meter"],
  ["activity-log-0001", "CommitGraph with its hover card"],
  ["time-line-001", "DeliveryTimeline, StageFlow, OverviewTile"],
  ["chat-log-001", "Dark command palette with term highlighting"],
  ["ai-chat-0001", "AI insight panel with quoted source citations"],
  ["tabs-design-0001", "PillTabs, NotchTabs, DotTabs"],
  ["progress-bar-001", "RangeBar with its diagnosis marker, numbered wizard"],
  ["ui-design-4", "Change-tracking grid with hatched revision rows"],
  ["gradient.jpeg", "Grain gradient modal header"],
  ["logo-0001 · logo-001", "Squircle app icons, appearance sheet"],
  ["Ornek1 · Ornek6", "Credit-score hero, trust strip, RainbowMeter"],
];

export default function Introduction() {
  return (
    <Section
      id="introduction"
      eyebrow="Getting started"
      title="Introduction"
      desc={
        <>
          UICean is a personal design foundation turned into a real library. It
          started as 36 screenshots of interfaces worth stealing from, and ended
          as {COMPONENT_PAGES.length} documented component families that share
          one token set, one button recipe and two typographic voices.
        </>
      }
    >
      <Demo label="What you get" contentClassName="!items-stretch !justify-start py-8">
        <div className="grid grid-cols-1 w-full gap-4 sm:grid-cols-3">
          {[
            { icon: <ICube size={18} />, v: "70+", l: "components", d: "across 16 source files" },
            { icon: <ILayers size={18} />, v: "83", l: "icons", d: "hand-drawn, tree-shakeable" },
            { icon: <ISparkleFill size={18} />, v: "2", l: "install routes", d: "npm package or CLI copy" },
          ].map((s) => (
            <Card key={s.l} className="rounded-2xl p-5">
              <span className="flex size-10 items-center justify-center rounded-[12px] border border-line bg-elev text-ink-2">
                {s.icon}
              </span>
              <div className="mt-3 font-mono text-[24px] font-bold text-ink">
                {s.v}
              </div>
              <div className="text-[13.5px] font-semibold text-ink">{s.l}</div>
              <div className="mt-0.5 text-[12px] text-ink-3">{s.d}</div>
            </Card>
          ))}
        </div>
      </Demo>

      {/* ------------------------------------------------ the rules ---- */}
      <div>
        <h2 className="mb-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          The rules that do not bend
        </h2>
        <p className="mb-5 text-[14px] leading-relaxed text-ink-2">
          A design system is mostly a list of things it refuses to do. These five
          are load-bearing — break one and components stop looking related.
        </p>
        <div className="flex flex-col gap-2.5">
          {RULES.map((r) => (
            <Card key={r.title} className="flex gap-3.5 rounded-2xl p-4">
              <span
                className={cx(
                  "flex size-7 shrink-0 items-center justify-center rounded-full",
                  r.ok
                    ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-500/10 text-red-500",
                )}
              >
                {r.ok ? (
                  <ICheck size={14} strokeWidth={3} />
                ) : (
                  <IX size={13} strokeWidth={3} />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-semibold text-ink">
                  {r.title}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-2">
                  {r.body}
                </span>
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------- the layers ---- */}
      <div>
        <h2 className="mb-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          How the library is layered
        </h2>
        <p className="mb-5 text-[14px] leading-relaxed text-ink-2">
          One source file per family, one docs page per source file, one registry
          item per docs page. A page, a file and an install command always line
          up — so “where does this live?” has exactly one answer.
        </p>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {LAYERS.map(([name, contents, to]) => (
            <Link
              key={name}
              to={to}
              className="flex items-start gap-4 border-b border-line px-4 py-3.5 transition-colors last:border-0 hover:bg-elev"
            >
              <span className="w-24 shrink-0 pt-0.5 text-[13.5px] font-semibold text-ink">
                {name}
              </span>
              <span className="min-w-0 flex-1 font-mono text-[11.5px] leading-relaxed text-ink-2">
                {contents}
              </span>
              <IArrowRight size={14} className="mt-0.5 shrink-0 text-ink-3" />
            </Link>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------- the anatomy ---- */}
      <div>
        <h2 className="mb-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          Repository layout
        </h2>
        <p className="mb-5 text-[14px] leading-relaxed text-ink-2">
          The library and the site that documents it live in one repo. The site
          imports the library from source, so editing a component hot-reloads the
          page that documents it.
        </p>
        <CodeBlock
          filename="uicean/"
          code={`packages/core/          # the published npm package \`uicean\`
  src/
    uicean.css          # every design token, in one file
    index.ts            # the single barrel export
    Button.tsx …        # one file per component family
    presets/            # brand-bridge example

apps/docs/              # this site — Vite + React Router
  src/pages/            # one page per component family
  public/r/*.json       # the shadcn registry, built from packages/core

scripts/build-registry.mjs   # generates public/r from the package source`}
        />
      </div>

      {/* -------------------------------------------- the references ---- */}
      <div>
        <h2 className="mb-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          Every component is traceable
        </h2>
        <p className="mb-5 text-[14px] leading-relaxed text-ink-2">
          Nothing here was designed in a vacuum. Each demo carries the name of
          the reference image it was rebuilt from, so a design decision can
          always be argued back to its source.
        </p>
        <InsetPanel className="overflow-hidden !p-0">
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-4 py-2.5 text-left text-[11.5px] font-semibold text-ink-2">
                    Reference
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11.5px] font-semibold text-ink-2">
                    Produced
                  </th>
                </tr>
              </thead>
              <tbody>
                {REFERENCES.map(([ref, made]) => (
                  <tr key={ref} className="border-b border-line last:border-0">
                    <td className="px-4 py-2.5 font-mono text-[11.5px] whitespace-nowrap text-ink">
                      {ref}
                    </td>
                    <td className="px-4 py-2.5 text-[12.5px] text-ink-2">
                      {made}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InsetPanel>
      </div>

      {/* ------------------------------------------------ next steps ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/docs/installation">
          <Card className="h-full rounded-2xl p-5 transition-colors hover:border-line-strong">
            <StatusPill tone="green" size="sm">
              Start here
            </StatusPill>
            <div className="mt-3 text-[15px] font-bold text-ink">Installation</div>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
              Add the package, import the stylesheet, wrap the app. Two minutes.
            </p>
          </Card>
        </Link>
        <a href={SITE.github} target="_blank" rel="noreferrer">
          <Card className="h-full rounded-2xl p-5 transition-colors hover:border-line-strong">
            <StatusPill tone="gray" size="sm" icon={<IPencil size={11} />}>
              MIT
            </StatusPill>
            <div className="mt-3 flex items-center gap-1.5 text-[15px] font-bold text-ink">
              Source on GitHub <IArrowUpRight size={14} className="text-ink-3" />
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
              Fork it, strip it, rebrand the tokens. That is what it is for.
            </p>
          </Card>
        </a>
      </div>
    </Section>
  );
}
