import { useState, type ReactNode } from "react";
import { Section, Demo } from "@/components/Section";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  CountBadge,
  EntityChip,
  SignalBars,
  SplitButton,
  StatusPill,
  Switch,
  cx,
  IBriefcase,
  IBuilding,
  ICalendarSm,
  ICaretDown,
  ICaretRight,
  ICheck,
  IDatabase,
  IDots,
  IEye,
  IFilter,
  IGrip,
  IMail,
  IPencil,
  IPlus,
  ISort,
  IStar,
  IUpload,
  IUserCircle,
  IX,
} from "uicean";

/* ------------------------------------------------------------------ */
/* CHANGE-TRACKING GRID — ui-design-4                                   */
/* Full cell borders, department dot-pills, corner change flags,        */
/* hatched revision rows with struck-through previous values.           */
/* ------------------------------------------------------------------ */

type DeptTone = "green" | "orange" | "red" | "blue" | "gray";

const DEPT_DOT: Record<DeptTone, string> = {
  green: "bg-emerald-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  gray: "bg-stone-500",
};

/* small triangle tucked into a cell corner — "this value changed" */
function ChangeFlag({ tone = "amber" }: { tone?: "amber" | "red" }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-0 right-0"
      style={{
        width: 0,
        height: 0,
        borderTop: `7px solid ${tone === "amber" ? "#f5b544" : "#ef4444"}`,
        borderLeft: "7px solid transparent",
      }}
    />
  );
}

function DeptCell({
  name,
  tone,
  dim,
  strike,
}: {
  name: string;
  tone: DeptTone;
  dim?: boolean;
  strike?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-7 items-center gap-2 rounded-full border border-line bg-surface px-3 text-[12.5px] font-medium whitespace-nowrap text-ink",
        dim && "opacity-50",
      )}
    >
      <span className={cx("size-2 shrink-0 rounded-full", DEPT_DOT[tone])} />
      <span className={cx(strike && "line-through")}>{name}</span>
    </span>
  );
}

function EmploymentCell({
  state,
  dim,
}: {
  state: "active" | "inactive";
  dim?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-semibold whitespace-nowrap",
        state === "active"
          ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
          : "bg-red-500/10 text-red-500",
        dim && "opacity-50",
      )}
    >
      {state === "active" ? (
        <ICheck size={12} strokeWidth={3} />
      ) : (
        <IX size={12} strokeWidth={3} />
      )}
      {state === "active" ? "Active" : "Inactive"}
    </span>
  );
}

type EmpRow = {
  id: string;
  dept: string;
  deptTone: DeptTone;
  email: string;
  employment?: "active" | "inactive";
  first?: string;
  hire?: string;
  kind: "row" | "parent" | "revision";
  flags?: Array<"id" | "dept" | "email" | "employment" | "first" | "hire">;
  flagTone?: "amber" | "red";
  strikeEmail?: boolean;
  strikeFirst?: boolean;
  strikeHire?: boolean;
  open?: boolean;
};

const EMPLOYEES: EmpRow[] = [
  { kind: "row", id: "EMP001", dept: "Finance", deptTone: "green", email: "alex.meyer@acme....", employment: "active", first: "Alex", hire: "Oct 24" },
  { kind: "parent", open: true, id: "EMP002", dept: "HR", deptTone: "orange", email: "sarah.kim@acme.c...", employment: "active", first: "Sarah", hire: "Oct 24", strikeHire: true, flags: ["id", "dept", "email", "hire"] },
  { kind: "revision", id: "EMP002", dept: "Finance", deptTone: "green", email: "skim@googlemail....", strikeEmail: true, hire: "Oct 26" },
  { kind: "parent", open: true, id: "EMP003", dept: "Marketing", deptTone: "red", email: "daniel.roberts@ac...", employment: "active", first: "Daniel", hire: "Oct 24", flags: ["id", "dept", "email", "employment"] },
  { kind: "revision", id: "EMP003", dept: "HR", deptTone: "orange", email: "daniel@acme.com", strikeEmail: true, employment: "inactive" },
  { kind: "revision", id: "EMP003", dept: "Marketing", deptTone: "red", email: "danrob@gmail.com", employment: "active" },
  { kind: "row", id: "EMP004", dept: "Sales", deptTone: "blue", email: "nina.schultz@acm...", employment: "active", first: "Nina", hire: "Oct 24" },
  { kind: "row", id: "EMP005", dept: "Sales", deptTone: "blue", email: "ryan.walker@acme...", employment: "active", first: "Ryan", hire: "Oct 24" },
  { kind: "parent", open: false, id: "EMP006", dept: "Engineering", deptTone: "gray", email: "olivia.hart@acme.c...", employment: "active", first: "Olivia", hire: "Oct 24", strikeHire: true, flags: ["id", "dept", "email", "employment", "first"], flagTone: "red" },
  { kind: "row", id: "EMP007", dept: "Engineering", deptTone: "gray", email: "jason.ford@acme....", employment: "active", first: "Jason", hire: "Oct 24" },
  { kind: "parent", open: true, id: "EMP008", dept: "HR", deptTone: "orange", email: "maria.lopez@acme...", employment: "active", first: "Maria", hire: "Oct 24", flags: ["id", "dept", "email"] },
  { kind: "revision", id: "EMP008", dept: "Engineering", deptTone: "gray", email: "marialpz@gmail.com", first: "Marya", strikeFirst: true },
];

