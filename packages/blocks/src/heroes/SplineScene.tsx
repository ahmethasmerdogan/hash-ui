import {
  Suspense,
  lazy,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { cx, Spotlight } from "uicean";
import { useInView } from "../hooks.js";

/* ------------------------------------------------------------------ */
/* SplineScene                                                         */
/*                                                                     */
/* A Spline 3D scene, loaded only once it is about to be looked at.    */
/*                                                                     */
/* @splinetool/react-spline is an optional peer, not a dependency:     */
/* the runtime it pulls in is heavier than the rest of this package    */
/* put together, so a project that never renders a scene must never    */
/* pay for one. The import lives inside lazy(), which means bundlers   */
/* split it out and it is fetched when <SplineScene> first mounts —    */
/* and, because of the IntersectionObserver below, not before it is    */
/* near the viewport.                                                  */
/*                                                                     */
/* If the package is absent the block renders `fallback` and says so   */
/* in the console rather than throwing the page away.                  */
/* ------------------------------------------------------------------ */

type SplineProps = {
  scene: string;
  className?: string;
  onLoad?: () => void;
  onError?: (e: unknown) => void;
};

/* One shared promise, so several scenes on a page fetch the runtime once. */
let runtimePromise: Promise<{ default: ComponentType<SplineProps> }> | null = null;

function loadRuntime() {
  runtimePromise ??= import("@splinetool/react-spline")
    .then((mod) => ({
      default: (mod as { default: ComponentType<SplineProps> }).default,
    }))
    .catch(() => {
      console.warn(
        "[uicean-blocks] <SplineScene> needs the optional peer `@splinetool/react-spline`.\n" +
          "  npm i @splinetool/react-spline",
      );
      return { default: (() => null) as ComponentType<SplineProps> };
    });
  return runtimePromise;
}

const Spline = lazy(loadRuntime);

export type SplineSceneProps = {
  /** a scene URL from spline.design, ending in /scene.splinecode */
  scene: string;
  /** replaces the built-in loading state entirely */
  fallback?: ReactNode;
  /**
   * Warm the 3D runtime and the scene file while the page is idle, so the
   * block is ready by the time it is scrolled to. Set false if the scene is
   * far down a page most readers never reach and you would rather not spend
   * their bandwidth on it.
   */
  prefetch?: boolean;
  /**
   * How long to wait before calling it: the runtime is ~2 MB and the scene
   * is fetched from spline.design, so a slow link or a blocked request would
   * otherwise leave a spinner turning forever.
   */
  timeoutMs?: number;
  className?: string;
};

/**
 * The waiting state. A 3D runtime plus a remote scene is seconds of work on
 * any connection, so this is drawn as a deliberate placeholder — a shimmering
 * plate with a label — rather than a bare spinner that reads as a hang.
 */
function Loading({ label }: { label: string }) {
  return (
    <div className="relative flex size-full flex-col items-center justify-center gap-3 overflow-hidden px-6 text-center">
      <span
        aria-hidden
        className="fx-shimmer pointer-events-none absolute inset-0 opacity-60"
      />
      <span className="relative size-7 animate-[uicean-spin_900ms_linear_infinite] rounded-full border-2 border-current border-t-transparent text-ink-3" />
      <span className="relative text-[12.5px] text-ink-3">{label}</span>
    </div>
  );
}

export function SplineScene({
  scene,
  fallback,
  prefetch = true,
  timeoutMs = 20000,
  className,
}: SplineSceneProps) {
  /* 600px of lead time, not 200: the runtime plus the scene is a big download,
     and starting it as the block touches the fold means it is still blank when
     the reader arrives. */
  const [ref, near] = useInView<HTMLDivElement>("600px");
  /* mount is separate from `near` so the element keeps its box while the
     runtime downloads — swapping height mid-scroll is how you get jank */
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");

  /* The runtime is ~2 MB, and fetching it only once the block nears the
     viewport means the reader arrives to a spinner. Warm it while the page
     is idle instead, so by the time they scroll down only the scene itself
     is still outstanding. `requestIdleCallback` keeps this off the critical
     path — nothing above the fold is competing with it. */
  useEffect(() => {
    if (!prefetch) return;
    const idle =
      window.requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 1200));
    const handle = idle(() => {
      void loadRuntime();
      /* the scene is a separate download from a separate origin, and warming
         only the runtime still leaves that round trip on the critical path.
         The response goes straight into the HTTP cache, so the real load a
         moment later is served from it. */
      void fetch(scene, { mode: "cors", credentials: "omit" }).catch(() => {});
    });
    return () => {
      if (window.cancelIdleCallback && typeof handle === "number") {
        window.cancelIdleCallback(handle);
      }
    };
  }, [prefetch, scene]);

  useEffect(() => {
    if (near) setMounted(true);
  }, [near]);

  useEffect(() => {
    if (!mounted || state !== "idle") return;
    const t = window.setTimeout(() => setState("failed"), timeoutMs);
    return () => window.clearTimeout(t);
  }, [mounted, state, timeoutMs]);

  if (state === "failed") {
    return (
      <div
        ref={ref}
        className={cx(
          "flex size-full items-center justify-center px-6 text-center",
          className,
        )}
      >
        <p className="max-w-[16rem] text-[12.5px] leading-relaxed text-ink-3">
          The 3D scene could not be reached.{" "}
          <button
            type="button"
            onClick={() => setState("idle")}
            className="font-medium text-ink-2 underline underline-offset-2 hover:text-ink"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className={cx("relative size-full", className)}>
      {mounted ? (
        <Suspense fallback={fallback ?? <Loading label="Loading the 3D runtime…" />}>
          <Spline
            scene={scene}
            className="size-full"
            onLoad={() => setState("ready")}
            onError={() => setState("failed")}
          />
        </Suspense>
      ) : (
        (fallback ?? <Loading label="3D scene" />)
      )}
      {mounted && state === "idle" && (
        /* the runtime has mounted but the scene has not painted yet; the
           canvas is transparent until it does, so keep a label over it */
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Loading label="Loading the 3D scene…" />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export type SplineHeroProps = {
  scene?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** anything to put under the copy — buttons, a form */
  children?: ReactNode;
  className?: string;
};

/** The split card the scene is usually shown in: copy left, scene right. */
export function SplineHero({
  scene = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  title = "Interactive 3D",
  description = "Bring your interface to life with a real scene. The runtime is an optional peer and loads only when the block scrolls into view.",
  children,
  className,
}: SplineHeroProps) {
  return (
    <div
      className={cx(
        "dark relative isolate overflow-hidden rounded-2xl border border-line bg-[#08080a]",
        className,
      )}
    >
      {/* core's Spotlight is a wrapper that tracks the cursor, not a fixed
          overlay — so it goes around the content rather than over it */}
      <Spotlight size={420} className="flex flex-col md:h-[500px] md:flex-row">
        <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-10">
          <h2 className="bg-linear-to-b from-neutral-50 to-neutral-400 bg-clip-text text-3xl font-bold tracking-[-0.04em] text-transparent md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/55">
            {description}
          </p>
          {children && <div className="mt-7">{children}</div>}
        </div>

        <div className="relative h-72 flex-1 md:h-auto">
          <SplineScene scene={scene} />
        </div>
      </Spotlight>
    </div>
  );
}
