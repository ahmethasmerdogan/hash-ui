import { type ReactNode } from "react";
import { cx, Button, IArrowRight } from "uicean";
import { useInView, useReducedMotion } from "../hooks.js";

/* ------------------------------------------------------------------ */
/* HeroMarquee                                                         */
/*                                                                     */
/* Centred, loud, and framed by two bands of words drifting in         */
/* opposite directions — the hero a launch page wants when the product */
/* is the headline and there is no screenshot worth showing yet.       */
/*                                                                     */
/* The two bands move against each other rather than together. Two     */
/* strips travelling the same way read as one thing sliding; opposed,  */
/* they read as a frame with the page held inside it, which is the     */
/* only reason to have two.                                            */
/* ------------------------------------------------------------------ */

export type HeroMarqueeProps = {
  headline?: ReactNode;
  body?: ReactNode;
  actions?: Array<{ label: string; href?: string; onClick?: () => void }>;
  /** the words in the two bands */
  words?: string[];
  /** seconds for one pass; higher is slower */
  duration?: number;
  /**
   * The headline's element. A hero is its page's title, so h1 is right in
   * a real page and wrong in a docs demo, where the page already has one.
   */
  headingAs?: "h1" | "h2";
  className?: string;
};

const WORDS = [
  "Accessible by construction",
  "Light and dark",
  "Six sector themes",
  "No runtime dependency",
  "Copy it or install it",
  "MIT",
];

function Band({
  words,
  reverse,
  duration,
  running,
}: {
  words: string[];
  reverse?: boolean;
  duration: number;
  running: boolean;
}) {
  return (
    <div
      aria-hidden
      className="group/mq relative flex w-full overflow-hidden border-y border-line bg-surface py-3"
    >
      <div
        className="flex w-max items-center gap-8"
        style={{
          animation: `uicean-marquee ${duration}s linear infinite ${reverse ? "reverse" : ""}`,
          /* paused rather than removed: the band keeps its layout, so the
             page does not reflow when someone scrolls it out of view */
          animationPlayState: running ? "running" : "paused",
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-8">
            {words.map((w) => (
              <span
                key={w}
                className="flex items-center gap-8 text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap text-ink-2"
              >
                {w}
                <span className="size-1 rounded-full bg-brand" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroMarquee({
  headline = (
    <>
      The interface layer,
      <br />
      already written.
    </>
  ),
  body = "Ninety-six components, twenty-one page blocks and eighty-three icons — in light, in dark, and in six sector themes.",
  actions = [{ label: "Get started" }, { label: "Browse the blocks" }],
  words = WORDS,
  duration = 38,
  headingAs: Heading = "h1",
  className,
}: HeroMarqueeProps) {
  const [ref, seen] = useInView<HTMLElement>("0px", 800);
  const reduced = useReducedMotion();

  return (
    <section
      ref={ref}
      className={cx("relative isolate w-full overflow-hidden bg-canvas", className)}
    >
      <Band words={words} duration={duration} running={seen && !reduced} />

      <div className="relative px-6 py-20 text-center md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, var(--brand-soft) 0%, transparent 62%)",
          }}
        />
        <Heading className="mx-auto max-w-3xl text-[42px] leading-[1.04] font-bold tracking-[-0.038em] text-balance text-ink md:text-[64px]">
          {headline}
        </Heading>
        <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-2">{body}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {actions.map((a, i) => (
            <Button
              key={a.label}
              variant={i === 0 ? "green" : "outline"}
              size="lg"
              onClick={a.onClick}
              iconRight={i === 0 ? <IArrowRight size={16} /> : undefined}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      {/* reversed, so the two bands travel against each other */}
      <Band words={[...words].reverse()} reverse duration={duration} running={seen && !reduced} />
    </section>
  );
}
