import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cx, ISparkleFill } from "hash-ui";
import { runShader } from "./gl.js";

/* ------------------------------------------------------------------ */
/* LiquidMetalButton                                                   */
/*                                                                     */
/* A button whose face is poured chrome: ridges that fold over each    */
/* other, glints that slide along them, a hard horizon reflected in    */
/* the surface.                                                        */
/*                                                                     */
/* This was a rotating conic gradient twice, and read as a dark        */
/* pinwheel both times — spokes radiating from the middle of a pill,   */
/* which is a shape metal never makes. The lesson was on the same page:*/
/* NeuralVortex is a fragment shader and looks like something, and the */
/* CSS approximation next to it did not. So this is a shader now, and  */
/* the CSS is the fallback rather than the plan.                       */
/*                                                                     */
/* What makes chrome read as chrome is not the metal, it is the room.  */
/* A polished surface is only ever a picture of its surroundings, so   */
/* the shader reflects a bright sky over a dark floor with a hard      */
/* horizon between them; the horizon sliding across a moving ridge is  */
/* the whole effect. Matte metal is the same code with a soft horizon. */
/*                                                                     */
/* It keeps HashUI's button anatomy — the lamp is overhead, the ring   */
/* is 1px, there is a hairline specular along the top — so it sits     */
/* next to <Button> without looking imported.                          */
/* ------------------------------------------------------------------ */

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform float u_seed;
uniform float u_flow;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

/* Three octaves, not five. A button is roughly 260x88 CSS px: the fourth
   octave lands at about a pixel and a half, and a height field with pixel-
   sized detail is not a surface, it is static. */
float fbm(vec2 p) {
  float v = 0.0, a = 0.55;
  for (int i = 0; i < 3; i++) { v += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return v;
}

/* The surface. Two rounds of domain warping: the field is used to displace
   its own sample point, twice, which is what folds the ridges over each
   other. A single fbm only ever drifts, and drifting reads as fog. */
float height(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.11)),
                fbm(p + vec2(5.2, 1.3) - t * 0.09));
  vec2 r = vec2(fbm(p + 2.1 * q + vec2(1.7, 9.2) + t * 0.07),
                fbm(p + 2.1 * q + vec2(8.3, 2.8) - t * 0.06));
  return fbm(p + 2.1 * r);
}

/* The room the metal is standing in: bright sky, dark floor, and a hard
   edge where they meet. That edge is the effect — a soft one gives matte
   plastic no matter how good the ridges are. */
