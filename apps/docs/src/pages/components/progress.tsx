import { Section, Demo, DemoCol } from "@/components/Section";
import {
  Button,
  Card,
  CountdownLCD,
  DottedMeter,
  LcdTimer,
  ProgressBar,
  RangeBar,
  RingProgress,
  TickBars,
  ICreditCard,
} from "hash-ui";

/* ------------------------------------------------------------------ */
/* PROGRESS                                                            */
/* ------------------------------------------------------------------ */

function PromptLimitCard() {
  return (
    <Card floating className="w-full max-w-100 rounded-[18px] p-5">
      <div className="flex items-center gap-2 text-[14.5px]">
        <span className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-[9px] font-black text-white">
          F
        </span>
        <span className="font-bold text-ink">Ford</span>
        <span className="text-ink-3">· Prompt limit</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-[13.5px]">
        <span className="font-medium text-ink">Total prompts tracking</span>
        <span className="font-semibold text-ink tabular-nums">156</span>
      </div>
      <DottedMeter value={156} max={324} className="mt-2.5" />
      <div className="mt-2.5 flex items-center justify-between text-[13.5px]">
        <span className="text-ink-2">Max prompt limit</span>
        <span className="font-semibold text-ink tabular-nums">324</span>
      </div>
      <div className="mt-4 flex items-center gap-2.5">
        <Button variant="outline" size="sm" className="flex-1" iconLeft={<RingProgress value={156 / 324} size={15} stroke={2.5} />}>
          Manage credits
        </Button>
        <Button variant="dark" size="sm" className="flex-1" iconLeft={<ICreditCard size={14} />}>
          Upgrade plan
        </Button>
      </div>
    </Card>
  );
}

export default function ProgressSection() {
  return (
    <Section
      id="progress"
      registry="progress"
      source="Progress.tsx"
      eyebrow="Components"
      title="Progress & meters"
      desc="Every meter the references use: LCD countdowns, tick bars, dotted credit meters, rings, and the striped policy range with its diagnosis marker."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="LCD countdown" refName="button-design-0001.jpeg" variant="dark" contentClassName="py-10">
          <CountdownLCD
            segments={[
              { value: "04", label: "Days" },
              { value: "23", label: "Hours" },
              { value: "41", label: "Mins" },
            ]}
          />
        </Demo>

        <Demo label="LCD timer & ring" refName="active-node-0001 · datatable-003">
          <DemoCol>
            <LcdTimer value="2h 50m" />
            <span className="flex items-center gap-2.5">
              <RingProgress value={156 / 324} size={22} stroke={3} />
              <span className="font-mono text-[15px] font-semibold text-ink">
                156<span className="text-ink-3"> / 324</span>
              </span>
            </span>
          </DemoCol>
        </Demo>
      </div>

      <Demo label="Policy range with event marker" refName="progress-bar-001" contentClassName="py-12">
        <div className="w-full max-w-xl">
          <RangeBar
            startLabel="26 age"
            endLabel="65 age"
            progress={0.63}
            markerLabel="Diagnosis of terminal illness"
          />
          <div className="mt-2.5 flex items-center justify-between text-[13px]">
            <span className="text-ink-2">Policy Start</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Payout of up to ₹1 Cr
            </span>
            <span className="text-ink-2">Policy End</span>
          </div>
        </div>
      </Demo>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="Tick meters" imports={["TickBars","ProgressBar"]} refName="card-design-0001 · datatable-003">
          <div className="flex flex-col items-start gap-4">
            {[
              { f: 2, l: "Task A" },
              { f: 5, l: "Task B" },
              { f: 0, l: "Task C" },
            ].map((t) => (
              <span key={t.l} className="flex items-center gap-3">
                <TickBars total={6} filled={t.f} />
                <span className="font-mono text-[13px] text-emerald-600 dark:text-emerald-400">
                  {t.f}/6
                </span>
                <span className="text-[13.5px] text-ink-2">· {t.l}</span>
              </span>
            ))}
            <span className="flex items-center gap-3 pt-1">
              <TickBars total={5} filled={5} size="lg" />
              <TickBars total={5} filled={4} size="lg" />
              <TickBars total={5} filled={2} size="lg" />
              <span className="text-[13px] text-ink-3">volume</span>
            </span>
            <span className="flex w-full items-center gap-3">
              <ProgressBar value={83} className="flex-1" />
              <span className="microlabel">83% COMPLETE</span>
            </span>
          </div>
        </Demo>

        <Demo label="Credit meter card" refName="datatable-003" contentClassName="py-10">
          <PromptLimitCard />
        </Demo>
      </div>
    </Section>
  );
}
