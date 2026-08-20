import type { ReactNode } from "react";
import { cx } from "hash-ui";
import { AuthCard, type AuthCardProps } from "./AuthCard.js";

/* ------------------------------------------------------------------ */
/* AuthSplit                                                           */
/*                                                                     */
/* The same form, with the other half of the screen doing the selling: */
/* a quote, a logo row, whatever the marketing side wants. Below lg it  */
/* collapses to the card alone — a testimonial above a password field   */
/* on a phone is three scrolls of preamble before anyone can sign in.   */
/*                                                                     */
/* The aside is decorative by construction, so it is skipped rather     */
/* than read out: the form is the page, and a screen reader should      */
/* reach it first. That is also why the form column comes first in the  */
/* DOM and is placed second visually, rather than the other way round.  */
/* ------------------------------------------------------------------ */

export type AuthSplitProps = AuthCardProps & {
  /** which side the panel sits on at lg and up */
  side?: "left" | "right";
  quote?: ReactNode;
  attribution?: ReactNode;
  /** small marks under the quote — customer logos, usually */
  marks?: ReactNode;
  /** replaces the whole panel */
  panel?: ReactNode;
};

export function AuthSplit({
  side = "right",
  quote = "We replaced four internal component libraries with this one and shipped the quarter early.",
  attribution = "Deniz Aksoy · Head of Design, Northwind",
  marks,
  panel,
  className,
  ...card
}: AuthSplitProps) {
  return (
    <div
      className={cx(
        "grid min-h-screen grid-cols-1 bg-canvas lg:grid-cols-2",
        className,
      )}
    >
      {/* the form is first in the DOM whichever side it is shown on */}
      <div
        className={cx(
          "flex items-center justify-center px-6 py-16",
          side === "left" && "lg:order-2",
        )}
      >
        <AuthCard {...card} />
      </div>

      <aside
        /* nothing here is required to sign in, and a reader tabbing into
           the page should land on the email field, not a testimonial */
        aria-hidden
        className={cx(
          "relative hidden overflow-hidden border-line bg-inset lg:flex lg:flex-col lg:justify-end",
          side === "left" ? "lg:order-1 lg:border-r" : "lg:border-l",
        )}
      >
        {panel ?? (
          <>
            {/* a wash rather than an image: no asset to ship, no request to
                make, and it re-tints itself when the accent changes */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 20% 0%, var(--brand-soft) 0%, transparent 60%)," +
                  "radial-gradient(90% 60% at 100% 100%, var(--brand-soft) 0%, transparent 55%)",
              }}
            />
            <div className="relative z-10 max-w-lg p-14">
              <p className="text-[26px] leading-[1.32] font-semibold tracking-[-0.02em] text-balance text-ink">
                “{quote}”
              </p>
              <p className="mt-5 text-[13.5px] text-ink-2">{attribution}</p>
              {marks && (
                <div className="mt-10 flex flex-wrap items-center gap-6 opacity-55">
                  {marks}
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
