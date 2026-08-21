import type { ReactNode } from "react";
import { cx, IArrowUp } from "uicean";
import { useMagnetic, useScrollProgress } from "../hooks.js";

/* ------------------------------------------------------------------ */
/* CinematicFooter                                                     */
/*                                                                     */
/* The closing frame: a tilted marquee band, an enormous sign-off, two */
/* magnetic pills, and the brand left as a watermark behind it all.    */
/*                                                                     */
/* The "curtain reveal" is two CSS declarations, not a scroll library. */
/* Put the footer last inside a `relative` wrapper, give the content   */
/* above it `relative z-10` and an opaque background, and set          */
/* `sticky` here — the footer pins to the bottom of the viewport and   */
/* the page slides off it. Upstream this is GSAP ScrollTrigger.        */
/*                                                                     */
/* The reveal alone is only half of it. The content inside also drifts */
/* against the uncovering, which is what makes the curtain read as     */
/* depth rather than as a panel sliding into place.                    */
/*                                                                     */
/*   <div className="relative">                                        */
/*     <main className="relative z-10 bg-canvas">…</main>              */
/*     <CinematicFooter sticky />                                      */
/*   </div>                                                            */
/* ------------------------------------------------------------------ */

export type FooterLink = { label: ReactNode; href: string };

export type CinematicFooterProps = {
  /** the items in the tilted band, joined by a divider glyph */
  marquee?: string[];
  /** the glyph between marquee items */
  separator?: ReactNode;
  headline?: ReactNode;
  /** the two big calls to action */
  actions?: (FooterLink & { icon?: ReactNode })[];
  links?: FooterLink[];
  /** the oversized watermark bleeding off the right edge */
  wordmark?: ReactNode;
  copyright?: ReactNode;
  /** the small credit opposite the copyright */
  credit?: ReactNode;
  /** pin to the bottom so the page scrolls off it — see the note above */
  sticky?: boolean;
  onBackToTop?: () => void;
  className?: string;
};

const DEMO_MARQUEE = [
  "Accountability redefined",
  "Transparent tracking",
  "Twelve-step progress",
  "Sponsor connection",
  "Absolute privacy",
];

function MagneticPill({
  link,
}: {
  link: FooterLink & { icon?: ReactNode };
}) {
  const magnet = useMagnetic<HTMLAnchorElement>(0.3);
  return (
    <a
      ref={magnet.ref}
      onPointerMove={magnet.onPointerMove}
      onPointerLeave={magnet.onPointerLeave}
      href={link.href}
      className="fx-glass inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:border-line-strong"
    >
      {link.icon}
      {link.label}
    </a>
  );
}

export function CinematicFooter({
  marquee = DEMO_MARQUEE,
  separator = "✦",
  headline = "Ready to begin?",
  actions = [
    { label: "Download iOS", href: "#" },
    { label: "Download Android", href: "#" },
  ],
  links = [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
    { label: "Support", href: "#" },
  ],
  wordmark = "UICean",
  copyright = "© 2026 UICean. All rights reserved.",
  credit,
  sticky,
  onBackToTop,
  className,
}: CinematicFooterProps) {
  /* 0 while the footer is still covered, 1 once it is fully uncovered.
     "enter" rather than the default "cover": when `sticky` is set the footer
     is pinned to the bottom of the viewport, so its box never travels past
     the screen and a pass-through measurement would sit at a constant. What
     does change is how much of it has been revealed, which is what "enter"
     reports. */
  const [progressRef, progress] = useScrollProgress<HTMLDivElement>("enter");
  /* the band and the sign-off travel in opposite directions, so the
     parallax is legible without anything moving very far */
  const drift = (1 - progress) * 100;

  const backToTop = () =>
    onBackToTop
      ? onBackToTop()
      : window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className={cx(
        "relative isolate w-full overflow-hidden bg-canvas",
        sticky && "sticky bottom-0 z-0",
        className,
      )}
    >
      <div ref={progressRef} className="absolute inset-0 -z-30" aria-hidden />
      <div aria-hidden className="fx-aurora absolute inset-0 -z-20 opacity-70" />
      <div aria-hidden className="fx-grid fx-mask-b absolute inset-0 -z-20 opacity-40" />

      {/* the band. Rotating the track and over-sizing it is what keeps the
          ends off screen — a tilted strip that stops at the edge reads as a
          mistake rather than as a device. */}
      <div
        aria-hidden
        className="relative -mx-[6%] w-[112%] -rotate-2 border-y border-line bg-surface/70 py-3 will-change-transform"
        style={{ transform: `translate3d(0, ${drift * 0.35}px, 0)` }}
      >
        <div className="w-full overflow-hidden" data-fx-marquee>
          <div
            className="flex w-max items-center gap-8"
            style={{ animation: "uicean-fx-marquee-x 32s linear infinite" }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-8">
                {marquee.map((item, i) => (
                  <span
                    key={i}
                    className="microlabel flex items-center gap-8 !text-ink-2"
                  >
                    {item}
                    <span className="text-ink-3">{separator}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="relative mx-auto max-w-4xl px-6 pt-16 pb-8 text-center will-change-transform"
        style={{ transform: `translate3d(0, ${drift * -0.18}px, 0)` }}
      >
        <h2 className="fx-fade-type text-5xl font-bold tracking-[-0.05em] text-balance md:text-7xl">
          {headline}
        </h2>

        {actions.length > 0 && (
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {actions.map((a, i) => (
              <MagneticPill key={i} link={a} />
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {links.map((l, i) => (
              <a
                key={i}
                href={l.href}
                className="rounded-full border border-line px-3.5 py-1.5 text-[12.5px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {wordmark && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 -bottom-4 -z-10 overflow-hidden"
        >
          <span className="fx-ghost-type block translate-x-[12%] text-[22vw] leading-none font-bold tracking-[-0.05em] whitespace-nowrap">
            {wordmark}
          </span>
        </div>
      )}

      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-4 border-t border-line px-6 py-5">
        <span className="microlabel !text-ink-3">{copyright}</span>
        {credit && (
          <span className="microlabel ml-auto !text-ink-3">{credit}</span>
        )}
        <button
          type="button"
          onClick={backToTop}
          aria-label="Back to top"
          className={cx(
            "flex size-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:text-ink",
            credit ? "" : "ml-auto",
          )}
        >
          <IArrowUp size={15} />
        </button>
      </div>
    </footer>
  );
}
