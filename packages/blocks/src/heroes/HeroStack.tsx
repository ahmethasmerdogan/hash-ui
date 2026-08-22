import { useEffect, useState, type ReactNode } from "react";
import { cx, Button, IArrowRight, IStar } from "uicean";
import { useInView, useReducedMotion } from "../hooks.js";
import { Eyebrow } from "../parts.js";

/* ------------------------------------------------------------------ */
/* HeroStack                                                           */
/*                                                                     */
/* The marketing hero for something with a screenshot worth showing:   */
/* copy on the left, and on the right a stack of panels that fan out   */
/* as the section is scrolled into view.                                */
/*                                                                     */
/* The panels are drawn, not imported. A hero whose whole point is an  */
/* image ships that image, and then ships a 400 kB PNG that is wrong    */
/* by the next release; these are three divs with a hairline each, so   */
/* they re-tint with the theme and cost nothing.                        */
/* ------------------------------------------------------------------ */

export type HeroStackProps = {
  eyebrow?: ReactNode;
  headline?: ReactNode;
  /** the last words, drawn in the accent */
  headlineTrail?: ReactNode;
  body?: ReactNode;
  actions?: Array<{ label: string; href?: string; onClick?: () => void; variant?: "green" | "dark" | "outline" }>;
  /** the small proof line under the buttons */
  proof?: ReactNode;
  /** replaces the drawn stack entirely */
  visual?: ReactNode;
  /**
   * The headline's element. A hero is its page's title, so h1 is right in
   * a real page and wrong in a docs demo, where the page already has one.
   */
  headingAs?: "h1" | "h2";
  className?: string;
};

const PANELS = [
  { rot: -6, x: -18, y: 26, tone: "bg-elev" },
  { rot: -3, x: 10, y: 13, tone: "bg-surface" },
  { rot: 0, x: 0, y: 0, tone: "bg-surface" },
];

export function HeroStack({
  eyebrow = "New in v2",
  headline = "Every screen your team already drew,",
  headlineTrail = "as code.",
  body = "One system for the interface, the tokens and the page blocks — installed from npm, or copied into your repo and yours to edit.",
  actions = [
    { label: "Start building", variant: "green" },
    { label: "Read the docs", variant: "outline" },
  ],
  proof = "MIT licensed · No runtime dependency but React",
  visual,
  headingAs: Heading = "h1",
  className,
}: HeroStackProps) {
  const [ref, seen] = useInView<HTMLElement>("-15%", 1200);
  const reduced = useReducedMotion();
  const open = seen || reduced;

  return (
    <section
      ref={ref}
      className={cx(
        "relative isolate w-full overflow-hidden border-b border-line bg-canvas px-6 py-20 md:py-28",
        className,
      )}
    >
      {/* a wash rather than an image: nothing to download and it re-tints
          with the accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 8% -10%, var(--brand-soft) 0%, transparent 58%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <Heading className="mt-4 text-[40px] leading-[1.06] font-bold tracking-[-0.035em] text-balance text-ink md:text-[54px]">
            {headline}{" "}
            {headlineTrail && <span className="text-brand">{headlineTrail}</span>}
          </Heading>
          <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-ink-2">{body}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {actions.map((a, i) => (
              <Button
                key={a.label}
                variant={a.variant ?? (i === 0 ? "green" : "outline")}
                onClick={a.onClick}
                iconRight={i === 0 ? <IArrowRight size={15} /> : undefined}
              >
                {a.label}
              </Button>
            ))}
          </div>

          {proof && (
            <p className="mt-6 flex items-center gap-2 text-[12.5px] text-ink-3">
              <span aria-hidden className="flex gap-0.5 text-brand">
                {[0, 1, 2, 3, 4].map((i) => (
                  <IStar key={i} size={12} />
                ))}
              </span>
              {proof}
            </p>
          )}
        </div>

        <div className="relative min-h-75 md:min-h-95">
          {visual ?? (
            <div className="relative mx-auto h-full w-full max-w-125">
              {PANELS.map((p, i) => (
                <div
                  key={i}
                  aria-hidden
                  className={cx(
                    "absolute inset-x-0 top-0 rounded-[calc(var(--radius)+6px)] border border-line",
                    p.tone,
                    "transition-[transform,opacity] duration-700 ease-out",
                  )}
                  style={{
                    height: "min(22rem, 60vw)",
                    /* the fan only exists once the section has been seen;
                       before that the three sit squarely on each other, so
                       nothing moves for someone who never scrolls here */
                    transform: open
                      ? `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`
                      : "translate(0,0) rotate(0deg)",
                    opacity: open ? 1 : 0,
                    transitionDelay: `${(PANELS.length - 1 - i) * 90}ms`,
                    zIndex: i,
                  }}
                >
                  {i === PANELS.length - 1 && <PanelContents />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* the top panel gets a face, so the stack reads as an interface rather
   than as three rectangles */
function PanelContents() {
  const [row, setRow] = useState(1);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setRow((r) => (r + 1) % 4), 1800);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          {["bg-red-400/70", "bg-amber-400/70", "bg-emerald-400/70"].map((c) => (
            <span key={c} className={cx("size-2.5 rounded-full", c)} />
          ))}
        </span>
        <span className="ml-2 h-5 flex-1 rounded-full bg-inset" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cx(
              "flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 transition-colors duration-500",
              i === row ? "bg-brand-soft" : "bg-inset/60",
            )}
          >
            <span
              className={cx(
                "size-6 shrink-0 rounded-full transition-colors duration-500",
                i === row ? "bg-brand" : "bg-line-strong",
              )}
            />
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="h-2 rounded-full bg-line-strong" style={{ width: `${58 - i * 7}%` }} />
              <span className="h-2 rounded-full bg-line" style={{ width: `${34 + i * 5}%` }} />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
