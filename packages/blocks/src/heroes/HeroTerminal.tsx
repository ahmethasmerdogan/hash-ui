import type { ReactNode } from "react";
import { cx, IArrowRight, IChevronRight } from "uicean";
import {
  ActionButton,
  SplitHeadline,
  WindowFrame,
  WindowField,
  useRise,
  RISE_ATTR,
  type Action,
} from "../parts.js";
import { TerminalMock, type TerminalLine } from "../features/FeaturesTerminal.js";

/* ------------------------------------------------------------------ */
/* HeroTerminal                                                        */
/*                                                                     */
/* The developer-tool opening: an announcement pill, a headline whose  */
/* second line drops to a muted tone, two calls to action, and a       */
/* window mock showing the install actually running.                   */
/*                                                                     */
/* Pairs with <FeaturesTerminal> — same author upstream, same          */
/* vocabulary, and they reuse the same <TerminalMock> here so a page   */
/* using both gets one terminal treatment rather than two.             */
/* ------------------------------------------------------------------ */

const DEMO_LINES: TerminalLine[] = [
  { kind: "prompt", text: "npx create-hash-app@latest" },
  { kind: "step", text: "Resolving packages…" },
  { kind: "step", text: "Fetching dependencies…" },
  { kind: "step", text: "Linking dependencies…" },
  { kind: "step", text: "Initializing configuration…" },
  { kind: "result", text: "Ready to deploy." },
];

export type HeroTerminalProps = {
  /** the small chip at the very top — a release note, a changelog link */
  badge?: { tag?: ReactNode; label: ReactNode; href?: string };
  title?: ReactNode;
  titleTrail?: ReactNode;
  description?: ReactNode;
  actions?: Action[];
  /** what the window bar shows — a URL, a search prompt */
  windowBar?: ReactNode;
  lines?: TerminalLine[];
  /**
   * The headline's element. A hero is its page's title, so h1 is right in a
   * real page — and wrong on a docs page showing five of them, or anywhere
   * this block sits below one. Whatever you pass, the type is unchanged.
   */
  headingAs?: "h1" | "h2";
  /** replaces the whole window mock */
  visual?: ReactNode;
  className?: string;
};

export function HeroTerminal({
  badge = { tag: "Update", label: "Next-gen architecture" },
  title = "Build faster.",
  titleTrail = "Scale infinitely.",
  description = "The ultimate platform for modern software teams. Ship production-ready applications with an uncompromising, distraction-free workflow.",
  actions = [
    { label: "Start building", href: "#", variant: "white", iconRight: <IArrowRight size={16} /> },
    { label: "Documentation", href: "#", variant: "outline" },
  ],
  windowBar = "Search components, commands, or settings…",
  lines = DEMO_LINES,
  visual,
  headingAs = "h1",
  className,
}: HeroTerminalProps) {
  const [ref, rise] = useRise<HTMLElement>();

  return (
    <section
      ref={ref}
      /* `isolate` is load-bearing: without a stacking context here, the
         -z-10 grid below paints behind whatever background an ancestor
         happens to have, and the backdrop silently disappears. */
      className={cx(
        "relative isolate w-full overflow-hidden py-20 md:py-28",
        className,
      )}
    >
      {/* a grid that fades out before it reaches the copy */}
      <div aria-hidden className="fx-grid fx-mask-b absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto max-w-4xl px-6 text-center">
        {badge && (
          <div {...RISE_ATTR} style={rise(0)}>
            <Badge {...badge} />
          </div>
        )}

        <div {...RISE_ATTR} style={rise(1)}>
          <SplitHeadline
            as={headingAs}
            lead={title}
            trail={titleTrail}
            className={cx(badge ? "mt-7" : "", "mx-auto max-w-3xl")}
          />
        </div>

        {description && (
          <p
            {...RISE_ATTR}
            style={rise(2)}
            className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-balance text-ink-2 md:text-base"
          >
            {description}
          </p>
        )}

        {actions.length > 0 && (
          <div
            {...RISE_ATTR}
            style={rise(3)}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            {actions.map((a, i) => (
              <ActionButton key={i} action={a} size="md" />
            ))}
          </div>
        )}
      </div>

      <div {...RISE_ATTR} style={rise(4)} className="mx-auto mt-14 max-w-3xl px-6">
        {visual ?? (
          <WindowFrame bar={windowBar && <WindowField>{windowBar}</WindowField>}>
            <TerminalMock
              lines={lines}
              className="rounded-none border-0 bg-transparent [&>div:first-child]:hidden"
            />
          </WindowFrame>
        )}
      </div>
    </section>
  );
}

function Badge({
  tag,
  label,
  href,
}: {
  tag?: ReactNode;
  label: ReactNode;
  href?: string;
}) {
  const inner = (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3 pl-1 text-[12.5px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink">
      {tag && (
        <span className="rounded-full bg-ink px-2 py-0.5 text-[10.5px] font-semibold tracking-wide text-canvas uppercase">
          {tag}
        </span>
      )}
      {label}
      <IChevronRight size={13} className="text-ink-3" />
    </span>
  );
  return (
    <div className="flex justify-center">
      {href ? <a href={href}>{inner}</a> : inner}
    </div>
  );
}
