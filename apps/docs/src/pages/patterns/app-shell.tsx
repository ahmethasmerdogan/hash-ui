import { useState, useEffect } from "react";
import { Section, Demo } from "@/components/Section";
import {
  Avatar,
  Card,
  CountBadge,
  SearchField,
  StatusPill,
  Switch,
  UnderlineTabs,
  cx,
  useTheme,
  IBell,
  IBox,
  IChevronDown,
  IClock,
  IGrid,
  IHash,
  IPulse,
  ISettings,
  ISliders,
  ITimer,
  IUsers,
  IWarning,
  IZap,
} from "uicean";

/* ------------------------------------------------------------------ */
/* APP SHELL                                                           */
/* ------------------------------------------------------------------ */

function TopStatusBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 20_000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-line bg-surface py-2 pr-2 pl-3 shadow-float">
      <span className="flex size-9 items-center justify-center rounded-[11px] bg-[#111113] text-white">
        <IHash size={16} />
      </span>
      <span className="leading-tight">
        <span className="block text-[12px] font-bold text-ink">
          {now.toLocaleDateString("en-US", { weekday: "long" })}
        </span>
        <span className="block text-[10.5px] text-ink-3">
          {now.toLocaleDateString("en-US", { day: "numeric", month: "long" })}
        </span>
      </span>
      <span className="text-[26px] font-bold tracking-tight text-ink tabular-nums">
        {time}
      </span>
      <span className="mx-1 h-6 w-px rotate-12 bg-line-strong" />
      <span className="flex items-center gap-2 rounded-full bg-elev px-3 py-1.5 text-[13px] font-medium text-ink">
        <span className="size-2 rounded-full bg-emerald-500" />
        John Kevin
      </span>
      <span className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          className="h-9 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 px-4 text-[13px] font-semibold text-white shadow-btn"
        >
          Rest
        </button>
        <button
          type="button"
          className="h-9 rounded-full bg-[#111113] px-4 text-[13px] font-semibold text-white shadow-btn"
        >
          Productivity
        </button>
      </span>
    </div>
  );
}

function SidebarDemo() {
  const [logicOpen, setLogicOpen] = useState(true);
  const item = (
    icon: React.ReactNode,
    label: string,
    opts?: { active?: boolean; badge?: string; sub?: boolean },
  ) => (
    <button
      type="button"
      key={label}
      className={cx(
        "flex w-full items-center gap-2.5 rounded-[10px] px-3 text-[13.5px] transition-colors",
        opts?.sub ? "h-8.5" : "h-9.5",
        opts?.active
          ? "bg-gradient-to-b from-orange-400 to-orange-600 font-semibold text-white shadow-btn"
          : "font-medium text-ink-2 hover:bg-inset hover:text-ink",
      )}
    >
      <span className={cx("[&>svg]:size-4", opts?.active ? "text-white" : "text-ink-3")}>
        {icon}
      </span>
      {label}
      {opts?.badge && (
        <span className="ml-auto">
          <CountBadge tone="red">{opts.badge}</CountBadge>
        </span>
      )}
    </button>
  );

  return (
    <Card floating className="w-72 rounded-[20px] p-3.5">
      <div className="flex items-center gap-2.5 px-1.5 pb-3">
        <span className="flex size-8.5 items-center justify-center rounded-[10px] bg-gradient-to-b from-orange-400 to-orange-600 text-[15px] font-black text-white shadow-btn">
          A
        </span>
        <span className="text-[15px] font-bold text-ink">Acme</span>
        <span className="ml-auto text-ink-3">
          <ISliders size={15} />
        </span>
      </div>
      <SearchField kbd="⌘ K" className="mb-3" />
      <div className="flex flex-col gap-0.5">
        {item(<IPulse />, "Activity stream", { active: true })}
        {item(<IZap />, "Live operations")}
        {item(<IUsers />, "Participants")}
        <button
          type="button"
          onClick={() => setLogicOpen(!logicOpen)}
          className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13.5px] font-medium text-ink-2 transition-colors hover:bg-inset hover:text-ink"
        >
          <IGrid className="size-4 text-ink-3" />
          System logic
          <IChevronDown
            size={14}
            className={cx(
              "ml-auto text-ink-3 transition-transform",
              !logicOpen && "-rotate-90",
            )}
          />
        </button>
        {logicOpen && (
          <div className="ml-4.5 flex flex-col gap-0.5 border-l border-line pl-2">
            {item(<ISettings />, "Rules engine", { sub: true })}
            {item(<IZap />, "Triggers", { sub: true })}
            {item(<ITimer />, "Schedules", { sub: true })}
          </div>
        )}
        {item(<IRowsIcon />, "Action queue")}
        {item(<ITrendIcon />, "Insights")}
      </div>
      <div className="microlabel flex items-center justify-between px-2 pt-5 pb-2">
        PINNED MONITORS <IChevronDown size={12} />
      </div>
      <div className="flex flex-col gap-0.5">
        {item(<IWarning />, "SLA breaches", { badge: "1" })}
        {item(<IUsers />, "Escalated requests")}
        {item(<IGrid />, "High load zones")}
      </div>
      <div className="mt-4 flex items-center gap-2.5 border-t border-line px-1.5 pt-3.5">
        <Avatar name="Stephen S." size="sm" />
        <span className="min-w-0 leading-tight">
          <span className="block text-[13px] font-semibold text-ink">
            Stephen S.
          </span>
          <span className="block truncate text-[11px] text-ink-3">
            stephen@srotimi.design
          </span>
        </span>
        <IBell size={15} className="ml-auto text-ink-3" />
      </div>
    </Card>
  );
}

