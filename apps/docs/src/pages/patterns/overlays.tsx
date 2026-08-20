import { Section, Demo } from "@/components/Section";
import {
  Button,
  Card,
  OutlineBadge,
  RangeBar,
  StatusPill,
  cx,
  IArrowLeft,
  IArrowRight,
  ICheck,
  IChevronDown,
  IChevronUp,
  ICompass,
  ISparkleFill,
  IX,
} from "hash-ui";

/* ---------------- Get Started checklist — get-started-design-0001 -------- */

function GetStartedCard() {
  return (
    <Card floating className="w-full max-w-105 rounded-[26px] bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="text-[22px] font-bold tracking-tight text-ink">
          Get Started
        </span>
        <IX size={18} className="text-ink-2" />
      </div>

      <div className="mt-5">
        {/* step 1 — done */}
        <div className="relative flex items-center gap-4 rounded-2xl bg-inset px-4 py-4">
          <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#ff4fa8] to-[#e0187f] text-white ring-4 ring-pink-500/15">
            <ICheck size={20} strokeWidth={2.6} />
          </span>
          <div className="leading-tight">
            <div className="bg-gradient-to-r from-[#c01a72] to-ink bg-clip-text text-[19px] font-bold text-transparent">
              Connect Extension
            </div>
            <div className="mt-1 text-[14.5px] text-ink-3">
              Add MemoryBase to Chrome
            </div>
          </div>
        </div>

        {/* connector */}
        <div className="ml-9.5 h-6 w-px bg-line-strong" />

        {/* step 2 */}
        <div className="flex items-center gap-4 px-4">
          <span className="flex size-11 shrink-0 rounded-full border border-line bg-gradient-to-b from-elev to-inset" />
          <div className="leading-tight">
            <div className="text-[19px] font-bold text-ink">
              Log in to your AI tools
            </div>
            <div className="mt-1 text-[14.5px] text-ink-3">
              Bring in your past conversations
            </div>
          </div>
        </div>

        <div className="ml-9.5 h-6 w-px bg-line-strong" />

        {/* step 3 */}
        <div className="flex items-center gap-4 px-4">
          <span className="flex size-11 shrink-0 rounded-full border border-line bg-gradient-to-b from-elev to-inset" />
          <div className="leading-tight">
            <div className="text-[19px] font-bold text-ink">
              Try your first memory
            </div>
            <div className="mt-1 text-[14.5px] text-ink-3">
              Open ChatGPT/Claude to try it
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center gap-3.5 border-t border-line pt-5">
        <span className="flex size-11 items-center justify-center rounded-[13px] bg-gradient-to-b from-stone-500 to-stone-700 text-lg">
          🧑‍🦱
        </span>
        <div className="leading-tight">
          <div className="text-[16px] font-bold text-ink">Sebastiano</div>
          <div className="text-[13px] text-ink-3">Free Plan</div>
        </div>
        <span className="ml-auto flex flex-col text-ink-3">
          <IChevronUp size={13} />
          <IChevronDown size={13} className="-mt-1" />
        </span>
      </div>
    </Card>
  );
}

/* ---------------- Payment success — payment-success-001 ------------------ */

