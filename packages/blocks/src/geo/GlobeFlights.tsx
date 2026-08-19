import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "hash-ui";

/* ------------------------------------------------------------------ */
/* GlobeFlights                                                        */
/*                                                                     */
/* A slowly turning WebGL globe with great-circle routes drawn over    */
/* it and a glyph riding each arc.                                     */
/*                                                                     */
/* cobe renders the sphere; the routes are ours. cobe 0.6 has no       */
/* concept of an arc, so the overlay projects both endpoints itself,   */
/* walks the great circle between them, and breaks the line wherever   */
/* it crosses to the far hemisphere — that visibility test is the      */
/* whole trick, and without it the arcs cut straight through the       */
/* planet.                                                             */
/*                                                                     */
/* The peer is pinned to ^0.6.5 on purpose. cobe 2.x advertises native */
/* `arcs`, which would replace most of the code below, but 2.0.1 draws */
/* the sphere with no landmasses at all — verified against its own     */
/* README configuration. Revisit when that is fixed upstream.          */
/*                                                                     */
/* `globeRadius` is the one number that has to agree with cobe exactly */
/* or the glyphs float off the planet. 0.4 is measured, not guessed.   */
/*                                                                     */
/* cobe is an optional peer; without it the block renders its          */
/* fallback rather than throwing.                                      */
/* ------------------------------------------------------------------ */

export type Flight = {
  /** [latitude, longitude] — cobe's order, kept so both agree */
  from: [number, number];
  to: [number, number];
  label?: string;
  /** 0 → 1, where the glyph sits along the arc */
  progress?: number;
};

const DEMO_FLIGHTS: Flight[] = [
  { from: [40.71, -74.01], to: [51.51, -0.13], label: "JFK → LHR", progress: 0.45 },
  { from: [51.51, -0.13], to: [41.01, 28.98], label: "LHR → IST", progress: 0.55 },
  { from: [35.68, 139.69], to: [37.77, -122.42], label: "HND → SFO", progress: 0.3 },
  { from: [41.01, 28.98], to: [25.2, 55.27], label: "IST → DXB", progress: 0.65 },
];

/** lat/lng → unit sphere, with the globe's current rotation applied */
function toVec3(lat: number, lng: number, phi: number, theta: number) {
  const la = (lat * Math.PI) / 180;
  const ln = (lng * Math.PI) / 180 + phi;
  const x = Math.cos(la) * Math.sin(ln);
  const y0 = Math.sin(la);
  const z0 = Math.cos(la) * Math.cos(ln);
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  return { x, y: y0 * ct - z0 * st, z: y0 * st + z0 * ct };
}

/** spherical interpolation, so the midpoint sits on the surface */
function slerp(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
  t: number,
) {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a;
  const s = Math.sin(omega);
  const k1 = Math.sin((1 - t) * omega) / s;
  const k2 = Math.sin(t * omega) / s;
  return {
    x: a.x * k1 + b.x * k2,
    y: a.y * k1 + b.y * k2,
    z: a.z * k1 + b.z * k2,
  };
}

export type GlobeFlightsProps = {
  flights?: Flight[];
  /** radians per frame; 0 stops the rotation */
  speed?: number;
  /** the glyph riding each arc; false for none */
  marker?: string | false;
  size?: number;
  /** false for the dark treatment */
  light?: boolean;
  /**
   * The sphere's radius as a fraction of the canvas width. cobe does not
   * expose this, and the glyph overlay has to agree with it exactly or the
   * markers float off the planet — 0.4 is measured, not guessed.
   */
  globeRadius?: number;
  fallback?: ReactNode;
  className?: string;
};

/* The two palettes, kept side by side so the contrast between the land dots
   (mapBrightness) and the sphere behind them (mapBaseBrightness) can be read
   at a glance. Getting those two the wrong way round is exactly what turns
   the globe into a featureless white ball. */
