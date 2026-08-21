import { Section, Demo, DemoCol } from "@/components/Section";
import {
  AnnouncementPill,
  Card,
  CountBadge,
  GlowDot,
  GlowPill,
  Kbd,
  OutlineBadge,
  StatusPill,
  ICheck,
  IClock,
  IZap,
} from "uicean";

/* ------------------------------------------------------------------ */
/* BADGES                                                              */
/* ------------------------------------------------------------------ */

export default function BadgesSection() {
  return (
    <Section
      id="badges"
      registry="badge"
      source="Badge.tsx"
      eyebrow="Components"
      title="Badge & pill"
      desc="The full status vocabulary from the CRM table, bordered dot pills from the employee grid, outline priority badges, and the animated announcement chip."
    >
      <Demo label="Status pills" imports={["StatusPill"]} refName="datatable-0001">
        <div className="flex max-w-xl flex-wrap items-center justify-center gap-2.5">
          <StatusPill tone="green">Accepted</StatusPill>
          <StatusPill tone="amber">In Negotiation</StatusPill>
          <StatusPill tone="red">Rejected</StatusPill>
          <StatusPill tone="blue">Under Review</StatusPill>
          <StatusPill tone="orange">Follow-Up Required</StatusPill>
          <StatusPill tone="pink">Prospecting</StatusPill>
          <StatusPill tone="green" icon={<ICheck size={11} strokeWidth={3} />}>
            Included
          </StatusPill>
          <StatusPill tone="gray">Pending</StatusPill>
        </div>
      </Demo>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="Dot & tag pills" refName="datatable-0002 · menu-design-001">
          <div className="flex max-w-md flex-wrap items-center justify-center gap-2.5">
            <StatusPill tone="red" dot>
              Slow response
            </StatusPill>
            <StatusPill tone="green" dot>
              Fast Response
            </StatusPill>
            <StatusPill tone="gray" dot>
              No response
            </StatusPill>
            <StatusPill tone="amber" icon={<IClock size={12} />}>
              Time-Sensitive
            </StatusPill>
            <StatusPill tone="violet" icon={<IZap size={12} />}>
              Platform
            </StatusPill>
            <StatusPill tone="red" icon={<IZap size={12} />}>
              Live
            </StatusPill>
          </div>
        </Demo>

        <Demo label="Outline, counts & kbd" refName="card-design-0001 · chat-log-001">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <OutlineBadge tone="green">Priority</OutlineBadge>
            <OutlineBadge tone="gray">Development Tools</OutlineBadge>
            <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
              Filter <CountBadge tone="orange">3</CountBadge>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
              Inbox <CountBadge tone="red">9</CountBadge>
            </span>
            <span className="inline-flex items-center gap-2">
              <Kbd>esc</Kbd>
              <span className="text-[12px] text-ink-3">to exit</span>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span className="text-[12px] text-ink-3">to navigate</span>
            </span>
          </div>
        </Demo>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="State pills" refName="active-node-0001">
          <Card className="flex w-full max-w-sm items-center gap-3.5 rounded-2xl px-5 py-5">
            <GlowDot tone="red" />
            <span className="text-[19px] font-bold tracking-tight text-ink">
              Active <span className="font-semibold">Node</span>
            </span>
            <GlowPill tone="red" className="ml-1.5">
              Offline
            </GlowPill>
            <span className="ml-auto h-px w-10 bg-line-strong" />
          </Card>
        </Demo>

        <Demo label="Announcement pill" refName="alert-0002" variant="dark">
          <DemoCol>
            <AnnouncementPill chip="New" gradient="solid">
              Real Time Analytics
            </AnnouncementPill>
            <AnnouncementPill chip="New" gradient="sheen">
              Real Time Analytics
            </AnnouncementPill>
          </DemoCol>
        </Demo>
      </div>
    </Section>
  );
}
