import { Section, Demo } from "@/components/Section";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Kbd,
  StatusPill,
  cx,
  ICalendar,
  ICheck,
  IChevronLeft,
  IChevronRight,
  IDots,
  IFileText,
  IInfo,
  IMail,
  IPaperclip,
  IPencil,
  ISparkleFill,
  IStar,
  IWarning,
  IX,
} from "uicean";

/* ------------------------------------------------------------------ */
/* AI INSIGHT PANEL — ai-chat-0001                                     */
/* ------------------------------------------------------------------ */

function ActionRow({
  title,
  sub,
}: {
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface px-4 py-3.5 shadow-soft">
      <span className="relative flex size-11 items-center justify-center rounded-[13px] bg-[#111113] text-[17px] font-black text-white">
        R
        <span className="absolute -right-1 -bottom-1 flex size-4.5 items-center justify-center rounded-full bg-surface text-ink shadow-soft">
          <IMail size={10} />
        </span>
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="truncate text-[14.5px] font-semibold text-ink">{title}</div>
        <div className="mt-0.5 truncate text-[12.5px] text-ink-2">{sub}</div>
      </div>
      <span className="flex overflow-hidden rounded-[10px] border border-line shadow-soft">
        {[
          { icon: <IX size={14} />, name: "Dismiss" },
          { icon: <IPencil size={13} />, name: "Edit" },
          { icon: <ICheck size={14} />, name: "Accept" },
        ].map(({ icon: ic, name }, i) => (
            <button
              key={name}
              type="button"
              aria-label={name}
              className={cx(
                "flex h-8.5 w-9.5 items-center justify-center bg-surface text-ink-2 transition-colors hover:bg-elev hover:text-ink",
                i > 0 && "border-l border-line",
              )}
            >
              {ic}
            </button>
          ),
        )}
      </span>
    </div>
  );
}

