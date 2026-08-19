import type { ReactNode } from "react";
import { cx, Card, ICommand, IZap, IDatabase, ILayers } from "hash-ui";
import { SplitHeadline, useRise, RISE_ATTR } from "../parts.js";

/* ------------------------------------------------------------------ */
/* FeaturesTerminal                                                    */
/*                                                                     */
/* The developer-platform grid: every card opens with a terminal or an */
/* API exchange, and the prose sits underneath it as the caption.      */
/*                                                                     */
/* The log is data, not a screenshot, which is the whole point — the   */
/* copy can say `POST /v1/sync` and mean it, the type scales with the  */
/* page, and nobody has to re-export a PNG when a route is renamed.    */
/* ------------------------------------------------------------------ */

export type TerminalLine = {
  text: string;
  /** "$" prompt, "✓" completed step, "•" result, or plain output */
  kind?: "prompt" | "step" | "result" | "output";
  /** right-aligned trailing value — a timing, a status, a size */
  meta?: string;
};

export type TerminalFeature = {
  title: ReactNode;
  body?: ReactNode;
  icon?: ReactNode;
  /** the mock above the copy — supply `lines` or your own node */
  lines?: TerminalLine[];
  visual?: ReactNode;
  span?: 4 | 5 | 6 | 7 | 8 | 12;
};

const SPAN: Record<number, string> = {
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  12: "md:col-span-12",
};

const GLYPH: Record<string, string> = {
  prompt: "$",
  step: "✓",
  result: "•",
  output: " ",
};

export function TerminalMock({
  lines,
  className,
}: {
  lines: TerminalLine[];
  className?: string;
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-xl border border-line bg-inset",
        className,
      )}
    >
      <div className="flex gap-1.5 border-b border-line px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-ink-3/40" />
        ))}
      </div>
      <div className="space-y-1 p-3.5 font-mono text-[11.5px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex items-baseline gap-2">
            <span
              className={cx(
                "w-2 shrink-0",
                line.kind === "step" && "text-brand",
                line.kind === "result" && "text-ink",
                (!line.kind || line.kind === "prompt") && "text-ink-3",
              )}
            >
              {GLYPH[line.kind ?? "prompt"]}
            </span>
            <span
              className={cx(
                "min-w-0 flex-1 truncate",
                line.kind === "result"
                  ? "font-medium text-ink"
                  : line.kind === "output"
                    ? "text-ink-3"
                    : "text-ink-2",
              )}
            >
              {line.text}
            </span>
            {line.meta && (
              <span className="shrink-0 text-ink-3 tabular-nums">{line.meta}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const DEMO: TerminalFeature[] = [
  {
    title: "Sub-50ms execution",
    body: "Deployed across 150+ edge nodes. Your logic executes precisely where your users are, instantly.",
    icon: <IZap size={15} />,
    span: 7,
    lines: [
      { kind: "prompt", text: "latency_check --region global", meta: "[OK]" },
      { kind: "output", text: "resolving edge nodes…", meta: "12ms" },
      { kind: "output", text: "authenticating request…", meta: "8ms" },
      { kind: "output", text: "establishing connection…", meta: "14ms" },
      { kind: "result", text: "global deployment active (34ms total)" },
    ],
  },
  {
    title: "Atomic state",
    body: "Strictly consistent, strongly typed data primitives available at the edge.",
    icon: <IDatabase size={15} />,
    span: 5,
    lines: [
      { kind: "output", text: "read  session:a41f", meta: "hit" },
      { kind: "output", text: "write order:9c02", meta: "ok" },
      { kind: "output", text: "read  cart:9c02", meta: "hit" },
    ],
  },
  {
    title: "Typed end to end",
    body: "The client, the handler and the schema come from one definition, so a rename fails the build rather than the request.",
    icon: <ICommand size={15} />,
    span: 5,
    lines: [
      { kind: "prompt", text: "tsc --noEmit" },
      { kind: "step", text: "checked 214 files", meta: "1.8s" },
      { kind: "result", text: "no errors" },
    ],
  },
  {
    title: "One call, one contract",
    body: "Every route is a plain function. No decorators, no framework globals, nothing to learn twice.",
    icon: <ILayers size={15} />,
    span: 7,
    lines: [
      { kind: "prompt", text: "POST api.hashui.dev/v1/sync" },
      { kind: "output", text: '{ "records": 128, "mode": "delta" }' },
      { kind: "step", text: "202 Accepted", meta: "41ms" },
    ],
  },
];

export type FeaturesTerminalProps = {
  items?: TerminalFeature[];
  eyebrow?: ReactNode;
  /** the first line of the headline, in ink */
  title?: ReactNode;
  /** the second line, dropped to a muted tone */
  titleTrail?: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function FeaturesTerminal({
  items = DEMO,
  eyebrow = "Platform capabilities",
  title = "Everything you need.",
  titleTrail = "Nothing you don't.",
  description = "Purpose-built primitives designed for modern leverage. No bloat, no gimmicks — just raw, unadulterated performance.",
  className,
}: FeaturesTerminalProps) {
  const [ref, rise] = useRise<HTMLElement>();

  return (
    <section ref={ref} className={cx("w-full py-20 md:py-28", className)}>
      <div className="mx-auto max-w-5xl px-6">
        <div {...RISE_ATTR} style={rise(0)} className="mx-auto mb-14 max-w-2xl text-center">
          {eyebrow && (
            <div className="mb-5 flex justify-center">
              <span className="microlabel rounded-full border border-line bg-surface px-3 py-1">
                {eyebrow}
              </span>
            </div>
          )}
          <SplitHeadline lead={title} trail={titleTrail} className="md:text-5xl" />
          {description && (
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-ink-2">
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {items.map((item, i) => (
            <Card
              key={i}
              {...RISE_ATTR}
              style={rise(i + 1)}
              className={cx("flex flex-col gap-5 p-5", SPAN[item.span ?? 6])}
            >
              {item.visual ?? (item.lines && <TerminalMock lines={item.lines} />)}
              <div className="mt-auto">
                <h3 className="flex items-center gap-2 text-[14px] font-semibold tracking-[-0.02em] text-ink">
                  {item.icon && <span className="text-ink-3">{item.icon}</span>}
                  {item.title}
                </h3>
                {item.body && (
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                    {item.body}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
