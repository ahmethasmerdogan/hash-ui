import { useId } from "react";
import { cx } from "uicean";

/* ------------------------------------------------------------------ */
/* UICean mark                                                         */
/*                                                                     */
/* The squircle carries the same anatomy as every button face in the   */
/* system — vertical gradient, 1px ring of the same hue, hairline      */
/* highlight along the top edge — so the logo is itself a spec of the  */
/* design language. The glyph is three waves: UI + ocean.              */
/* ------------------------------------------------------------------ */

export function LogoMark({
  size = 32,
  className,
  radius = 0.234, // 15/64 — the squircle ratio used by the app-icon tiles
}: {
  size?: number;
  className?: string;
  radius?: number;
}) {
  /* several marks share a page — give each its own gradient ids */
  const id = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="UICean"
      className={cx("shrink-0", className)}
    >
      {/* userSpaceOnUse, not the objectBoundingBox default: the glyph gradient
          is shared by paths whose bounding box has zero height (the two
          horizontal bars), which would otherwise collapse to nothing */}
      <defs>
        <linearGradient
          id={`${id}-tile`}
          x1="32"
          y1="0"
          x2="32"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2eb266" />
          <stop offset="1" stopColor="#0c7d47" />
        </linearGradient>
        <linearGradient
          id={`${id}-glyph`}
          x1="32"
          y1="10"
          x2="32"
          y2="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e4fbef" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx={64 * radius} fill={`url(#${id}-tile)`} />
      {/* 1px ring + top hairline — the button-face recipe, in SVG */}
      <rect
        x="0.75"
        y="0.75"
        width="62.5"
        height="62.5"
        rx={64 * radius - 0.75}
        stroke="#0a6b3c"
        strokeWidth="1.5"
      />
      <path
        d={`M ${64 * radius} 1.5 H ${64 - 64 * radius}`}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Three waves — UI + ocean, and the same idea the system expresses
          everywhere else: depth as stacked surfaces rather than shadow.
          Three rather than four, and this amplitude rather than more,
          because at 16px in a browser tab any tighter and they merge into
          a smudge. */}
      <g
        stroke={`url(#${id}-glyph)`}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 21 Q22.5 15 32 21 T51 21" />
        <path d="M13 32 Q22.5 26 32 32 T51 32" />
        <path d="M13 43 Q22.5 37 32 43 T51 43" />
      </g>
    </svg>
  );
}

export function Logo({
  size = 32,
  className,
  version,
}: {
  size?: number;
  className?: string;
  version?: string;
}) {
  return (
    <span className={cx("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      <span
        className="font-bold tracking-[-0.035em] text-ink"
        style={{ fontSize: size * 0.55 }}
      >
        UICean
      </span>
      {version && (
        <span className="rounded-full border border-line bg-elev px-2 py-0.5 font-mono text-[10px] font-medium text-ink-2">
          {version}
        </span>
      )}
    </span>
  );
}