function AIPanel() {
  return (
    <Card floating className="w-full max-w-135 rounded-[22px]">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
        <span className="relative">
          <span className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-700 text-white">
            <ISparkleFill size={12} />
          </span>
          <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            1
          </span>
        </span>
        <span className="text-[15px] font-bold text-ink">
          Resend needs attention
        </span>
        <span className="ml-auto flex items-center gap-3.5 text-ink-3">
          <IDots size={15} />
          <IX size={16} />
        </span>
      </div>

      <div className="px-5 py-5">
        {/* deal header — left panel of the ref */}
        <div className="flex items-start justify-between">
          <span className="flex size-9 items-center justify-center rounded-[11px] bg-[#111113] text-[15px] font-black text-white">
            R
          </span>
          <StatusPill tone="blue" size="sm" icon={<ISparkleFill size={10} />}>
            AI Enhanced
          </StatusPill>
        </div>
        <div className="mt-2.5 leading-tight">
          <div className="text-[15px] font-bold text-ink">Resend deal</div>
          <div className="text-[12px] text-ink-3">
            resend.com · San Francisco, CA
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <StatusPill tone="green" size="sm">
            Healthy
          </StatusPill>
          <StatusPill tone="blue" size="sm">
            High intent
          </StatusPill>
          <StatusPill tone="orange" size="sm">
            Prospecting
          </StatusPill>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <IconButton size="md" aria-label="Star">
            <IStar size={14} />
          </IconButton>
          <IconButton size="md" aria-label="Email">
            <IMail size={14} />
          </IconButton>
          <IconButton size="md" aria-label="Notes">
            <IFileText size={14} />
          </IconButton>
          <IconButton size="md" aria-label="Attachments">
            <IPaperclip size={14} />
          </IconButton>
          <IconButton size="md" aria-label="More">
            <IDots size={14} />
          </IconButton>
        </div>

        <p className="mt-4 text-[14.5px] leading-relaxed text-ink">
          I found two buying signals on Resend.
        </p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
          Zeno asked about team pricing, seat count, and deliverability limits
          after the walkthrough. He also mentioned they care about developer
          experience and strong APIs, which matches your ICP.
        </p>

        {/* source citation card */}
        <div className="mt-5 rounded-2xl border border-line bg-surface shadow-card">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="flex size-6 items-center justify-center rounded-full border border-line text-ink-2">
              <IChevronLeft size={13} />
            </span>
            <span className="text-[12.5px] font-medium text-ink-2 tabular-nums">
              2/2
            </span>
            <span className="flex size-6 items-center justify-center rounded-full text-ink-3">
              <IChevronRight size={13} />
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[12.5px] text-ink-2">
              <ICalendar size={13} /> 2 sources
            </span>
          </div>
          <div className="relative px-4 py-3.5 text-[14px] leading-relaxed">
            <p className="text-ink-3">
              …product direction feels very aligned with what we need.
            </p>
            <p className="mt-1 text-ink">
              We’re comparing options this week, but Resend looks like the
              strongest fit for our transactional email volume.{" "}
              <mark className="rounded-[3px] bg-blue-500/15 px-0.5 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300">
                Can you send over pricing for 8 seats and let us know what
                higher monthly limits would look like?
              </mark>
            </p>
            <p className="mt-1 text-ink-3">
              At Resend, we’re focused on building email infrastructure…
            </p>
            <div className="absolute right-0 -bottom-3.5 left-0 flex justify-center">
              <Button variant="outline" size="sm" className="!h-8 !rounded-[9px] !bg-surface">
                View email
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2.5 border-t border-line px-4 py-3">
            <span className="flex size-6 items-center justify-center rounded-md bg-red-500/10 text-red-500">
              <IMail size={13} />
            </span>
            <span className="text-[13.5px] font-semibold text-ink">
              Re: Resend pricing
            </span>
            <span className="ml-auto text-[12.5px] text-ink-3">Apr 28, 2026</span>
          </div>
        </div>

        <p className="mt-5 text-[14.5px] text-ink-2">
          I prepared two actions you can review.
        </p>
        <div className="mt-3 flex flex-col gap-2.5">
          <ActionRow
            title="Send Resend pricing proposal"
            sub="Email draft · deliverability limits"
          />
          <ActionRow title="Update Resend fields" sub="7 field updates · AI enriched" />
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* COMMAND PALETTE — chat-log-001                                      */
/* ------------------------------------------------------------------ */

function Hl({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded-[4px] bg-[#5b2c10] px-1 text-orange-300">
      {children}
    </mark>
  );
}

function PaletteTask({
  checked,
  title,
  meta,
}: {
  checked?: boolean;
  title: React.ReactNode;
  meta: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5 px-5 py-3">
      <span
        className={cx(
          "mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-[8px] border",
          checked
            ? "border-orange-600 bg-gradient-to-b from-orange-500 to-orange-700 text-white"
            : "border-line-strong bg-elev shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]",
        )}
      >
        {checked && <ICheck size={12} strokeWidth={3.2} />}
      </span>
      <div className="min-w-0 leading-snug">
        <div className="text-[15px] font-medium text-ink">{title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[13px] text-ink-3">
          {meta}
        </div>
      </div>
    </div>
  );
}

function CommandPalette() {
  return (
    <div className="w-full max-w-135 overflow-hidden rounded-[20px] border border-line bg-canvas shadow-float">
      <div className="px-5 pt-4 pb-1.5 text-[15px] font-medium text-ink-3">
        Tasks
      </div>
      <PaletteTask
        title={
          <>
            Review <Hl>design</Hl> tokens with frontend team
          </>
        }
        meta={
          <>
            <span className="flex items-center gap-1 whitespace-nowrap">
              Due to <ICalendar size={12} /> May 21
            </span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              Assigned to: <Avatar name="Sasha Green" size="xs" /> Sasha Green
            </span>
            <span aria-hidden>·</span>
            <span className="whitespace-nowrap">Status: ⏰ In Progress</span>
          </>
        }
      />
      <PaletteTask
        title={
          <>
            Finalize <Hl>design</Hl> specs for dev handoff
          </>
        }
        meta={
          <>
            <span className="flex items-center gap-1 whitespace-nowrap">
              Due to <ICalendar size={12} /> May 25
            </span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              Assigned to: <Avatar name="Daniel Kim" size="xs" /> Daniel Kim
            </span>
            <span aria-hidden>·</span>
            <span className="whitespace-nowrap">Status: 🗂️ Backlog</span>
          </>
        }
      />
      <PaletteTask
        checked
        title={
          <>
            <Hl>Design</Hl> specs for dev handoff
          </>
        }
        meta={
          <>
            <span className="flex items-center gap-1 whitespace-nowrap">
              Due to <ICalendar size={12} /> May 18
            </span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              Assigned to: <Avatar name="Anna Li" size="xs" /> Anna Li
            </span>
            <span aria-hidden>·</span>
            <span className="whitespace-nowrap">Status: ✅ Done</span>
          </>
        }
      />

      <div className="border-t border-line px-5 pt-4 pb-1.5 text-[15px] font-medium text-ink-3">
        Messages
      </div>
      {[
        {
          name: "Eivor Varinsdottir",
          in: "# Product / # Sprint Planning",
          quote: (
            <>
              “Let’s simplify the <Hl>design</Hl> flow here.”
            </>
          ),
        },
        {
          name: "Jason Carter",
          in: "💬 Direct message",
          quote: (
            <>
              “Attach the latest <Hl>design</Hl> to Jira please.”
            </>
          ),
        },
      ].map((m) => (
        <div key={m.name} className="px-5 py-3">
          <div className="flex items-center gap-2 text-[14px]">
            <Avatar name={m.name} size="sm" />
            <span className="font-semibold text-ink">{m.name}</span>
            <span className="text-ink-3">in:</span>
            <span className="text-ink-2">{m.in}</span>
          </div>
          <div className="mt-2 ml-3.5 border-l-2 border-line-strong pl-4 text-[15px] text-ink italic">
            {m.quote}
          </div>
        </div>
      ))}

      <div className="mt-2 flex items-center gap-2.5 border-t border-line bg-surface px-5 py-3">
        <Kbd>esc</Kbd>
        <span className="text-[13px] text-ink-3">to exit</span>
        <span className="ml-auto flex items-center gap-2">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <span className="text-[13px] text-ink-3">to navigate</span>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DEPLOY LOG VIEWER — ui-design-terminal-1                            */
/* ------------------------------------------------------------------ */

type LogLine = {
  time: string;
  text: string;
  kind?: "plain" | "ok" | "warn" | "info";
};

const LOG_LINES: LogLine[] = [
  { time: "9:53:21 AM", text: "Building for Nitro preset: node-server" },
  { time: "9:53:21 AM", text: "Building client..." },
  { time: "9:53:21 AM", text: "vite v6.3.5 building for production..." },
  { time: "9:53:21 AM", text: "✓ 1786 modules transformed.", kind: "ok" },
  {
    time: "9:53:21 AM",
    text: "[warn] [plugin @tailwindcss/vite:generate:build] Source map…",
    kind: "warn",
  },
  { time: "9:53:22 AM", text: "../node_modules/.cache/nitro/…", kind: "info" },
  { time: "9:53:22 AM", text: "../node_modules/.cache/vite/…", kind: "info" },
  { time: "9:53:24 AM", text: "✓ built in 3.42s", kind: "ok" },
];

function LogViewer() {
  return (
    <Card floating className="w-full max-w-3xl overflow-hidden rounded-[18px]">
      <div className="flex items-center gap-2 border-b border-line bg-elev px-4 py-3 text-[13.5px]">
        <span className="font-semibold text-ink">Dokedu Backend</span>
        <IChevronRight size={13} className="text-ink-3" />
        <span className="flex items-center gap-1.5 font-medium text-ink-2">
          <span className="size-2 rounded-full bg-orange-500" /> 5315ffa
        </span>
      </div>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <button
          type="button"
          className="flex h-8.5 items-center gap-1.5 rounded-[9px] border border-line bg-surface px-3 text-[13px] font-semibold text-ink shadow-soft"
        >
          All Logs <span className="font-normal text-ink-3">143</span>
        </button>
        <button
          type="button"
          className="flex h-8.5 items-center gap-1.5 rounded-[9px] px-3 text-[13px] font-medium text-ink-3"
        >
          <IInfo size={13} /> Errors <span>0</span>
        </button>
        <button
          type="button"
          className="flex h-8.5 items-center gap-1.5 rounded-[9px] bg-ink/6 px-3 text-[13px] font-medium text-ink-2 dark:bg-white/8"
        >
          <IWarning size={13} /> Warnings <span className="font-semibold text-ink">2</span>
        </button>
      </div>
      <div className="scroll-thin overflow-x-auto py-1.5 font-mono text-[12.5px] leading-6">
        {LOG_LINES.map((l, i) => (
          <div
            key={i}
            className={cx(
              "flex gap-5 px-4 whitespace-nowrap",
              l.kind === "warn" && "bg-orange-500/12",
            )}
          >
            <span
              className={cx(
                "shrink-0 tabular-nums",
                l.kind === "warn" ? "text-orange-600 dark:text-orange-300" : "text-ink-3",
              )}
            >
              {l.time}
            </span>
            <span
              className={cx(
                l.kind === "ok" && "text-emerald-600 dark:text-emerald-400",
                l.kind === "warn" && "text-orange-600 dark:text-orange-300",
                l.kind === "info" && "text-ink-2",
                (!l.kind || l.kind === "plain") && "text-ink",
              )}
            >
              {l.kind === "info" && (
                <span className="mr-2 inline-flex size-4 -translate-y-px items-center justify-center rounded-[4px] bg-blue-500/15 align-middle text-[9px] font-bold text-blue-600 not-italic dark:text-blue-300">
                  i
                </span>
              )}
              {l.text}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function ChatSection() {
  return (
    <Section
      id="chat"
      eyebrow="Patterns"
      title="AI & command"
      desc="The AI deal-insight panel with quoted source citations, the dark command palette with term highlighting, and the deploy-log console with severity filters."
    >
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <Demo label="AI insight panel" refName="ai-chat-0001" contentClassName="py-8 !px-4">
          <AIPanel />
        </Demo>
        <Demo label="Command palette" refName="chat-log-001" variant="dark" contentClassName="py-8 !px-4">
          <CommandPalette />
        </Demo>
      </div>
      <Demo label="Deploy logs" refName="ui-design-terminal-1" contentClassName="py-8">
        <LogViewer />
      </Demo>
    </Section>
  );
}
