import { useState, type ReactNode } from "react";
import { cx, Button, IMenu, IX } from "uicean";
import { ActionButton, useRise, RISE_ATTR, type Action } from "../parts.js";
import { LogoCloud, type Logo } from "../logos/LogoCloud.js";

/* ------------------------------------------------------------------ */
/* HeroSplit                                                           */
/*                                                                     */
/* The marketing-site opening: a real navigation bar, a left-aligned   */
/* headline — not centred, which is what makes it read as a product    */
/* site rather than a launch page — and a client strip underneath.     */
/*                                                                     */
/* The nav is included because this block is usually the first thing   */
/* on the page and would otherwise need one bolted on. It collapses    */
/* to a sheet below `md` and takes its links as data.                  */
/* ------------------------------------------------------------------ */

export type NavLink = { label: ReactNode; href: string };

export type HeroSplitProps = {
  brand?: ReactNode;
  links?: NavLink[];
  /** the right-hand side of the nav bar */
  navActions?: Action[];
  title?: ReactNode;
  description?: ReactNode;
  actions?: Action[];
  /**
   * The headline's element. A hero is its page's title, so h1 is right in a
   * real page — and wrong on a docs page showing five of them, or anywhere
   * this block sits below one. Whatever you pass, the type is unchanged.
   */
  headingAs?: "h1" | "h2";
  /** the strip below the fold */
  clientsLabel?: ReactNode;
  clients?: Logo[];
  className?: string;
};

const DEMO_LINKS: NavLink[] = [
  { label: "Features", href: "#" },
  { label: "Solution", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "About", href: "#" },
];

export function HeroSplit({
  brand = "uicean",
  links = DEMO_LINKS,
  navActions = [
    { label: "Login", href: "#", variant: "ghost" },
    { label: "Sign up", href: "#", variant: "dark" },
  ],
  title = "Ship 10× faster with UICean",
  description = "Highly customizable components for building modern websites and applications that look and feel the way you mean it.",
  actions = [
    { label: "Start building", href: "#", variant: "dark" },
    { label: "Request a demo", href: "#", variant: "ghost" },
  ],
  clientsLabel = "Powering the best teams",
  clients,
  headingAs: H = "h1",
  className,
}: HeroSplitProps) {
  const [open, setOpen] = useState(false);
  const [ref, rise] = useRise<HTMLDivElement>();

  return (
    <section className={cx("w-full", className)}>
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
          <span className="flex items-center gap-2 text-[15px] font-bold tracking-[-0.03em] text-ink">
            {brand}
          </span>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l, i) => (
              <a
                key={i}
                href={l.href}
                className="text-[13.5px] font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            {navActions.map((a, i) => (
              <ActionButton key={i} action={a} size="sm" />
            ))}
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="ml-auto flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-ink-2 md:hidden"
          >
            {open ? <IX size={16} /> : <IMenu size={16} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-line bg-surface px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((l, i) => (
                <a
                  key={i}
                  href={l.href}
                  className="rounded-lg px-2 py-2 text-[14px] font-medium text-ink-2 hover:bg-elev hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex gap-2">
              {navActions.map((a, i) => (
                <ActionButton key={i} action={a} size="sm" />
              ))}
            </div>
          </div>
        )}
      </header>

      <div ref={ref} className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28">
        <H
          {...RISE_ATTR}
          style={rise(0)}
          className="max-w-xl text-4xl leading-[1.05] font-bold tracking-[-0.045em] text-balance text-ink md:text-6xl"
        >
          {title}
        </H>
        {description && (
          <p
            {...RISE_ATTR}
            style={rise(1)}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-2 md:text-base"
          >
            {description}
          </p>
        )}
        {actions.length > 0 && (
          <div
            {...RISE_ATTR}
            style={rise(2)}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            {actions.map((a, i) => (
              <ActionButton key={i} action={a} size="md" />
            ))}
          </div>
        )}
      </div>

      {(clientsLabel || clients) && (
        <div className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            {clientsLabel && (
              <span className="microlabel max-w-24 shrink-0 !leading-relaxed">
                {clientsLabel}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <LogoCloud logos={clients} columns={4} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
