import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  cx,
  Avatar,
  Kbd,
  ISearch,
  IHome,
  IMail,
  IPulse,
  IFolder,
  ICalendar,
  IUsers,
  IGlobe,
  ICreditCard,
  ICommand,
  ILayers,
  ISettings,
  IHash,
  IChevronDown,
  IChevronRight,
  IMenu,
  IX,
} from "hash-ui";

/* ------------------------------------------------------------------ */
/* SidebarNav / DashboardShell                                         */
/*                                                                     */
/* A workspace switcher, a nested navigation tree and a pinned footer  */
/* group — the sidebar an application actually needs rather than a     */
/* list of links.                                                      */
/*                                                                     */
/* Two things are worth reading before you change them:                */
/*                                                                     */
/* The active row is a black ink pill with a leading dot. That is the  */
/* system's rule and it is not negotiable per-block — the reference    */
/* this came from used a pale grey fill, which reads as "hovered" in   */
/* every other HashUI surface and would have made the state ambiguous. */
/*                                                                     */
/* Children expand by animating grid-template-rows from 0fr to 1fr.    */
/* It is the only way to transition to a height you do not know, and   */
/* it beats measuring scrollHeight in a layout effect.                 */
/* ------------------------------------------------------------------ */

export type NavItemData = {
  id: string;
  title: ReactNode;
  icon?: ReactNode;
  badge?: number | string;
  /** shown on hover — the keyboard route to the same place */
  shortcut?: string;
  children?: NavItemData[];
};

export type NavGroupData = { heading?: string; items: NavItemData[] };

const s = 16;

const DEMO_GROUPS: NavGroupData[] = [
  {
    items: [
      { id: "search", title: "Search", icon: <ISearch size={s} />, shortcut: "⌘K" },
      { id: "home", title: "Home", icon: <IHome size={s} /> },
      { id: "inbox", title: "Inbox", icon: <IMail size={s} />, badge: 12 },
      { id: "analytics", title: "Analytics", icon: <IPulse size={s} /> },
    ],
  },
  {
    heading: "Workspace",
    items: [
      {
        id: "projects",
        title: "Projects",
        icon: <IFolder size={s} />,
        children: [
          { id: "p-active", title: "Active", icon: <IHash size={s} /> },
          { id: "p-archived", title: "Archived", icon: <IHash size={s} /> },
        ],
      },
      { id: "calendar", title: "Calendar", icon: <ICalendar size={s} /> },
      {
        id: "team",
        title: "Team",
        icon: <IUsers size={s} />,
        children: [
          { id: "t-design", title: "Designers", icon: <IHash size={s} /> },
          { id: "t-eng", title: "Engineering", icon: <IHash size={s} /> },
          { id: "t-product", title: "Product", icon: <IHash size={s} /> },
        ],
      },
      {
        id: "customers",
        title: "Customers",
        icon: <IGlobe size={s} />,
        children: [
          { id: "c-enterprise", title: "Enterprise", icon: <IHash size={s} /> },
          { id: "c-smb", title: "SMB", icon: <IHash size={s} /> },
        ],
      },
      { id: "finance", title: "Finance", icon: <ICreditCard size={s} /> },
    ],
  },
  {
    heading: "Developers",
    items: [
      { id: "api", title: "API keys", icon: <ICommand size={s} /> },
      { id: "webhooks", title: "Webhooks", icon: <ILayers size={s} /> },
    ],
  },
];

const DEMO_FOOTER: NavItemData[] = [
  { id: "settings", title: "Settings", icon: <ISettings size={s} />, shortcut: "⌘," },
];

/* ------------------------------------------------------------------ */

