import { useState, type ReactNode } from "react";
import {
  cx,
  SearchField,
  IGrid,
  IRows,
  ILayers,
  IPulse,
  IUsers,
  IFileText,
  ISettings,
  IUserCircle,
  IBox,
  IChevronDown,
  IChevronRight,
  IDots,
} from "uicean";

/* ------------------------------------------------------------------ */
/* RailSidebar                                                         */
/*                                                                     */
/* The two-part navigation an admin tool grows into: a narrow rail of  */
/* destinations on the far left, and a panel showing the tree for      */
/* whichever rail item is selected.                                    */
/*                                                                     */
/* The rail is the reason this exists next to <SidebarNav> — it lets   */
/* one product hold several unrelated trees without a mega-menu, and   */
/* it keeps the top-level switch reachable no matter how deep the      */
/* panel is scrolled.                                                  */
/*                                                                     */
/* The reference marks the active row with a pale fill. That reads as  */
/* "hovered" everywhere else in this system, so the row uses UICean's  */
/* ink pill and leading dot instead — see <SidebarNav> for the rule.   */
/* ------------------------------------------------------------------ */

export type RailItem = { id: string; label: string; icon: ReactNode };

export type PanelItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  /** renders a trailing chevron; the panel does not nest further */
  expandable?: boolean;
};

export type PanelGroup = { heading?: string; items: PanelItem[] };

const s = 16;

const DEMO_RAIL: RailItem[] = [
  { id: "dash", label: "Dashboards", icon: <IGrid size={s} /> },
  { id: "reports", label: "Reports", icon: <IFileText size={s} /> },
  { id: "activity", label: "Activity", icon: <IPulse size={s} /> },
  { id: "assets", label: "Assets", icon: <IBox size={s} /> },
  { id: "people", label: "People", icon: <IUsers size={s} /> },
  { id: "layers", label: "Layers", icon: <ILayers size={s} /> },
];

const DEMO_RAIL_FOOTER: RailItem[] = [
  { id: "settings", label: "Settings", icon: <ISettings size={s} /> },
  { id: "account", label: "Account", icon: <IUserCircle size={s} /> },
];

const DEMO_GROUPS: PanelGroup[] = [
  {
    heading: "Dashboard types",
    items: [
      { id: "overview", label: "Overview", icon: <IGrid size={14} /> },
      { id: "exec", label: "Executive summary", icon: <IRows size={14} />, expandable: true },
      { id: "ops", label: "Operations dashboard", icon: <IPulse size={14} />, expandable: true },
      { id: "fin", label: "Financial dashboard", icon: <IFileText size={14} />, expandable: true },
    ],
  },
  {
    heading: "Report summaries",
    items: [
      { id: "weekly", label: "Weekly reports", icon: <IFileText size={14} />, expandable: true },
      { id: "monthly", label: "Monthly insights", icon: <IRows size={14} />, expandable: true },
      { id: "quarterly", label: "Quarterly analysis", icon: <ILayers size={14} />, expandable: true },
    ],
  },
  {
    heading: "Business intelligence",
    items: [
      { id: "perf", label: "Performance metrics", icon: <IPulse size={14} />, expandable: true },
      { id: "pred", label: "Predictive analytics", icon: <IGrid size={14} />, expandable: true },
    ],
  },
];

export type RailSidebarProps = {
  brand?: ReactNode;
  /** the mark in the rail's top slot */
  mark?: ReactNode;
  rail?: RailItem[];
  railFooter?: RailItem[];
  /** the panel's own title, above the search field */
  panelTitle?: ReactNode;
  groups?: PanelGroup[];
  /** the row pinned to the bottom of the panel */
  footer?: { label: ReactNode; onMenu?: () => void };
  activeRailId?: string;
  onRailSelect?: (id: string) => void;
  activeId?: string;
  onSelect?: (id: string) => void;
  searchable?: boolean;
  className?: string;
};

