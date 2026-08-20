import { useCallback, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx, ISparkleFill } from "hash-ui";

/* ------------------------------------------------------------------ */
/* LiquidMetalButton                                                   */
/*                                                                     */
/* A brushed-metal pill with a sheen that keeps turning under it, a    */
/* glowing rim, and a ripple that leaves from wherever you clicked.    */
/*                                                                     */
/* The original drives the metal with a WebGL fragment shader          */
/* (@paper-design/shaders). Nothing here needs a GPU program: a conic  */
/* gradient rotating behind a vertical ramp reads as the same swirling */
/* metal, costs one composited layer, and degrades to a still gradient */
/* when the reader asks for less motion.                               */
/*                                                                     */
/* It keeps HashUI's button anatomy — vertical gradient, 1px ring,     */
/* inset top highlight, pill by default — so it sits next to <Button>  */
/* without looking imported. The glow is the one liberty, and it is    */
/* why this lives in blocks and not core.                              */
/* ------------------------------------------------------------------ */

type Ripple = { id: number; x: number; y: number };

export type LiquidMetalButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** button text — ignored when `viewMode` is "icon" */
  label?: ReactNode;
  /** "text" is a pill, "icon" is a circle */
  viewMode?: "text" | "icon";
  /** glyph for icon mode, or the leading glyph in text mode */
  icon?: ReactNode;
  /**
   * Required in icon mode, where there is no text to read. Falls back to
   * `label` so the common case needs nothing extra.
   */
  "aria-label"?: string;
  size?: "sm" | "md" | "lg";
  /** turn the rim glow off and keep only the metal */
  glow?: boolean;
};

const TEXT_SIZE = {
  sm: "h-9 px-5 text-[13px]",
  md: "h-11 px-7 text-sm",
  lg: "h-13 px-9 text-[15px]",
};

const ICON_SIZE = {
  sm: "size-9",
  md: "size-11",
  lg: "size-13",
};

export function LiquidMetalButton({
  label = "Get started",
  viewMode = "text",
  icon,
  size = "md",
  glow = true,
  className,
  onClick,
  "aria-label": ariaLabel,
  ...rest
}: LiquidMetalButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const seq = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      const id = ++seq.current;
      setRipples((list) => [
        ...list,
        { id, x: e.clientX - r.left, y: e.clientY - r.top },
      ]);
      /* the ripple animation is 600ms; drop the node just after it ends
         so a rapid clicker never accumulates dead spans */
      window.setTimeout(
        () => setRipples((list) => list.filter((p) => p.id !== id)),
        620,
      );
      onClick?.(e);
    },
    [onClick],
  );

  const isIcon = viewMode === "icon";

  return (
    <button
      type="button"
      onClick={handleClick}
      /* in icon mode the glyph is the whole button, and a glyph is not a name */
      aria-label={
        ariaLabel ?? (isIcon && typeof label === "string" ? label : undefined)
      }
      className={cx(
        "group/lm relative isolate inline-flex items-center justify-center overflow-hidden",
        "font-medium tracking-[-0.01em] text-white select-none",
        "ring-1 ring-black/25 ring-inset",
        "transition-transform duration-200 active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none",
        isIcon ? "rounded-full" : "rounded-full",
        isIcon ? ICON_SIZE[size] : TEXT_SIZE[size],
        glow && "fx-glow-ring",
        className,
      )}
      {...rest}
    >
      {/* The metal is three layers, and it needs all three.

          1. the chrome itself: alternating dark / near-white / mid bands on a
             conic gradient, turning. Alternation is what reads as metal —
             a single ramp only ever reads as a dark button.
          2. the light falling on it: hot top edge, shaded underside.
          3. a hairline specular along the very top, the same one every other
             HashUI button carries. */}
      <span
        aria-hidden
        className="fx-metal-spin absolute inset-0 -z-20 overflow-hidden rounded-full"
      />
      <span
        aria-hidden
        className="fx-metal-lit pointer-events-none absolute inset-0 -z-10 rounded-full"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[6%] top-px -z-10 h-px rounded-full bg-white/55"
      />

      {ripples.map((p) => (
        <span
          key={p.id}
          aria-hidden
          className="pointer-events-none absolute size-6 rounded-full bg-white/50"
          style={{
            left: p.x - 12,
            top: p.y - 12,
            animation: "hashui-fx-ripple 600ms ease-out forwards",
          }}
        />
      ))}

      <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_1px_0_rgba(0,0,0,0.45)]">
        {isIcon ? (
          (icon ?? <ISparkleFill size={size === "lg" ? 18 : 16} />)
        ) : (
          <>
            {icon}
            {label}
          </>
        )}
      </span>
    </button>
  );
}
