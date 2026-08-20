import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cx, IX } from "hash-ui";
import { NAV } from "@/lib/routes";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const ref = useRef<HTMLElement>(null);

  /* Keep the current page in view when you land on a deep link.
     Deliberately not scrollIntoView: that also moves the browser's sequential
     focus navigation starting point onto the link it scrolled to, so the next
     Tab continued from inside the sidebar and skipped everything before it —
     including the skip link, on exactly the pages that need one. Adjusting
     the scroller directly has the same effect on screen and none on focus. */
  useEffect(() => {
    const nav = ref.current;
    const link = nav?.querySelector<HTMLElement>(`[data-nav="${pathname}"]`);
    if (!nav || !link) return;

    const box = nav.closest<HTMLElement>("[data-nav-scroller]") ?? nav.parentElement;
    if (!box) return;

    /* rect deltas rather than offsetTop: offsetTop is measured against the
       nearest positioned ancestor, which is not necessarily this scroller */
    const l = link.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    if (l.top < b.top) box.scrollTop += l.top - b.top - 12;
    else if (l.bottom > b.bottom) box.scrollTop += l.bottom - b.bottom + 12;
  }, [pathname]);

  return (
    <nav ref={ref} className="px-3.5 pt-6 pb-10">
      {NAV.map((g) => (
        <div key={g.label} className="mb-7">
          <div className="microlabel flex items-baseline justify-between px-2.5 pb-2">
            {g.label}
            <span className="font-mono text-[9.5px] normal-case text-ink-3/70">
              {g.items.length}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const on = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-nav={item.path}
                  onClick={onNavigate}
                  aria-current={on ? "page" : undefined}
                  className={cx(
                    "group/nav relative flex h-9 items-center gap-2.5 rounded-full pr-2.5 pl-3.5 text-[13.5px] transition-colors duration-150",
                    on
                      ? "bg-ink font-medium text-canvas"
                      : "font-medium text-ink-2 hover:bg-inset hover:text-ink",
                  )}
                >
                  <span
                    className={cx(
                      "size-1.5 shrink-0 rounded-full transition-colors",
                      on ? "bg-canvas" : "bg-line-strong group-hover/nav:bg-ink-3",
                    )}
                  />
                  {item.label}
                  {item.badge && (
                    <span
                      className={cx(
                        "ml-auto rounded-full px-1.5 py-px text-[10px] font-semibold",
                        on
                          ? "bg-canvas/20 text-canvas"
                          : "bg-brand/12 text-brand-ink dark:text-brand",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside
      data-nav-scroller
      className="scroll-thin sticky top-15 hidden h-[calc(100vh-3.75rem)] w-[252px] shrink-0 overflow-y-auto border-r border-line lg:block"
    >
      <NavList />
    </aside>
  );
}

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <div
        className="absolute inset-0 bg-[#1c1b18]/45 backdrop-blur-[2px] dark:bg-black/60"
        style={{ animation: "hashui-overlay-in 0.15s ease-out" }}
        onClick={onClose}
      />
      <div
        data-nav-scroller
        className="scroll-thin absolute inset-y-0 left-0 flex w-[280px] flex-col overflow-y-auto border-r border-line bg-surface"
        style={{ animation: "hashui-modal-in 0.2s cubic-bezier(0.2,0.9,0.3,1)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-4 right-3.5 z-20 flex size-7.5 items-center justify-center rounded-full bg-ink/6 text-ink-2 dark:bg-white/10"
        >
          <IX size={14} />
        </button>
        <NavList onNavigate={onClose} />
      </div>
    </div>
  );
}
