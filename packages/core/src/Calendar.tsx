import { useMemo, useRef, useState } from "react";
import { cx } from "./cx.js";
import { IChevronDown } from "./icons.js";
import { Popover } from "./Popover.js";

/* ------------------------------------------------------------------ */
/* Calendar and DatePicker                                             */
/*                                                                     */
/* No date library. The arithmetic a month grid needs is four lines of  */
/* Date maths, and the alternatives weigh more than the whole of this   */
/* package: date-fns is 20 kB for the parts a calendar touches, and     */
/* moment is 70.                                                        */
/*                                                                     */
/* Formatting and weekday names come from Intl, which every browser     */
/* already has, so the calendar speaks the reader's language and puts   */
/* the week on the right day without shipping a locale table.           */
/*                                                                     */
/* Dates are handled as local midnight throughout. Mixing a UTC value   */
/* into a local grid is how a date picker ends up one day out for       */
/* everyone west of Greenwich, and it always survives to production     */
/* because it looks right where it was written.                         */
/* ------------------------------------------------------------------ */

/** local midnight, so comparisons never fall through a timezone */
function day(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function addMonths(d: Date, n: number) {
  /* the 1 matters: adding a month to the 31st lands in the month after
     next, because there is no 31st in between */
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function useMonthGrid(month: Date, locale: string, weekStartsOn: number) {
  return useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const lead = (first.getDay() - weekStartsOn + 7) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - lead);

    /* always six rows: a grid that changes height as you page through it
       makes the whole popover jump */
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }

    const dowFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const dows = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2024, 0, 7 + ((weekStartsOn + i) % 7));
      return dowFmt.format(d);
    });

    return { cells, dows };
  }, [month, locale, weekStartsOn]);
}

