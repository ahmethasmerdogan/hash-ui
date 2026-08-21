import { Link } from "react-router-dom";
import { Section } from "@/components/Section";
import { Card, cx, IArrowRight, IArrowUpRight } from "hash-ui";
import { BLOCK_PAGES } from "@/lib/routes";
import { CodeBlock } from "@/components/Code";

const RULES = [
  {
    title: "Sections, not primitives",
    body: "A block is a whole strip of a page — a hero, a footer, a feature grid. It is composed out of the same Button, Card and Marquee you already have, so it inherits your tokens rather than bringing its own.",
  },
  {
    title: "Content is data",
    body: "Every block ships working demo content and takes the real thing as props. Drop one in to see it, then pass your own items, logos or nav tree without touching the markup.",
  },
  {
    title: "Core stays dependency-free",
    body: "hash-ui still imports nothing but React. The three blocks that genuinely need a library — Spline, cobe, MapLibre — declare it as an optional peer and load it dynamically, so you only pay for the one you use.",
  },
  {
    title: "Glow lives here and nowhere else",
    body: "The flat rule holds across core: every --sh-* token is none and depth comes from layering. The effects layer is the single exception, and it is opt-in by class name.",
  },
];

export default function BlocksOverviewPage() {
  return (
    <Section
      id="blocks"
      eyebrow="Blocks"
      title="Blocks"
      desc={
        <>
          Section-sized pieces built out of the core primitives, shipped as a
          separate package so the core stays small. Twenty-one of them, drawn
          from a set of references and rebuilt in the system&rsquo;s own idiom.
        </>
      }
    >
      <CodeBlock
        code={`npm i hash-ui-blocks

# then, after the core stylesheet
@import "hash-ui/css";
@import "hash-ui-blocks/css";`}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BLOCK_PAGES.map((p) => (
          <Link key={p.path} to={p.path} className="group/card">
            <Card
              className={cx(
                "h-full p-5 transition-colors duration-200",
                "group-hover/card:border-line-strong",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
                  {p.label}
                </h3>
                <IArrowUpRight
                  size={14}
                  className="mt-0.5 shrink-0 text-ink-3 transition-transform duration-200 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-ink"
                />
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                {p.desc}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {RULES.map((r) => (
          <Card key={r.title} className="p-5">
            <div className="microlabel mb-2.5 !text-brand">{r.title}</div>
            <p className="text-[13.5px] leading-relaxed text-ink-2">{r.body}</p>
          </Card>
        ))}
      </div>

      <Link
        to="/docs/blocks/heroes"
        className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand hover:underline"
      >
        Start with the heroes
        <IArrowRight size={14} />
      </Link>
    </Section>
  );
}
