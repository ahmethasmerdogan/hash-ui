import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { cx, Kbd, ISearch } from "hash-ui";
import { NAV, type DocPage } from "@/lib/routes";

function Match({ label, q }: { label: string; q: string }) {
  if (!q) return <>{label}</>;
  const i = label.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{label}</>;
  return (
    <>
      {label.slice(0, i)}
      <mark className="rounded-[4px] bg-[#5b2c10] px-0.5 text-orange-300">
        {label.slice(i, i + q.length)}
      </mark>
      {label.slice(i + q.length)}
    </>
  );
}

type Entry = DocPage & { group: string };

export function CommandK({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const flat = useMemo<Entry[]>(
    () => NAV.flatMap((g) => g.items.map((it) => ({ ...it, group: g.label }))),
    [],
  );

  /* the keyword field carries the component names a page documents, so
     searching "Tooltip" finds the Feedback page even though no nav label
     mentions it */
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return flat;
    return flat.filter((it) =>
      `${it.label} ${it.desc} ${it.keywords ?? ""} ${it.group}`
        .toLowerCase()
        .includes(needle),
    );
  }, [flat, q]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!open) return;
    const go = (path: string) => {
      onClose();
      navigate(path);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(filtered.length - 1, a + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === "Enter" && filtered[active]) {
        e.preventDefault();
        go(filtered[active].path);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, active, navigate, onClose]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  let lastGroup = "";
  return createPortal(
    <div className="fixed inset-0 z-[96] flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-[#1c1b18]/50 backdrop-blur-[3px] dark:bg-black/65"
        style={{ animation: "hashui-overlay-in 0.15s ease-out" }}
        onClick={onClose}
      />
      <div
        className="dark relative w-full max-w-135"
        style={{ animation: "hashui-modal-in 0.2s cubic-bezier(0.2,0.9,0.3,1)" }}
      >
        <div className="overflow-hidden rounded-[20px] border border-line bg-canvas shadow-float">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <ISearch size={16} className="shrink-0 text-ink-3" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search components, patterns, tokens…"
              className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
            />
            <Kbd>esc</Kbd>
          </div>

          <div ref={listRef} className="scroll-thin max-h-[46vh] overflow-y-auto py-2">
            {filtered.length === 0 && (
              <div className="px-5 py-8 text-center text-[13.5px] text-ink-3">
                Nothing matches “{q}”
              </div>
            )}
            {filtered.map((it, i) => {
              const groupHeader =
                it.group !== lastGroup ? (
                  <div className="px-5 pt-3 pb-1 text-[12.5px] font-medium text-ink-3">
                    {it.group}
                  </div>
                ) : null;
              lastGroup = it.group;
              return (
                <div key={it.path}>
                  {groupHeader}
                  <button
                    type="button"
                    data-idx={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      onClose();
                      navigate(it.path);
                    }}
                    className={cx(
                      "flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors",
                      i === active ? "bg-white/6 text-ink" : "text-ink-2",
                    )}
                  >
                    <span
                      className={cx(
                        "size-1.5 shrink-0 rounded-full",
                        i === active ? "bg-emerald-400" : "bg-ink-3/40",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[14.5px]">
                        <Match label={it.label} q={q} />
                      </span>
                      <span className="block truncate text-[12px] text-ink-3">
                        {it.desc}
                      </span>
                    </span>
                    {i === active && (
                      <span className="ml-auto shrink-0 text-[11.5px] text-ink-3">
                        Open ↵
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 border-t border-line bg-surface px-5 py-3">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span className="text-[12.5px] text-ink-3">to navigate</span>
            <span className="ml-auto flex items-center gap-2">
              <Kbd>↵</Kbd>
              <span className="text-[12.5px] text-ink-3">to open</span>
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
