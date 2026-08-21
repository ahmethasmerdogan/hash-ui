import { useState } from "react";
import { Section, Demo, DemoCol } from "@/components/Section";
import {
  Card,
  Field,
  Label,
  Textarea,
  Separator,
  Toggle,
  ToggleGroup,
  Spinner,
  Button,
  DataTable,
  Table,
  THead,
  TBody,
  Tr,
  Th,
  Td,
  StatusPill,
  type Column,
} from "uicean";

function FieldDemo() {
  const [handle, setHandle] = useState("");
  const taken = handle.trim().toLowerCase() === "admin";
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Field
        label="Workspace name"
        hint="Shown to everyone you invite."
        required
      >
        {(p) => (
          <input
            {...p}
            className="h-10.5 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/15"
            placeholder="Acme"
          />
        )}
      </Field>

      <Field
        label="Handle"
        hint="Letters and numbers only."
        error={taken ? "That handle is already taken." : undefined}
      >
        {(p) => (
          <input
            {...p}
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="type “admin” to see the error"
            className="h-10.5 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/15 aria-[invalid=true]:border-red-500"
          />
        )}
      </Field>

      <Field label="Notes" hint="Markdown is fine.">
        {(p) => <Textarea {...p} autoGrow placeholder="Anything the team should know…" />}
      </Field>
    </div>
  );
}

type Row = { id: string; customer: string; plan: string; seats: number; status: string };

const ROWS: Row[] = [
  { id: "1", customer: "Northwind", plan: "Scale", seats: 240, status: "Live" },
  { id: "2", customer: "Acme Corp", plan: "Team", seats: 18, status: "Live" },
  { id: "3", customer: "Globex", plan: "Starter", seats: 3, status: "Trial" },
  { id: "4", customer: "Initech", plan: "Scale", seats: 96, status: "Paused" },
];

const COLUMNS: Array<Column<Row>> = [
  { id: "customer", header: "Customer", cell: (r) => <span className="font-medium text-ink">{r.customer}</span>, sortBy: (r) => r.customer },
  { id: "plan", header: "Plan", cell: (r) => r.plan, sortBy: (r) => r.plan },
  { id: "seats", header: "Seats", cell: (r) => r.seats, sortBy: (r) => r.seats, align: "right" },
  {
    id: "status",
    header: "Status",
    cell: (r) => (
      <StatusPill tone={r.status === "Live" ? "green" : r.status === "Trial" ? "blue" : "amber"}>
        {r.status}
      </StatusPill>
    ),
    sortBy: (r) => r.status,
  },
];