vec3 env(vec3 dir) {
  float y = dir.y;
  /* A dark room, not a photographer's studio.
   *
   * The first version ran the floor to near-black and the sky to pure
   * white, which is correct for a mirrored sphere and wrong for a 40px
   * pill: at that size a full-range height field is not marble, it is
   * camouflage. The range here is compressed into dark steel, and the
   * only thing allowed to reach white is the thin strip below — so the
   * button reads as a dark surface with a highlight travelling over it,
   * which is what the reference actually looks like. */
  vec3 sky    = mix(vec3(0.26, 0.27, 0.30), vec3(0.52, 0.54, 0.58), smoothstep(0.0, 0.6, y));
  vec3 floorC = mix(vec3(0.055, 0.055, 0.065), vec3(0.15, 0.155, 0.175), smoothstep(-0.9, 0.0, y));
  /* a softer horizon too: a hard edge at this scale is a hard edge in the
     middle of a button, and it reads as a seam rather than a reflection */
  vec3 c = mix(floorC, sky, smoothstep(-0.10, 0.10, y));
  /* the one bright thing in the room */
  c += vec3(1.0) * smoothstep(0.07, 0.01, abs(y - 0.19)) * 0.55;
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;

  /* sample space is corrected against height, not width: a pill is wide,
     and sampling it square smears every ridge sideways into a stripe */
  vec2 p = (gl_FragCoord.xy * 2.0 - u_res) / u_res.y;

  float t = u_time * u_flow;
  float e = 3.5 / u_res.y;

  /* 0.34: about one ridge across the face. Every previous value put more
     detail on a 260x88 button than a button that size can carry — two
     ridges was still busy enough to read as a pattern rather than a
     surface. */
  float h  = height(p * 0.34 + u_seed, t);
  float hx = height((p + vec2(e, 0.0)) * 0.34 + u_seed, t);
  float hy = height((p + vec2(0.0, e)) * 0.34 + u_seed, t);

  /* the normal is the gradient of the height field. This pair is how molten
     it looks: a big multiplier over a small z is crumpled foil, and that is
     what the first attempt at this shader produced. */
  vec3 n = normalize(vec3((h - hx) * 1.5, (h - hy) * 1.5, 0.72));

  vec3 view = vec3(0.0, 0.0, 1.0);
  vec3 col = env(reflect(-view, n));

  /* one hard light so the surface throws glints rather than a wash */
  vec3 L = normalize(vec3(-0.35, 0.86, 0.52));
  col += vec3(1.0) * pow(max(dot(reflect(-L, n), view), 0.0), 30.0) * 0.55;

  /* HashUI lights every button from directly above. The metal obeys the
     same lamp, or it looks pasted onto the page. */
  col *= mix(1.30, 0.62, uv.y);

  /* Guarantee the label has something to sit on.
   *
   * Measured over eight frames, a glint sliding under the text took the
   * background to L = 0.75 — white on that is 1.3:1, and the word simply
   * disappeared for a frame. Darkening the whole face is what flattened
   * the first version of this shader into a dull plate, so instead the
   * highlights are capped inside the label band and nowhere else: metal
   * below the cap keeps every bit of its detail, and only the blown parts
   * come down. Capping the largest channel at 0.44 puts relative luminance
   * under 0.15, which clears 4.5:1 against white — AA, at the worst frame the
   * animation can produce rather than the average one. */
  float band = smoothstep(0.52, 0.20, abs(uv.y - 0.5))
             * smoothstep(1.06, 0.80, abs(uv.x - 0.5) * 2.0);
  float capV = mix(1.0, 0.44, band);
  float mx = max(col.r, max(col.g, col.b));
  if (mx > capV) col *= capV / mx;

  gl_FragColor = vec4(col, 1.0);
}
`;

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
  /** a cool white rim light. Off by default: chrome next to a coloured
   *  halo reads as plastic with a lamp behind it. */
  glow?: boolean;
  /** how fast the metal flows. 0 is a frozen pour. */
  flow?: number;
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

/* every button gets its own offset into the noise, so a row of them is not
   the same pour repeated */
let seedSeq = 0;

export function LiquidMetalButton({
  label = "Get started",
  viewMode = "text",
  icon,
  size = "md",
  glow = false,
  flow = 1,
  className,
  onClick,
  "aria-label": ariaLabel,
  ...rest
}: LiquidMetalButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const seq = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seed = useRef((seedSeq = (seedSeq + 7.3) % 100));
  const flowRef = useRef(flow);
  flowRef.current = flow;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return (
      runShader(canvas, FRAG, {
        uniforms: () => ({ u_seed: seed.current, u_flow: flowRef.current }),
      }) ?? undefined
    );
  }, []);

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
        "group/lm relative isolate inline-flex items-center justify-center overflow-hidden rounded-full",
        "font-medium tracking-[-0.01em] text-white select-none",
        "ring-1 ring-black/35 ring-inset",
        "transition-transform duration-200 active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none",
        isIcon ? ICON_SIZE[size] : TEXT_SIZE[size],
        glow && "fx-glow-rim",
        className,
      )}
      {...rest}
    >
      {/* The chrome. `fx-metal-still` underneath is what shows when there is
          no WebGL context to be had — a plain vertical steel ramp, which is
          a duller button rather than a broken one. */}
      <span aria-hidden className="fx-metal-still absolute inset-0 -z-20 rounded-full" />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 -z-10 size-full rounded-full"
      />
      {/* the hairline specular every other HashUI button carries */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[6%] top-px z-0 h-px rounded-full bg-white/60"
      />

      {ripples.map((p) => (
        <span
          key={p.id}
          aria-hidden
          className="pointer-events-none absolute z-10 size-6 rounded-full bg-white/60"
          style={{
            left: p.x - 12,
            top: p.y - 12,
            animation: "hashui-fx-ripple 600ms ease-out forwards",
          }}
        />
      ))}

      <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]">
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
