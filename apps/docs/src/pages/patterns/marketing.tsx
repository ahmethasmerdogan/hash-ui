import { Section, Demo } from "@/components/Section";
import {
  AvatarGroup,
  Button,
  Card,
  RainbowMeter,
  IArrowRight,
  ICheck,
  ISparkleFill,
  IStarFill,
} from "hash-ui";

/* ---------------- Marketing feature panel — how-it-works-0001 ------------ */

function AuditMiniCard() {
  const rows: Array<[string, number, "pass" | "review"]> = [
    ["Vendor Authorization", 2, "pass"],
    ["Invoice Approval", 4, "pass"],
    ["System Access Review", 3, "pass"],
    ["Revenue Recognition", 5, "review"],
    ["Expense validation", 3, "pass"],
  ];
  return (
    <div className="w-full max-w-95 rounded-xl bg-white text-left shadow-float">
      <div className="flex items-center gap-2 border-b border-stone-200 px-3.5 py-2.5">
        <span className="flex size-5 items-center justify-center rounded-[6px] bg-red-500 text-[9px] font-black text-white">
          B
        </span>
        <span className="text-[12px] font-semibold text-stone-800">
          Baelish and co.
        </span>
        <span className="ml-auto text-stone-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="12" cy="19" r="1.6" />
          </svg>
        </span>
      </div>
      <div className="flex items-center gap-2 border-b border-stone-200 px-3.5 py-2">
        <span className="flex size-4.5 items-center justify-center rounded-[5px] bg-blue-600 text-[8px] font-bold text-white">
          A
        </span>
        <span className="text-[11px] text-stone-400">Audit-056E</span>
      </div>
      <div className="grid grid-cols-[1.4fr_0.9fr_0.9fr] gap-2 border-b border-stone-100 bg-stone-50 px-3.5 py-1.5 text-[10px] font-medium text-stone-400">
        <span>Tasks</span>
        <span>Linked Evidence</span>
        <span>Status</span>
      </div>
      {rows.map(([task, n, st]) => (
        <div
          key={task}
          className="grid grid-cols-[1.4fr_0.9fr_0.9fr] items-center gap-2 border-b border-stone-100 px-3.5 py-2 text-[11px] last:border-0"
        >
          <span className="truncate font-medium text-stone-800">{task}</span>
          <span className="flex items-center gap-1">
            <span className="size-4 rounded-[4px] border border-stone-200 bg-stone-100" />
            <span className="size-4 rounded-[4px] border border-stone-200 bg-stone-100" />
            <span className="flex h-4 min-w-4 items-center justify-center rounded-[4px] border border-stone-200 px-0.5 text-[9px] font-semibold text-stone-500">
              {n}
            </span>
          </span>
          {st === "pass" ? (
            <span className="flex items-center gap-1 text-[10.5px] font-medium text-stone-600">
              <ICheck
                size={11}
                strokeWidth={3}
                className="rounded-full bg-emerald-500 p-0.5 text-white"
              />
              Passed
            </span>
          ) : (
            <span className="relative inline-flex w-fit items-center rounded-[4px] bg-red-500 py-0.5 pr-2 pl-2.5 text-[10px] font-semibold text-white">
              <span className="absolute -left-1 size-2 rotate-45 rounded-[2px] bg-red-500" />
              Needs Review
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* Landing widgets — Ornek1 / Ornek6 credit-score hero */
function LandingWidgets() {
  return (
    <div className="grid grid-cols-1 w-full items-start gap-8 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="text-left">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-3.5 pl-2 text-[13px] font-medium text-ink shadow-soft">
          <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
            <ISparkleFill size={10} />
          </span>
          Powered by <span className="font-semibold">GPT-4o</span>
        </span>
        <h3 className="mt-5 text-[34px] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
          Increase your credit score automatically using AI
        </h3>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">
          The fastest way to improve your credit score and capacity. Powered by
          patented AI automation.{" "}
          <span className="font-semibold text-ink">
            Guaranteed growth or your money back.
          </span>
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {["100% Guaranteed Growth", "No credit card required", "24/7 Live Support"].map(
            (t) => (
              <span key={t} className="flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap text-ink-2">
                <ICheckRing /> {t}
              </span>
            ),
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="green" iconRight={<IChevronRightSmall />}>
            Get started for Free
          </Button>
          <Button variant="white" shape="rect" iconRight={<IChevronRightSmall muted />}>
            Live Demo
          </Button>
        </div>
        <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-full border border-line bg-surface/70 py-2 pr-4 pl-2.5 shadow-soft">
          <AvatarGroup
            size="sm"
            people={[
              { name: "Ana Ruiz", emoji: "👩🏻", tint: "pink" },
              { name: "Tom Lee", emoji: "🧔🏽", tint: "blue" },
              { name: "Efe Can", emoji: "👨🏻‍🦰", tint: "yellow" },
              { name: "Lia Wu", emoji: "👩🏽‍🦱", tint: "green" },
            ]}
          />
          <span className="text-[13px] font-bold text-ink">20K+</span>
          <span className="h-4 w-px bg-line-strong" />
          <span className="text-[13px] text-ink-2">
            Trusted by <span className="font-bold text-ink">58,980+ users</span>
          </span>
          <span className="h-4 w-px bg-line-strong" />
          <span className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <IStarFill key={i} size={13} className="text-amber-400" />
            ))}
            <span className="ml-1 text-[13px] font-bold text-ink">
              4.98<span className="font-normal text-ink-3">/5</span>
            </span>
          </span>
        </div>
      </div>

      <Card floating className="w-full rounded-[22px] p-3">
        <div className="flex items-center justify-between px-2 pt-1.5 pb-3 text-[12.5px]">
          <span className="text-ink-2">
            Average improvement of{" "}
            <span className="font-bold text-ink">+148 points</span> in 90 Days
          </span>
          <span className="flex items-center gap-1 text-ink-3">
            <ISparkleFill size={11} /> Powered by GPT-4o
          </span>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-[radial-gradient(130%_160%_at_85%_-20%,#14532d_0%,#0c2a1c_55%,#081f15_100%)] px-6 py-6">
          <div className="absolute -top-10 right-8 size-40 rounded-full border border-emerald-400/20" />
          <div className="absolute -top-2 right-16 size-56 rounded-full border border-emerald-400/10" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="leading-tight">
              <div className="text-[12.5px] text-emerald-100/60">
                Current Score
              </div>
              <div className="mt-1 text-[38px] font-bold text-white tabular-nums">
                450
              </div>
              <div className="text-[12.5px] text-emerald-100/60">Fair</div>
            </div>
            <div className="relative flex flex-1 items-center px-2">
              <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-emerald-400/40" />
              <span className="mx-2 flex size-13 items-center justify-center rounded-[16px] border border-emerald-300/30 bg-emerald-400/10 text-emerald-300">
                <ISparkleFill size={22} />
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-emerald-400/40 to-emerald-300/60" />
            </div>
            <div className="text-right leading-tight">
              <div className="text-[12.5px] text-emerald-100/60">
                Projected Score
              </div>
              <div className="mt-1 text-[38px] font-bold text-emerald-300 tabular-nums [text-shadow:0_0_18px_rgba(52,211,153,0.55)]">
                850
              </div>
              <div className="text-[12.5px] text-emerald-100/60">Excellent</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-line px-1 py-4">
          {[
            { l: "Removals", d: "3 removals in 12 months." },
            { l: "Corrections", d: "2 corrections in 6 months." },
            { l: "On-time Payments", d: "98% on-time payments" },
          ].map((s) => (
            <div key={s.l} className="px-3 text-center">
              <div className="text-[13px] font-semibold text-ink">{s.l}</div>
              <div className="mt-0.5 text-[11.5px] text-ink-3">{s.d}</div>
            </div>
          ))}
        </div>

        <div className="px-2 pb-1">
          <RainbowMeter />
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-ink-3">
            <span className="flex size-4 items-center justify-center rounded-[4px] bg-ink/8 text-[9px] font-bold text-ink-2 dark:bg-white/10">
              i
            </span>
            Scores between <span className="font-semibold text-ink">700-850</span>{" "}
            mean that your assets are effective.
          </div>
          <div className="mt-3.5 flex items-center justify-between border-t border-line pt-3">
            <span className="text-[12px] text-ink-3">powered by</span>
            <span className="flex gap-2">
              <Button variant="white" shape="rect" size="sm">
                Take screenshot
              </Button>
              <Button variant="white" shape="rect" size="sm">
                Re-calculate
              </Button>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ICheckRing() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
      <circle cx="12" cy="12" r="8.5" opacity="0.45" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.9" />
    </svg>
  );
}
function IChevronRightSmall({ muted }: { muted?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className={muted ? "text-ink-3" : undefined}>
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export default function MarketingSection() {
  return (
    <Section
      id="marketing"
      eyebrow="Patterns"
      title="Marketing sections"
      desc="The bracketed-eyebrow feature block from the audit reference, plus the credit-score hero widgets: green CTA pair, trust strip, dark score panel and the rainbow meter."
    >
      <Demo label="Landing hero widgets" refName="Ornek1 · Ornek6" contentClassName="!p-6 md:!p-10">
        <LandingWidgets />
      </Demo>
      <Demo label="How it works" refName="how-it-works-0001" contentClassName="!p-4 md:!p-8">
        <div className="w-full rounded-2xl bg-elev px-6 py-8 md:px-10">
          <div className="flex items-center gap-1.5 text-[12px] text-ink-2">
            <span className="text-ink-3">[</span> How It Works{" "}
            <span className="text-ink-3">]</span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-6 border-t border-line pt-6 md:grid-cols-[1.2fr_1fr]">
            <h3 className="max-w-md text-[26px] leading-snug font-semibold tracking-[-0.01em] text-ink md:text-[30px]">
              Audit execution, built for review from day one
            </h3>
            <div className="text-[14px] leading-relaxed text-ink-2">
              We execute audit testing and documentation on top of your existing
              workflows, producing review-ready results with clear traceability.
              <div className="mt-5">
                <a
                  href="#marketing"
                  className="inline-flex items-center gap-1.5 font-semibold text-ink"
                >
                  Check out the security parameters <IArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>

          <div className="relative mt-8 flex min-h-95 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(180deg,#05070a_0%,#101b26_38%,#3d4f5f_72%,#93a3b0_100%)] px-4 py-10">
            <AuditMiniCard />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              [
                "Audit Work You Can Stand Behind",
                "Every test, result, and conclusion is clearly documented and backed by evidence. Audit teams can explain outcomes with confidence during reviews and discussions.",
              ],
              [
                "Less Rework at Review Time",
                "With evidence linked automatically and workpapers generated consistently, teams spend less time responding to follow-ups and redoing documentation.",
              ],
              [
                "Consistency Across Audit Cycle",
                "Standardized testing and documentation ensure the same level of quality across teams, audits, and reporting periods.",
              ],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="text-[14.5px] font-semibold text-ink">{t}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Demo>
    </Section>
  );
}
