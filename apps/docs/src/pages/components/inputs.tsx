import { useState } from "react";
import { Section, Demo } from "@/components/Section";
import { ApiTable } from "@/components/Code";
import {
  Accordion,
  Breadcrumbs,
  Button,
  Card,
  GoalBar,
  Pagination,
  RadioCards,
  RadioGroup,
  SelectField,
  Slider,
  Stepper,
  IArrowLeft,
  IArrowRight,
  IHome,
} from "hash-ui";

function StepperDemo() {
  const steps = ["Account", "Company", "Billing", "Review"];
  const [cur, setCur] = useState(1);
  return (
    <div className="w-full max-w-lg">
      <Stepper steps={steps} current={cur} />
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="white"
          shape="rect"
          size="sm"
          disabled={cur === 0}
          onClick={() => setCur((c) => Math.max(0, c - 1))}
          iconLeft={<IArrowLeft size={14} />}
        >
          Back
        </Button>
        <Button
          variant="dark"
          size="sm"
          disabled={cur === steps.length - 1}
          onClick={() => setCur((c) => Math.min(steps.length - 1, c + 1))}
          iconRight={<IArrowRight size={14} />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function SliderDemo() {
  const [seats, setSeats] = useState(8);
  const [limit, setLimit] = useState(65);
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-medium text-ink">Seats</span>
          <span className="text-ink-3">per workspace</span>
        </div>
        <Slider value={seats} onChange={setSeats} min={1} max={24} />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-medium text-ink">Monthly limit</span>
          <span className="text-ink-3">of 324 prompts</span>
        </div>
        <Slider value={limit} onChange={setLimit} suffix="%" />
      </div>
    </div>
  );
}

export default function InputsSection() {
  const [radio, setRadio] = useState("view");
  const [plan, setPlan] = useState("pro");
  const [page, setPage] = useState(3);
  return (
    <Section
      id="inputs"
      registry="inputs"
      source="Inputs.tsx"
      eyebrow="Components"
      title="Inputs & selection"
      desc="Sliders, radios and plan pickers, styled selects, accordions, a horizontal stepper, pagination and breadcrumbs — plus the emissions goal bar rebuilt from the dashboard reference."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Slider" imports={["Slider"]} refName="hashui original" contentClassName="py-10">
          <SliderDemo />
        </Demo>

        <Demo label="Select & radio" refName="Ornek2 permissions">
          <div className="flex w-full max-w-sm flex-col gap-5">
            <SelectField
              label="Default permission"
              options={["can view", "can comment", "can edit", "full access"]}
            />
            <RadioGroup
              value={radio}
              onChange={setRadio}
              options={[
                { value: "view", label: "Can view", desc: "Read-only access to the project" },
                { value: "edit", label: "Can edit", desc: "Modify records and invite others" },
              ]}
            />
          </div>
        </Demo>
      </div>

      <Demo label="Plan picker (card radio)" imports={["RadioCards"]} refName="hashui original">
        <RadioCards
          className="w-full max-w-xl"
          value={plan}
          onChange={setPlan}
          options={[
            {
              value: "free",
              label: "Free",
              desc: "40+ base components, open-source forever.",
              meta: "$0 / mo",
            },
            {
              value: "pro",
              label: "Pro",
              desc: "Sectoral templates, Figma library, priority support.",
              meta: "$16 / mo",
            },
          ]}
        />
      </Demo>

      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Accordion" imports={["Accordion"]} refName="hashui original" contentClassName="py-10 !px-5">
          <Accordion
            items={[
              {
                title: "How do the tokens work?",
                content:
                  "Every color, radius and font stack lives in src/index.css as a CSS variable, exposed to Tailwind through @theme inline — flip the .dark class and the whole system re-themes.",
              },
              {
                title: "Can I use it in a new project?",
                content:
                  "Copy src/ui and the token block, install Geist, and import from the barrel: import { Button, useToast } from \"./ui\".",
              },
              {
                title: "Is there a Figma file?",
                content:
                  "Not yet — the screenshots folder is the source of truth, and every component links back to its reference image.",
              },
            ]}
          />
        </Demo>

        <Demo label="Stepper (interactive)" imports={["Stepper"]} refName="hashui original" contentClassName="py-10">
          <StepperDemo />
        </Demo>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Pagination & breadcrumbs" refName="ui-design-4 header">
          <div className="flex flex-col items-center gap-6">
            <Breadcrumbs
              items={[
                {
                  label: (
                    <span className="flex items-center gap-1.5">
                      <IHome size={13} /> Home
                    </span>
                  ),
                },
                { label: "…" },
                { label: "company" },
                { label: "employee-management-system" },
              ]}
            />
            <Pagination pages={8} value={page} onChange={setPage} />
          </div>
        </Demo>

        <Demo label="Goal bar" imports={["GoalBar"]} refName="ui-design-2" contentClassName="py-10">
          <Card className="w-full max-w-md rounded-2xl p-5">
            <div className="text-[13.5px] font-semibold text-ink">
              Goal: 80% emissions reduction by 2030
            </div>
            <div className="mt-0.5 text-[11.5px] text-ink-3">Tonnes of CO₂e</div>
            <div className="mt-3 text-[13px]">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                3%
              </span>{" "}
              <span className="text-ink-3">closer to your goal</span>
            </div>
            <GoalBar className="mt-3" value={27} target={80} marks={[0, 27, 80, 100]} />
          </Card>
        </Demo>
      </div>

      <ApiTable
        component="Slider"
        rows={[
          {
            prop: "value / onChange",
            type: "number / (v: number) => void",
            desc: "Controlled value; uncontrolled if omitted.",
          },
          {
            prop: "min / max / step",
            type: "number",
            def: "0 / 100 / 1",
            desc: "Range boundaries.",
          },
          {
            prop: "suffix",
            type: "string",
            desc: 'Unit appended to the readout, e.g. "%".',
          },
        ]}
      />
    </Section>
  );
}
