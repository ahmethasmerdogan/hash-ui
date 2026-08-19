import { useEffect, useRef, useState } from "react";
import { ACCENTS, cx, useTheme, ICheck, type AccentId } from "hash-ui";

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

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Accent colour: ${ACCENTS[accent].label}`}
        onClick={() => setOpen((o) => !o)}
        className="flex size-9 items-center justify-center rounded-[10px] border border-line bg-surface transition-colors hover:border-line-strong"
      >
        <span
          className="size-4 rounded-full ring-1 ring-black/10 ring-inset"
          style={{ background: ACCENTS[accent].swatch }}
        />
      </button>

      {open && (
        <div
          role="menu"
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
                  setOpen(false);
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
