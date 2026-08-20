import { useState } from "react";
import { Section, Demo } from "@/components/Section";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  InsetPanel,
  MetaRow,
  OutlineBadge,
  SegmentedControl,
  SignalBars,
  StatTile,
  StatusPill,
  Switch,
  TickBars,
  cx,
  IArrowRight,
  IBox,
  ICalendar,
  ICheck,
  ICheckCircleFill,
  IChevronRight,
  IClock,
  IDatabase,
  IFlag,
  IGrip,
  IPlus,
  IPulse,
  ISettings,
  ITrendUp,
  IZap,
} from "hash-ui";

function TrackStep({
  label,
  time,
  state,
  first,
}: {
  label: string;
  time: string;
  state: "done" | "todo";
  first?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      {/* connector + node share one row so every node sits on the same baseline */}
      <div className="flex h-4 items-center">
        <span
          className={cx(
            "h-px",
            first ? "w-4 shrink-0" : "flex-1",
            state === "done" ? "bg-emerald-600/60" : "bg-line-strong",
          )}
        />
        {state === "done" ? (
          <ICheckCircleFill size={16} className="shrink-0 text-emerald-600" />
        ) : (
          <span className="size-4 shrink-0 rounded-full border-2 border-line-strong bg-surface" />
        )}
      </div>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-[12.5px] font-semibold text-ink">
          {label}
        </div>
        <div className="truncate text-[11px] text-ink-3">{time}</div>
      </div>
    </div>
  );
}

