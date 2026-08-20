import { useState, type FormEvent, type ReactNode } from "react";
import { cx, Button, Typewriter, IChevronDown, IArrowRight, IMessage, IMail, IUsers, IHash } from "hash-ui";
import {
  ActionButton,
  WindowFrame,
  useRise,
  RISE_ATTR,
  type Action,
} from "../parts.js";
import { usePointer } from "../hooks.js";
import type { NavLink } from "./HeroSplit.js";

/* ------------------------------------------------------------------ */
/* HeroNexus                                                           */
/*                                                                     */
/* The SaaS opening, with the parts that actually convert: a sticky    */
/* nav with grouped menus, an announcement pill, a headline whose last */
/* word cycles, and an inline capture form instead of a button that    */
/* sends people somewhere else.                                        */
/*                                                                     */
/* The backdrop is two dot fields stacked: the neutral texture           */
/* everywhere, and a brand-tinted one revealed by a radial mask that     */
/* follows the pointer. That is the whole "interactive grid" — no        */
/* canvas, no per-dot state, one mask-position repaint.                  */
/*                                                                       */
/* The lit field is tinted rather than merely brighter because the       */
/* neutral dot sits one shade off the canvas: turning up its opacity     */
/* changes nothing anyone can see.                                       */
/* ------------------------------------------------------------------ */

export type NexusMenu = NavLink & { items?: NavLink[] };

export type HeroNexusProps = {
  brand?: ReactNode;
  menus?: NexusMenu[];
  navActions?: Action[];
  announcement?: { label: ReactNode; href?: string };
  /** the fixed part of the headline */
  title?: ReactNode;
  /** words the last line cycles through */
  rotating?: string[];
  description?: ReactNode;
  /** the inline capture form; omit for a plain call to action */
  capture?: {
    placeholder?: string;
    submitLabel?: ReactNode;
    note?: ReactNode;
    onSubmit?: (email: string) => void;
  };
  worksWithLabel?: ReactNode;
  worksWith?: { label: ReactNode; icon?: ReactNode }[];
  /**
   * The headline's element. A hero is its page's title, so h1 is right in a
   * real page — and wrong on a docs page showing five of them, or anywhere
   * this block sits below one. Whatever you pass, the type is unchanged.
   */
  headingAs?: "h1" | "h2";
  /** the product shot under the fold */
  visual?: ReactNode;
  className?: string;
};

