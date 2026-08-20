import type { ReactNode } from "react";
import { cx } from "hash-ui";
import { useInView } from "../hooks.js";
import type { NavLink } from "./HeroSplit.js";

/* ------------------------------------------------------------------ */
/* HeroCinematic                                                       */
/*                                                                     */
/* A full-bleed film still or loop, a floating pill of navigation, and */
/* the brand set enormous along the bottom edge.                       */
/*                                                                     */
/* Two details do the work. The headline reveals word by word rather   */
/* than as a block, so the eye reads it at the pace it was written.    */
/* And the wordmark is allowed to run past the right edge — cropping   */
/* the mark is what says "this is a poster", and it only works if you  */
/* let it actually leave the frame.                                    */
/*                                                                     */
/* `media` takes any node: an <img>, a <video autoPlay muted loop      */
/* playsInline>, or a canvas. Nothing is fetched for you.              */
/* ------------------------------------------------------------------ */

export type HeroCinematicProps = {
  /** the background layer — an <img>, <video>, or anything else */
  media?: ReactNode;
  links?: NavLink[];
  /** revealed one word at a time */
  title?: string;
  description?: ReactNode;
  /** the oversized mark along the bottom edge */
  wordmark?: ReactNode;
  /**
   * The headline's element. A hero is its page's title, so h1 is right in a
   * real page — and wrong on a docs page showing five of them, or anywhere
   * this block sits below one. Whatever you pass, the type is unchanged.
   */
  headingAs?: "h1" | "h2";
  /** how far the wordmark is allowed to run off the right edge, in % */
  bleed?: number;
  className?: string;
};

const DEMO_LINKS: NavLink[] = [
  { label: "Our story", href: "#" },
  { label: "Collective", href: "#" },
  { label: "Workshop", href: "#" },
  { label: "Programs", href: "#" },
  { label: "Inquiries", href: "#" },
];

/** the stand-in backdrop: a slow gradient, so the block has something to
    show before anyone has picked a film */
function DefaultMedia() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-linear-to-br from-[#2b2f36] via-[#1b1d22] to-[#0c0d10]">
      <div className="fx-aurora absolute inset-0 opacity-60" />
      {/* a slow push, so the stand-in behaves like footage rather than like a
          painted panel; a real <video> supplied via `media` replaces it */}
      <div className="fx-kenburns absolute inset-0 bg-[radial-gradient(55%_55%_at_32%_36%,rgba(255,255,255,0.22),transparent_68%)]" />
    </div>
  );
}

export function HeroCinematic({
  media,
  links = DEMO_LINKS,
  title = "Where the work goes quiet",
  description,
  wordmark = "Prisma*",
  bleed = 12,
  headingAs: H = "h1",
  className,
}: HeroCinematicProps) {
  /* the headline is gated on this, so it gets the fail-safe: if the observer
     never fires the words appear anyway rather than staying invisible */
  const [ref, seen] = useInView<HTMLDivElement>("-5% 0px", 1200);
  const words = title.split(" ");

  return (
    <section
      ref={ref}
      className={cx(
        "@container relative isolate flex min-h-[85vh] w-full flex-col overflow-hidden rounded-3xl",
        className,
      )}
    >
      <div className="absolute inset-0 -z-20">{media ?? <DefaultMedia />}</div>

      {/* the vignette: without it the nav and the wordmark sit on whatever
          the film happens to be doing at that moment */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-black/55 via-transparent to-black/75"
      />

      <div className="flex justify-center px-6 pt-6">
        <nav className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/12 bg-black/35 px-2 py-1.5 backdrop-blur-md">
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex min-h-0 flex-1 shrink items-center px-6 py-10 md:px-12">
        <div className="max-w-2xl">
          <H className="text-4xl leading-[1.05] font-bold tracking-[-0.045em] text-white md:text-6xl">
            {words.map((w, i) => (
              <span
                key={i}
                data-fx-rise
                className="inline-block"
                style={{
                  opacity: seen ? 1 : 0,
                  transform: seen ? "none" : "translate3d(0, 18px, 0)",
                  transition: `opacity 620ms cubic-bezier(.22,1,.36,1) ${i * 80}ms, transform 620ms cubic-bezier(.22,1,.36,1) ${i * 80}ms`,
                }}
              >
                {w}
                {i < words.length - 1 && " "}
              </span>
            ))}
          </H>
          {description && (
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/65">
              {description}
            </p>
          )}
        </div>
      </div>

      {wordmark && (
        <div
          aria-hidden
          className="pointer-events-none shrink-0 overflow-hidden px-6 pb-4 md:px-12"
        >
          <div
            className="text-[clamp(3rem,17cqw,16rem)] leading-[0.82] font-bold tracking-[-0.05em] whitespace-nowrap text-white/85"
            style={{ marginRight: `-${bleed}%` }}
          >
            {wordmark}
          </div>
        </div>
      )}
    </section>
  );
}
