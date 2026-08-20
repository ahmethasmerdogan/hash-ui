import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

/* ------------------------------------------------------------------ */
/* The four jobs every overlay has.                                    */
/*                                                                     */
/* Dismissing, trapping focus, locking the scroll, and standing next   */
/* to something. Written per component they drift, and the drift is    */
/* always the same: the first one gets the focus-restore fix and the   */
/* other five do not. Modal shipped for months with no trap at all and */
/* dropped focus on <body> when it closed, which is exactly the bug    */
/* the command palette had.                                            */
/*                                                                     */
/* No floating-ui. Positioning here is a rect, a preferred side, a     */
/* flip when there is no room, and a clamp to the viewport — which is  */
/* the whole of what a popover needs and about eighty lines. The       */
/* library is 30 kB on its own, and core's promise is that it imports  */
/* nothing but React.                                                  */
/* ------------------------------------------------------------------ */

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),' +
  'select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function focusables(root: HTMLElement) {
  /* No size filter. Measuring offsetWidth to decide "is it visible" drops
     every control in any environment without layout, and the contents of
     an open panel are visible by construction. The selector already
     excludes what actually cannot take focus: disabled, and tabindex="-1". */
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => !el.closest("[hidden]"),
  );
}

/** Escape, and a click outside the panel. */
export function useDismiss({
  open,
  onClose,
  refs,
  outside = true,
  escape = true,
}: {
  open: boolean;
  onClose: () => void;
  /** the panel, plus anything that must not count as "outside" — the
   *  trigger especially, or clicking it would close and reopen at once */
  refs: Array<RefObject<HTMLElement | null>>;
  outside?: boolean;
  escape?: boolean;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (escape && e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!outside) return;
      const t = e.target as Node;
      if (refs.some((r) => r.current?.contains(t))) return;
      onClose();
    };

    document.addEventListener("keydown", onKey);
    /* pointerdown, not click: a click fires after the pointer goes up, by
       which time a menu item under the cursor may already have moved */
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose, outside, escape]);
}

/**
 * Keep Tab inside the panel, put focus in it on open, and give focus back
 * to whatever opened it on close.
 */
export function useFocusTrap({
  open,
  ref,
  autoFocus = true,
}: {
  open: boolean;
  ref: RefObject<HTMLElement | null>;
  autoFocus?: boolean;
}) {
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;

    const panel = ref.current;
    if (panel && autoFocus) {
      /* the panel itself when there is nothing focusable in it — a dialog
         whose focus stays outside is not modal in any useful sense */
      const first = focusables(panel)[0];
      if (first) first.focus();
      else {
        panel.tabIndex = -1;
        panel.focus();
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = ref.current;
      if (!panel) return;
      const items = focusables(panel);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!panel.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      /* focus goes back where it came from. Without this a keyboard user
         lands on <body> and tabs in from the top of the document again. */
      restoreRef.current?.focus?.();
    };
  }, [open, ref, autoFocus]);
}

/** Stop the page behind an overlay from scrolling, without it jumping. */
export function useScrollLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const { overflow, paddingRight } = document.body.style;
    /* the scrollbar's width is added back as padding, or hiding it shifts
       the whole page sideways the moment the overlay appears */
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);
}

export type Placement = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

/**
 * Put a floating panel next to an anchor: preferred side, flipped when
 * there is not room, then clamped so it never leaves the viewport.
 */
export function useAnchoredPosition({
  open,
  anchorRef,
  floatingRef,
  placement = "bottom",
  align = "center",
  offset = 8,
  padding = 8,
}: {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  placement?: Placement;
  align?: Align;
  /** gap between the anchor and the panel */
  offset?: number;
  /** how close to the viewport edge the panel may come */
  padding?: number;
}) {
  const [pos, setPos] = useState<{ top: number; left: number; side: Placement } | null>(null);

  /* useLayoutEffect: measured and placed before the browser paints, or the
     panel is visible for one frame in the top-left corner */
  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }

    const place = () => {
      const a = anchorRef.current?.getBoundingClientRect();
      const f = floatingRef.current?.getBoundingClientRect();
      if (!a || !f) return;

      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;

      const room = {
        top: a.top - padding,
        bottom: vh - a.bottom - padding,
        left: a.left - padding,
        right: vw - a.right - padding,
      };
      const needs = placement === "top" || placement === "bottom" ? f.height + offset : f.width + offset;

      /* flip only when the other side has more room; a popover that flips
         into an even tighter gap has achieved nothing */
      const opposite: Record<Placement, Placement> = {
        top: "bottom",
        bottom: "top",
        left: "right",
        right: "left",
      };
      const side =
        room[placement] >= needs || room[placement] >= room[opposite[placement]]
          ? placement
          : opposite[placement];

      let top = 0;
      let left = 0;
      if (side === "bottom" || side === "top") {
        top = side === "bottom" ? a.bottom + offset : a.top - f.height - offset;
        left =
          align === "start" ? a.left : align === "end" ? a.right - f.width : a.left + (a.width - f.width) / 2;
      } else {
        left = side === "right" ? a.right + offset : a.left - f.width - offset;
        top =
          align === "start" ? a.top : align === "end" ? a.bottom - f.height : a.top + (a.height - f.height) / 2;
      }

      left = Math.min(Math.max(padding, left), vw - f.width - padding);
      top = Math.min(Math.max(padding, top), vh - f.height - padding);

      setPos({ top, left, side });
    };

    place();
    /* the anchor moves when anything between it and the viewport scrolls,
       so this listens in the capture phase rather than on window alone */
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, anchorRef, floatingRef, placement, align, offset, padding]);

  return pos;
}

/** `true` once the component has mounted in a browser. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