const DEMO_MENUS: NexusMenu[] = [
  { label: "Product", href: "#" },
  { label: "Customers", href: "#" },
  {
    label: "Channels",
    href: "#",
    items: [
      { label: "Chat", href: "#" },
      { label: "Email", href: "#" },
      { label: "Voice", href: "#" },
    ],
  },
  {
    label: "Resources",
    href: "#",
    items: [
      { label: "Docs", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  { label: "Pricing", href: "#" },
];

const DEMO_WORKS_WITH = [
  { label: "Slack", icon: <IHash size={14} /> },
  { label: "Teams", icon: <IUsers size={14} /> },
  { label: "Discord", icon: <IMessage size={14} /> },
  { label: "Email", icon: <IMail size={14} /> },
];

export function HeroNexus({
  brand = "Nexus",
  menus = DEMO_MENUS,
  navActions = [
    { label: "Sign in", href: "#", variant: "ghost" },
    { label: "Book a demo", href: "#", variant: "green" },
  ],
  announcement = { label: "Announcing our $15M Series A", href: "#" },
  title = "Deliver",
  rotating = ["collaborative", "unmistakable", "effortless"],
  description = "Support your customers on Slack, Microsoft Teams, Discord and many more — and move from answering tickets to building genuine relationships.",
  capture = {
    placeholder: "Your work email",
    submitLabel: "See Nexus in action",
    note: "Free 14-day trial",
  },
  worksWithLabel = "Works with",
  worksWith = DEMO_WORKS_WITH,
  visual,
  headingAs: H = "h1",
  className,
}: HeroNexusProps) {
  const [ref, pos] = usePointer<HTMLElement>();
  /* until the pointer has actually been over the hero, a lit patch stuck at
     dead centre reads as a rendering artefact rather than as a response */
  const [lit, setLit] = useState(false);
  const [email, setEmail] = useState("");
  const [riseRef, rise] = useRise<HTMLDivElement>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    capture?.onSubmit?.(email);
  };

  return (
    <section
      ref={ref}
      onPointerEnter={() => setLit(true)}
      onPointerLeave={() => setLit(false)}
      /* `isolate` is load-bearing: the two dot fields below sit at negative
         z-index, and without a stacking context here they paint behind the
         nearest ancestor background instead of behind this section. */
      className={cx("relative isolate w-full overflow-hidden", className)}
    >
      {/* the resting texture, everywhere */}
      <div aria-hidden className="dot-grid absolute inset-0 -z-20" />
      {/* the lit patch, only where the pointer is */}
      <div
        aria-hidden
        className="fx-dot-brand absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity: lit ? 1 : 0,
          maskImage: `radial-gradient(260px circle at ${pos.x * 100}% ${pos.y * 100}%, #000 0%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(260px circle at ${pos.x * 100}% ${pos.y * 100}%, #000 0%, transparent 70%)`,
        }}
      />

      <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
          <span className="text-[15px] font-bold tracking-[-0.03em] text-ink">
            {brand}
          </span>
          <nav className="hidden items-center gap-6 md:flex">
            {menus.map((m, i) => (
              <div key={i} className="group/menu relative">
                <a
                  href={m.href}
                  className="flex items-center gap-1 py-5 text-[13.5px] font-medium text-ink-2 transition-colors hover:text-ink"
                >
                  {m.label}
                  {m.items && <IChevronDown size={12} className="text-ink-3" />}
                </a>
                {m.items && (
                  /* hover-intent without JS: the panel is inside the trigger's
                     hover area, so moving down into it never closes it */
                  <div className="invisible absolute top-full left-0 min-w-40 rounded-xl border border-line bg-surface p-1.5 opacity-0 transition-all duration-150 group-hover/menu:visible group-hover/menu:opacity-100">
                    {m.items.map((item, j) => (
                      <a
                        key={j}
                        href={item.href}
                        className="block rounded-lg px-3 py-1.5 text-[13px] text-ink-2 hover:bg-elev hover:text-ink"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {navActions.map((a, i) => (
              <ActionButton key={i} action={a} size="sm" />
            ))}
          </div>
        </div>
      </header>

      <div
        ref={riseRef}
        className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center md:pt-24"
      >
        {announcement && (
          <a
            {...RISE_ATTR}
            style={rise(0)}
            href={announcement.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand-soft px-3.5 py-1.5 text-[12.5px] font-medium text-brand-ink transition-colors hover:border-brand/45"
          >
            {announcement.label}
            <IArrowRight size={12} />
          </a>
        )}

        <H
          {...RISE_ATTR}
          style={rise(1)}
          className="mt-7 text-4xl leading-[1.05] font-bold tracking-[-0.045em] text-balance text-ink md:text-6xl"
        >
          {title}{" "}
          <span className="text-brand">
            <Typewriter words={rotating} />
          </span>
        </H>

        {description && (
          <p
            {...RISE_ATTR}
            style={rise(2)}
            className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-balance text-ink-2"
          >
            {description}
          </p>
        )}

        {capture && (
          <form
            {...RISE_ATTR}
            style={rise(3)}
            onSubmit={submit}
            className="mx-auto mt-8 flex max-w-md flex-col items-center gap-2"
          >
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={capture.placeholder}
                aria-label={capture.placeholder}
                className="h-9.5 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
              />
              <Button type="submit" variant="green" size="md">
                {capture.submitLabel}
              </Button>
            </div>
            {capture.note && (
              <span className="text-[12px] text-ink-3">{capture.note}</span>
            )}
          </form>
        )}

        {worksWith && worksWith.length > 0 && (
          <div {...RISE_ATTR} style={rise(4)} className="mt-10">
            {worksWithLabel && (
              <div className="microlabel mb-3">{worksWithLabel}</div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {worksWith.map((w, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-ink-2"
                >
                  {w.icon}
                  {w.label}
                </span>
              ))}
              <span className="text-[13px] text-ink-3">and more</span>
            </div>
          </div>
        )}
      </div>

      <div {...RISE_ATTR} style={rise(5)} className="mx-auto max-w-4xl px-6 pb-20">
        {visual ?? (
          <WindowFrame contentClassName="bg-inset">
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[180px_1fr]">
              <div className="hidden flex-col gap-1.5 sm:flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cx(
                      "h-7 rounded-lg",
                      i === 1 ? "bg-ink/10 dark:bg-white/12" : "bg-ink/4 dark:bg-white/5",
                    )}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <div className="h-24 rounded-xl border border-line bg-surface" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-xl border border-line bg-surface" />
                  <div className="h-20 rounded-xl border border-line bg-surface" />
                </div>
              </div>
            </div>
          </WindowFrame>
        )}
      </div>
    </section>
  );
}
