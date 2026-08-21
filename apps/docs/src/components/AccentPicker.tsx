import { useEffect, useRef, useState } from "react";
import { ACCENTS, cx, useTheme, ICheck, type AccentId } from "uicean";

/* ------------------------------------------------------------------ */
/* AccentPicker                                                        */
/*                                                                     */
/* Five swatches behind one button in the top bar. The choice is a     */
/* token swap on <html>, so every page, block and effect on the site   */
/* re-colours at once and the selection survives a reload.             */
/*                                                                     */
/* The trigger shows the current swatch rather than an icon: it is the */
/* one control here whose state is a colour, and drawing that colour   */
/* is a shorter path to "what is this?" than any glyph.                */
/* ------------------------------------------------------------------ */

const IDS = Object.keys(ACCENTS) as AccentId[];

export function AccentPicker() {
  const { accent, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* Focus the current swatch when the menu opens, so the first arrow press
     moves from where you are rather than from nowhere. */
  useEffect(() => {
    if (!open) return;
    const items = menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]');
    const active = menu.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]');
    (active ?? items?.[0])?.focus();
  }, [open]);

  /* role="menu" promises arrow-key navigation; the browser gives none. */
  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(
      menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [],
    );
    if (!items.length) return;
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const go = (n: number) => {
      e.preventDefault();
      items[(n + items.length) % items.length]?.focus();
    };
    if (e.key === "ArrowDown") go(i + 1);
    if (e.key === "ArrowUp") go(i - 1);
    if (e.key === "Home") go(0);
    if (e.key === "End") go(items.length - 1);
  };

  return (
    <div ref={wrap} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Accent colour: ${ACCENTS[accent].label}`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex size-9 items-center justify-center rounded-[10px] border border-line bg-surface transition-colors hover:border-line-strong"
      >
        <span
          className="size-4 rounded-full ring-1 ring-black/10 ring-inset"
          style={{ background: ACCENTS[accent].swatch }}
        />
      </button>

      {open && (
        <div
          ref={menu}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-line bg-surface p-1.5"
        >
          <div className="microlabel px-2.5 pt-1 pb-2">Accent</div>
          {IDS.map((id) => {
            const a = ACCENTS[id];
            const active = id === accent;
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setAccent(id);
                  close();
                }}
                className={cx(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  active ? "bg-elev" : "hover:bg-elev",
                )}
              >
                <span
                  className="size-3.5 shrink-0 rounded-full ring-1 ring-black/10 ring-inset"
                  style={{ background: a.swatch }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-ink">
                    {a.label}
                  </span>
                  <span className="block text-[11px] text-ink-3">{a.note}</span>
                </span>
                {active && <ICheck size={14} className="shrink-0 text-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