export function RailSidebar({
  brand = "Interfaces",
  mark,
  rail = DEMO_RAIL,
  railFooter = DEMO_RAIL_FOOTER,
  panelTitle = "Dashboard",
  groups = DEMO_GROUPS,
  footer = { label: "Text content" },
  activeRailId,
  onRailSelect,
  activeId,
  onSelect,
  searchable = true,
  className,
}: RailSidebarProps) {
  const [railInternal, setRailInternal] = useState(rail[0]?.id ?? "");
  const [internal, setInternal] = useState("overview");
  const [query, setQuery] = useState("");

  const currentRail = activeRailId ?? railInternal;
  const current = activeId ?? internal;
  const selectRail = onRailSelect ?? setRailInternal;
  const select = onSelect ?? setInternal;

  /* filtering happens here rather than in each group so an empty group
     disappears entirely instead of leaving a stranded heading */
  const filtered = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) =>
        String(i.label).toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div
      className={cx(
        "flex h-full overflow-hidden rounded-2xl border border-line bg-surface",
        className,
      )}
    >
      {/* the rail */}
      <div className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-line bg-elev py-3">
        <span className="mb-2 flex size-8 items-center justify-center rounded-[10px] bg-ink text-canvas">
          {mark ?? <IGrid size={15} />}
        </span>
        {rail.map((r) => (
          <RailButton
            key={r.id}
            item={r}
            active={r.id === currentRail}
            onClick={() => selectRail(r.id)}
          />
        ))}
        <div className="mt-auto flex flex-col gap-1">
          {railFooter.map((r) => (
            <RailButton
              key={r.id}
              item={r}
              active={r.id === currentRail}
              onClick={() => selectRail(r.id)}
            />
          ))}
        </div>
      </div>

      {/* the panel */}
      <div className="flex w-65 min-w-0 flex-col p-3">
        <div className="flex items-center gap-2 px-1 pb-3">
          <span className="truncate text-[13.5px] font-semibold text-ink">
            {brand}
          </span>
        </div>

        {panelTitle && (
          <button
            type="button"
            className="flex items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-elev"
          >
            <span className="truncate text-[17px] font-bold tracking-[-0.03em] text-ink">
              {panelTitle}
            </span>
            <IChevronDown size={14} className="shrink-0 text-ink-3" />
          </button>
        )}

        {searchable && (
          <div className="mt-3">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search…"
              kbd={false}
            />
          </div>
        )}

        <div className="scroll-thin mt-4 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
          {filtered.map((group, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              {group.heading && (
                <span className="microlabel mb-1.5 px-2.5">{group.heading}</span>
              )}
              {group.items.map((item) => {
                const isActive = item.id === current;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => select(item.id)}
                    className={cx(
                      "group/row flex items-center justify-between gap-2 rounded-full py-1.5 pr-2.5 pl-2.5 text-left transition-colors duration-150",
                      isActive
                        ? "bg-ink text-canvas"
                        : "text-ink-2 hover:bg-elev hover:text-ink",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        aria-hidden
                        className={cx(
                          "size-1.5 shrink-0 rounded-full transition-colors",
                          isActive ? "bg-canvas" : "bg-transparent",
                        )}
                      />
                      {item.icon && (
                        <span
                          className={cx(
                            "shrink-0",
                            isActive ? "text-canvas" : "text-ink-3",
                          )}
                        >
                          {item.icon}
                        </span>
                      )}
                      <span className="truncate text-[13px] font-medium">
                        {item.label}
                      </span>
                    </span>
                    {item.expandable && (
                      <IChevronRight
                        size={13}
                        className={cx(
                          "shrink-0",
                          isActive ? "text-canvas/60" : "text-ink-3",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="px-2.5 py-6 text-center text-[12.5px] text-ink-3">
              Nothing matches “{query}”.
            </p>
          )}
        </div>

        {footer && (
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-line px-2.5 pt-3">
            <span className="truncate text-[13px] text-ink-2">{footer.label}</span>
            <button
              type="button"
              aria-label="More"
              onClick={footer.onMenu}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-elev hover:text-ink"
            >
              <IDots size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RailButton({
  item,
  active,
  onClick,
}: {
  item: RailItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={item.label}
      aria-label={item.label}
      aria-current={active ? "true" : undefined}
      className={cx(
        "flex size-9 items-center justify-center rounded-[10px] transition-colors",
        active
          ? "bg-surface text-ink"
          : "text-ink-3 hover:bg-surface/60 hover:text-ink-2",
      )}
    >
      {item.icon}
    </button>
  );
}
