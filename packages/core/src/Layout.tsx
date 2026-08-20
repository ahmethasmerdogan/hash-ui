import {
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "./cx.js";
import { IChevronDown } from "./icons.js";

/* ------------------------------------------------------------------ */
/* The structural pieces: Collapsible, ScrollArea, AspectRatio,        */
/* InputOTP.                                                           */
/*                                                                     */
/* None of them look like much and all four are load-bearing. They are */
/* also the four most often reimplemented badly: a disclosure that     */
/* animates to a height it had to measure, a scroll area that hides    */
/* its scrollbar from a mouse but also from a screen reader, a ratio   */
/* box built from padding-bottom percentages, and an OTP field that is */
/* six inputs a password manager cannot fill and a paste cannot fill   */
/* either.                                                             */
/* ------------------------------------------------------------------ */

export function Collapsible({
  trigger,
  children,
  defaultOpen = false,
  open: controlled,
  onOpenChange,
  className,
}: {
  /** the always-visible part. A string gets the default row treatment. */
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultOpen);
  const open = controlled ?? internal;
  const id = useId();

  const toggle = () => {
    const v = !open;
    if (controlled === undefined) setInternal(v);
    onOpenChange?.(v);
  };

  return (
    <div className={cx("w-full", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-3 rounded-[var(--radius)] px-1 py-2 text-left text-[13.5px] font-medium text-ink transition-colors hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand/45"
      >
        {trigger}
        <IChevronDown
          size={15}
          aria-hidden
          className={cx("shrink-0 text-ink-3 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {/* grid-template-rows 0fr → 1fr is the only way to animate to a
          height you cannot know in advance. Measuring scrollHeight in a
          layout effect is the usual alternative and it fights every
          resize, every font swap and every image that loads late. */}
      <div
        id={id}
        role="region"
        className="grid transition-[grid-template-rows] duration-250 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className={cx(
              "px-1 pb-3 text-[13.5px] leading-relaxed text-ink-2 transition-opacity duration-200",
              open ? "opacity-100" : "opacity-0",
            )}
            /* hidden from the reading order while closed, or a screen
               reader walks straight into content nobody can see. React 19
               takes `inert` as a real boolean — the empty-string cast that
               older versions needed makes it warn. */
            inert={!open}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScrollArea({
  children,
  height,
  maxHeight = 280,
  orientation = "vertical",
  className,
}: {
  children: ReactNode;
  height?: number | string;
  maxHeight?: number | string;
  orientation?: "vertical" | "horizontal" | "both";
  className?: string;
}) {
  return (
    <div
      /* tabIndex 0 on a scrollable box, because a region a mouse can
         scroll and a keyboard cannot is a region a keyboard user cannot
         read. The browser only does this for you when the box happens to
         contain something focusable. */
      tabIndex={0}
      className={cx(
        "scroll-thin rounded-[var(--radius)] outline-none focus-visible:ring-2 focus-visible:ring-brand/45",
        orientation === "vertical" && "overflow-y-auto",
        orientation === "horizontal" && "overflow-x-auto",
        orientation === "both" && "overflow-auto",
        className,
      )}
      style={{ height, maxHeight: height ? undefined : maxHeight }}
    >
      {children}
    </div>
  );
}

export function AspectRatio({
  ratio = 16 / 9,
  children,
  className,
}: {
  /** width ÷ height. 16/9, 4/3, 1 — write it as the division. */
  ratio?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      /* the real property, not the padding-bottom trick. That trick needs
         an absolutely positioned child, which means everything inside has
         to know it is inside one. */
      className={cx("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: String(ratio) }}
    >
      {children}
    </div>
  );
}

export function InputOTP({
  length = 6,
  value,
  onChange,
  onComplete,
  label = "One-time code",
  disabled,
  className,
}: {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
  /** fired the moment the last slot is filled */
  onComplete?: (v: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [internal, setInternal] = useState("");
  const code = (value ?? internal).slice(0, length);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const set = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    if (value === undefined) setInternal(clean);
    onChange?.(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  return (
    <div
      className={cx("relative inline-flex", className)}
      onClick={() => inputRef.current?.focus()}
    >
      {/* One real input behind the boxes, not one per digit.
       *
       * Six separate inputs is the usual build and it breaks three things
       * at once: a password manager fills the first box and stops, a paste
       * of "483920" lands entirely in one box, and the browser's own SMS
       * autofill never fires. One input with autocomplete="one-time-code"
       * gets all three for free. The boxes are decoration over it. */}
      <input
        ref={inputRef}
        value={code}
        onChange={(e) => set(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPaste={(e: ClipboardEvent<HTMLInputElement>) => {
          e.preventDefault();
          set(e.clipboardData.getData("text"));
        }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          /* the caret is invisible, so arrow keys would move a cursor
             nobody can see; only editing keys mean anything here */
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
            e.preventDefault();
        }}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label={label}
        maxLength={length}
        className="absolute inset-0 z-10 h-full w-full cursor-default opacity-0"
      />
      <span aria-hidden className="flex items-center gap-2">
        {Array.from({ length }, (_, i) => {
          const char = code[i];
          const active = focused && (i === code.length || (i === length - 1 && code.length === length));
          return (
            <span
              key={i}
              className={cx(
                "flex h-12 w-10 items-center justify-center rounded-[var(--radius)] border bg-surface font-mono text-[18px] text-ink transition-colors",
                active ? "border-brand ring-[3px] ring-brand/15" : "border-line-strong",
                disabled && "opacity-55",
              )}
            >
              {char ?? (
                <span className={cx("block h-4 w-px bg-ink-3/60", active ? "animate-pulse" : "opacity-0")} />
              )}
            </span>
          );
        })}
      </span>
    </div>
  );
}