const THEMES = {
  light: {
    dark: 0,
    diffuse: 1.2,
    mapBrightness: 1.2,
    baseColor: [1, 1, 1] as [number, number, number],
    glowColor: [1, 1, 1] as [number, number, number],
  },
  dark: {
    dark: 1,
    diffuse: 1.2,
    mapBrightness: 6,
    baseColor: [0.16, 0.16, 0.19] as [number, number, number],
    glowColor: [0.1, 0.1, 0.12] as [number, number, number],
  },
};

export function GlobeFlights({
  flights = DEMO_FLIGHTS,
  speed = 0.0035,
  marker = "✈️",
  size = 480,
  light = true,
  globeRadius = 0.4,
  fallback,
  className,
}: GlobeFlightsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  /* rotation is mirrored into state so the glyph overlay can follow it; one
     setState per frame is cheap next to the WebGL draw it accompanies */
  const [rot, setRot] = useState({ phi: 0, theta: 0.25 });

  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | undefined;

    (async () => {
      let createGlobe: typeof import("cobe").default;
      try {
        const mod = await import("cobe");
        createGlobe = (mod as { default: typeof import("cobe").default }).default;
      } catch {
        console.warn(
          "[@hash-ui/blocks] <GlobeFlights> needs the optional peer `cobe`.\n" +
            "  npm i cobe",
        );
        if (!cancelled) setFailed(true);
        return;
      }
      if (cancelled || !canvasRef.current) return;

      const theme = light ? THEMES.light : THEMES.dark;
      const theta = 0.25;
      let phi = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const globe = createGlobe(canvasRef.current, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi: 0,
        theta,
        scale: 1,
        offset: [0, 0],
        mapSamples: 16000,
        markerColor: [0.02, 0.59, 0.41],
        markers: flights.map((f) => ({ location: f.from, size: 0.035 })),
        ...theme,
        onRender: (state) => {
          phi += speed;
          (state as { phi: number }).phi = phi;
          setRot({ phi, theta });
        },
      });

      destroy = () => globe.destroy();
    })();

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [flights, speed, size, light]);

  /* the SVG shares the canvas box, so the centre is half the viewBox and the
     sphere's edge is `globeRadius` of its width */
  const c = size / 2;
  const r = size * globeRadius;

  return (
    <div
      className={cx("relative", className)}
      style={{ width: size, maxWidth: "100%", aspectRatio: "1 / 1" }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
        aria-label="Rotating globe with flight routes"
      />

      {failed &&
        (fallback ?? (
          <div className="absolute inset-0 flex items-center justify-center rounded-full border border-line bg-inset p-6 text-center">
            <p className="max-w-[70%] text-[13px] leading-relaxed text-ink-2">
              This block needs the optional peer{" "}
              <code className="font-mono text-[12px]">cobe</code>.
            </p>
          </div>
        ))}

      {!failed && (
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="pointer-events-none absolute inset-0 size-full"
          aria-hidden
        >
          {flights.map((f, i) => {
            const a = toVec3(f.from[0], f.from[1], rot.phi, rot.theta);
            const b = toVec3(f.to[0], f.to[1], rot.phi, rot.theta);

            /* walk the great circle, dropping every point on the far side.
               `open` collects one visible run; a route that goes round the
               back therefore draws as two polylines, not one straight chord. */
            const STEPS = 64;
            const runs: string[] = [];
            let open: string[] = [];
            for (let k = 0; k <= STEPS; k++) {
              const p = slerp(a, b, k / STEPS);
              if (p.z > 0.02) {
                open.push(`${c + p.x * r},${c - p.y * r}`);
              } else {
                if (open.length > 1) runs.push(open.join(" "));
                open = [];
              }
            }
            if (open.length > 1) runs.push(open.join(" "));

            const mid = slerp(a, b, f.progress ?? 0.5);
            const glyphVisible = mid.z > 0.02;

            return (
              <g key={i}>
                {runs.map((points, j) => (
                  <polyline
                    key={j}
                    points={points}
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth={1.4}
                    strokeOpacity={0.85}
                    strokeLinecap="round"
                  />
                ))}
                {marker && glyphVisible && (
                  <text
                    x={c + mid.x * r}
                    y={c - mid.y * r}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                  >
                    {marker}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