function IPlusSmall() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IDotsSmall() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

function IRowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h13M4 12h16M4 17h10" />
    </svg>
  );
}
function ITrendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="m7.5 14 3-3.5 2.5 2 3.5-4" />
    </svg>
  );
}

function KanbanPeek() {
  return (
    <div className="w-80">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md border border-line bg-surface text-ink-2">
          <IBox size={13} />
        </span>
        <span className="text-[13.5px] font-bold text-ink">Detected</span>
        <span className="text-[12px] font-semibold text-ink-3">12</span>
        <span className="ml-auto flex items-center gap-2.5 text-ink-3">
          <IPlusSmall />
          <IDotsSmall />
        </span>
      </div>
      <Card className="rounded-2xl p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8.5 items-center justify-center rounded-[9px] bg-gradient-to-b from-emerald-400 to-teal-600 text-white shadow-btn">
            <IZap size={15} />
          </span>
          <div className="leading-tight">
            <div className="text-[13.5px] font-bold text-ink">
              API Rate Limiting
            </div>
            <div className="text-[11.5px] text-ink-3">#OPS-131</div>
          </div>
          <Avatar name="Rita M" size="sm" className="ml-auto" />
        </div>
        <div className="mt-3 space-y-0.5 border-t border-line pt-2">
          {[
            ["Origin", "Third-party integr."],
            ["Priority", "Minor"],
            ["Handler", "Integration team"],
          ].map(([l, v]) => (
            <div key={l} className="flex items-center gap-3 py-1 text-[12.5px]">
              <span className="w-16 text-ink-3">{l}</span>
              <span className="font-medium text-ink">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <StatusPill tone="amber" size="sm" icon={<IClock size={11} />}>
            Time-Sensitive
          </StatusPill>
          <StatusPill tone="violet" size="sm" icon={<IZap size={11} />}>
            Platform
          </StatusPill>
        </div>
      </Card>
    </div>
  );
}

/* Account dropdown — Ornek2 / Ornek3 (AlignUI) */
function AccountMenu() {
  const { resolved, setMode } = useTheme();
  const item = (icon: React.ReactNode, label: string, opts?: { selected?: boolean; chevron?: boolean }) => (
    <button
      key={label}
      type="button"
      className={cx(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors",
        opts?.selected ? "bg-inset text-ink" : "text-ink-2 hover:bg-inset hover:text-ink",
      )}
    >
      <span className="text-ink-3 [&>svg]:size-[17px]">{icon}</span>
      {label}
      {opts?.chevron && (
        <IChevronDown size={14} className="ml-auto -rotate-90 text-ink-3" />
      )}
    </button>
  );
  return (
    <Card floating className="w-80 rounded-[20px] p-2.5">
      <div className="flex items-center gap-3 px-2 py-2">
        <Avatar name="James Brown" size="lg" />
        <div className="min-w-0 leading-tight">
          <div className="text-[14.5px] font-semibold text-ink">James Brown</div>
          <div className="truncate text-[12.5px] text-ink-3">
            james@alignui.com
          </div>
        </div>
        <span className="ml-auto rounded-md bg-red-500/10 px-2 py-1 text-[11px] font-bold text-red-500">
          PRO
        </span>
      </div>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <IMoonIcon />
        <span className="text-[14px] font-medium text-ink-2">Dark Mode</span>
        <span className="ml-auto">
          <Switch
            checked={resolved === "dark"}
            onChange={(v) => setMode(v ? "dark" : "light")}
            size="sm"
            label="Dark mode"
          />
        </span>
      </div>
      <div className="mx-2 my-1.5 border-t border-dashed border-line-strong" />
      {item(<IPulse />, "Activity")}
      {item(<IGrid />, "Integrations", { selected: true, chevron: true })}
      {item(<ISettings />, "Settings")}
      <div className="mx-2 my-1.5 border-t border-dashed border-line-strong" />
      {item(<IPlusIcon />, "Add Account")}
      {item(<ILogoutIcon />, "Logout")}
      <div className="px-3 pt-2 pb-1.5 text-[12px] text-ink-3">
        v.1.5.69 · Terms &amp; Conditions
      </div>
    </Card>
  );
}

function IMoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ink-3">
      <path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5Z" />
    </svg>
  );
}
function IPlusIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function ILogoutIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15 8l4 4-4 4M19 12H9" />
    </svg>
  );
}