export function Calendar({
  value,
  onChange,
  min,
  max,
  locale,
  /** 0 is Sunday, 1 is Monday. Defaults to Monday. */
  weekStartsOn = 1,
  className,
}: {
  value?: Date | null;
  onChange?: (d: Date) => void;
  min?: Date;
  max?: Date;
  locale?: string;
  weekStartsOn?: 0 | 1 | 6;
  className?: string;
}) {
  const loc = locale ?? (typeof navigator !== "undefined" ? navigator.language : "en-GB");
  const [month, setMonth] = useState(() => (value ? addMonths(value, 0) : addMonths(new Date(), 0)));
  const gridRef = useRef<HTMLDivElement>(null);
  const today = day(new Date());

  const { cells, dows } = useMonthGrid(month, loc, weekStartsOn);
  const monthLabel = new Intl.DateTimeFormat(loc, { month: "long", year: "numeric" }).format(month);
  const fullFmt = new Intl.DateTimeFormat(loc, { dateStyle: "full" });

  const disabled = (d: Date) => (min && day(d) < day(min)) || (max && day(d) > day(max));

  /* the roving tab stop: one date is tabbable and the arrows move it, so
     a keyboard user does not tab through forty-two cells to reach a date */
  const [focusDate, setFocusDate] = useState<Date>(value ?? today);

  const move = (e: React.KeyboardEvent, by: number | "monthStart" | "monthEnd") => {
    e.preventDefault();
    const next = new Date(focusDate);
    if (by === "monthStart") next.setDate(1);
    else if (by === "monthEnd") next.setMonth(next.getMonth() + 1, 0);
    else next.setDate(next.getDate() + by);
    setFocusDate(next);
    if (next.getMonth() !== month.getMonth()) setMonth(addMonths(next, 0));
    requestAnimationFrame(() =>
      gridRef.current?.querySelector<HTMLElement>('[data-focus="true"]')?.focus(),
    );
  };

  return (
    <div className={cx("w-max select-none", className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMonth((m) => addMonths(m, -1))}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-[var(--radius-btn-sm)] text-ink-3 transition-colors hover:bg-inset hover:text-ink"
        >
          <IChevronDown size={15} className="rotate-90" />
        </button>
        {/* aria-live so paging the month is announced; a sighted reader
            sees it change and nobody else did */}
        <span aria-live="polite" className="text-[13.5px] font-semibold text-ink">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-[var(--radius-btn-sm)] text-ink-3 transition-colors hover:bg-inset hover:text-ink"
        >
          <IChevronDown size={15} className="-rotate-90" />
        </button>
      </div>

      <div role="grid" aria-label={monthLabel} ref={gridRef}>
        <div role="row" className="grid grid-cols-7">
          {dows.map((d) => (
            <div
              key={d}
              role="columnheader"
              className="pb-1.5 text-center text-[11px] font-medium tracking-wide text-ink-3 uppercase"
            >
              {d}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, r) => (
          <div role="row" key={r} className="grid grid-cols-7">
            {cells.slice(r * 7, r * 7 + 7).map((d) => {
              const outside = d.getMonth() !== month.getMonth();
              const isSel = value ? sameDay(d, value) : false;
              const isToday = sameDay(d, today);
              const isFocus = sameDay(d, focusDate);
              const off = disabled(d);
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  role="gridcell"
                  aria-selected={isSel}
                  aria-current={isToday ? "date" : undefined}
                  aria-disabled={off || undefined}
                  data-focus={isFocus}
                  tabIndex={isFocus ? 0 : -1}
                  disabled={off}
                  onClick={() => {
                    setFocusDate(d);
                    if (!off) onChange?.(day(d));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") move(e, -1);
                    else if (e.key === "ArrowRight") move(e, 1);
                    else if (e.key === "ArrowUp") move(e, -7);
                    else if (e.key === "ArrowDown") move(e, 7);
                    else if (e.key === "PageUp") { e.preventDefault(); setMonth((m) => addMonths(m, -1)); }
                    else if (e.key === "PageDown") { e.preventDefault(); setMonth((m) => addMonths(m, 1)); }
                    else if (e.key === "Home") move(e, "monthStart");
                    else if (e.key === "End") move(e, "monthEnd");
                  }}
                  /* the full date as the name: "14" tells a screen-reader
                     user nothing about which month or year they are in */
                  aria-label={fullFmt.format(d)}
                  className={cx(
                    "relative m-0.5 flex size-9 items-center justify-center rounded-[var(--radius-btn-sm)] text-[13px] transition-colors",
                    "outline-none focus-visible:ring-2 focus-visible:ring-brand/45",
                    isSel
                      ? "bg-ink font-semibold text-canvas"
                      : outside
                        ? "text-ink-3/45 hover:bg-inset"
                        : "text-ink-2 hover:bg-inset hover:text-ink",
                    off && "pointer-events-none opacity-30",
                  )}
                >
                  {d.getDate()}
                  {isToday && !isSel && (
                    <span
                      aria-hidden
                      className="absolute bottom-1 size-1 rounded-full bg-brand"
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  min,
  max,
  locale,
  weekStartsOn = 1,
  label,
  disabled,
  className,
}: {
  value?: Date | null;
  onChange?: (d: Date) => void;
  placeholder?: string;
  min?: Date;
  max?: Date;
  locale?: string;
  weekStartsOn?: 0 | 1 | 6;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const loc = locale ?? (typeof navigator !== "undefined" ? navigator.language : "en-GB");
  const fmt = new Intl.DateTimeFormat(loc, { dateStyle: "medium" });

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
      align="start"
      label={label ?? "Choose a date"}
      className="!p-3"
      trigger={(p) => (
        <button
          {...p}
          ref={p.ref as unknown as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          aria-label={label}
          className={cx(
            "inline-flex h-10.5 w-full items-center justify-between gap-2 rounded-[var(--radius)] border border-line-strong bg-surface px-3.5 text-left text-sm transition-colors",
            "outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/15",
            "disabled:cursor-not-allowed disabled:opacity-55",
            value ? "text-ink" : "text-ink-3",
            className,
          )}
        >
          <span className="truncate">{value ? fmt.format(value) : placeholder}</span>
          <IChevronDown size={14} aria-hidden className="shrink-0 text-ink-3" />
        </button>
      )}
    >
      <Calendar
        value={value}
        min={min}
        max={max}
        locale={loc}
        weekStartsOn={weekStartsOn}
        onChange={(d) => {
          onChange?.(d);
          setOpen(false);
        }}
      />
    </Popover>
  );
}
