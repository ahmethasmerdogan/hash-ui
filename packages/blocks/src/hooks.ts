import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* The four hooks the blocks share.                                    */
/*                                                                     */
/* Upstream these jobs belong to framer-motion (useScroll, useInView,  */
/* useSpring). They are small enough to own outright, and owning them  */
/* is what keeps uicean-blocks installable without a motion library. */
/* ------------------------------------------------------------------ */

/**
 * True once the element has been scrolled into view. Does not flip back.
 *
 * `fallbackMs` gives up waiting and reports true anyway. Use it whenever the
 * hook gates something a reader must be able to *read* — a revealed headline
 * that never reveals is invisible text. Environments where the observer
 * legitimately never fires are not exotic: printing, `content-visibility`,
 * and screenshot tools that capture beyond the viewport without scrolling
 * all hit it. Leave it off when the hook gates loading rather than showing,
 * so an off-screen block does not fetch a 3D runtime nobody asked for.
 */
export function useInView<T extends HTMLElement>(
  rootMargin = "-12% 0px",
  fallbackMs?: number,
) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);

    const timer =
      fallbackMs === undefined
        ? undefined
        : window.setTimeout(() => setSeen(true), fallbackMs);

    return () => {
      io.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [rootMargin, fallbackMs, seen]);

  return [ref, seen] as const;
}

/**
 * How far the element has travelled through the viewport, 0 → 1.
 *
 * 0 when its top edge sits at the bottom of the viewport, 1 once its bottom
 * edge has passed the top — the same window framer-motion's `useScroll` with
 * `offset: ["start end", "end start"]` reports.
 */
export function useScrollProgress<T extends HTMLElement>(
  offset: "cover" | "enter" = "cover",
) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  /* rAF-coalesced: scroll fires far more often than we can usefully paint */
  const frame = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      /* "enter" finishes as soon as the element is fully on screen, which is
         what a sticky hero wants; "cover" runs the whole pass-through. */
      const span = offset === "enter" ? r.height : r.height + vh;
      const travelled = offset === "enter" ? vh - r.top : vh - r.top;
      setProgress(Math.min(1, Math.max(0, travelled / (span || 1))));
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [offset]);

  return [ref, progress] as const;
}

/**
 * Pull an element towards the cursor while it is hovered, and let it spring
 * back when the cursor leaves. `strength` is the fraction of the distance
 * from the element's centre the element is allowed to travel.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transition = "transform 90ms linear";
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    },
    [strength],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    /* the overshoot lives here: a back-out curve, not a linear settle */
    el.style.transition = "transform 520ms cubic-bezier(.34,1.56,.64,1)";
    el.style.transform = "translate3d(0,0,0)";
  }, []);

  return { ref, onPointerMove, onPointerLeave } as const;
}

/** Pointer position inside an element, normalised 0 → 1 on both axes. */
export function usePointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setPos({
        x: (e.clientX - r.left) / (r.width || 1),
        y: (e.clientY - r.top) / (r.height || 1),
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return [ref, pos] as const;
}

/** Respects the OS "reduce motion" switch, and keeps respecting it. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}
