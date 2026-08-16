import { Section, Demo } from "@/components/Section";
import {
  Card,
  CommitGraph,
  DeliveryTimeline,
  InsetPanel,
  OverviewTile,
  ProgressBar,
  StageFlow,
  StatusPill,
  IBell,
  IBox,
  ITruck,
  IZap,
} from "hash-ui";

/* ------------------------------------------------------------------ */
/* TIMELINES                                                           */
/* ------------------------------------------------------------------ */

export default function TimelinesSection() {
  return (
    <Section
      id="timelines"
      registry={["timeline", "commit-graph"]}
      source="Timeline.tsx"
      eyebrow="Components"
      title="Timelines & flows"
      desc="The delivery stepper with overview tiles, the service-stage pipeline with protocol connectors, and the spreadsheet commit graph with its hover card."
    >
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Demo label="Delivery timeline" imports={["DeliveryTimeline"]} refName="time-line-001" contentClassName="py-10">
          <Card floating className="w-full max-w-105 rounded-[20px]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="text-[15px] font-bold text-ink">
                Delivery timeline
              </span>
              <StatusPill tone="green" size="sm" dot className="uppercase tracking-[0.05em] !font-semibold">
                In Transit
              </StatusPill>
            </div>
            <div className="px-5 py-5">
              <DeliveryTimeline
                steps={[
                  {
                    title: "Order confirmed",
                    badge: "Done",
                    desc: "Payment received — order #4821 confirmed",
                    time: "17 Nov, 13:45",
                    state: "done",
                  },
                  {
                    title: "Shipped",
                    badge: "Done",
                    desc: "Picked up by courier — scanned at origin",
                    time: "17 Nov, 15:30",
                    state: "done",
                  },
                  {
                    title: "In transit",
                    badge: "Active",
                    desc: "At regional hub — next: local delivery center",
                    time: "18 Nov, 09:15",
                    state: "active",
                  },
                  {
                    title: "Delivered",
                    badge: "Pending",
                    desc: "Package will be delivered to your doorstep",
                    state: "pending",
                  },
                ]}
              />
              <div className="microlabel mt-5 mb-2">OVERVIEW</div>
              <div className="grid grid-cols-3 gap-2.5">
                <OverviewTile value="2" label="COMPLETED" tone="green" />
                <OverviewTile value="1" label="IN PROGRESS" tone="green" />
                <OverviewTile value="1" label="REMAINING" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar value={83} className="flex-1" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="microlabel">EST. DELIVERY: 19 NOV</span>
                <span className="microlabel">83% COMPLETE</span>
              </div>
            </div>
          </Card>
        </Demo>

        <Demo label="Stage flow" refName="time-line-001" contentClassName="py-10">
          <Card floating className="w-full max-w-105 rounded-[20px]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="text-[15px] font-bold text-ink">Stage flow</span>
              <span className="microlabel">4 STAGES</span>
            </div>
            <div className="dot-grid px-5 py-5">
              <StageFlow
                stages={[
                  {
                    icon: <IZap />,
                    iconTone: "linear-gradient(180deg,#fbbf24,#f59e0b)",
                    title: "Payment gateway",
                    desc: "Stripe → payment.confirmed",
                    chip: "Trigger",
                    chipTone: "orange",
                  },
                  {
                    icon: <IBox />,
                    iconTone: "linear-gradient(180deg,#60a5fa,#3b82f6)",
                    title: "Order service",
                    desc: "Validate, store, assign fulfillment",
                    chip: "Service",
                    chipTone: "blue",
                    connector: { label: "WEBHOOK", latency: "80ms" },
                  },
                  {
                    icon: <ITruck />,
                    iconTone: "linear-gradient(180deg,#34d399,#059669)",
                    title: "Courier API",
                    desc: "Track shipment, poll status updates",
                    chip: "Active",
                    chipTone: "green",
                    state: "active",
                    connector: { label: "REST API", latency: "240ms" },
                  },
                  {
                    icon: <IBell />,
                    iconTone: "linear-gradient(180deg,#a8a29e,#78716c)",
                    title: "Notification service",
                    desc: "Email + push to customer",
                    chip: "Pending",
                    chipTone: "gray",
                    state: "pending",
                    connector: { label: "PUB/SUB" },
                  },
                ]}
              />
              <div className="microlabel mt-5 mb-2">SYSTEM HEALTH</div>
              <div className="grid grid-cols-3 gap-2.5">
                <InsetPanel className="flex flex-col items-center gap-1 py-3">
                  <span className="font-mono text-[15px] font-bold text-ink">
                    847
                  </span>
                  <span className="microlabel">EVENTS TODAY</span>
                </InsetPanel>
                <InsetPanel className="flex flex-col items-center gap-1 py-3">
                  <span className="font-mono text-[15px] font-bold text-ink">
                    340ms
                  </span>
                  <span className="microlabel">AVG LATENCY</span>
                </InsetPanel>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-emerald-500/10 py-3">
                  <span className="font-mono text-[15px] font-bold text-emerald-700 dark:text-emerald-300">
                    99.9%
                  </span>
                  <span className="microlabel !text-emerald-700/70 dark:!text-emerald-300/70">
                    UPTIME
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={75} />
                <div className="mt-2 flex items-center justify-between">
                  <span className="microlabel">NEXT: NOTIFICATION SERVICE</span>
                  <span className="microlabel">75% COMPLETE</span>
                </div>
              </div>
            </div>
          </Card>
        </Demo>
      </div>

      <Demo label="Commit history" refName="activity-log-0001" contentClassName="py-10">
        <Card floating className="w-full max-w-2xl rounded-[20px]">
          <div className="border-b border-line px-6 py-4 text-[16px] font-bold text-ink">
            Commit History
          </div>
          <div className="px-4 py-4 pb-10">
            <CommitGraph
              commits={[
                { msg: "Merged Revised EBITDA V2 into base model", lane: 0, open: true },
                { msg: "Prepared merge preview for affected rows", lane: 0, highlight: true },
                { msg: "Recalculated dependent formulas", lane: 1, branch: "orange", dim: true },
                { msg: "Rebuilt scenario weighting", lane: 1, branch: "orange", dim: true },
                { msg: "Updated COGS based on revised cost structure", lane: 0 },
                { msg: "Adjusted revenue forecast for FY2026", lane: 1, branch: "red", dim: true },
                { msg: "Created Revised EBITDA V2 branch", lane: 0 },
                { msg: "Validated formulas across operating model", lane: 0 },
                { msg: "Saved Acme_LBO_v1.xlsx as base model", lane: 0, dim: true },
              ]}
              popover={{
                afterIndex: 1,
                name: "kev-droid",
                time: "2 hours ago",
                text: "Prepared merge preview for affected spreadsheet rows.",
                files: "1 file changed",
                add: 128,
                del: 42,
              }}
            />
          </div>
        </Card>
      </Demo>
    </Section>
  );
}