export default function FormsPage() {
  const [align, setAlign] = useState<string>("l");
  const [marks, setMarks] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <Section
        id="field"
        eyebrow="Components"
        title="Field"
        desc="A label, a control, and a line underneath that is either a hint or an error — with the ids generated and the aria wiring done, so the line is announced with the control instead of merely sitting near it."
        registry="form"
        pkg="core"
        source="Form.tsx"
      >
        <Demo
          label="Field — type “admin” in the handle to see the error state"
          imports={["Field", "Textarea"]}
          code={`<Field label="Handle" hint="Letters and numbers only." error={taken ? "Already taken." : undefined}>
  {(props) => <input {...props} />}
</Field>`}
        >
          <FieldDemo />
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The control is a function, not a child.</span>{" "}
            shadcn threads this through context and a{" "}
            <code className="font-mono">FormControl</code> wrapper;{" "}
            <code className="font-mono">cloneElement</code> is the other usual
            answer. Both hide the props being applied, and both break the moment
            you put a wrapper around the control. Here the props arrive as an
            argument, so they are visible at the call site and type-check
            against whatever element you actually render.
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The error takes over the hint.</span>{" "}
            It replaces it rather than stacking under it — two lines of
            competing guidance is how a form ends up shouting — and it carries{" "}
            <code className="font-mono">role=&quot;alert&quot;</code>, so an error
            that appears on submit is spoken rather than left for someone to
            find on their way back up the form.
          </p>
        </Card>
      </Section>

      <Section
        id="toggle"
        level={2}
        eyebrow="Components"
        title="Toggle & ToggleGroup"
        desc="A button that stays down. Not a checkbox and not a switch — it reports aria-pressed, which is what a toolbar button does."
        registry="form"
        pkg="core"
        source="Form.tsx"
      >
        <Demo
          label="Toggle, single-select group, multi-select group"
          imports={["Toggle", "ToggleGroup"]}
          code={`<ToggleGroup
  label="Alignment"
  value={align}
  onChange={(v) => setAlign(v)}
  items={[{ value: "l", label: "Left" }, { value: "c", label: "Centre" }]}
/>

<ToggleGroup multiple label="Text style" value={marks} onChange={setMarks} items={…} />`}
        >
          <DemoCol>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <ToggleGroup
                label="Alignment"
                value={align}
                onChange={(v) => setAlign(v as string)}
                items={[
                  { value: "l", label: "Left" },
                  { value: "c", label: "Centre" },
                  { value: "r", label: "Right" },
                ]}
              />
              <ToggleGroup
                multiple
                label="Text style"
                value={marks}
                onChange={(v) => setMarks(v as string[])}
                items={[
                  { value: "b", label: <span className="font-bold">B</span>, "aria-label": "Bold" },
                  { value: "i", label: <span className="italic">I</span>, "aria-label": "Italic" },
                  { value: "u", label: <span className="underline">U</span>, "aria-label": "Underline" },
                ]}
              />
            </div>
            <p className="text-center text-[12.5px] text-ink-3">
              single: <code className="font-mono">{align || "—"}</code> · multiple:{" "}
              <code className="font-mono">{marks.length ? marks.join(", ") : "—"}</code>
            </p>
          </DemoCol>
        </Demo>
      </Section>

      <Section
        id="separator-spinner"
        level={2}
        eyebrow="Components"
        title="Separator & Spinner"
        desc="A rule that can carry a word, and a spinner that says what it is waiting for — or stays silent when the control around it already does."
        registry="form"
        pkg="core"
        source="Form.tsx"
      >
        <Demo
          label="Separator, labelled separator, spinner"
          imports={["Separator", "Spinner", "Label"]}
          code={`<Separator />
<Separator label="or" />
<Separator orientation="vertical" />
<Spinner />                 // announces "Loading"
<Spinner label={null} />    // silent, for inside a busy button`}
        >
          <DemoCol>
            <div className="w-full max-w-sm space-y-5">
              <Separator />
              <Separator label="or" />
              <div className="flex items-center justify-center gap-4 text-[13px] text-ink-2">
                <span>Draft</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Published</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Archived</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Spinner />
              <Spinner size={22} />
              <Button
                variant="dark"
                size="sm"
                onClick={() => {
                  setBusy(true);
                  window.setTimeout(() => setBusy(false), 1600);
                }}
                aria-busy={busy}
              >
                {busy ? <Spinner size={14} label={null} /> : null}
                {busy ? "Saving…" : "Save changes"}
              </Button>
            </div>
            <div className="w-full max-w-sm">
              <Label required>A label, with the required marker</Label>
            </div>
          </DemoCol>
        </Demo>
      </Section>

      <Section
        id="datatable"
        level={2}
        eyebrow="Components"
        title="DataTable"
        desc="Columns in, rows out. Click a header to sort ascending, again for descending, a third time to go back to the order you passed in."
        registry="table"
        pkg="core"
        source="Table.tsx"
      >
        <Demo
          label="DataTable — the headers sort"
          imports={["DataTable"]}
          code={`<DataTable
  rows={rows}
  rowKey={(r) => r.id}
  caption="Customers by plan"
  columns={[
    { id: "customer", header: "Customer", cell: (r) => r.customer, sortBy: (r) => r.customer },
    { id: "seats", header: "Seats", cell: (r) => r.seats, sortBy: (r) => r.seats, align: "right" },
  ]}
/>`}
        >
          <div className="w-full">
            <DataTable
              rows={ROWS}
              columns={COLUMNS}
              rowKey={(r) => r.id}
              caption="Customers by plan, seats and status"
            />
          </div>
        </Demo>

        <Demo
          label="The primitives, for a table that is not a list of records"
          imports={["Table", "THead", "TBody", "Tr", "Th", "Td"]}
          code={`<Table caption="Token scale">
  <THead><tr><Th>Token</Th><Th align="right">Value</Th></tr></THead>
  <TBody>
    <Tr><Td>--radius</Td><Td align="right">10px</Td></Tr>
  </TBody>
</Table>`}
        >
          <div className="w-full">
            <Table caption="The radius scale" minWidth={320}>
              <THead>
                <tr>
                  <Th>Token</Th>
                  <Th>Derived as</Th>
                  <Th align="right">Value</Th>
                </tr>
              </THead>
              <TBody>
                <Tr>
                  <Td className="font-mono text-ink">--radius</Td>
                  <Td className="text-ink-3">the one you set</Td>
                  <Td align="right" className="font-mono">10px</Td>
                </Tr>
                <Tr>
                  <Td className="font-mono text-ink">--radius-btn-sm</Td>
                  <Td className="text-ink-3">var(--radius)</Td>
                  <Td align="right" className="font-mono">10px</Td>
                </Tr>
                <Tr>
                  <Td className="font-mono text-ink">--radius-btn-md</Td>
                  <Td className="text-ink-3">+ 2px</Td>
                  <Td align="right" className="font-mono">12px</Td>
                </Tr>
                <Tr>
                  <Td className="font-mono text-ink">--radius-btn-lg</Td>
                  <Td className="text-ink-3">+ 4px</Td>
                  <Td align="right" className="font-mono">14px</Td>
                </Tr>
              </TBody>
            </Table>
          </div>
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The sort state lives on the header cell.</span>{" "}
            <code className="font-mono">aria-sort</code> goes on the{" "}
            <code className="font-mono">&lt;th&gt;</code>, which is where a
            screen reader looks for it — an arrow glyph inside the button tells
            a sighted reader and nobody else.
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">There is no virtualisation, deliberately.</span>{" "}
            A table long enough to need windowing needs a library, and a design
            system that pretends otherwise ends up owning one. The wrapper
            scrolls sideways below <code className="font-mono">minWidth</code>{" "}
            so the columns never collapse into each other on a phone.
          </p>
        </Card>
      </Section>
    </>
  );
}
