import { useState } from "react";
import { Section, Demo, DemoCol } from "@/components/Section";
import {
  Card,
  Button,
  Popover,
  HoverCard,
  Sheet,
  AlertDialog,
  Collapsible,
  ScrollArea,
  AspectRatio,
  InputOTP,
  Combobox,
  Command,
  Calendar,
  DatePicker,
  Avatar,
  StatusPill,
  Field,
  Separator,
  Kbd,
  IZap,
  IFolder,
  ISettings,
  type Option,
} from "uicean";

const COUNTRIES: Array<Option> = [
  { value: "tr", label: "Türkiye", description: "+90", keywords: "turkey turkiye" },
  { value: "de", label: "Germany", description: "+49", keywords: "deutschland" },
  { value: "fr", label: "France", description: "+33", keywords: "paris" },
  { value: "gb", label: "United Kingdom", description: "+44", keywords: "uk britain england" },
  { value: "us", label: "United States", description: "+1", keywords: "usa america" },
  { value: "jp", label: "Japan", description: "+81", keywords: "nippon tokyo" },
];

const COMMANDS: Array<Option> = [
  { value: "new", label: "New project", group: "Actions", icon: <IFolder size={15} />, keywords: "create add" },
  { value: "deploy", label: "Deploy to production", group: "Actions", icon: <IZap size={15} />, keywords: "ship release" },
  { value: "settings", label: "Open settings", group: "Navigate", icon: <ISettings size={15} />, keywords: "preferences config" },
  { value: "members", label: "Manage members", group: "Navigate", keywords: "team people users" },
  { value: "danger", label: "Delete workspace", group: "Danger", disabled: true },
];

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="dark" size="sm" onClick={() => setOpen(true)}>
        Open sheet
      </Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Workspace settings"
        description="Changes apply to everyone in Northwind."
        footer={
          <div className="flex justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="green" size="sm" onClick={() => setOpen(false)}>
              Save
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Display name" hint="Shown across the product.">
            {(p) => (
              <input
                {...p}
                defaultValue="Northwind"
                className="h-10 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/15"
              />
            )}
          </Field>
          <Separator />
          <Collapsible trigger="Advanced">
            Tab is trapped in here, Escape closes it, and focus goes back to the
            button that opened it.
          </Collapsible>
        </div>
      </Sheet>
    </>
  );
}

function AlertDemo() {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
          Delete workspace
        </Button>
        {gone && <StatusPill tone="red">Deleted</StatusPill>}
      </div>
      <AlertDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setGone(true);
          setOpen(false);
        }}
        title="Delete this workspace?"
        description="Every project, deployment and log inside it goes too. This cannot be undone."
        confirmLabel="Delete everything"
      />
    </>
  );
}

function CommandDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Open palette <Kbd>⌘K</Kbd>
        </Button>
        {last && (
          <p className="text-[12.5px] text-ink-3">
            picked <code className="font-mono text-ink-2">{last}</code>
          </p>
        )}
      </div>
      <Command
        open={open}
        onClose={() => setOpen(false)}
        options={COMMANDS}
        onSelect={(v) => setLast(v)}
      />
    </>
  );
}

