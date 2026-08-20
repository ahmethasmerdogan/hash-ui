import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx.js";
import { ICheck, IChevronDown, ISearch } from "./icons.js";
import {
  useAnchoredPosition,
  useDismiss,
  useMounted,
  useScrollLock,
} from "./overlay-primitives.js";

/* ------------------------------------------------------------------ */
/* Combobox and Command                                                */
/*                                                                     */
/* The same pattern at two scales: a text field that filters a list,    */
/* where focus stays in the field and the highlighted row is announced  */
/* through aria-activedescendant. Neither is a listbox you tab through  */
/* — the arrow keys move the selection, which is why the rows are not   */
/* focusable and why the field never loses focus.                       */
/*                                                                     */
/* Combobox is a form control and anchors to its trigger. Command is a  */
/* modal palette over the page. Everything else about them is shared,   */
/* including the part everyone gets wrong: a filtered list has to keep  */
/* the highlight on a row that still exists.                            */
/* ------------------------------------------------------------------ */

export type Option<T extends string = string> = {
  value: T;
  label: string;
  /** matched by the filter but never displayed — synonyms, ids, keywords */
  keywords?: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** rows sharing a group are drawn under one heading */
  group?: string;
};

function useFiltered<T extends string>(options: Array<Option<T>>, query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      `${o.label} ${o.keywords ?? ""} ${o.description ?? ""} ${o.group ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [options, query]);
}

/** shared keyboard handling for a field that drives a list below it */
function useListNavigation(count: number, onPick: (i: number) => void, onClose: () => void) {
  const [active, setActive] = useState(0);

  /* the highlight moves back to the top whenever the list changes, or it
     ends up pointing past the end of a filtered list and Enter picks
     nothing at all */
  useEffect(() => setActive(0), [count]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(count - 1, a + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(count - 1);
      } else if (e.key === "Enter") {
        if (count === 0) return;
        e.preventDefault();
        onPick(active);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [count, active, onPick, onClose],
  );

  return { active, setActive, onKeyDown };
}

/** keep the highlighted row in view without scrolling the page with it */
function useScrollActiveIntoView(listRef: React.RefObject<HTMLElement | null>, active: number) {
  useEffect(() => {
    const row = listRef.current?.querySelector(`[data-idx="${active}"]`);
    /* guarded: scrollIntoView is absent in jsdom, and a missing scroll is
       not a reason for a keypress to throw */
    row?.scrollIntoView?.({ block: "nearest" });
  }, [listRef, active]);
}

const ROW =
  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13.5px] transition-colors";

function Rows<T extends string>({
  items,
  active,
  selected,
  onPick,
  setActive,
  idPrefix,
  empty,
}: {
  items: Array<Option<T>>;
  active: number;
  selected?: T | T[];
  onPick: (i: number) => void;
  setActive: (i: number) => void;
  idPrefix: string;
  empty: ReactNode;
}) {
  if (items.length === 0)
    return <div className="px-3 py-8 text-center text-[13px] text-ink-3">{empty}</div>;

  let lastGroup: string | undefined;
  return (
    <>
      {items.map((o, i) => {
        const isSel = Array.isArray(selected) ? selected.includes(o.value) : selected === o.value;
        const head = o.group && o.group !== lastGroup ? o.group : null;
        lastGroup = o.group;
        return (
          <div key={o.value} role="presentation">
            {head && (
              <div
                role="presentation"
                className="px-3 pt-2.5 pb-1 text-[11.5px] font-medium tracking-wide text-ink-3 uppercase"
              >
                {head}
              </div>
            )}
            <button
              type="button"
              role="option"
              id={`${idPrefix}-${i}`}
              aria-selected={isSel}
              data-idx={i}
              /* not focusable: focus stays in the field, and the row the
                 arrows landed on is announced through activedescendant */
              tabIndex={-1}
              disabled={o.disabled}
              onPointerMove={() => setActive(i)}
              onClick={() => onPick(i)}
              className={cx(
                ROW,
                "rounded-[var(--radius-btn-sm)]",
                i === active ? "bg-inset text-ink" : "text-ink-2",
                o.disabled && "pointer-events-none opacity-45",
              )}
            >
              {o.icon && <span className="shrink-0 text-ink-3">{o.icon}</span>}
              <span className="min-w-0 flex-1">
                <span className="block truncate">{o.label}</span>
                {o.description && (
                  <span className="block truncate text-[12px] text-ink-3">{o.description}</span>
                )}
              </span>
              {isSel && <ICheck size={14} className="shrink-0 text-brand" />}
            </button>
          </div>
        );
      })}
    </>
  );
}

export function Combobox<T extends string>({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  empty = "No match",
  label,
  disabled,
  className,
}: {
  options: Array<Option<T>>;
  value?: T;
  onChange?: (v: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  empty?: ReactNode;
  /** what is being chosen — required when no visible label points at it */
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [internal, setInternal] = useState<T | undefined>(value);
  const current = value ?? internal;

  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const mounted = useMounted();

  const filtered = useFiltered(options, query);
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const pick = useCallback(
    (i: number) => {
      const o = filtered[i];
      if (!o || o.disabled) return;
      if (value === undefined) setInternal(o.value);
      onChange?.(o.value);
      close();
      anchorRef.current?.focus();
    },
    [filtered, value, onChange, close],
  );

  const { active, setActive, onKeyDown } = useListNavigation(filtered.length, pick, close);
  useScrollActiveIntoView(listRef, active);
  const pos = useAnchoredPosition({
    open,
    anchorRef,
    floatingRef: panelRef,
    placement: "bottom",
    align: "start",
    offset: 6,
  });
  useDismiss({ open, onClose: close, refs: [panelRef, anchorRef] });

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const selected = options.find((o) => o.value === current);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-haspopup="listbox"
        aria-label={label}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "inline-flex h-10.5 w-full items-center justify-between gap-2 rounded-[var(--radius)] border border-line-strong bg-surface px-3.5 text-left text-sm transition-colors",
          "outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/15",
          "disabled:cursor-not-allowed disabled:opacity-55",
          selected ? "text-ink" : "text-ink-3",
          className,
        )}
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label ?? placeholder}</span>
        <IChevronDown size={14} aria-hidden className="shrink-0 text-ink-3" />
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-[92] overflow-hidden rounded-[calc(var(--radius)+2px)] border border-line bg-surface"
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              width: anchorRef.current?.offsetWidth,
              /* opacity rather than visibility: a control inside a
                 visibility:hidden subtree cannot take focus, and this is
                 hidden for exactly the one commit in which the focus trap
                 runs. One transparent frame, and the panel is focusable
                 throughout it. */
              opacity: pos ? 1 : 0,
            }}
          >
            <div className="flex items-center gap-2 border-b border-line px-3">
              <ISearch size={14} aria-hidden className="shrink-0 text-ink-3" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-controls={`${id}-list`}
                aria-activedescendant={filtered[active] ? `${id}-${active}` : undefined}
                aria-autocomplete="list"
                className="h-10 w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
              />
            </div>
            <div
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              aria-label={label ?? "Options"}
              className="scroll-thin max-h-64 overflow-y-auto p-1"
            >
              <p role="status" className="sr-only">
                {filtered.length === 0
                  ? "No results"
                  : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
              </p>
              <Rows
                items={filtered}
                active={active}
                selected={current}
                onPick={pick}
                setActive={setActive}
                idPrefix={id}
                empty={empty}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export function Command<T extends string>({
  open,
  onClose,
  options,
  onSelect,
  placeholder = "Type a command or search…",
  empty = "Nothing matches",
  label = "Command palette",
}: {
  open: boolean;
  onClose: () => void;
  options: Array<Option<T>>;
  onSelect: (value: T) => void;
  placeholder?: string;
  empty?: ReactNode;
  label?: string;
}) {
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const id = useId();
  const mounted = useMounted();

  const filtered = useFiltered(options, query);

  const pick = useCallback(
    (i: number) => {
      const o = filtered[i];
      if (!o || o.disabled) return;
      onSelect(o.value);
      onClose();
    },
    [filtered, onSelect, onClose],
  );

  const { active, setActive, onKeyDown } = useListNavigation(filtered.length, pick, onClose);
  useScrollActiveIntoView(listRef, active);
  useScrollLock(open);
  useDismiss({ open, onClose, refs: [panelRef], escape: false });

  useEffect(() => {
    if (!open) return;
    setQuery("");
    restoreRef.current = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => restoreRef.current?.focus?.();
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[96] flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-[#1c1b18]/50 backdrop-blur-[3px] dark:bg-black/65"
        style={{ animation: "hashui-overlay-in 0.15s ease-out" }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="relative w-full max-w-135 overflow-hidden rounded-[calc(var(--radius)+10px)] border border-line bg-surface"
        style={{ animation: "hashui-modal-in 0.2s cubic-bezier(0.2,0.9,0.3,1)" }}
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <ISearch size={16} aria-hidden className="shrink-0 text-ink-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              /* Tab would walk out of a modal whose rows are not focusable
                 anyway, so it is kept in the field */
              if (e.key === "Tab") e.preventDefault();
              onKeyDown(e);
            }}
            placeholder={placeholder}
            role="combobox"
            aria-label={label}
            aria-expanded
            aria-controls={`${id}-list`}
            aria-activedescendant={filtered[active] ? `${id}-${active}` : undefined}
            aria-autocomplete="list"
            className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
          />
        </div>
        <div
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="scroll-thin max-h-[46vh] overflow-y-auto p-2"
        >
          <p role="status" className="sr-only">
            {filtered.length === 0
              ? "No results"
              : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
          </p>
          <Rows
            items={filtered}
            active={active}
            onPick={pick}
            setActive={setActive}
            idPrefix={id}
            empty={empty}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
