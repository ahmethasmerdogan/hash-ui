import type { CSSProperties, ReactNode } from "react";
import { cx, Button, type ButtonVariant, type ButtonSize } from "hash-ui";
import { useInView } from "./hooks.js";

/* ------------------------------------------------------------------ */
/* The small shared pieces every block reaches for.                    */
/*                                                                     */
/* Blocks are section-sized, so they take their calls to action as     */
/* data rather than as children. `Action` is that shape, and           */
/* <ActionButton> renders it the way the rest of the site does — a     */
/* core <Button> wrapped in a real anchor, so middle-click, "open in   */
/* new tab" and copy-link all keep working.                            */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Entrance motion                                                     */
/*                                                                     */
/* Upstream, every one of these blocks fades and lifts its content in  */
/* on framer-motion. Without that the whole section simply exists,     */
/* fully formed, the instant it is scrolled to — which reads as        */
/* nothing having loaded rather than as restraint.                     */
/*                                                                     */
/* `useRise` is that, in two lines and no wrappers. One observer per   */
/* block; each element gets a style object with its own delay, applied */
/* to the element that is already there. Nothing is nested, so a grid  */
/* stays a grid and a flex row stays a flex row.                       */
/* ------------------------------------------------------------------ */

export type RiseStyle = (index?: number, step?: number) => CSSProperties;

/**
 * Watch one element, and hand back a style-maker for everything inside it.
 *
 * The fail-safe on `useInView` matters here more than anywhere: these styles
 * start at `opacity: 0`, so an observer that never fires would leave the
 * whole section invisible rather than merely un-animated.
 */
export function useRise<T extends HTMLElement>(rootMargin = "-8% 0px") {
  const [ref, seen] = useInView<T>(rootMargin, 1400);
  const rise: RiseStyle = (index = 0, step = 70) => ({
    opacity: seen ? 1 : 0,
    transform: seen ? "none" : "translate3d(0, 16px, 0)",
    transition:
      `opacity 640ms cubic-bezier(.22,1,.36,1) ${index * step}ms,` +
      ` transform 640ms cubic-bezier(.22,1,.36,1) ${index * step}ms`,
  });
  return [ref, rise, seen] as const;
}

/** Marks an element as entrance-animated, so reduced motion can pin it. */
export const RISE_ATTR = { "data-fx-rise": "" } as const;

export type Action = {
  label: ReactNode;
  href: string;
  /** opens in a new tab and sets rel="noreferrer" */
  external?: boolean;
  variant?: ButtonVariant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

export function ActionButton({
  action,
  size = "md",
  className,
  fallbackVariant = "green",
}: {
  action: Action;
  size?: ButtonSize;
  className?: string;
  fallbackVariant?: ButtonVariant;
}) {
  return (
    <a
      href={action.href}
      {...(action.external
        ? { target: "_blank", rel: "noreferrer" }
        : undefined)}
      className={cx("inline-flex", className)}
    >
      <Button
        variant={action.variant ?? fallbackVariant}
        size={size}
        iconLeft={action.iconLeft}
        iconRight={action.iconRight}
      >
        {action.label}
      </Button>
    </a>
  );
}

/* ------------------------------------------------------------------ */

/** The wide-tracked uppercase label the system uses above headlines. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx("microlabel", className)}>{children}</div>;
}

/**
 * The two-line display headline several of these references share: the
 * first line in ink, the second dropped to a muted tone so the pair reads
 * as one sentence losing its voice rather than as two headings.
 */
export function SplitHeadline({
  lead,
  trail,
  as: Tag = "h2",
  className,
}: {
  lead: ReactNode;
  trail?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag
      className={cx(
        "text-4xl leading-[1.05] font-bold tracking-[-0.045em] text-balance text-ink md:text-6xl",
        className,
      )}
    >
      {lead}
      {trail && (
        <>
          <br />
          <span className="text-ink-3">{trail}</span>
        </>
      )}
    </Tag>
  );
}

/**
 * The window chrome that wraps every product shot and terminal in these
 * references: three lights, an optional centred field, then your content.
 */
export function WindowFrame({
  bar,
  children,
  className,
  contentClassName,
}: {
  /** what sits in the middle of the title bar — a URL field, a search box */
  bar?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-2xl border border-line bg-surface",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-line bg-elev px-4 py-2.5">
        <div className="flex shrink-0 gap-1.5">
          {["bg-ink-3/50", "bg-ink-3/35", "bg-ink-3/25"].map((tone, i) => (
            <span key={i} className={cx("size-2.5 rounded-full", tone)} />
          ))}
        </div>
        {bar && <div className="min-w-0 flex-1">{bar}</div>}
      </div>
      <div className={cx("min-w-0", contentClassName)}>{children}</div>
    </div>
  );
}

/** A read-only field for a window bar — a URL, a command, a search prompt. */
export function WindowField({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-6.5 max-w-sm items-center justify-center rounded-md border border-line bg-surface px-3 font-mono text-[11px] text-ink-3">
      {children}
    </div>
  );
}