function NavItem({
  item,
  activeId,
  onSelect,
  level = 0,
}: {
  item: NavItemData;
  activeId: string;
  onSelect: (id: string) => void;
  level?: number;
}) {
  const [open, setOpen] = useState(false);
  const isActive = activeId === item.id;
  const hasChildren = !!item.children?.length;

  return (
    <div className="flex w-full flex-col">
      <button
        type="button"
        aria-expanded={hasChildren ? open : undefined}
        aria-current={isActive ? "page" : undefined}
        onClick={() => (hasChildren ? setOpen((o) => !o) : onSelect(item.id))}
        style={{ paddingLeft: level * 12 + 10 }}
        className={cx(
          "group/nav flex w-full items-center justify-between gap-2 rounded-full py-1.5 pr-2.5 text-left transition-colors duration-150",
          isActive
            ? "bg-ink text-canvas"
            : "text-ink-2 hover:bg-elev hover:text-ink",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {/* the leading dot is the active marker; it holds the row's left
              edge steady so nothing shifts when the state changes */}
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
                isActive ? "text-canvas" : "text-ink-3 group-hover/nav:text-ink-2",
              )}
            >
              {item.icon}
            </span>
          )}
          <span className="truncate text-[13px] font-medium">{item.title}</span>
        </span>

        <span className="flex shrink-0 items-center gap-1.5">
          {item.shortcut && !isActive && (
            <Kbd className="hidden group-hover/nav:inline-flex">{item.shortcut}</Kbd>
          )}
          {item.badge !== undefined && (
            <span
              className={cx(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10.5px] font-semibold",
                isActive
                  ? "bg-canvas/20 text-canvas"
                  : "bg-brand-soft text-brand-ink",
              )}
            >
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <IChevronRight
              size={13}
              className={cx(
                "text-ink-3 transition-transform duration-200",
                open && "rotate-90",
              )}
            />
          )}
        </span>
      </button>

      {hasChildren && (
        /* 0fr → 1fr is the only way to animate to a height you cannot know */
        <div
          className={cx(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="relative mt-0.5 flex min-h-0 flex-col gap-0.5 overflow-hidden">
            <span
              aria-hidden
              className="absolute top-0 bottom-0 border-l border-line"
              style={{ left: level * 12 + 17 }}
            />
            {item.children!.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                activeId={activeId}
                onSelect={onSelect}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function WorkspaceSwitcher({
  workspaces = ["Acme Corp", "Personal workspace", "Client sandbox"],
  selected,
  plan = "Pro plan",
  onSelect,
}: {
  workspaces?: string[];
  selected?: string;
  plan?: ReactNode;
  onSelect?: (ws: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(workspaces[0]);
  const current = selected ?? internal;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const choose = (ws: string) => {
    (onSelect ?? setInternal)(ws);
    setOpen(false);
    triggerRef.current?.focus();
  };

  /* A menu that can only be dismissed by clicking somewhere else is a trap
     for anyone not using a mouse. Escape closes it and hands focus back. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Arrow keys walk the options; the browser only does this for a real
     <select>, and this is a listbox made of buttons. */
  const onListKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [],
    );
    if (!items.length) return;
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        e.key === "ArrowDown"
          ? items[(i + 1 + items.length) % items.length]
          : items[(i - 1 + items.length) % items.length];
      next?.focus();
    }
    if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    }
    if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="group/ws flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-elev"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <Avatar name={current} size="sm" />
          <span className="flex min-w-0 flex-col text-left">
            <span className="truncate text-[13px] font-semibold text-ink">
              {current}
            </span>
            <span className="text-[11px] text-ink-3">{plan}</span>
          </span>
        </span>
        <IChevronDown size={14} className="shrink-0 text-ink-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            ref={listRef}
            role="listbox"
            onKeyDown={onListKeyDown}
            className="absolute top-full left-0 z-50 mt-1 flex w-full flex-col gap-0.5 rounded-xl border border-line bg-surface p-1.5"
          >
            {workspaces.map((ws) => (
              <button
                key={ws}
                type="button"
                role="option"
                aria-selected={ws === current}
                autoFocus={ws === current}
                onClick={() => choose(ws)}
                className={cx(
                  "rounded-lg px-3 py-1.5 text-left text-[13px] transition-colors",
                  ws === current
                    ? "bg-brand-soft font-medium text-brand-ink"
                    : "text-ink-2 hover:bg-elev hover:text-ink",
                )}
              >
                {ws}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export type SidebarNavProps = {
  groups?: NavGroupData[];
  /** pinned below the scroll area, above a divider */
  footerItems?: NavItemData[];
  activeId?: string;
  onSelect?: (id: string) => void;
  workspaces?: string[];
  activeWorkspace?: string;
  onWorkspaceSelect?: (ws: string) => void;
  className?: string;
};

export function SidebarNav({
  groups = DEMO_GROUPS,
  footerItems = DEMO_FOOTER,
  activeId,
  onSelect,
  workspaces,
  activeWorkspace,
  onWorkspaceSelect,
  className,
}: SidebarNavProps) {
  const [internal, setInternal] = useState("home");
  const current = activeId ?? internal;
  const select = onSelect ?? setInternal;

  return (
    <div
      className={cx(
        "flex h-full w-65 flex-col border-r border-line bg-surface p-3",
        className,
      )}
    >
      <WorkspaceSwitcher
        workspaces={workspaces}
        selected={activeWorkspace}
        onSelect={onWorkspaceSelect}
      />

      <div className="scroll-thin mt-3 flex flex-1 flex-col gap-5 overflow-y-auto">
        {groups.map((group, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="microlabel mb-1.5 px-2.5">{group.heading}</span>
            )}
            {group.items.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                activeId={current}
                onSelect={select}
              />
            ))}
          </div>
        ))}
      </div>

      {footerItems.length > 0 && (
        <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3">
          {footerItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              activeId={current}
              onSelect={select}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function flatten(items: NavItemData[]): NavItemData[] {
  return items.flatMap((i) => [i, ...(i.children ? flatten(i.children) : [])]);
}

export type DashboardShellProps = SidebarNavProps & {
  /** the workspace area to the right of the sidebar */
  children?: ReactNode;
  /** intercepts the item with this id and opens the search overlay instead */
  searchId?: string;
  className?: string;
};

/** Sidebar, collapsible rail, top bar and a ⌘K overlay, framed as one app. */
export function DashboardShell({
  children,
  searchId = "search",
  className,
  ...nav
}: DashboardShellProps) {
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState("home");
  const [workspace, setWorkspace] = useState("Acme Corp");
  const [searching, setSearching] = useState(false);

  const all = flatten((nav.groups ?? DEMO_GROUPS).flatMap((g) => g.items)).concat(
    nav.footerItems ?? DEMO_FOOTER,
  );
  const active = all.find((i) => i.id === activeId);

  const select = (id: string) => {
    if (id === searchId) return setSearching(true);
    setActiveId(id);
  };

  return (
    <div
      className={cx(
        "relative flex h-175 overflow-hidden rounded-2xl border border-line bg-surface",
        className,
      )}
    >
      <div
        className={cx(
          "h-full shrink-0 overflow-hidden transition-all duration-300 ease-out",
          open ? "w-65" : "w-0",
        )}
      >
        <SidebarNav
          {...nav}
          className="w-65"
          activeId={activeId}
          onSelect={select}
          activeWorkspace={workspace}
          onWorkspaceSelect={setWorkspace}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-canvas">
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface px-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
              onClick={() => setOpen((o) => !o)}
              className="flex size-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-elev hover:text-ink"
            >
              <IMenu size={17} />
            </button>
            <div className="flex min-w-0 items-center gap-2 text-[13px] text-ink-3">
              <span className="truncate">{workspace}</span>
              <span>/</span>
              <span className="truncate font-medium text-ink">
                {active?.title ?? "Dashboard"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSearching(true)}
            className="flex h-8 items-center gap-2 rounded-lg border border-line bg-canvas px-3 text-[12.5px] text-ink-3 transition-colors hover:text-ink-2"
          >
            <ISearch size={13} />
            <span className="hidden sm:inline">Search</span>
            <Kbd>⌘K</Kbd>
          </button>
        </div>

        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto p-6">
          {children ?? <PlaceholderContent />}
        </div>
      </div>

      {searching && (
        <div className="absolute inset-0 z-50 flex items-start justify-center bg-canvas/50 px-4 pt-[14%] backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setSearching(false)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <ISearch size={16} className="shrink-0 text-ink-3" />
              <input
                autoFocus
                placeholder="Search projects, docs, or actions…"
                aria-label="Search"
                className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-ink-3"
              />
              <button
                type="button"
                onClick={() => setSearching(false)}
                aria-label="Close search"
                className="flex size-7 items-center justify-center rounded-lg text-ink-3 hover:bg-elev hover:text-ink"
              >
                <IX size={15} />
              </button>
            </div>
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <ICommand size={22} className="text-ink-3/60" />
              <p className="text-[13px] font-medium text-ink-2">
                Type a command or search…
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlaceholderContent() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-8 w-48 rounded-lg bg-ink/5 dark:bg-white/6" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 rounded-2xl border border-line bg-surface" />
        <div className="h-32 rounded-2xl border border-line bg-surface" />
      </div>
      <div className="rounded-2xl border border-line bg-surface p-6">
        <div className="h-5 w-1/3 rounded-md bg-ink/5 dark:bg-white/6" />
        <div className="my-5 h-px bg-line" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-11 rounded-xl bg-ink/4 dark:bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
