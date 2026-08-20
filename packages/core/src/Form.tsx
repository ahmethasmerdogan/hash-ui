import { useId, useState, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cx } from "./cx.js";

/* ------------------------------------------------------------------ */
/* The form parts HashUI was missing.                                  */
/*                                                                     */
/* The system was rich in expressive pieces — meters, glow pills,      */
/* commit graphs — and had no label, no textarea, and no way to attach */
/* a description or an error to a control. Those are the parts an      */
/* application cannot be built without, and the ones where getting the */
/* markup wrong is an accessibility bug rather than a visual one.      */
/*                                                                     */
/* `Field` is the piece that matters. shadcn solves this with a Form   */
/* built on react-hook-form; here it is a component that generates the */
/* ids and wires aria-describedby and aria-invalid itself, so a hint    */
/* and an error are announced instead of merely displayed, and no form  */
/* library is installed to get it.                                      */
/* ------------------------------------------------------------------ */

/* the shared control recipe: one hairline, the brand ring on focus */
export const FIELD_BASE =
  "w-full rounded-[var(--radius)] border border-line-strong bg-surface text-sm text-ink " +
  "outline-none transition-colors placeholder:text-ink-3 " +
  "focus:border-brand focus:ring-[3px] focus:ring-brand/15 " +
  "disabled:cursor-not-allowed disabled:opacity-55 " +
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15";

export function Label({
  children,
  htmlFor,
  required,
  className,
}: {
  children: ReactNode;
  htmlFor?: string;
  /** shows the marker and, more usefully, says so out loud */
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cx("block text-[13px] font-medium text-ink", className)}
    >
      {children}
      {required && (
        <>
          <span aria-hidden className="ml-0.5 text-red-500">
            *
          </span>
          {/* an asterisk is a decoration; the word is the information */}
          <span className="sr-only"> (required)</span>
        </>
      )}
    </label>
  );
}

export function Textarea({
  rows = 4,
  autoGrow,
  className,
  onChange,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** grow with the content instead of scrolling inside a fixed box */
  autoGrow?: boolean;
}) {
  return (
    <textarea
      rows={rows}
      onChange={(e) => {
        if (autoGrow) {
          /* reset first: without it the box can only ever get taller,
             because scrollHeight never shrinks below the current height */
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }
        onChange?.(e);
      }}
      className={cx(FIELD_BASE, "resize-y px-3.5 py-2.5 leading-relaxed", autoGrow && "resize-none overflow-hidden", className)}
      {...rest}
    />
  );
}

export function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  label?: ReactNode;
  /** shown under the control, and announced with it */
  hint?: ReactNode;
  /** replaces the hint when set, and marks the control invalid */
  error?: ReactNode;
  required?: boolean;
  className?: string;
  /**
   * The control, as a function of the props it has to carry. A function
   * rather than cloneElement: the props are visible at the call site, they
   * type-check against whatever element you are rendering, and a wrapper
   * around the control does not silently swallow them.
   */
  children: (props: {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    required?: boolean;
  }) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errId = `${id}-error`;
  const described = error ? errId : hint ? hintId : undefined;

  return (
    <div className={cx("flex flex-col gap-1.5 text-left", className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {children({
        id,
        "aria-describedby": described,
        "aria-invalid": error ? true : undefined,
        required,
      })}
      {error ? (
        /* role="alert" so an error that appears after submit is spoken,
           rather than sitting silently under a control the reader has
           already moved past */
        <p id={errId} role="alert" className="text-[12.5px] leading-relaxed text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[12.5px] leading-relaxed text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Separator({
  orientation = "horizontal",
  label,
  className,
}: {
  orientation?: "horizontal" | "vertical";
  /** a word sitting in the rule, e.g. "or" */
  label?: ReactNode;
  className?: string;
}) {
  if (label) {
    return (
      <div className={cx("flex items-center gap-3", className)}>
        <span className="h-px flex-1 bg-line" />
        <span className="text-[12px] font-medium tracking-wide text-ink-3 uppercase">
          {label}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }
  return (
    <div
      /* a rule carries no information a screen reader needs; the heading
         or the group around it already says where the boundary is */
      role="separator"
      aria-orientation={orientation}
      className={cx(
        "shrink-0 bg-line",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}

export function Toggle({
  pressed,
  onChange,
  size = "md",
  children,
  disabled,
  className,
  "aria-label": ariaLabel,
}: {
  pressed?: boolean;
  onChange?: (v: boolean) => void;
  size?: "sm" | "md";
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  /** required when the content is only a glyph */
  "aria-label"?: string;
}) {
  const [internal, setInternal] = useState(pressed ?? false);
  const on = pressed ?? internal;
  return (
    <button
      type="button"
      /* aria-pressed, not a checkbox: this is a button that stays down, and
         the two announce differently */
      aria-pressed={on}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        const v = !on;
        if (pressed === undefined) setInternal(v);
        onChange?.(v);
      }}
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-btn-sm)] font-medium transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand/45",
        "disabled:pointer-events-none disabled:opacity-45",
        size === "sm" ? "h-8 min-w-8 px-2.5 text-[13px]" : "h-9.5 min-w-9.5 px-3 text-sm",
        on ? "bg-ink text-canvas" : "bg-transparent text-ink-2 hover:bg-inset hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ToggleGroup<T extends string>({
  items,
  value,
  onChange,
  multiple,
  size = "md",
  label,
  className,
}: {
  items: Array<{ value: T; label: ReactNode; "aria-label"?: string }>;
  /** a single value, or an array when `multiple` */
  value?: T | T[];
  onChange?: (v: T | T[]) => void;
  multiple?: boolean;
  size?: "sm" | "md";
  /** what the set of toggles is for — a group of buttons with no name
   *  announces as a run of unrelated buttons */
  label?: string;
  className?: string;
}) {
  const [internal, setInternal] = useState<T | T[]>(value ?? (multiple ? [] : ("" as T)));
  const current = value ?? internal;
  const isOn = (v: T) => (Array.isArray(current) ? current.includes(v) : current === v);

  const set = (v: T) => {
    let next: T | T[];
    if (multiple) {
      const list = Array.isArray(current) ? current : [];
      next = list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
    } else {
      /* clicking the active one in a single-select group clears it, the
         same as every segmented control that is not a radio group */
      next = current === v ? ("" as T) : v;
    }
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={cx("inline-flex items-center gap-1 rounded-[var(--radius)] bg-ink/6 p-1 dark:bg-white/8", className)}
    >
      {items.map((it) => (
        <Toggle
          key={it.value}
          size={size}
          pressed={isOn(it.value)}
          onChange={() => set(it.value)}
          aria-label={it["aria-label"]}
        >
          {it.label}
        </Toggle>
      ))}
    </div>
  );
}

export function Spinner({
  size = 16,
  label = "Loading",
  className,
}: {
  size?: number;
  /**
   * Announced while it spins. Pass null for a spinner that sits inside a
   * control which already says it is busy — two announcements of the same
   * wait is worse than one.
   */
  label?: string | null;
  className?: string;
}) {
  return (
    <span
      role={label ? "status" : undefined}
      className={cx("inline-flex items-center", className)}
    >
      <span
        aria-hidden
        className="block rounded-full border-2 border-current border-t-transparent opacity-80"
        style={{
          width: size,
          height: size,
          animation: "hashui-spin 0.7s linear infinite",
        }}
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
