import { type ReactNode } from "react";
import { cx, Button, NumberTicker, StatusPill, IArrowRight, IArrowUpRight } from "uicean";
import { useInView, useReducedMotion } from "../hooks.js";
import { Eyebrow } from "../parts.js";

/* ------------------------------------------------------------------ */
/* HeroMetrics                                                         */
/*                                                                     */
/* The hero for something that has numbers to stand on: a claim, and   */
/* underneath it a row of figures that count up once the section is    */
/* actually seen.                                                       */
/*                                                                     */
/* They count from a value near the target rather than from zero. A    */
/* number rolling up from 0 to 99.98 spends most of its animation      */
/* showing figures that are not true, and on a metric like uptime that */
/* reads as a fault rather than as movement.                            */
/* ------------------------------------------------------------------ */

export type Metric = {
  value: number;
  /** what sits after the number — "%", "ms", "k" */
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  /** a small delta under the label, e.g. "+12% this quarter" */
  delta?: string;
  tone?: "green" | "blue" | "amber" | "red";
};

export type HeroMetricsProps = {
  eyebrow?: ReactNode;
  headline?: ReactNode;
  body?: ReactNode;
  actions?: Array<{ label: string; onClick?: () => void }>;
  metrics?: Metric[];
  status?: ReactNode;
  /**
   * The headline's element. A hero is its page's title, so h1 is right in
   * a real page and wrong in a docs demo, where the page already has one.
   */
  headingAs?: "h1" | "h2";
  className?: string;
};

const METRICS: Metric[] = [
  { value: 99.98, suffix: "%", decimals: 2, label: "Uptime, rolling 90 days", delta: "no incidents", tone: "green" },
  { value: 34, suffix: "ms", label: "Median edge response", delta: "−18% this quarter", tone: "blue" },
  { value: 2.4, suffix: "M", decimals: 1, label: "Requests served daily", delta: "+340k", tone: "green" },
  { value: 12, suffix: "", label: "Regions, all active", delta: "3 added", tone: "amber" },
];

export function HeroMetrics({
  eyebrow = "Platform",
  headline = "Numbers that hold up when someone checks them.",
  body = "Every figure below is read from the same place the status page reads from, which is the only way a metric on a marketing page means anything.",
  actions = [{ label: "Read the report" }, { label: "Status page" }],
  metrics = METRICS,
  status = "All systems operational",
  headingAs: Heading = "h1",
  className,
}: HeroMetricsProps) {
  const [ref, seen] = useInView<HTMLElement>("-10%", 1200);
  const reduced = useReducedMotion();

  return (
    <section
      ref={ref}
      className={cx(
        "relative isolate w-full overflow-hidden border-b border-line bg-canvas px-6 py-20 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {status && <StatusPill tone="green">{status}</StatusPill>}
          </div>
          <Heading className="mt-4 text-[38px] leading-[1.08] font-bold tracking-[-0.034em] text-balance text-ink md:text-[50px]">
            {headline}
          </Heading>
          <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">{body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {actions.map((a, i) => (
              <Button
                key={a.label}
                variant={i === 0 ? "green" : "outline"}
                onClick={a.onClick}
                iconRight={i === 0 ? <IArrowRight size={15} /> : <IArrowUpRight size={14} />}
              >
                {a.label}
              </Button>
            ))}
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[calc(var(--radius)+6px)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-surface p-6">
              <dd className="font-mono text-[30px] leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">
                {m.prefix}
                {seen && !reduced ? (
                  <NumberTicker
                    value={m.value}
                    decimals={m.decimals}
                    /* start close, not at zero — a metric that spends its
                       animation showing 3.7% uptime is showing a lie */
                    from={m.value * 0.88}
                  />
                ) : (
                  m.value.toFixed(m.decimals ?? 0)
                )}
                {m.suffix}
              </dd>
              <dt className="mt-2.5 text-[13px] leading-relaxed text-ink-2">{m.label}</dt>
              {m.delta && (
                <p className="mt-2 text-[12px] font-medium text-ink-3">{m.delta}</p>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
