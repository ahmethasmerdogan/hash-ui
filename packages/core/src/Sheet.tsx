import { useCallback, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx.js";
import { Button } from "./Button.js";
import { IX } from "./icons.js";
import { useDismiss, useFocusTrap, useMounted, useScrollLock } from "./overlay-primitives.js";

/* ------------------------------------------------------------------ */
/* Sheet and AlertDialog                                               */
/*                                                                     */
/* Both are modal, so both trap focus, lock the scroll and restore      */
/* focus on close — all of that comes from overlay.ts and none of it is */
/* written twice.                                                       */
/*                                                                     */
/* Where they differ is what closing means. A sheet is a container: it  */
/* closes on Escape and on a click outside, because dismissing it costs */
/* nothing. An alert dialog is a question: it does neither, because the */
/* whole point is that someone answers it, and a stray click landing on */
/* the backdrop is not an answer.                                       */
/* ------------------------------------------------------------------ */

const SIDES = {
  right: "inset-y-0 right-0 h-full w-full max-w-105 border-l",
  left: "inset-y-0 left-0 h-full w-full max-w-105 border-r",
  top: "inset-x-0 top-0 w-full max-h-[85vh] border-b",
  bottom: "inset-x-0 bottom-0 w-full max-h-[85vh] border-t",
} as const;

const SLIDE = {
  right: "uicean-sheet-right",
  left: "uicean-sheet-left",
  top: "uicean-sheet-top",
  bottom: "uicean-sheet-bottom",
} as const;

export function Sheet({
  open,
  onClose,
  side = "right",
  title,
  description,
  footer,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  side?: keyof typeof SIDES;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const mounted = useMounted();

  useDismiss({ open, onClose, refs: [panelRef] });
  useFocusTrap({ open, ref: panelRef });
  useScrollLock(open);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[93]">
      <div
        className="absolute inset-0 bg-[#1c1b18]/45 backdrop-blur-[3px] dark:bg-black/60"
        style={{ animation: "uicean-overlay-in 0.2s ease-out" }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${id}-t` : undefined}
        aria-describedby={description ? `${id}-d` : undefined}
        className={cx(
          "absolute flex flex-col border-line bg-canvas outline-none",
          SIDES[side],
          className,
        )}
        style={{ animation: `${SLIDE[side]} 0.26s cubic-bezier(0.2,0.9,0.3,1)` }}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div className="min-w-0">
              {title && (
                <h2 id={`${id}-t`} className="text-[15px] font-semibold text-ink">
                  {title}
                </h2>
              )}
              {description && (
                <p id={`${id}-d`} className="mt-1 text-[13px] leading-relaxed text-ink-3">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-btn-sm)] text-ink-3 transition-colors hover:bg-inset hover:text-ink"
            >
              <IX size={15} />
            </button>
          </div>
        )}
        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export function AlertDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  tone = "danger",
  busy,
  children,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  busy?: boolean;
  children?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const mounted = useMounted();

  /* Escape cancels — that is an answer, and a deliberate one. A click on
     the backdrop is not, so `outside` stays off. */
  const cancel = useCallback(() => onCancel(), [onCancel]);
  useDismiss({ open, onClose: cancel, refs: [panelRef], outside: false });
  useFocusTrap({ open, ref: panelRef, autoFocus: false });
  useScrollLock(open);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[94] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#1c1b18]/45 backdrop-blur-[3px] dark:bg-black/60"
        style={{ animation: "uicean-overlay-in 0.2s ease-out" }}
      />
      <div
        ref={panelRef}
        /* alertdialog, not dialog: it interrupts, and assistive technology
           treats the two differently */
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-t`}
        aria-describedby={description ? `${id}-d` : undefined}
        className="relative w-full max-w-105 rounded-[calc(var(--radius)+8px)] border border-line bg-surface p-6 outline-none"
        style={{ animation: "uicean-modal-in 0.22s cubic-bezier(0.2,0.9,0.3,1)" }}
      >
        <h2 id={`${id}-t`} className="text-[16.5px] font-semibold text-ink">
          {title}
        </h2>
        {description && (
          <p id={`${id}-d`} className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
            {description}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-2.5">
          {/* Cancel takes focus, not Confirm. The destructive action should
              never be one stray Enter away from happening. */}
          <Button variant="outline" size="sm" onClick={onCancel} autoFocus>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "green"}
            size="sm"
            onClick={onConfirm}
            disabled={busy}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
