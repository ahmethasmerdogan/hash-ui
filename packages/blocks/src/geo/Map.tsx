import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cx } from "uicean";

/* ------------------------------------------------------------------ */
/* Map, MapMarker, MarkerContent, MarkerTooltip, MarkerLabel           */
/*                                                                     */
/* A composable MapLibre surface. Markers are React children rather    */
/* than imperative `new maplibregl.Marker()` calls, so a marker can be */
/* any UICean component and its tooltip is ordinary JSX.               */
/*                                                                     */
/* Markers are positioned by projecting their coordinates through the  */
/* map on every move rather than by handing DOM nodes to MapLibre.     */
/* That keeps them inside React's tree — they can hold state, use      */
/* context, and unmount cleanly — at the cost of one project() call    */
/* per marker per frame, which is nothing at the scale these are for.  */
/*                                                                     */
/* maplibre-gl is an optional peer. Without it the frame renders its   */
/* fallback and logs the install line instead of throwing.             */
/* ------------------------------------------------------------------ */

type MapCtx = {
  /** screen position of a coordinate, or null before the map is ready */
  project: ((lng: number, lat: number) => { x: number; y: number }) | null;
  /** bumped on every map move so markers re-project */
  version: number;
  ready: boolean;
};

const Ctx = createContext<MapCtx>({ project: null, version: 0, ready: false });

/** A free raster style, so the block works without an API key. */
export const DEFAULT_STYLE = {
  version: 8 as const,
  sources: {
    carto: {
      type: "raster" as const,
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: "© CARTO © OpenStreetMap contributors",
    },
  },
  layers: [{ id: "carto", type: "raster" as const, source: "carto" }],
};

export type MapProps = {
  /** [longitude, latitude] */
  center?: [number, number];
  zoom?: number;
  /** a MapLibre style object or a style URL */
  style?: unknown;
  interactive?: boolean;
  children?: ReactNode;
  fallback?: ReactNode;
  className?: string;
};

export function Map({
  center = [-73.9857, 40.7484],
  zoom = 11,
  style = DEFAULT_STYLE,
  interactive = true,
  children,
  fallback,
  className,
}: MapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ project: (c: [number, number]) => { x: number; y: number }; remove: () => void } | null>(null);
  const [ctx, setCtx] = useState<MapCtx>({ project: null, version: 0, ready: false });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      /* maplibre-gl exports `Map` by name and has no default export. Reaching
         for `.default` happened to work at runtime under some bundlers and
         did not typecheck against the real package at all — the copied
         registry file failed to compile for anyone who had it installed. */
      let MapLibreMap: typeof import("maplibre-gl").Map;
      try {
        ({ Map: MapLibreMap } = await import("maplibre-gl"));
      } catch {
        console.warn(
          "[uicean-blocks] <Map> needs the optional peer `maplibre-gl`.\n" +
            "  npm i maplibre-gl\n" +
            '  and import its stylesheet once: import "maplibre-gl/dist/maplibre-gl.css";',
        );
        if (!cancelled) setFailed(true);
        return;
      }

      if (cancelled || !hostRef.current) return;

      /* `style` is deliberately `unknown` on the public prop — a caller
         should not have to import maplibre's StyleSpecification just to pass
         a URL. This is the one place the two meet, so the cast lives here
         and resolves against whichever types are actually installed. */
      const options = {
        container: hostRef.current,
        style,
        center,
        zoom,
        interactive,
        attributionControl: { compact: true },
      } as ConstructorParameters<typeof MapLibreMap>[0];

      const map = new MapLibreMap(options);
      mapRef.current = map as unknown as typeof mapRef.current;

      const bump = () =>
        setCtx({
          project: (lng: number, lat: number) => map.project([lng, lat]),
          version: performance.now(),
          ready: true,
        });

      map.on("load", bump);
      /* "move" fires continuously through a pan or zoom, which is exactly
         when the markers need to be re-projected */
      map.on("move", bump);
      map.on("resize", bump);

      cleanup = () => map.remove();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      mapRef.current = null;
    };
    /* the map is created once; changing center/zoom after mount is the
       caller's job through the map instance, not a remount */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx("relative size-full overflow-hidden", className)}>
      <div ref={hostRef} className="size-full" />
      {failed &&
        (fallback ?? (
          <div className="absolute inset-0 flex items-center justify-center bg-inset p-6 text-center">
            <p className="max-w-xs text-[13px] leading-relaxed text-ink-2">
              This block needs the optional peer{" "}
              <code className="font-mono text-[12px]">maplibre-gl</code>.
            </p>
          </div>
        ))}
      {!failed && (
        <Ctx.Provider value={ctx}>
          <div className="pointer-events-none absolute inset-0">{children}</div>
        </Ctx.Provider>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

type MarkerCtx = { hovered: boolean };
const MarkerCtxObj = createContext<MarkerCtx>({ hovered: false });

export type MapMarkerProps = {
  longitude: number;
  latitude: number;
  children?: ReactNode;
  className?: string;
};

export function MapMarker({
  longitude,
  latitude,
  children,
  className,
}: MapMarkerProps) {
  const { project, ready } = useContext(Ctx);
  const [hovered, setHovered] = useState(false);

  if (!ready || !project) return null;
  const { x, y } = project(longitude, latitude);

  return (
    <MarkerCtxObj.Provider value={{ hovered }}>
      <div
        className={cx(
          "pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
          className,
        )}
        style={{ left: x, top: y }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {children}
      </div>
    </MarkerCtxObj.Provider>
  );
}

/** The marker itself — whatever you want drawn at the coordinate. */
export function MarkerContent({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("relative", className)}>
      {children ?? <MarkerDot />}
    </div>
  );
}

/** The default pin: a filled dot with a ring, so it reads on any basemap. */
export function MarkerDot({
  tone = "brand",
  className,
}: {
  tone?: "brand" | "blue" | "red";
  className?: string;
}) {
  const fill = {
    brand: "bg-brand",
    blue: "bg-blue-500",
    red: "bg-red-500",
  }[tone];
  return (
    <span
      className={cx(
        "block size-3.5 rounded-full ring-2 ring-white transition-transform duration-150 hover:scale-115",
        fill,
        className,
      )}
    />
  );
}

/** Shown only while the marker is hovered. */
export function MarkerTooltip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { hovered } = useContext(MarkerCtxObj);
  return (
    <div
      role="tooltip"
      className={cx(
        "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-ink transition-all duration-150",
        hovered
          ? "translate-y-0 opacity-100"
          : "translate-y-1 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Always visible, sits under the marker. */
export function MarkerLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "mt-1 rounded-md bg-surface/90 px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
