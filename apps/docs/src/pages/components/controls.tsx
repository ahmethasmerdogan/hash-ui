import { useState, type ReactNode } from "react";
import { Section, Demo, DemoCol } from "@/components/Section";
import {
  Button,
  Checkbox,
  SearchField,
  SegmentedControl,
  Switch,
  cx,
} from "hash-ui";

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9Z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9Z"
      />
    </svg>
  );
}

function FormField({
  label,
  value,
  placeholder,
  focus,
  right,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  focus?: boolean;
  right?: ReactNode;
}) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-[13px] font-medium text-ink">
        {label}
      </span>
      <span
        className={cx(
          "flex h-10.5 items-center gap-2 rounded-[10px] border bg-surface px-3.5 transition-all",
          focus
            ? "border-emerald-500 ring-[3px] ring-emerald-500/15"
            : "border-line-strong shadow-soft",
        )}
      >
        <input
          defaultValue={value}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
        />
        {right}
      </span>
    </label>
  );
}

function SignupFields() {
  const [optOut, setOptOut] = useState(false);
  return (
    <div className="w-full max-w-sm">
      <div className="text-left text-[22px] font-bold tracking-tight text-ink">
        Create an account
      </div>
      <Button variant="white" shape="rect" className="mt-5 w-full" iconLeft={<GoogleG />}>
        Sign up with Google
      </Button>
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[12px] text-ink-3">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="First name" value="Luke" />
        <FormField label="Last name" value="Dalton" />
      </div>
      <div className="mt-4">
        <FormField label="Email" value="luke@exaltstudio.co" focus />
      </div>
      <div className="mt-4">
        <FormField
          label="Password"
          placeholder="••••••••"
          right={<IEyeOff />}
        />
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-left">
        <Checkbox checked={optOut} onChange={setOptOut} label="Opt out of marketing email" />
        <span className="text-[12.5px] leading-snug text-ink-2">
          I don’t want to receive emails about product feature updates and best
          practices.
        </span>
      </label>
      <p className="mt-4 text-left text-[12.5px] leading-snug text-ink-3">
        By creating an account, you agree to our{" "}
        <a className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400" href="#controls">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400" href="#controls">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

function IEyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-3">
      <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-2.2 3.1M6.6 6.6A16.6 16.6 0 0 0 2.5 12S6 19 12 19c1.5 0 2.9-.4 4.1-1M3 3l18 18" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CONTROLS                                                            */
/* ------------------------------------------------------------------ */

export default function ControlsSection() {
  const [seg, setSeg] = useState("1M");
  const [seg2, setSeg2] = useState("list");
  return (
    <Section
      id="controls"
      registry="controls"
      source="controls.tsx"
      eyebrow="Components"
      title="Controls"
      desc="Switches, rounded checkboxes and the raised-thumb segmented control that shows up in nearly every light reference."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="Switch & checkbox" imports={["Switch","Checkbox"]} refName="card-design-0001">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
            <span className="flex items-center gap-3">
              <Switch checked={undefined} label="Enabled" />
              <span className="text-sm text-ink-2">Remind</span>
            </span>
            <span className="flex items-center gap-3">
              <Switch size="sm" label="Compact" />
              <span className="text-sm text-ink-2">Compact</span>
            </span>
            <span className="flex items-center gap-3">
              <Checkbox checked={undefined} label="Example option" />
              <span className="text-sm text-ink-2">08.00 – 10.00</span>
            </span>
            <span className="flex items-center gap-3">
              <Checkbox tone="orange" checked={undefined} label="Flagged for review" />
              <span className="text-sm text-ink-2">Design specs</span>
            </span>
          </div>
        </Demo>

        <Demo label="Segmented control" imports={["SegmentedControl"]} refName="card-design-0001 · datatable-0002">
          <DemoCol>
            <SegmentedControl
              value={seg}
              onChange={setSeg}
              options={[
                { value: "1D", label: "1D" },
                { value: "7D", label: "7D" },
                { value: "1M", label: "1M" },
              ]}
            />
            <SegmentedControl
              value={seg2}
              onChange={setSeg2}
              options={[
                { value: "list", label: "Customer List" },
                { value: "org", label: "Organization" },
              ]}
            />
          </DemoCol>
        </Demo>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="Search field" refName="datatable-0001 · menu-design-001">
          <div className="w-full max-w-sm">
            <SearchField />
          </div>
        </Demo>

        <Demo label="Form fields" refName="ui-design-3" contentClassName="py-10">
          <SignupFields />
        </Demo>
      </div>
    </Section>
  );
}