function PaymentSuccessModal() {
  return (
    <Card floating className="w-full max-w-3xl overflow-hidden rounded-[24px]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr]">
        {/* left */}
        <div className="flex flex-col items-center justify-center px-8 py-10 text-center">
          <span className="relative flex size-17 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 text-white ring-8 ring-emerald-500/12">
            <ICheck size={30} strokeWidth={2.6} />
          </span>
          <h3 className="mt-6 text-[17px] font-bold text-ink">
            Your timesheet is on its way for approval!
          </h3>
          <p className="mt-2 max-w-60 text-[13.5px] leading-relaxed text-ink-2">
            We’ve sent it to your clients and are just waiting on their approval
            to get you paid.
          </p>
          <div className="mt-7 flex w-full max-w-72 flex-col gap-2.5">
            <Button variant="green">Got It</Button>
            <Button variant="white" shape="rect">
              Submit another Timecard
            </Button>
          </div>
        </div>

        {/* right */}
        <div className="relative bg-elev px-7 py-7">
          <IX size={15} className="absolute top-5 right-5 text-ink-3" />
          <div className="text-[15px] font-bold text-ink">Timecard Summary</div>

          <div className="mt-5 space-y-4 text-[13.5px]">
            <div>
              <div className="text-ink-3">Client</div>
              <div className="mt-0.5 font-medium text-ink">
                ONE Collective GmbH
              </div>
            </div>
            <div>
              <div className="text-ink-3">Task</div>
              <div className="mt-0.5 font-medium text-ink">Product Design</div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-line bg-surface px-4 py-1.5 shadow-soft">
            {[
              ["Monday, 7 May 2024", "4:30"],
              ["Wednesday, 9 May 2024", "1:30"],
              ["Wednesday, 11 May 2024", "2:00"],
            ].map(([d, t]) => (
              <div
                key={d}
                className="flex items-center justify-between border-b border-line py-2.5 text-[13px] last:border-0"
              >
                <span className="text-ink-2">{d}</span>
                <span className="font-semibold text-ink tabular-nums">{t}</span>
              </div>
            ))}
            <div className="flex items-center justify-end gap-2 py-2.5 text-[13px]">
              <span className="font-medium text-ink-2">Total</span>
              <span className="font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                8:00
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-ink-2">8 Hours of Work</span>
              <span className="font-semibold text-ink tabular-nums">
                $1,440.00
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-2">ACME Commission</span>
              <span className="font-medium text-ink-2 tabular-nums">
                - $288.00 <span className="text-ink-3">(20%)</span>
              </span>
            </div>
          </div>

          <div className="mt-6 text-right">
            <div className="text-[12.5px] font-medium text-emerald-700 dark:text-emerald-400">
              Take Home
            </div>
            <div className="text-[26px] font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
              $1,152.00
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Install modal header — gradient.jpeg ------------------- */

function InstallModal() {
  return (
    <Card floating className="w-full max-w-135 overflow-hidden rounded-[26px]">
      <div className="grain relative h-36 bg-[linear-gradient(100deg,#9d8bf5_0%,#c86ef0_30%,#ff3fb8_55%,#ff9046_82%,#ff4f96_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(100%_120%_at_50%_-30%,rgba(255,255,255,0.4),transparent_55%)]" />
        <div className="absolute inset-0 z-[2] flex items-center justify-center gap-3.5">
          <span className="flex size-14 items-center justify-center rounded-[20px] border border-white/50 bg-white/30 text-white backdrop-blur-md">
            <ISparkleFill size={26} />
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-white/80" />
            <span className="size-1 rounded-full bg-white/80" />
            <span className="size-1 rounded-full bg-white/80" />
          </span>
          <span className="flex size-14 items-center justify-center rounded-[20px] border border-white/50 bg-white/30 text-white backdrop-blur-md">
            <ICompass size={26} />
          </span>
        </div>
        <IX size={16} className="absolute top-4 right-4 z-[2] text-white/80" />
      </div>

      <div className="px-8 pt-7 pb-8 text-center">
        <h3 className="text-[32px] font-bold tracking-[-0.03em] text-ink">
          Install Chrome
        </h3>
        <p className="mt-1.5 text-[15px] text-ink-2">Developed by Conduit AI</p>

        <div className="mt-6 rounded-2xl border border-line bg-surface p-5 text-left shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[15px] font-bold text-ink">GitHub</div>
              <div className="mt-0.5 text-[13.5px] text-ink-2">by Microsoft</div>
            </div>
            <OutlineBadge tone="gray" className="!normal-case !tracking-normal">
              Development Tools
            </OutlineBadge>
          </div>
          <div className="mt-4 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">About</span>
            <br />
            Chrome lets Codex use your Chrome browser for tasks that need your
            existing browser state, including open tabs, page content, and
            websites you’re already signed into.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Add-on wizard — progress-bar-001 ----------------------- */

const WIZARD_STEPS = [
  "Terminal illness",
  "Continuance Benefits",
  "Insta Payment",
  "Special Exit Value",
  "Accidental death rider",
  "Critical illness",
  "Waiver of premium",
];

function WizardModal() {
  return (
    <Card floating className="w-full max-w-4xl overflow-hidden rounded-[24px]">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <div className="border-b border-line p-4 md:border-r md:border-b-0">
          {WIZARD_STEPS.map((s, i) => {
            const active = i === 0;
            return (
              <div
                key={s}
                className={cx(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5",
                  active && "border border-line bg-elev shadow-soft",
                )}
              >
                <span
                  className={cx(
                    "flex size-6.5 items-center justify-center rounded-full text-[12px] font-bold",
                    active
                      ? "bg-blue-600 text-white shadow-btn"
                      : "bg-ink/8 text-ink-3 dark:bg-white/10",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cx(
                    "text-[13.5px]",
                    active ? "font-semibold text-ink" : "font-medium text-ink-2",
                  )}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[21px] font-bold tracking-tight text-ink">
                Terminal illness
              </h3>
              <StatusPill tone="green" size="sm" icon={<ICheck size={11} strokeWidth={3} />}>
                Included
              </StatusPill>
            </div>
            <div className="text-right leading-tight">
              <div className="text-[13px] text-ink-3">Premium</div>
              <div className="text-[19px] font-bold text-emerald-600 dark:text-emerald-400">
                Free
              </div>
            </div>
          </div>

          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ink-2">
            If you are diagnosed with a terminal illness something that will
            likely be fatal, Axis MaxLife will pay upto 1 Crore from your cover
            the moment the diagnosis is confirmed. And you can use this money
            any way you wish.
          </p>

          <div className="mt-12">
            <RangeBar
              startLabel="26 age"
              endLabel="65 age"
              progress={0.62}
              markerLabel="Diagnosis of terminal illness"
            />
            <div className="mt-2 flex items-center justify-between text-[12.5px]">
              <span className="text-ink-2">Policy Start</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Payout of up to ₹1 Cr
              </span>
              <span className="text-ink-2">Policy End</span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="white" shape="rect" iconLeft={<IArrowLeft size={15} />}>
              Back
            </Button>
            <Button variant="primary" shape="rect" iconRight={<IArrowRight size={15} />}>
              Next Add On
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function OverlaysSection() {
  return (
    <Section
      id="overlays"
      eyebrow="Patterns"
      title="Overlays & onboarding"
      desc="The ringed-check onboarding list, the split success modal, the grainy gradient install sheet and the numbered add-on wizard."
    >
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <Demo label="Get started checklist" refName="get-started-design-0001" contentClassName="py-10">
          <GetStartedCard />
        </Demo>
        <Demo label="Install sheet" refName="gradient.jpeg" contentClassName="py-10">
          <InstallModal />
        </Demo>
      </div>
      <Demo label="Split success modal" refName="payment-success-001" contentClassName="py-10 !px-4">
        <PaymentSuccessModal />
      </Demo>
      <Demo label="Add-on wizard" refName="progress-bar-001" contentClassName="py-10 !px-4">
        <WizardModal />
      </Demo>
    </Section>
  );
}