function OrderTrackingCard() {
  return (
    <Card floating className="w-full max-w-125 rounded-[22px] p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] border border-line bg-elev text-emerald-700 dark:text-emerald-300">
          <IBox size={17} />
        </span>
        <span className="shrink-0 text-[16px] font-bold whitespace-nowrap text-ink">
          Order ID1234
        </span>
        <StatusPill tone="green" size="sm" className="min-w-0 shrink truncate">
          Order In Transit
        </StatusPill>
        <span className="ml-auto flex shrink-0 items-center gap-1.5">
          <Button variant="green" size="sm">
            Ready to ship
          </Button>
          <Button
            variant="green"
            size="sm"
            className="!w-8 !px-0"
            aria-label="Next"
          >
            <IChevronRight size={15} />
          </Button>
        </span>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <div>
          <div className="text-[15px] font-bold text-ink">Order Tracking</div>
          <div className="mt-0.5 text-[13px] font-medium text-ink-2">
            Product in Transit
          </div>
        </div>
        <div className="text-xs text-ink-3">
          EST: <span className="font-semibold text-ink">3 days</span>
        </div>
      </div>

      <InsetPanel className="mt-3 px-4 py-4">
        <div className="flex gap-2">
          <TrackStep first label="Packaged" time="Mar 8, 12:04pm" state="done" />
          <TrackStep label="Sent out" time="Mar 8, 12:24pm" state="done" />
          <TrackStep label="In Transit" time="Waiting..." state="todo" />
          <TrackStep label="Delivered" time="Waiting..." state="todo" />
        </div>
      </InsetPanel>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {[
          ["Order Date", "Sept 24, 2023"],
          ["Delivery Date", "Sept 24, 2023"],
          ["Courier", "DHL Courier"],
          ["Address", "No 4, Good…"],
        ].map(([l, v]) => (
          <div key={l} className="leading-tight">
            <div className="text-[11px] text-ink-3">{l}</div>
            <div className="mt-1 truncate text-[12.5px] font-semibold text-ink">
              {v}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-[15px] font-bold text-ink">Order Summary</div>
      <InsetPanel className="mt-2.5 px-4 py-1.5">
        {[
          ["Sub total", "$400"],
          ["Discount", "$0"],
          ["Shipping", "$100.56"],
        ].map(([l, v]) => (
          <div
            key={l}
            className="flex items-center justify-between py-2 text-[13.5px]"
          >
            <span className="text-ink-2">{l}</span>
            <span className="font-semibold text-ink tabular-nums">{v}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-line py-2.5 text-[14px]">
          <span className="font-medium text-ink-2">Total Amount</span>
          <span className="font-bold text-ink tabular-nums">$500.56</span>
        </div>
      </InsetPanel>

      <div className="mt-5 flex items-center gap-3.5">
        <span className="flex size-11 items-center justify-center rounded-lg bg-gradient-to-b from-orange-300 to-orange-600 text-lg">
          🛋️
        </span>
        <div className="leading-tight">
          <div className="text-[13.5px] font-semibold text-ink">
            Brown Italy Leather Couch
          </div>
        </div>
        <div className="ml-auto text-right leading-tight">
          <div className="text-[14px] font-bold text-ink tabular-nums">
            $400.00
          </div>
          <div className="text-[11px] text-ink-3">Qty: 12</div>
        </div>
      </div>

      <Button
        variant="white"
        shape="rect"
        className="mt-4 w-full"
        iconRight={<IArrowRight size={15} />}
      >
        View details
      </Button>
    </Card>
  );
}

function ScheduleCard() {
  const [range, setRange] = useState("1M");
  return (
    <Card floating className="w-full max-w-125 rounded-[22px] p-5">
      <div className="flex items-center justify-between px-1 pb-4">
        <span className="text-[15px] font-semibold tracking-[0.12em] text-ink">
          HISTORY WORK
        </span>
        <SegmentedControl
          size="sm"
          value={range}
          onChange={setRange}
          options={[
            { value: "1D", label: "1D" },
            { value: "7D", label: "7D" },
            { value: "1M", label: "1M" },
          ]}
        />
      </div>

      <div className="rounded-2xl border border-line bg-surface p-3 shadow-soft">
        <div className="flex items-center justify-between px-1.5 pb-3">
          <span className="microlabel !text-[11px]">SCHEDULE</span>
          <Button variant="outline" size="sm" iconLeft={<IPlus size={13} />}>
            ADD
          </Button>
        </div>

        {/* expanded row */}
        <div className="rounded-xl border border-line shadow-soft">
          <div className="flex items-center gap-3 px-3.5 py-3">
            <Checkbox checked label="Task complete" />
            <span className="text-[13.5px] font-semibold whitespace-nowrap text-ink tabular-nums">
              08.00 – 10.00
            </span>
            <span className="mx-3 min-w-0 flex-1 truncate rounded-lg border border-line bg-elev px-4 py-1.5 text-center text-[12.5px] text-ink-2">
              Meeting Project
            </span>
            <IGrip size={15} className="shrink-0 text-ink-3" />
          </div>
          <div className="mx-3.5 mb-3.5 rounded-xl bg-elev px-3.5 py-3.5">
            <div className="flex flex-nowrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[15px] font-bold tracking-wide text-ink">
                  OFFICE
                </div>
                <div className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
                  437 medical Street
                  <br />
                  Anantari, lk 746389,
                  <br />
                  Indonesia
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 pt-0.5">
                {[
                  { done: 2, label: "Task A" },
                  { done: 5, label: "Task B" },
                  { done: 0, label: "Task C" },
                ].map((t) => (
                  <span
                    key={t.label}
                    className="flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <TickBars total={6} filled={t.done} size="sm" />
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      {t.done}/6
                    </span>
                    <span className="text-[11.5px] text-ink-2">· {t.label}</span>
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2.5">
                <OutlineBadge tone="green">Priority</OutlineBadge>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Switch size="sm" label="Enable" />
                  <span className="text-[12px] text-ink-2">Remind</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* collapsed rows */}
        {[
          ["10.00 – 11.00", "workshops", 1],
          ["13.00 – 14.00", "Client Discussions", 1],
          ["14.00 – 15.00", "Team sync-ups", 0.55],
          ["15.00 – 16.00", "project updates", 0.3],
        ].map(([time, label, op]) => (
          <div
            key={time as string}
            className="mt-2 flex items-center gap-3 rounded-xl border border-line px-3.5 py-3"
            style={{ opacity: op as number }}
          >
            <Checkbox label="Select item" />
            <span className="text-[13.5px] font-semibold whitespace-nowrap text-ink tabular-nums">
              {time}
            </span>
            <span className="mx-3 min-w-0 flex-1 truncate rounded-lg border border-line bg-elev px-4 py-1.5 text-center text-[12.5px] text-ink-2">
              {label}
            </span>
            <IGrip size={15} className="shrink-0 text-ink-3" />
          </div>
        ))}
      </div>

      <div className="-mt-3.5 flex justify-center">
        <Button variant="outline" size="sm" className="!rounded-full shadow-card">
          SEE ALL SCHEDULE
        </Button>
      </div>
    </Card>
  );
}

function IncidentCard() {
  return (
    <Card className="w-full max-w-105 rounded-[18px]">
      <div className="flex items-center gap-3 rounded-t-[18px] bg-elev px-4 py-3.5">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-gradient-to-b from-rose-400 to-red-600 text-white shadow-btn">
          <IZap size={16} />
        </span>
        <div className="leading-tight">
          <div className="text-[14.5px] font-bold text-ink">
            Service Flow Interruption
          </div>
          <div className="text-[12px] text-ink-3">#OPS-129</div>
        </div>
        <Avatar name="Sasha Green" size="sm" className="ml-auto" />
      </div>
      <div className="px-4 py-2">
        <MetaRow icon={<IFlag size={14} />} label="Origin" value="Customer Mobile App" />
        <MetaRow
          icon={<SignalBars level={4} tone="red" />}
          label="Priority"
          value="High Impact"
        />
        <MetaRow icon={<ISettings size={14} />} label="Handler" value="Platform operations" />
        <MetaRow icon={<IPulse size={14} />} label="Process" value="Incident resolution" />
        <MetaRow icon={<ICalendar size={14} />} label="Date" value="Jan 24, 2026" />
      </div>
      <div className="flex items-center gap-2 border-t border-line px-4 py-3">
        <StatusPill tone="amber" size="sm" icon={<IClock size={11} />}>
          Time-Sensitive
        </StatusPill>
        <StatusPill tone="violet" size="sm" icon={<IZap size={11} />}>
          Platform
        </StatusPill>
        <StatusPill tone="red" size="sm" dot>
          Live
        </StatusPill>
        <span className="ml-auto text-[11.5px] text-ink-3">3 · 22hr ago</span>
      </div>
    </Card>
  );
}

function IntentTile() {
  return (
    <Card className="w-64 rounded-2xl p-4">
      <span className="flex size-8 items-center justify-center rounded-lg border border-line bg-elev text-ink-2">
        <ICalendar size={15} />
      </span>
      <div className="mt-3 text-[13px] text-ink-2">Buying intent</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[20px] font-bold text-ink">High</div>
          <div className="text-[11.5px] text-ink-3">last 7 days</div>
        </div>
        <svg width="96" height="40" viewBox="0 0 96 40" fill="none">
          <path
            d="M2 34 C14 32, 18 28, 26 27 S 44 30, 52 24 66 12, 78 10 90 6, 94 4"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M2 34 C14 32, 18 28, 26 27 S 44 30, 52 24 66 12, 78 10 90 6, 94 4 L94 40 L2 40 Z"
            fill="url(#intent-g)"
          />
          <defs>
            <linearGradient id="intent-g" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#3b82f6" stopOpacity="0.18" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Card>
  );
}

function CustomerHeaderCard({ variant }: { variant: "dark" | "tint" }) {
  const dark = variant === "dark";
  return (
    <Card floating className="relative w-full max-w-115 overflow-hidden rounded-[18px]">
      <span className="absolute top-4 bottom-4 left-0 z-10 w-[3.5px] rounded-r-full bg-emerald-500" />
      <div
        className={cx(
          "flex items-center gap-4 px-5 py-4.5",
          dark ? "bg-[#12372a]" : "bg-emerald-500/12",
        )}
      >
        <span
          className={cx(
            "flex size-12 items-center justify-center rounded-full text-[15px] font-bold",
            dark ? "bg-white text-[#12372a]" : "bg-[#12372a] text-white",
          )}
        >
          RH
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className={cx(
                "text-[19px] font-bold tracking-tight whitespace-nowrap",
                dark ? "text-white" : "text-ink",
              )}
            >
              Richard Hendricks
            </span>
            <span className="flex h-6 items-center gap-1 rounded-md bg-emerald-500 px-2 text-[11.5px] font-semibold text-white shadow-btn">
              <ICheck size={11} strokeWidth={3} /> Active
            </span>
          </div>
          <div
            className={cx(
              "mt-1 flex items-center gap-2 font-mono text-[12.5px]",
              dark ? "text-emerald-100/70" : "text-ink-2",
            )}
          >
            {!dark && (
              <>
                <span className="truncate">richard@piedpiper.com</span>
                <span className="opacity-40">|</span>
              </>
            )}
            <span className={cx("rounded-[4px] border px-1 text-[9px] font-bold", dark ? "border-white/30" : "border-line-strong")}>
              ID
            </span>
            <span className="truncate">cus_PKughP00Km6IjD</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 opacity-70">
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V6a2 2 0 0 1 2-2h9" />
            </svg>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-5 py-4.5">
        {[
          ["Language", "🇺🇸 English (US)"],
          ["Account Details", "richard@piedpiper.com"],
          ["Next Invoice", "10A5438B-0001"],
          ["Tax Location Status", "Unrecognized Location"],
        ].map(([l, v]) => (
          <div key={l} className="min-w-0 leading-tight">
            <div className="text-[12.5px] text-ink-3">{l}</div>
            <div className="mt-1 truncate text-[14px] font-medium text-ink">
              {v}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function CardsSection() {
  return (
    <Section
      id="cards"
      registry="card"
      source="Card.tsx"
      eyebrow="Components"
      title="Card"
      desc="Nested card-in-card layering: white shells, gray inset panels, hairline internals. Recreations of the order tracker, the schedule agenda and the ops incident card."
    >
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <Demo label="Order tracking" refName="button-0002" contentClassName="py-10 !px-4">
          <OrderTrackingCard />
        </Demo>
        <Demo label="Agenda with task meters" refName="card-design-0001" contentClassName="py-10 !px-4">
          <ScheduleCard />
        </Demo>
      </div>

      <Demo label="Customer header card" refName="ui-design-1" contentClassName="py-10">
        <div className="flex flex-wrap items-start justify-center gap-6">
          <CustomerHeaderCard variant="dark" />
          <CustomerHeaderCard variant="tint" />
        </div>
      </Demo>

      <Demo label="Incident card & stat tiles" refName="menu-design-001 · ai-chat-0001">
        <div className="flex flex-wrap items-start justify-center gap-6">
          <IncidentCard />
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <StatTile icon={<IDatabase size={15} />} value="Series A" label="funding" />
              <StatTile icon={<IClock size={15} />} value="2021" label="Founded" />
              <StatTile
                icon={<ITrendUp size={15} />}
                value="$2.5M"
                label="est ARR"
                mono
              />
            </div>
            <IntentTile />
          </div>
        </div>
      </Demo>
    </Section>
  );
}
