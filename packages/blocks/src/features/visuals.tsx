import { useId, type ReactNode } from "react";
import { cx, Avatar } from "uicean";

/* ------------------------------------------------------------------ */
/* The illustrations the feature grids are built out of.               */
/*                                                                     */
/* Every one is drawn rather than imported: an <img> in a feature card */
/* is the thing most likely to be missing, stale or the wrong theme    */
/* when the block lands in someone else's project. These scale, invert */
/* with the theme, and cost nothing to ship.                           */
/* ------------------------------------------------------------------ */

/** A number held inside a thin ellipse — the "100% customizable" tile. */
export function StatDial({
  value = "100%",
  className,
}: {
  value?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex items-center justify-center py-6", className)}>
      <div className="relative flex items-center justify-center px-10 py-4">
        <span
          aria-hidden
          className="absolute inset-0 rounded-[50%] border border-line-strong"
        />
        <span className="font-mono text-4xl font-semibold tracking-[-0.04em] text-ink md:text-5xl">
          {value}
        </span>
      </div>
    </div>
  );
}

/** Concentric arcs reading as a fingerprint — the "secure by default" tile. */
export function FingerprintMark({ className }: { className?: string }) {
  const rings = [10, 18, 26, 34, 42];
  return (
    <div className={cx("flex items-center justify-center py-4", className)}>
      <svg viewBox="0 0 100 100" className="size-28 text-ink-3" aria-hidden>
        {rings.map((r, i) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            /* breaking each ring at a different angle is what stops this
               reading as a target and starts it reading as a print */
            strokeDasharray={`${r * 3.4} ${r * 2.9}`}
            strokeDashoffset={i * 14}
            strokeLinecap="round"
            opacity={0.35 + i * 0.13}
          />
        ))}
      </svg>
    </div>
  );
}

/** A deterministic jagged line — the throughput readout. */
export function Sparkline({
  points = 44,
  seed = 7,
  className,
  strokeClassName = "text-ink",
}: {
  points?: number;
  seed?: number;
  className?: string;
  strokeClassName?: string;
}) {
  const id = useId().replace(/:/g, "");
  /* a tiny LCG, so the same card draws the same line on the server, on the
     client and in a screenshot test — Math.random() would flicker */
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };

  const w = 240;
  const h = 64;
  const step = w / (points - 1);
  const ys: number[] = [];
  let level = 0.5;
  for (let i = 0; i < points; i++) {
    level = Math.min(0.95, Math.max(0.08, level + (rand() - 0.48) * 0.34));
    ys.push(h - level * h);
  }

  const d = ys.map((y, i) => `${i ? "L" : "M"}${i * step} ${y.toFixed(1)}`).join(" ");
  const area = `${d} L${w} ${h} L0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cx("h-16 w-full", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} className={strokeClassName} />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={strokeClassName}
      />
    </svg>
  );
}

/** Named avatar chips stacked down the right of a card. */
export function AvatarStack({
  people = ["L. Keur", "M. Irung", "B. Ng"],
  className,
}: {
  people?: string[];
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col items-end gap-2.5 py-2", className)}>
      {people.map((name, i) => (
        <div
          key={name}
          className={cx(
            "flex items-center gap-2 rounded-full border border-line bg-surface py-1 pr-1 pl-3",
            /* staggering the indent keeps the column from reading as a list */
            i === 1 && "mr-6",
            i === 2 && "mr-2",
          )}
        >
          <span className="text-[12px] font-medium text-ink-2">{name}</span>
          <Avatar name={name} size="xs" />
        </div>
      ))}
    </div>
  );
}

/** Two overlapping circles — the set-operation glyphs. */
export function SetGlyph({
  mode = "union",
  className,
}: {
  mode?: "union" | "intersect" | "join" | "exclude";
  className?: string;
}) {
  const fill = {
    union: [0.18, 0.18],
    intersect: [0.06, 0.06],
    join: [0.28, 0.28],
    exclude: [0.2, 0.02],
  }[mode];

  return (
    <svg viewBox="0 0 48 32" className={cx("size-9", className)} aria-hidden>
      <circle
        cx="18"
        cy="16"
        r="11"
        fill="currentColor"
        fillOpacity={fill[0]}
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="30"
        cy="16"
        r="11"
        fill="currentColor"
        fillOpacity={fill[1]}
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/** The squircle icon tile the system uses to frame a glyph. */
export function IconTile({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "flex size-11 items-center justify-center rounded-[14px] border border-line bg-elev text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** L-shaped ticks pinned outside each corner of a card. */
export function CropMarks({ className }: { className?: string }) {
  const corner = "absolute size-2.5 border-ink-3/45";
  return (
    <span aria-hidden className={cx("pointer-events-none absolute inset-0", className)}>
      <span className={cx(corner, "-top-px -left-px border-t border-l")} />
      <span className={cx(corner, "-top-px -right-px border-t border-r")} />
      <span className={cx(corner, "-bottom-px -left-px border-b border-l")} />
      <span className={cx(corner, "-right-px -bottom-px border-r border-b")} />
    </span>
  );
}
