import { Section, Demo, DemoCol } from "@/components/Section";
import { ApiTable } from "@/components/Code";
import {
  AvatarGroup,
  Button,
  ButtonGroup,
  Card,
  CountBadge,
  SplitButton,
  IBed,
  ICalendar,
  ICheck,
  IChevronDown,
  IChevronRight,
  IClock,
  IFilter,
  IFlag,
  IGlobe,
  IHeart,
  ILinkedIn,
  ILock,
  IMap,
  IMapPin,
  IMessage,
  IPencil,
  IPlus,
  IShare,
  ISort,
  IX,
  IXSocial,
} from "hash-ui";

function IMoonSmall() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="#8b5cf6">
      <path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* BUTTONS                                                             */
/* ------------------------------------------------------------------ */

export default function ButtonsSection() {
  return (
    <Section
      id="buttons"
      registry="button"
      source="Button.tsx"
      eyebrow="Components"
      title="Button"
      desc="One recipe for every button: a vertical gradient, a 1px ring of the same hue and a hairline top highlight — the treatment from the credit-score CTA, applied across the palette. Fully rounded by default, no drop shadows anywhere."
    >
      <Demo label="Accent faces" imports={["Button"]} refName="button-001 · top-alert-0001 · datatable-0001">
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Button variant="primary" iconLeft={<IMap size={16} />}>
            Accept &amp; Get Directions
          </Button>
          <Button variant="white" iconLeft={<IX size={15} />}>
            Reject Invite
          </Button>
          <Button variant="white">Start for free</Button>
          <Button variant="danger" iconLeft={<IPlus size={15} />}>
            Add new
          </Button>
        </div>
      </Demo>

      <Demo label="Neutral & utility faces" imports={["Button"]} refName="Ornek2 · Ornek6 · datatable-003 · payment-success-001">
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Button variant="green" iconRight={<IChevronRight size={15} />}>
            Get started for Free
          </Button>
          <Button
            variant="white"
            shape="rect"
            iconRight={<IChevronRight size={14} className="text-ink-3" />}
          >
            Live Demo
          </Button>
          <Button variant="dark" iconLeft={<IPencil size={15} />}>
            Suggest more
          </Button>
          <Button variant="outline">Manage credits</Button>
          <Button variant="green" iconLeft={<ICheck size={15} />}>
            Got It
          </Button>
          <Button variant="ghost">Cancel</Button>
        </div>
      </Demo>

      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Attached group & block button" imports={["ButtonGroup","Button"]} refName="Ornek2">
          <DemoCol className="w-full max-w-sm">
            <ButtonGroup
              className="w-full [&>button]:flex-1"
              items={[
                { label: "Like", icon: <IHeart size={15} /> },
                { label: "Comment", icon: <IMessage size={15} /> },
                { label: "Share", icon: <IShare size={15} /> },
              ]}
            />
            <Button variant="dark" className="w-full" size="lg">
              Reset Password
            </Button>
            <Button variant="outline" iconLeft={<IPlus size={14} />}>
              Add Contact
            </Button>
          </DemoCol>
        </Demo>

        <Demo label="Input-attached action" refName="Ornek2 invite">
          <div className="flex w-full max-w-sm items-center gap-2.5">
            <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-line bg-surface px-3 shadow-soft focus-within:border-line-strong">
              <input
                placeholder="Email address..."
                className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
              />
              <button
                type="button"
                className="flex shrink-0 items-center gap-1 text-[13px] font-medium whitespace-nowrap text-ink-2"
              >
                <IGlobe size={14} className="text-ink-3" /> can view
                <IChevronDown size={12} className="text-ink-3" />
              </button>
            </label>
            <Button variant="outline" className="!h-10">
              Invite
            </Button>
          </div>
        </Demo>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Demo
          label="Social action bar"
          imports={["IconButton", "Button"]}
          refName="button-design-0001.jpg"
          contentClassName="py-12"
        >
          {/* flat lavender tray, squircle tiles inset by ~1/4 of their size */}
          <div className="flex items-center gap-3 rounded-[30px] bg-[#e5ecfb] p-4 dark:bg-[#1b2540]">
            <span className="flex size-20 items-center justify-center rounded-[24px] bg-white text-[#111113]">
              <IXSocial size={34} />
            </span>
            <span className="flex size-20 items-center justify-center rounded-[24px] bg-white text-[#111113]">
              <ILinkedIn size={34} />
            </span>
            <Button
              variant="primary"
              className="!h-20 !rounded-[24px] !px-9 !text-[22px] !font-bold"
            >
              Let’s talk
            </Button>
          </div>
        </Demo>

        <Demo
          label="Waitlist CTA on dark"
          imports={["Button", "CountdownLCD"]}
          refName="button-design-0001.jpeg"
          variant="dark"
        >
          <DemoCol>
            <Button variant="green" size="lg" className="!h-13 !px-12 !text-[16px]">
              Get Early Access
            </Button>
            <span className="flex items-center gap-1.5 text-[13px] text-ink-3">
              <ILock size={13} /> No spam. Priority access only.
            </span>
          </DemoCol>
        </Demo>
      </div>

      <Demo label="Sizes, split & toolbar" refName="datatable-0001 · datatable-0002">
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
          <SplitButton label="Add customer" />
          <Button variant="outline" size="sm" iconLeft={<IFilter size={14} />}>
            Filter <CountBadge tone="orange">3</CountBadge>
          </Button>
          <Button variant="outline" size="sm" iconLeft={<ISort size={14} />}>
            Sort <CountBadge tone="orange">4</CountBadge>
          </Button>
        </div>
      </Demo>

      <Demo
        label="Composition — meeting invite card"
        refName="button-001"
        contentClassName="py-12"
      >
        <Card floating className="w-full max-w-90 rounded-[30px] p-7 text-center">
          <div className="flex justify-center">
            <AvatarGroup
              size="lg"
              people={[
                {
                  name: "Johnny Appleseed",
                  emoji: "😄",
                  tint: "blue",
                  badge: <span className="size-2 rounded-full bg-emerald-500" />,
                },
                {
                  name: "Mina Park",
                  emoji: "😊",
                  tint: "green",
                  badge: <IBed size={9} className="text-ink-2" />,
                },
                {
                  name: "Leo Chen",
                  emoji: "😎",
                  tint: "yellow",
                  badge: (
                    <IMoonSmall />
                  ),
                },
              ]}
            />
          </div>
          <p className="mt-4 text-[19px] leading-snug font-semibold text-ink">
            Johnny Appleseed{" "}
            <span className="font-medium text-ink-3">
              and two others invited you to a meeting.
            </span>
          </p>
          <div className="mt-4 space-y-1.5 text-[15px] text-ink-2">
            <p className="flex items-center justify-center gap-2">
              <ICalendar size={15} className="text-ink-3" /> Tomorrow
            </p>
            <p className="flex items-center justify-center gap-2">
              <IClock size={15} className="text-ink-3" /> at 3:05pm
            </p>
            <p className="flex items-center justify-center gap-2">
              <IFlag size={15} className="text-ink-3" /> until 4:30pm
            </p>
            <p className="flex items-center justify-center gap-2">
              <IMapPin size={15} className="text-ink-3" /> in “Ventura Hwy”
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button variant="primary" size="lg" iconLeft={<IMap size={17} />}>
              Accept &amp; Get Directions
            </Button>
            <Button variant="white" size="lg" iconLeft={<IX size={15} />}>
              Reject Invite
            </Button>
          </div>
        </Card>
      </Demo>

      <ApiTable
        component="Button"
        rows={[
          {
            prop: "variant",
            type: '"green" | "primary" | "dark" | "danger" | "amber" | "white" | "outline" | "ghost"',
            def: '"green"',
            desc: "Hue of the shared gradient + ring face.",
          },
          {
            prop: "shape",
            type: '"pill" | "rect"',
            def: '"pill"',
            desc: "Fully rounded, or a 12px-radius rectangle.",
          },
          {
            prop: "size",
            type: '"sm" | "md" | "lg"',
            def: '"md"',
            desc: "Height and typography scale.",
          },
          {
            prop: "iconLeft / iconRight",
            type: "ReactNode",
            desc: "Optional leading / trailing icon.",
          },
          {
            prop: "loading",
            type: "boolean",
            def: "false",
            desc: "Shows a spinner and disables interaction.",
          },
          {
            prop: "disabled",
            type: "boolean",
            def: "false",
            desc: "Dimmed, non-interactive state.",
          },
        ]}
      />
    </Section>
  );
}
