/* Usage snippets, keyed by Demo label — Demo looks these up automatically. */

export const SNIPPETS: Record<string, string> = {
  "Accent faces": `import { Button } from "hash-ui";

// every variant shares one anatomy:
// gradient + 1px ring + inset top highlight
<Button variant="green">Get started for Free</Button>
<Button variant="primary" iconLeft={<IMap />}>
  Accept & Get Directions
</Button>
<Button variant="danger" iconLeft={<IPlus />}>Add new</Button>
<Button variant="amber">Pending review</Button>`,

  "Neutral & utility faces": `<Button variant="white">Live Demo</Button>
<Button variant="dark">Suggest more</Button>
<Button variant="outline">Manage credits</Button>
<Button variant="ghost">Cancel</Button>

// shape="rect" opts into a 12px radius
<Button variant="green" shape="rect">Save</Button>`,

  "Attached group & block button": `<ButtonGroup
  items={[
    { label: "Like", icon: <IHeart /> },
    { label: "Comment", icon: <IMessage /> },
    { label: "Share", icon: <IShare /> },
  ]}
/>
<Button variant="dark" size="lg" className="w-full">
  Reset Password
</Button>`,

  "Button states": `<Button variant="green" loading>Calculating…</Button>
<Button variant="primary" loading>Saving</Button>
<Button variant="dark" disabled>Suggest more</Button>`,

  "Status pills": `import { StatusPill } from "hash-ui";

<StatusPill tone="green">Accepted</StatusPill>
<StatusPill tone="amber">In Negotiation</StatusPill>
<StatusPill tone="red" dot>Slow response</StatusPill>
<StatusPill tone="violet" icon={<IZap />}>Platform</StatusPill>`,

  "Sizes & presence": `import { Avatar, AvatarGroup } from "hash-ui";

<Avatar name="Arlene McCoy" status="online" />
<Avatar name="Jerome Bell" size="lg" status="away" ring />
<AvatarGroup
  people={[
    { name: "Ava Miller", emoji: "😄", tint: "blue" },
    { name: "Noah Kim", emoji: "😊", tint: "green" },
    { name: "Kai Wong" },
  ]}
/>`,

  "Switch & checkbox": `import { Switch, Checkbox } from "hash-ui";

<Switch checked={remind} onChange={setRemind} />
<Checkbox checked={done} onChange={setDone} />
<Checkbox tone="orange" />`,

  "Segmented control": `<SegmentedControl
  value={range}
  onChange={setRange}
  options={[
    { value: "1D", label: "1D" },
    { value: "7D", label: "7D" },
    { value: "1M", label: "1M" },
  ]}
/>`,

  Slider: `import { Slider } from "hash-ui";

<Slider value={seats} onChange={setSeats} min={1} max={24} />
<Slider value={limit} onChange={setLimit} suffix="%" />`,

  "Plan picker (card radio)": `<RadioCards
  value={plan}
  onChange={setPlan}
  options={[
    { value: "free", label: "Free", desc: "Open-source forever.", meta: "$0 / mo" },
    { value: "pro", label: "Pro", desc: "Templates + support.", meta: "$16 / mo" },
  ]}
/>`,

  Accordion: `<Accordion
  items={[
    { title: "How do the tokens work?", content: "Every color lives in CSS…" },
    { title: "Can I use it in a new project?", content: "Copy src/ui and go." },
  ]}
/>`,

  "Stepper (interactive)": `const [step, setStep] = useState(1);

<Stepper
  steps={["Account", "Company", "Billing", "Review"]}
  current={step}
/>`,

  "Goal bar": `<GoalBar value={27} target={80} marks={[0, 27, 80, 100]} />`,

  Alerts: `import { Alert } from "hash-ui";

<Alert tone="success" title="Payment received" />
<Alert
  tone="warning"
  title="Approaching prompt limit"
  action={<Button size="sm" variant="white" shape="rect">Upgrade</Button>}
  onClose={dismiss}
>
  156 of 324 prompts used.
</Alert>`,

  "Toast queue (live)": `// wrap the app once
<ToastProvider>
  <App />
</ToastProvider>

// then, anywhere:
const { push } = useToast();
push({
  tone: "success",
  title: "Timesheet submitted",
  desc: "Sent for approval.",
});`,

  "Dialog (live)": `const [open, setOpen] = useState(false);

<Modal open={open} onClose={() => setOpen(false)} width="max-w-105">
  <Card floating className="relative p-6">
    <ModalClose onClose={() => setOpen(false)} />
    <h3>Delete this workspace?</h3>
    <Button variant="danger" shape="rect">Delete workspace</Button>
  </Card>
</Modal>`,

  "Tooltip & dropdown": `<Tooltip label="Add to favorites">
  <IconButton><IStar /></IconButton>
</Tooltip>

<Dropdown
  label="Actions"
  entries={[
    { type: "label", label: "WORKSPACE" },
    { label: "Rename", icon: <IPencil /> },
    { type: "divider" },
    { label: "Delete workspace", icon: <IX />, danger: true },
  ]}
/>`,

  Skeleton: `<Skeleton className="size-10 !rounded-full" />
<Skeleton className="h-3.5 w-2/5" />
<Skeleton className="h-28 w-full !rounded-xl" />`,

  "Empty state": `<EmptyState
  icon={<IFolder />}
  title="No documents yet"
  desc="Upload your first workpaper to start the audit trail."
  action={<Button variant="dark" size="sm">Add document</Button>}
/>`,

  "v.1 — raised pill": `<PillTabs
  accentFirst
  items={[
    { id: "discover", label: "Discover", icon: <ICompass /> },
    { id: "models", label: "3D Models", icon: <ICube /> },
    { id: "uikit", label: "UI Kit", icon: <IPersonX /> },
  ]}
/>`,

  "Tick meters": `<TickBars total={6} filled={2} />
<SignalBars level={4} tone="red" />
<DottedMeter value={156} max={324} />
<ProgressBar value={83} />`,

  "Delivery timeline": `<DeliveryTimeline
  steps={[
    { title: "Order confirmed", badge: "Done", state: "done" },
    { title: "Shipped", badge: "Done", state: "done" },
    { title: "In transit", badge: "Active", state: "active" },
    { title: "Delivered", badge: "Pending", state: "pending" },
  ]}
/>`,

  "Business Partner CRM": `<StatusPill tone={row.tone}>{row.status}</StatusPill>
<SignalBars level={row.priority} />
<EntityChip name="Peregrin" hue="#0ea5e9" />`,

  "Number ticker": `import { NumberTicker } from "hash-ui";

<NumberTicker value={58980} suffix="+" />
<NumberTicker value={4.98} decimals={2} />
// counts up when scrolled into view`,

  "Typewriter & gradient text": `<Typewriter
  words={["dashboards", "landing pages", "AI panels"]}
/>
<GradientText>Distilled from the wild.</GradientText>`,

  "Shimmer button & border beam": `<ShimmerButton>Get Early Access</ShimmerButton>

<Card className="relative">
  <BorderBeam radius={16} duration={6} />
  …
</Card>`,

  Marquee: `<Marquee duration={24} pauseOnHover>
  {logos.map((l) => (
    <Logo key={l} name={l} />
  ))}
</Marquee>`,

  "Spotlight card": `<Spotlight size={320} color="rgba(52,211,153,0.14)">
  <CardContent />
</Spotlight>`,

  "Tilt card": `<TiltCard max={10}>
  <Card>3D perspective on hover</Card>
</TiltCard>`,

  Meteors: `<Card className="relative overflow-hidden">
  <Meteors count={10} />
  …
</Card>`,

  "Scroll reveal": `<Reveal delay={120}>
  <Card>fades up when scrolled into view</Card>
</Reveal>`,

  "3D orb — three.js (lazy chunk)": `import { ThreeOrb } from "hash-ui";

// three.js loads as a separate chunk,
// only when the scene scrolls into view
<ThreeOrb height={340} />`,
};
