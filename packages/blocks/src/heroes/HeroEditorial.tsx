import { type ReactNode } from "react";
import { cx, Avatar, IArrowRight } from "uicean";
import { useInView, useReducedMotion } from "../hooks.js";

/* ------------------------------------------------------------------ */
/* HeroEditorial                                                       */
/*                                                                     */
/* A masthead rather than a pitch: a rule, a kicker, a headline set at */
/* reading width, a byline, and a deck. For a publication, a changelog */
/* entry or a long post — anywhere the page is the writing.            */
/*                                                                     */
/* Everything here is typographic. There is no gradient, no glow and   */
/* no illustration, because the moment a masthead grows a wash it      */
/* stops being a masthead and becomes a landing page with an article   */
/* underneath it.                                                      */
/*                                                                     */
/* Pairs with the `editorial` sector theme, which drops the corner     */
/* radius to 2px and warms the paper — but it does not require it.     */
/* ------------------------------------------------------------------ */

export type HeroEditorialProps = {
  kicker?: ReactNode;
  headline?: ReactNode;
  deck?: ReactNode;
  author?: { name: string; role?: string };
  date?: string;
  readingTime?: string;
  /** the small print under the rule — a section, an issue number */
  meta?: ReactNode;
  /** rendered under the deck; a pull quote, a figure, a table of contents */
  children?: ReactNode;
  /**
   * The headline's element. A hero is its page's title, so h1 is right in
   * a real page and wrong in a docs demo, where the page already has one.
   */
  headingAs?: "h1" | "h2";
  className?: string;
};

export function HeroEditorial({
  kicker = "Field notes",
  headline = "What a design system owes the person who inherits it",
  deck = "Most systems are judged on the day they are adopted. The interesting question is what they cost eighteen months later, when the person who wrote them has left and the tokens have quietly stopped meaning anything.",
  author = { name: "Ahmet Hâşim Erdoğan", role: "Design systems" },
  date = "21 August 2026",
  readingTime = "9 min read",
  meta = "Issue 04",
  children,
  headingAs: Heading = "h1",
  className,
}: HeroEditorialProps) {
  const [ref, seen] = useInView<HTMLElement>("0px", 700);
  const reduced = useReducedMotion();
  const shown = seen || reduced;

  return (
    <section
      ref={ref}
      className={cx("w-full border-b border-line bg-canvas px-6 py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-3xl">
        {/* the rule and the kicker are one line — a masthead's first move */}
        <div className="flex items-baseline gap-4">
          <span className="text-[11.5px] font-semibold tracking-[0.14em] text-brand uppercase">
            {kicker}
          </span>
          <span aria-hidden className="h-px flex-1 bg-line-strong" />
          {meta && (
            <span className="font-mono text-[11.5px] text-ink-3">{meta}</span>
          )}
        </div>

        <Heading
          className={cx(
            "mt-7 text-[34px] leading-[1.12] font-bold tracking-[-0.03em] text-balance text-ink md:text-[46px]",
            "transition-[opacity,transform] duration-700 ease-out",
            shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          {headline}
        </Heading>

        <p
          className={cx(
            /* the deck is set larger than body copy and looser than the
               headline; it is the bridge between the two */
            "mt-6 text-[17px] leading-[1.62] text-ink-2",
            "transition-[opacity,transform] duration-700 ease-out",
            shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
          style={{ transitionDelay: "90ms" }}
        >
          {deck}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-6">
          {author && (
            <span className="flex items-center gap-2.5">
              <Avatar name={author.name} size="sm" />
              <span className="leading-tight">
                <span className="block text-[13px] font-semibold text-ink">{author.name}</span>
                {author.role && (
                  <span className="block text-[12px] text-ink-3">{author.role}</span>
                )}
              </span>
            </span>
          )}
          <span aria-hidden className="hidden h-8 w-px bg-line sm:block" />
          <span className="flex items-center gap-3 text-[12.5px] text-ink-3">
            {date && <span>{date}</span>}
            {date && readingTime && <span aria-hidden>·</span>}
            {readingTime && <span>{readingTime}</span>}
          </span>
        </div>

        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PullQuote — the thing an editorial hero most often needs next       */
/* ------------------------------------------------------------------ */

export function PullQuote({
  children,
  cite,
  className,
}: {
  children: ReactNode;
  cite?: ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cx(
        /* the accent rule carries the emphasis, so the type does not have
           to be enlarged into shouting */
        "border-l-2 border-brand pl-5",
        className,
      )}
    >
      <blockquote className="text-[19px] leading-[1.5] font-medium tracking-[-0.015em] text-balance text-ink">
        {children}
      </blockquote>
      {cite && (
        <figcaption className="mt-3 flex items-center gap-2 text-[12.5px] text-ink-3">
          <IArrowRight size={12} aria-hidden />
          {cite}
        </figcaption>
      )}
    </figure>
  );
}