/* Calendar meeting cards — Ornek4 */
function MeetingCards() {
  const cards = [
    {
      title: "Weekly Team Meeting",
      time: "3:00 PM - 4:30 PM",
      tone: "green" as const,
      left: "Today",
      right: "Join Meeting",
    },
    {
      title: "Product Launch Event",
      time: "3:00 PM - 4:30 PM",
      tone: "orange" as const,
      left: "2 Conflicted",
      right: "See Conflict",
    },
    {
      title: "Team Building Workshop",
      time: "9:00 AM - 12:00 PM",
      tone: "red" as const,
      left: "Cancelled",
      right: null,
    },
  ];
  const tones = {
    green: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    orange: "bg-orange-500/12 text-orange-600 dark:text-orange-300",
    red: "bg-red-500/12 text-red-500 dark:text-red-300",
  };
  const dots = {
    green: "bg-emerald-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <UnderlineTabs
        accent="#7c5cfc"
        items={[
          { id: "all", label: "All Scheduled", icon: <IGrid /> },
          { id: "meetings", label: "Meetings (8)", icon: <IUsers /> },
          { id: "events", label: "Events (4)", icon: <ITimer /> },
          { id: "conflicted", label: "Conflicted (2)", icon: <IWarning /> },
        ]}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.slice(0, 2).map((c) => (
          <Card key={c.title} className="rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="leading-tight">
                <div className="text-[14.5px] font-bold text-ink">{c.title}</div>
                <div className="mt-1 text-[12.5px] text-ink-2">{c.time}</div>
              </div>
              <span className="flex size-7 items-center justify-center rounded-full border border-line text-ink-3">
                <IChevronDown size={13} />
              </span>
            </div>
            <div
              className={cx(
                "mt-3.5 flex items-center justify-between rounded-lg px-3 py-2 text-[12.5px] font-semibold",
                tones[c.tone],
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className={cx("size-2 rounded-full", dots[c.tone])} />
                {c.left}
              </span>
              {c.right && (
                <span className="underline underline-offset-2">{c.right}</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AppShellSection() {
  return (
    <Section
      id="appshell"
      eyebrow="Patterns"
      title="App shell"
      desc="The productivity status bar with a live clock, the ops sidebar with its gradient active state, and a kanban column peek — assembled entirely from UICean primitives."
    >
      <Demo label="Top status bar" refName="top-alert-0001" contentClassName="py-10">
        <TopStatusBar />
      </Demo>
      <Demo label="Sidebar & board column" refName="menu-design-001" contentClassName="items-start py-10">
        <SidebarDemo />
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex h-8.5 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-[12.5px] font-semibold text-ink shadow-soft"
            >
              Filter
              <span className="rounded-full bg-ink/8 px-1.5 text-[10.5px] font-bold dark:bg-white/10">
                0
              </span>
            </button>
            {["Assigned unit", "Service type", "Resolution window"].map((f) => (
              <button
                key={f}
                type="button"
                className="flex h-8.5 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-[12.5px] font-medium text-ink-2 shadow-soft transition-colors hover:text-ink"
              >
                {f}
                <IChevronDown size={12} className="text-ink-3" />
              </button>
            ))}
          </div>
          <KanbanPeek />
        </div>
      </Demo>
      <Demo label="Account menu" refName="Ornek2 · Ornek3" contentClassName="py-10">
        <AccountMenu />
      </Demo>
      <Demo label="Calendar tabs & meeting cards" refName="Ornek4" contentClassName="py-10">
        <MeetingCards />
      </Demo>
    </Section>
  );
}
