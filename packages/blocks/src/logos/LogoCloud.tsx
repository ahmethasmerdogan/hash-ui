import type { ReactNode } from "react";
import { cx, IPlus } from "hash-ui";

/* ------------------------------------------------------------------ */
/* LogoCloud / LogoCloudPlus                                           */
/*                                                                     */
/* The social-proof grid, in the two treatments from the references:   */
/* a plain ruled grid, and one with plus marks pinned to the interior  */
/* crossings and a checkerboard tint on the cells.                     */
/*                                                                     */
/* Logos are given as data. `src` renders an <img>, `srcDark` swaps it  */
/* on a dark canvas, and anything with neither falls back to a typeset  */
/* wordmark — so a grid still reads as itself offline, in a screenshot  */
/* test, or before anyone has picked their customers.                   */
/*                                                                      */
/* The theme swap is two <img> tags with `dark:` visibility rather than */
/* a `useTheme()` read: it costs no JavaScript, works before hydration, */
/* and a brand wordmark inverted with a filter looks wrong in a way     */
/* everyone notices except the person who shipped it.                   */
/* ------------------------------------------------------------------ */

export type Logo = {
  /** image URL — an SVG wordmark is what these grids are drawn for */
  src?: string;
  /** the variant to use on a dark canvas; falls back to `src` */
  srcDark?: string;
  /** required: the accessible name, and the fallback wordmark */
  alt: string;
  href?: string;
  /** override the fallback rendering entirely */
  render?: ReactNode;
};

/* svgl.app serves these; "light"/"dark" in their names is the background the
   mark is drawn for, not the mark's own colour. */
const svgl = (name: string) => `https://svgl.app/library/${name}.svg`;

const DEMO: Logo[] = [
  { alt: "Nvidia", src: svgl("nvidia-wordmark-light"), srcDark: svgl("nvidia-wordmark-dark") },
  { alt: "Supabase", src: svgl("supabase_wordmark_light"), srcDark: svgl("supabase_wordmark_dark") },
  { alt: "OpenAI", src: svgl("openai_wordmark_light"), srcDark: svgl("openai_wordmark_dark") },
  { alt: "Turso", src: svgl("turso-wordmark-light"), srcDark: svgl("turso-wordmark-dark") },
  { alt: "Vercel", src: svgl("vercel_wordmark"), srcDark: svgl("vercel_wordmark_dark") },
  { alt: "GitHub", src: svgl("github_wordmark_light"), srcDark: svgl("github_wordmark_dark") },
  { alt: "Claude", src: svgl("claude-ai-wordmark-icon_light"), srcDark: svgl("claude-ai-wordmark-icon_dark") },
  { alt: "Clerk", src: svgl("clerk-wordmark-light"), srcDark: svgl("clerk-wordmark-dark") },
];

/* grayscale at rest is the convention here: a wall of twelve brand palettes
   fights everything around it. Hover restores the real thing. */
const IMG =
  "h-6 w-auto max-w-[120px] object-contain opacity-65 grayscale transition duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0";

function LogoMark({ logo }: { logo: Logo }) {
  const inner =
    logo.render ??
    (logo.src ? (
      <>
        <img
          src={logo.src}
          alt={logo.alt}
          loading="lazy"
          className={cx(IMG, logo.srcDark && "dark:hidden")}
        />
        {logo.srcDark && (
          <img
            src={logo.srcDark}
            alt=""
            aria-hidden
            loading="lazy"
            className={cx(IMG, "hidden dark:block")}
          />
        )}
      </>
    ) : (
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink-2 transition-colors duration-300 group-hover/logo:text-ink">
        {logo.alt}
      </span>
    ));

  if (!logo.href) return <>{inner}</>;
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center"
    >
      {inner}
    </a>
  );
}

export type LogoCloudProps = {
  logos?: Logo[];
  /** cells per row on desktop; the grid halves on small screens */
  columns?: 3 | 4 | 5;
  className?: string;
};

const COLS: Record<number, string> = {
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-5",
};

/** The plain treatment: one hairline grid, nothing else. */
export function LogoCloud({
  logos = DEMO,
  columns = 4,
  className,
}: LogoCloudProps) {
  return (
    <div
      className={cx(
        /* the outer ring plus a 1px gap tinted with the line colour gives
           every cell its border without doubling any of them up */
        "grid gap-px overflow-hidden rounded-2xl border border-line bg-line",
        COLS[columns],
        className,
      )}
    >
      {logos.map((logo) => (
        <div
          key={logo.alt}
          className="group/logo flex h-24 items-center justify-center bg-surface px-4 transition-colors duration-300 hover:bg-elev"
        >
          <LogoMark logo={logo} />
        </div>
      ))}
    </div>
  );
}

/**
 * The decorated treatment: alternating cell tint, and a plus mark pinned to
 * every interior crossing of the grid.
 */
export function LogoCloudPlus({
  logos = DEMO,
  columns = 4,
  className,
}: LogoCloudProps) {
  const rows = Math.ceil(logos.length / columns);

  return (
    <div className={cx("relative", className)}>
      <div
        className={cx(
          "grid gap-px overflow-hidden rounded-2xl border border-line bg-line",
          COLS[columns],
        )}
      >
        {logos.map((logo, i) => {
          const row = Math.floor(i / columns);
          const col = i % columns;
          /* checkerboard: shift the parity by row so the tint runs diagonally
             rather than striping down every other column */
          const tinted = (row + col) % 2 === 1;
          return (
            <div
              key={logo.alt}
              className={cx(
                "group/logo flex h-24 items-center justify-center px-4 transition-colors duration-300",
                tinted ? "bg-inset hover:bg-elev" : "bg-surface hover:bg-elev",
              )}
            >
              <LogoMark logo={logo} />
            </div>
          );
        })}
      </div>

      {/* the plus marks. Interior crossings only — a mark on the outer ring
          would read as a stray glyph rather than as grid hardware. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
        {Array.from({ length: rows - 1 }).flatMap((_, r) =>
          Array.from({ length: columns - 1 }).map((__, c) => (
            <span
              key={`${r}-${c}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-ink-3"
              style={{
                left: `${((c + 1) / columns) * 100}%`,
                top: `${((r + 1) / rows) * 100}%`,
              }}
            >
              <IPlus size={12} />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

/** Heading + grid, the shape the references actually ship. */
export function LogoCloudSection({
  title = "Companies we collaborate with.",
  highlight,
  logos = DEMO,
  columns = 4,
  variant = "plus",
  className,
}: LogoCloudProps & {
  title?: ReactNode;
  /** a trailing phrase rendered in ink while the title stays muted */
  highlight?: string;
  variant?: "plain" | "plus";
}) {
  const Grid = variant === "plus" ? LogoCloudPlus : LogoCloud;
  return (
    <section className={cx("mx-auto w-full max-w-3xl px-4", className)}>
      <h2 className="mb-6 text-center text-lg font-medium tracking-[-0.02em] text-ink-2 md:text-2xl">
        {title}
        {highlight && <span className="font-semibold text-ink"> {highlight}</span>}
      </h2>
      <Grid logos={logos} columns={columns} />
    </section>
  );
}
