import {
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx.js";
import {
  useAnchoredPosition,
  useDismiss,
  useFocusTrap,
  useMounted,
  type Align,
  type Placement,
} from "./overlay-primitives.js";

/* ------------------------------------------------------------------ */
/* Popover and HoverCard                                               */
/*                                                                     */
/* A panel anchored to a trigger. Popover opens on click and takes      */
/* focus, because it holds controls; HoverCard opens on hover and       */
/* never takes focus, because it holds a preview and stealing focus     */
/* from someone who merely moved the mouse is hostile.                  */
/*                                                                     */
/* That difference is the whole reason they are two components rather   */
/* than one with a prop. It decides the role, whether Tab is trapped,   */
/* whether Escape closes it, and whether a touch device gets it at all. */
/* ------------------------------------------------------------------ */

type TriggerProps = {
  ref: (el: HTMLElement | null) => void;
  onClick?: (e: React.MouseEvent) => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-describedby"?: string;
};

/** the trigger, either as an element to clone or as a render function */
type Trigger = ReactElement | ((props: TriggerProps) => ReactNode);

function renderTrigger(trigger: Trigger, props: TriggerProps) {
  if (typeof trigger === "function") return trigger(props);
  if (isValidElement(trigger)) return cloneElement(trigger, props as never);
  return trigger;
}

const PANEL =
  "rounded-[calc(var(--radius)+2px)] border border-line bg-surface p-4 " +
  "text-[13.5px] leading-relaxed text-ink-2";

export function Popover({
  trigger,
  children,
  placement = "bottom",
  align = "center",
  offset = 8,
  label,
  open: controlled,
  onOpenChange,
  className,
}: {
  trigger: Trigger;
  children: ReactNode;
  placement?: Placement;
  align?: Align;
  offset?: number;
  /** what the panel is. A dialog with no name announces as "dialog". */
  label?: string;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  className?: string;
}) {
  const [internal, setInternal] = useState(false);
  const open = controlled ?? internal;
  const anchorRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const mounted = useMounted();

  const set = useCallback(
    (v: boolean) => {
      if (controlled === undefined) setInternal(v);
      onOpenChange?.(v);
    },
    [controlled, onOpenChange],
  );
  const close = useCallback(() => set(false), [set]);

  const pos = useAnchoredPosition({ open, anchorRef, floatingRef: panelRef, placement, align, offset });
  useDismiss({ open, onClose: close, refs: [panelRef, anchorRef] });
  useFocusTrap({ open, ref: panelRef });

  return (
    <>
      {renderTrigger(trigger, {
        ref: (el) => {
          anchorRef.current = el;
        },
        onClick: () => set(!open),
        "aria-expanded": open,
        "aria-controls": open ? id : undefined,
      })}
      {open &&
        mounted &&
        createPortal(
          <div
            ref={panelRef}
            id={id}
            role="dialog"
            aria-label={label}
            className={cx("fixed z-[92] w-max max-w-[min(22rem,calc(100vw-1rem))]", PANEL, className)}
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              /* hidden until measured: one frame in the top-left corner is
                 a visible flash on every open */
              /* opacity rather than visibility: a control inside a
                 visibility:hidden subtree cannot take focus, and this is
                 hidden for exactly the one commit in which the focus trap
                 runs. One transparent frame, and the panel is focusable
                 throughout it. */
              opacity: pos ? 1 : 0,
              animation: pos ? "uicean-modal-in 0.14s cubic-bezier(0.2,0.9,0.3,1)" : undefined,
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}

export function HoverCard({
  trigger,
  children,
  placement = "top",
  align = "center",
  offset = 8,
  openDelay = 220,
  closeDelay = 140,
  className,
}: {
  trigger: Trigger;
  children: ReactNode;
  placement?: Placement;
  align?: Align;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();
  const mounted = useMounted();

  const pos = useAnchoredPosition({ open, anchorRef, floatingRef: panelRef, placement, align, offset });

  const schedule = (v: boolean) => {
    window.clearTimeout(timer.current);
    /* the close delay is what lets the pointer cross the gap between the
       trigger and the card without it vanishing on the way */
    timer.current = window.setTimeout(() => setOpen(v), v ? openDelay : closeDelay);
  };

  const handlers = {
    onPointerEnter: () => schedule(true),
    onPointerLeave: () => schedule(false),
    /* keyboard users get it on focus, which is the only way they can ask
       for it at all */
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  };

  return (
    <>
      {renderTrigger(trigger, {
        ref: (el) => {
          anchorRef.current = el;
        },
        /* describedby, not controls: this is a description of the trigger,
           and it is never focusable, so there is nothing to expand into */
        "aria-describedby": open ? id : undefined,
        ...handlers,
      })}
      {open &&
        mounted &&
        createPortal(
          <div
            ref={panelRef}
            id={id}
            role="tooltip"
            onPointerEnter={() => schedule(true)}
            onPointerLeave={() => schedule(false)}
            className={cx("fixed z-[92] w-max max-w-80", PANEL, className)}
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              /* opacity rather than visibility: a control inside a
                 visibility:hidden subtree cannot take focus, and this is
                 hidden for exactly the one commit in which the focus trap
                 runs. One transparent frame, and the panel is focusable
                 throughout it. */
              opacity: pos ? 1 : 0,
              animation: pos ? "uicean-modal-in 0.14s cubic-bezier(0.2,0.9,0.3,1)" : undefined,
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