export default function OverlaysPage() {
  const [country, setCountry] = useState<string>();
  const [date, setDate] = useState<Date | null>(null);
  const [otp, setOtp] = useState("");

  return (
    <>
      <Section
        id="popover"
        eyebrow="Components"
        title="Popover & HoverCard"
        desc="A panel anchored to a trigger. Popover opens on click and takes focus because it holds controls; HoverCard opens on hover and never does, because taking focus from a passing pointer is hostile."
        registry="popover"
        pkg="core"
        source="Popover.tsx"
      >
        <Demo
          label="Popover, HoverCard — both flip when there is no room below"
          imports={["Popover", "HoverCard"]}
          code={`<Popover label="Invite" trigger={<Button>Invite people</Button>}>
  <Field label="Email">{(p) => <input {...p} />}</Field>
</Popover>

<HoverCard trigger={<a href="#">@deniz</a>}>
  <ProfileCard />
</HoverCard>`}
        >
          <DemoCol>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <Popover
                label="Invite people"
                trigger={
                  <Button variant="dark" size="sm">
                    Invite people
                  </Button>
                }
              >
                <div className="flex w-64 flex-col gap-3">
                  <Field label="Email">
                    {(p) => (
                      <input
                        {...p}
                        placeholder="you@company.com"
                        className="h-9 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3 text-[13px] text-ink outline-none focus:border-brand"
                      />
                    )}
                  </Field>
                  <Button variant="green" size="sm" className="w-full">
                    Send invite
                  </Button>
                </div>
              </Popover>

              <HoverCard
                trigger={
                  <button className="text-[13.5px] font-medium text-brand underline underline-offset-3">
                    @deniz
                  </button>
                }
              >
                <div className="flex w-56 items-start gap-3">
                  <Avatar name="Deniz Aksoy" size="sm" />
                  <span>
                    <span className="block text-[13px] font-semibold text-ink">Deniz Aksoy</span>
                    <span className="block text-[12px] text-ink-3">
                      Head of Design · Northwind
                    </span>
                  </span>
                </div>
              </HoverCard>
            </div>
            <p className="text-center text-[12.5px] text-ink-3">
              Focus the link with Tab — the hover card opens, because hover is
              not the only way to ask for something.
            </p>
          </DemoCol>
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">No floating-ui.</span>{" "}
            Positioning is a rect, a preferred side, a flip when the other side
            has more room, and a clamp to the viewport — about eighty lines in{" "}
            <code className="font-mono">overlay-primitives.ts</code>. The library
            is 30 kB, which is most of this package, and core&rsquo;s promise is
            that it imports nothing but React.
          </p>
        </Card>
      </Section>

      <Section
        id="sheet"
        level={2}
        eyebrow="Components"
        title="Sheet & AlertDialog"
        desc="Both are modal, so both trap focus, lock the scroll and hand focus back. They differ on what closing means."
        registry="sheet"
        pkg="core"
        source="Sheet.tsx"
      >
        <Demo
          label="Sheet, AlertDialog — try Escape and a click on the backdrop in each"
          imports={["Sheet", "AlertDialog"]}
          code={`<Sheet open={open} onClose={close} side="right" title="Workspace settings">
  …
</Sheet>

<AlertDialog
  open={open}
  onCancel={close}
  onConfirm={destroy}
  title="Delete this workspace?"
  confirmLabel="Delete everything"
/>`}
        >
          <DemoCol>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <SheetDemo />
              <AlertDemo />
            </div>
          </DemoCol>
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The sheet dismisses, the alert does not.</span>{" "}
            A sheet is a container and closing it costs nothing. An alert dialog
            is a question, so a click landing on the backdrop is not an answer —
            only Escape and the two buttons are. Escape maps to cancel, because
            that is the deliberate one.
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Cancel takes focus, not Confirm.</span>{" "}
            The destructive action should never be one stray Enter away from
            happening, which is exactly what focusing the confirm button makes
            it.
          </p>
        </Card>
      </Section>

      <Section
        id="combobox"
        level={2}
        eyebrow="Components"
        title="Combobox & Command"
        desc="The same pattern at two scales: a field that filters a list, with focus staying in the field and the highlighted row announced through aria-activedescendant."
        registry="combobox"
        pkg="core"
        source="Combobox.tsx"
      >
        <Demo
          label="Combobox, Command — try “paris”, then arrow down"
          imports={["Combobox", "Command"]}
          code={`<Combobox
  label="Country"
  value={country}
  onChange={setCountry}
  options={[{ value: "fr", label: "France", keywords: "paris" }]}
/>

<Command open={open} onClose={close} options={commands} onSelect={run} />`}
        >
          <DemoCol>
            <div className="flex w-full max-w-md flex-col gap-5">
              <Field label="Country" hint="Type “paris” — keywords match even when they are never shown.">
                {() => (
                  <Combobox
                    label="Country"
                    options={COUNTRIES}
                    value={country}
                    onChange={(v) => setCountry(v)}
                  />
                )}
              </Field>
              <CommandDemo />
            </div>
          </DemoCol>
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">
              The highlight resets whenever the list changes.
            </span>{" "}
            Highlight the third row, filter down to one, press Enter — without
            that reset the index points past the end and Enter selects nothing.
            It is the most common bug in this pattern and it only appears when
            someone types.
          </p>
        </Card>
      </Section>

      <Section
        id="calendar"
        level={2}
        eyebrow="Components"
        title="Calendar & DatePicker"
        desc="A month grid with no date library. Intl supplies the month and weekday names, so it speaks the reader's language without shipping a locale table."
        registry="calendar"
        pkg="core"
        source="Calendar.tsx"
      >
        <Demo
          label="Calendar, DatePicker — arrow keys move by day, PageUp/PageDown by month"
          imports={["Calendar", "DatePicker"]}
          code={`<Calendar value={date} onChange={setDate} />

<DatePicker value={date} onChange={setDate} label="Ship date" />`}
        >
          <DemoCol>
            <div className="flex flex-wrap items-start justify-center gap-8">
              <div className="rounded-[calc(var(--radius)+4px)] border border-line bg-surface p-3">
                <Calendar value={date} onChange={setDate} />
              </div>
              <div className="w-56">
                <Field label="Ship date" hint={date ? undefined : "Nothing chosen yet."}>
                  {() => (
                    <DatePicker
                      label="Ship date"
                      value={date}
                      onChange={setDate}
                      min={new Date(2026, 0, 1)}
                    />
                  )}
                </Field>
              </div>
            </div>
          </DemoCol>
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">One tab stop, not forty-two.</span>{" "}
            A roving tab index: one date is tabbable and the arrows move it, so
            reaching the 28th does not mean pressing Tab twenty-eight times.
            Each cell is named with the whole date, because &ldquo;14&rdquo; on
            its own says nothing about which month you are in.
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Local midnight throughout.</span>{" "}
            Mixing a UTC instant into a local grid is how a date picker ends up
            a day out for everyone west of Greenwich — and it always reaches
            production, because it looks right where it was written.
          </p>
        </Card>
      </Section>

      <Section
        id="structure"
        level={2}
        eyebrow="Components"
        title="Collapsible, ScrollArea, AspectRatio, InputOTP"
        desc="The structural pieces. None of them look like much and all four are load-bearing."
        registry="layout"
        pkg="core"
        source="Layout.tsx"
      >
        <Demo
          label="All four — paste a code into the OTP field"
          imports={["Collapsible", "ScrollArea", "AspectRatio", "InputOTP"]}
          code={`<Collapsible trigger="What counts as a seat?">…</Collapsible>

<ScrollArea maxHeight={180}>…</ScrollArea>

<AspectRatio ratio={16 / 9}><img … /></AspectRatio>

<InputOTP length={6} onComplete={verify} />`}
        >
          <DemoCol>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-[var(--radius)] border border-line p-3">
                <Collapsible trigger="What counts as a seat?" defaultOpen>
                  Anyone who signs in during the billing period. Invited people
                  who never accept are not counted.
                </Collapsible>
                <Collapsible trigger="Can we change plan mid-cycle?">
                  Yes — the difference is prorated to the day.
                </Collapsible>
              </div>

              <ScrollArea maxHeight={148} className="border border-line p-3">
                <p className="text-[13px] leading-relaxed text-ink-2">
                  This box is focusable, which is the point. A region a mouse
                  can scroll and a keyboard cannot is a region a keyboard user
                  cannot read — and the browser only makes it focusable for you
                  when it happens to contain something focusable.
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
                  Tab to it and use the arrow keys. The scrollbar is the thin
                  one the rest of the system uses.
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
                  There is deliberately no custom-drawn scrollbar. Replacing the
                  native one means reimplementing its keyboard behaviour, its
                  overscroll and its accessibility, and the thin native one
                  already looks right.
                </p>
              </ScrollArea>
            </div>

            <div className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-2">
              <AspectRatio
                ratio={16 / 9}
                className="rounded-[var(--radius)] border border-line bg-inset"
              >
                <div className="flex size-full items-center justify-center font-mono text-[12px] text-ink-3">
                  16 / 9
                </div>
              </AspectRatio>

              <div className="flex flex-col items-center gap-3">
                <InputOTP length={6} value={otp} onChange={setOtp} />
                <p className="text-[12.5px] text-ink-3">
                  {otp.length === 6 ? "Complete" : `${otp.length} of 6`} — try
                  pasting “483920”
                </p>
              </div>
            </div>
          </DemoCol>
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">
              The OTP field is one input, not six.
            </span>{" "}
            Six inputs is the usual build and it breaks three things at once: a
            password manager fills the first box and stops, a paste of
            &ldquo;483920&rdquo; lands entirely in one box, and the browser&rsquo;s
            own SMS autofill never fires. One input with{" "}
            <code className="font-mono">autocomplete=&quot;one-time-code&quot;</code>{" "}
            gets all three for free; the boxes are decoration drawn over it.
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">
              Collapsible animates on grid rows.
            </span>{" "}
            <code className="font-mono">grid-template-rows</code> from{" "}
            <code className="font-mono">0fr</code> to{" "}
            <code className="font-mono">1fr</code> — the only way to animate to a
            height you cannot know in advance. Measuring{" "}
            <code className="font-mono">scrollHeight</code> in a layout effect is
            the usual alternative and it fights every resize, every font swap
            and every image that loads late.
          </p>
        </Card>
      </Section>
    </>
  );
}