const COLS: Array<{ key: string; label: string; icon: ReactNode }> = [
  { key: "employee", label: "Employee", icon: null },
  { key: "dept", label: "Department", icon: <IBuilding size={14} /> },
  { key: "email", label: "Email", icon: <IMail size={14} /> },
  { key: "employment", label: "Employment", icon: <IBriefcase size={14} /> },
  { key: "first", label: "First Name", icon: <IUserCircle size={14} /> },
  { key: "hire", label: "Hire date", icon: <ICalendarSm size={14} /> },
];

function DiffTableDemo() {
  const [showChanges, setShowChanges] = useState(true);
  const [tab, setTab] = useState("employees");
  const rows = showChanges
    ? EMPLOYEES
    : EMPLOYEES.filter((r) => r.kind !== "revision");

  const cell = "relative border-r border-line px-4 py-2.5 last:border-r-0";

  return (
    <div className="w-full max-w-4xl">
      <div className="text-[17px] font-semibold tracking-tight text-ink">
        Employee Overview
      </div>

      <div className="mt-3.5 flex w-full flex-wrap items-center gap-3">
        {/* segmented tab shell — bordered container, white active chip */}
        <div className="scroll-thin flex max-w-full items-center overflow-x-auto rounded-[12px] border border-line bg-surface p-1">
          {[
            ["employees", "Employees"],
            ["departments", "Departments"],
            ["positions", "Positions"],
            ["performance", "Performance Review"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cx(
                "h-8 shrink-0 rounded-[9px] px-3.5 text-[13px] whitespace-nowrap transition-colors",
                tab === id
                  ? "border border-line bg-surface font-semibold text-ink"
                  : "font-medium text-ink-3 hover:text-ink-2",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="ml-auto flex items-center gap-2.5">
          <span className="text-[13.5px] font-medium text-ink">
            Show changes
          </span>
          <Switch tone="ink" checked={showChanges} onChange={setShowChanges} label="Show changes" />
        </span>
      </div>

      {/* the grid */}
      <div className="scroll-thin mt-3 overflow-x-auto rounded-[10px] border border-line bg-surface">
        <table className="w-full min-w-[860px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-line">
              {COLS.map((c, i) => (
                <th
                  key={c.key}
                  className={cx(
                    "border-r border-line px-4 py-3 text-left font-semibold whitespace-nowrap text-ink last:border-r-0",
                    i === 0 && "w-44",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {i === 0 ? (
                      <Checkbox label="Select row" />
                    ) : (
                      <span className="text-ink-3">{c.icon}</span>
                    )}
                    {c.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const rev = r.kind === "revision";
              const flag = (k: string) =>
                !rev && r.flags?.includes(k as never) ? (
                  <ChangeFlag tone={r.flagTone} />
                ) : null;
              return (
                <tr
                  key={`${r.id}-${i}`}
                  className={cx(
                    "border-b border-line last:border-b-0",
                    rev && "hatch",
                  )}
                >
                  {/* employee id + leading control */}
                  <td className={cell}>
                    {flag("id")}
                    <span className="flex items-center gap-2.5">
                      {rev ? (
                        <IGrip size={13} className="shrink-0 text-ink-3" />
                      ) : r.kind === "parent" ? (
                        <span className="flex size-[18px] shrink-0 items-center justify-center text-ink-2">
                          {r.open ? (
                            <ICaretDown size={11} />
                          ) : (
                            <ICaretRight size={11} />
                          )}
                        </span>
                      ) : (
                        <Checkbox label="Select row" />
                      )}
                      <span className={cx(rev ? "text-ink-3" : "text-ink")}>
                        {r.id}
                      </span>
                    </span>
                  </td>

                  <td className={cell}>
                    {flag("dept")}
                    <DeptCell name={r.dept} tone={r.deptTone} dim={rev} />
                  </td>

                  <td className={cell}>
                    {flag("email")}
                    <span
                      className={cx(
                        rev ? "text-ink-3" : "text-ink",
                        r.strikeEmail && "line-through",
                      )}
                    >
                      {r.email}
                    </span>
                  </td>

                  <td className={cell}>
                    {flag("employment")}
                    {r.employment && (
                      <EmploymentCell state={r.employment} dim={rev} />
                    )}
                  </td>

                  <td className={cell}>
                    {flag("first")}
                    <span
                      className={cx(
                        rev ? "text-ink-3" : "text-ink",
                        r.strikeFirst && "line-through",
                      )}
                    >
                      {r.first}
                    </span>
                  </td>

                  <td className={cell}>
                    {flag("hire")}
                    <span
                      className={cx(
                        rev ? "text-ink-3" : "text-ink",
                        r.strikeHire && "text-ink-3 line-through",
                      )}
                    >
                      {r.hire}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-2.5 flex items-center gap-4 text-[12px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            style={{
              width: 0,
              height: 0,
              borderTop: "7px solid #f5b544",
              borderLeft: "7px solid transparent",
            }}
          />
          modified
        </span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            style={{
              width: 0,
              height: 0,
              borderTop: "7px solid #ef4444",
              borderLeft: "7px solid transparent",
            }}
          />
          conflict
        </span>
        <span className="flex items-center gap-1.5">
          <span className="hatch h-3.5 w-6 rounded border border-line" />
          previous revision
        </span>
      </div>
    </div>
  );
}

const CUSTOMERS: Array<{
  name: string;
  email: string;
  phone: string;
  date: string;
  org: string;
  hue: string;
  tag: string;
  tagTone: "red" | "green" | "gray";
}> = [
  { name: "Santi Carloza", email: "hello@santi.com", phone: "(671) 082-3395", date: "Nov 11, 2023", org: "Microsoft", hue: "#0ea5e9", tag: "Slow respone", tagTone: "red" },
  { name: "Fast Respone", email: "guyhawkins@mail.com", phone: "(916) 390-7143", date: "Nov 07, 2023", org: "Meta Platform", hue: "#2563eb", tag: "No respone", tagTone: "gray" },
  { name: "Arlene McCoy", email: "arlenemcoy@mail.com", phone: "(234) 048-2260", date: "Nov 06, 2023", org: "MAC Tools", hue: "#dc2626", tag: "Fast Respone", tagTone: "green" },
  { name: "Darlene Robertson", email: "darlener...n@mail.com", phone: "(279) 485-4275", date: "Nov 04, 2023", org: "Daemon", hue: "#7c3aed", tag: "No respone", tagTone: "gray" },
];

/* ------------------------------------------------------------------ */
/* DATA TABLE                                                          */
/* ------------------------------------------------------------------ */

type Row = {
  name: string;
  company: string;
  hue: string;
  price: string;
  status: string;
  tone: "green" | "amber" | "red" | "blue" | "orange" | "pink";
  date: string;
  next: string;
  priority: 1 | 2 | 3 | 4;
  ptone: "green" | "red";
};

const ROWS: Row[] = [
  { name: "Ariend Michgy", company: "Peregrin", hue: "#0ea5e9", price: "$15,900,000", status: "In Negotiation", tone: "amber", date: "12/03/2024", next: "Start implementation", priority: 2, ptone: "green" },
  { name: "Azizay Muscry", company: "Pollinate", hue: "#8b5cf6", price: "$8,500,000", status: "Rejected", tone: "red", date: "02/02/2024", next: "Reassess and re-approach", priority: 3, ptone: "green" },
  { name: "Rachel Vigmel", company: "Eclipseful", hue: "#1c1b18", price: "$3,000,000", status: "Follow-Up Required", tone: "orange", date: "21/01/2024", next: "Set up initial meeting", priority: 4, ptone: "red" },
  { name: "Saliem Mewd", company: "Solaris Energy", hue: "#f59e0b", price: "$10,000,000", status: "Prospecting", tone: "pink", date: "22/04/2024", next: "Discuss collaboration", priority: 2, ptone: "green" },
  { name: "Kae Sank Pank", company: "Spherule", hue: "#2563eb", price: "$9,850,000", status: "Under Review", tone: "blue", date: "11/01/2024", next: "Negotiate final terms", priority: 4, ptone: "green" },
  { name: "Giebran Reka", company: "Sisyphus", hue: "#78716c", price: "$10,700,000", status: "Prospecting", tone: "pink", date: "12/09/2024", next: "Set follow-up meeting", priority: 1, ptone: "green" },
  { name: "Pradow Alexav", company: "Railspeed", hue: "#ef4444", price: "$4,270,000", status: "Accepted", tone: "green", date: "23/05/2024", next: "Kick-off project", priority: 3, ptone: "green" },
  { name: "Aniesa Basworo", company: "Magnolia", hue: "#ec4899", price: "$12,200,000", status: "Accepted", tone: "green", date: "12/06/2024", next: "Finalize payment schedule", priority: 2, ptone: "green" },
];

function SortHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cx(
        "px-3 py-2.5 text-left text-[12px] font-semibold whitespace-nowrap text-ink-2",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-ink-3">
          <path d="m8 9.5 4-4 4 4M8 14.5l4 4 4-4" />
        </svg>
      </span>
    </th>
  );
}

export default function TableSection() {
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set([1, 3, 4, 7]),
  );
  const toggle = (i: number) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <Section
      id="table"
      registry={["badge", "progress", "avatar", "controls"]}
      eyebrow="Components"
      title="Data table"
      desc="The CRM grid: count-badged toolbar pills, priority signal bars, entity chips, the full status vocabulary and an active cell-edit state."
    >
      <Demo label="Business Partner CRM" imports={["StatusPill","SignalBars","EntityChip"]} refName="datatable-0001" contentClassName="!p-4 md:!p-6">
        <Card floating className="w-full overflow-hidden rounded-[18px]">
          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
            <Button variant="outline" size="sm" iconLeft={<span className="flex size-4 items-center justify-center rounded-[5px] bg-emerald-500 text-white"><ICheck size={10} strokeWidth={3.5} /></span>}>
              {selected.size} Selected
            </Button>
            <Button variant="outline" size="sm" iconLeft={<IPencil size={13} />}>
              Update
            </Button>
            <Button variant="outline" size="sm" iconLeft={<IFilter size={13} />}>
              Filter <CountBadge tone="orange">3</CountBadge>
            </Button>
            <Button variant="outline" size="sm" iconLeft={<ISort size={13} />}>
              Sort <CountBadge tone="orange">4</CountBadge>
            </Button>
            <span className="px-1 text-[13px] text-ink-3">120 Result</span>
            <span className="ml-auto flex items-center gap-2">
              <Button variant="danger" size="sm" iconLeft={<IPlus size={14} />}>
                Add new
              </Button>
              <Button variant="outline" size="sm" iconLeft={<IUpload size={13} />}>
                Import / Export
              </Button>
              <Button variant="outline" size="sm" className="!w-8 !px-0" aria-label="Preview">
                <IEye size={14} />
              </Button>
              <Button variant="outline" size="sm" className="!w-8 !px-0" aria-label="More">
                <IDots size={14} />
              </Button>
            </span>
          </div>

          {/* table */}
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-line bg-elev">
                  <th className="w-11 px-3.5 py-2.5">
                    <Checkbox
                      label="Select all rows"
                      checked={selected.size === ROWS.length}
                      onChange={(v) =>
                        setSelected(
                          v ? new Set(ROWS.map((_, i) => i)) : new Set(),
                        )
                      }
                    />
                  </th>
                  <th className="px-3 py-2.5 text-left text-[12px] font-semibold whitespace-nowrap text-ink-2">
                    Priority
                  </th>
                  <SortHeader>Client Name</SortHeader>
                  <SortHeader>Company</SortHeader>
                  <SortHeader>Listed Price</SortHeader>
                  <SortHeader>Status</SortHeader>
                  <SortHeader>Date</SortHeader>
                  <SortHeader>Next Step</SortHeader>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => {
                  const isSel = selected.has(i);
                  const editing = i === 2;
                  const editingPrice = i === 5;
                  return (
                    <tr
                      key={r.name}
                      className={cx(
                        "group border-b border-line transition-colors last:border-0",
                        isSel ? "bg-blue-500/4" : "hover:bg-elev",
                      )}
                    >
                      <td className="px-3.5 py-2.5">
                        <Checkbox checked={isSel} onChange={() => toggle(i)} label="Select row" />
                      </td>
                      <td className="px-3 py-2.5">
                        <SignalBars level={r.priority} tone={r.ptone === "red" ? "red" : "green"} />
                      </td>
                      <td className="px-3 py-2.5 font-medium whitespace-nowrap text-ink">
                        {r.name}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {editing ? (
                          <span className="relative inline-flex">
                            <span className="absolute -top-4 right-0 rounded-[5px] rounded-bl-none bg-violet-500 px-1.5 py-px text-[9px] font-bold text-white">
                              Lin
                            </span>
                            <span className="rounded-md ring-2 ring-violet-500 ring-offset-1 ring-offset-surface">
                              <EntityChip name={r.company} hue={r.hue} className="px-1.5 py-0.5" />
                            </span>
                          </span>
                        ) : (
                          <EntityChip name={r.company} hue={r.hue} />
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12.5px] font-medium whitespace-nowrap text-ink tabular-nums">
                        {editingPrice ? (
                          <span className="relative inline-flex">
                            <span className="absolute -top-4 right-0 rounded-[5px] rounded-bl-none bg-amber-500 px-1.5 py-px font-sans text-[9px] font-bold text-white">
                              Lintang
                            </span>
                            <span className="rounded-md px-1 ring-2 ring-amber-500 ring-offset-1 ring-offset-surface">
                              {r.price}
                            </span>
                          </span>
                        ) : (
                          r.price
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <StatusPill tone={r.tone} size="sm">
                          {r.status}
                        </StatusPill>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-ink-2 tabular-nums">
                        {r.date}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-ink-2">
                        {r.next}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[12px] text-ink-3">
            <span>
              {selected.size} of {ROWS.length} row(s) selected
            </span>
            <span className="flex items-center gap-1.5">
              <IDatabase size={13} /> Synced · 2 min ago
            </span>
          </div>
        </Card>
      </Demo>

      <Demo label="Customer rows" refName="datatable-0002" contentClassName="!p-4 md:!p-6">
        <Card floating className="w-full max-w-4xl overflow-hidden rounded-[18px]">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-ink">Customer</div>
              <div className="text-[11.5px] text-ink-3">324 Customer</div>
            </div>
            <span className="ml-auto">
              <SplitButton label="Add customer" />
            </span>
          </div>
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-[13px]">
              <tbody>
                {CUSTOMERS.map((c, i) => (
                  <tr
                    key={c.name}
                    className={cx(
                      "border-b border-line transition-colors last:border-0 hover:bg-elev",
                      i === 0 && "bg-blue-500/4 ring-1 ring-blue-500/40 ring-inset",
                    )}
                  >
                    <td className="w-10 px-3.5 py-3">
                      <Checkbox label="Select row" />
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-2.5 font-medium text-ink">
                        <Avatar name={c.name} size="sm" />
                        {c.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-blue-600 dark:text-blue-400">
                      {c.email}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-blue-600 tabular-nums dark:text-blue-400">
                      {c.phone}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-ink-2">
                      {c.date}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <EntityChip name={c.org} hue={c.hue} />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <StatusPill tone={c.tagTone} size="sm" dot>
                        {c.tag}
                      </StatusPill>
                    </td>
                    <td className="px-3 py-3 text-ink-3">
                      <span className="flex items-center gap-3">
                        <IStar size={14} />
                        <IDots size={14} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Demo>

      <Demo label="Change-tracking table" refName="ui-design-4" contentClassName="!p-4 md:!p-6">
        <DiffTableDemo />
      </Demo>
    </Section>
  );
}
