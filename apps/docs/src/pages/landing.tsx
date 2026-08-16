import { Link } from "react-router-dom";
import {
  AnnouncementPill,
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CountBadge,
  DotTabs,
  GoalBar,
  NumberTicker,
  OutlineBadge,
  Reveal,
  RingProgress,
  SignalBars,
  StatusPill,
  Switch,
  TickBars,
  cx,
  IArrowRight,
  IArrowUpRight,
  ICheck,
  IClock,
  IGrid,
  ILayers,
  IMoon,
  ISparkleFill,
  IZap,
} from "hash-ui";
import { LogoMark } from "@/components/Logo";
import { InstallTabs } from "@/components/InstallTabs";
import { CodeBlock } from "@/components/Code";
import { SITE } from "@/lib/site";
import { COMPONENT_PAGES } from "@/lib/routes";
import { IGithub } from "@/app/Topbar";

const STATS = [
  { v: 70, suffix: "+", l: "COMPONENTS" },
  { v: 83, suffix: "", l: "HAND-DRAWN ICONS" },
  { v: 36, suffix: "", l: "REFERENCES STUDIED" },
  { v: 0, suffix: "", l: "RUNTIME UI DEPS" },
];

const FEATURES = [
  {
    icon: <IGrid size={18} />,
    title: "Two install routes",
    chip: { label: "npm + CLI", cls: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
    desc: "Import from the package, or copy the source in with the shadcn CLI and own it outright.",
  },
  {
    icon: <ILayers size={18} />,
    title: "Zero shadows, by rule",
    chip: { label: "FLAT", cls: "bg-blue-500/12 text-blue-600 dark:text-blue-300" },
    desc: "Depth comes from four stacked surfaces and a hairline — never a drop shadow.",
  },
  {
    icon: <IMoon size={18} />,
    title: "One token set, two themes",
    chip: { label: "BUILT-IN", cls: "bg-violet-500/12 text-violet-600 dark:text-violet-300" },
    desc: "Flip a class on <html> and the whole system re-themes. No duplicated palettes.",
  },
];

function Sampler() {
  return (
    <div className="dot-grid grid gap-4 rounded-[22px] border border-line bg-canvas p-5 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="rounded-2xl p-5">
        <div className="microlabel mb-3">BUTTONS</div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="green" size="sm">
            Get started
          </Button>
          <Button variant="primary" size="sm">
            Primary
          </Button>
          <Button variant="dark" size="sm">
            Dark
          </Button>
          <Button variant="outline" size="sm">
            Outline
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl p-5">
        <div className="microlabel mb-3">STATUS VOCABULARY</div>
        <div className="flex flex-wrap gap-2">
          <StatusPill tone="green" size="sm">
            Accepted
          </StatusPill>
          <StatusPill tone="amber" size="sm" icon={<IClock size={11} />}>
            Time-Sensitive
          </StatusPill>
          <StatusPill tone="red" size="sm" dot>
            Live
          </StatusPill>
          <StatusPill tone="violet" size="sm" icon={<IZap size={11} />}>
            Platform
          </StatusPill>
        </div>
      </Card>

      <Card className="rounded-2xl p-5">
        <div className="microlabel mb-3">PEOPLE</div>
        <div className="flex items-center gap-3">
          <AvatarGroup
            size="md"
            people={[
              { name: "Ava Miller", emoji: "😄", tint: "blue" },
              { name: "Noah Kim", emoji: "😊", tint: "green" },
              { name: "Liam Ortiz", emoji: "😎", tint: "yellow" },
              { name: "Kai Wong" },
            ]}
          />
          <Avatar name="Mina Park" size="md" status="online" ring />
        </div>
      </Card>

      <Card className="rounded-2xl p-5">
        <div className="microlabel mb-3">METERS</div>
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-3">
            <TickBars total={6} filled={4} />
            <span className="font-mono text-[12px] text-emerald-600 dark:text-emerald-400">
              4/6
            </span>
            <SignalBars level={3} />
            <RingProgress value={0.62} size={20} stroke={3} />
          </span>
          <GoalBar value={27} target={80} marks={[0, 27, 80, 100]} />
        </div>
      </Card>

      <Card className="rounded-2xl p-5">
        <div className="microlabel mb-3">CONTROLS</div>
        <div className="flex flex-wrap items-center gap-4">
          <Switch checked />
          <Switch size="sm" />
          <OutlineBadge tone="green">Priority</OutlineBadge>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-2">
            Filter <CountBadge tone="orange">3</CountBadge>
          </span>
        </div>
      </Card>

      <Card className="rounded-2xl p-5">
        <div className="microlabel mb-3">TABS</div>
        <div className="dark -mx-1 rounded-xl bg-[#111113] p-3">
          <DotTabs
            items={[
              { id: "a", label: "Discover" },
              { id: "b", label: "Models" },
              { id: "c", label: "Avatars" },
            ]}
            dotted="a"
          />
        </div>
      </Card>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
      {/* ---------------------------------------------------- hero ---- */}
      <section className="pt-10 md:pt-16">
        <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface">
          <div className="grain relative h-40 overflow-hidden bg-[linear-gradient(105deg,#0d9488_0%,#059669_26%,#22c55e_52%,#84cc16_78%,#10b981_100%)] md:h-48">
            <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_50%_-40%,rgba(255,255,255,0.4),transparent_62%)]" />
            <div className="absolute inset-x-0 top-1/2 z-[2] flex -translate-y-1/2 items-center justify-center">
              <span className="rounded-[26%] border border-white/35 bg-white/15 p-2.5 backdrop-blur-md">
                <LogoMark size={68} radius={0.22} />
              </span>
            </div>
          </div>

          <div className="px-6 pt-9 pb-11 text-center md:px-12">
            <div className="mb-7 flex justify-center">
              <AnnouncementPill chip={SITE.version}>
                npm package · shadcn registry · MIT
              </AnnouncementPill>
            </div>

            <h1 className="mx-auto max-w-3xl text-[42px] leading-[1.04] font-bold tracking-[-0.035em] text-ink md:text-[58px]">
              A design foundation,
              <br />
              distilled from the wild.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-ink-2">
              HashUI turns a folder of curated interface screenshots into a
              reusable React&nbsp;19 + Tailwind&nbsp;v4 system — tokens,
              primitives and pixel-faithful recreations of every reference, in
              light and dark.
            </p>

            <div className="mx-auto mt-8 max-w-lg text-left">
              <InstallTabs items={["hashui"]} defaultMode="npm" />
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/docs/components/button">
                <Button variant="green" size="lg" iconRight={<IArrowRight size={17} />}>
                  Browse components
                </Button>
              </Link>
              <Link to="/docs/installation">
                <Button variant="white" size="lg">
                  Installation
                </Button>
              </Link>
              <a href={SITE.github} target="_blank" rel="noreferrer">
                <Button variant="dark" size="lg" iconLeft={<IGithub size={16} />}>
                  GitHub
                </Button>
              </a>
            </div>

            <div className="mx-auto mt-11 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-line bg-elev px-3 py-3.5 text-center"
                >
                  <div className="font-mono text-[22px] font-bold text-ink">
                    <NumberTicker value={s.v} suffix={s.suffix} />
                  </div>
                  <div className="microlabel mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ features ---- */}
      <section className="pt-16">
        <div className="grid divide-line overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-3 md:divide-x">
          {FEATURES.map((it) => (
            <div
              key={it.title}
              className="flex flex-col items-center px-6 py-7 text-center"
            >
              <span className="flex size-11 items-center justify-center rounded-[13px] border border-line bg-elev text-ink-2">
                {it.icon}
              </span>
              <div className="mt-3.5 flex items-center gap-2">
                <span className="text-[14.5px] font-bold text-ink">{it.title}</span>
                <span
                  className={cx(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                    it.chip.cls,
                  )}
                >
                  {it.chip.label}
                </span>
              </div>
              <p className="mt-1.5 max-w-60 text-[12.5px] leading-relaxed text-ink-3">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- sampler ---- */}
      <section className="pt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="microlabel mb-2 flex items-center gap-2 !text-brand">
              <span aria-hidden>[</span> Live, not screenshots{" "}
              <span aria-hidden>]</span>
            </div>
            <h2 className="text-[26px] font-bold tracking-[-0.02em] text-ink">
              Everything below is the real thing
            </h2>
          </div>
          <Link
            to="/docs/components/button"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-2 transition-colors hover:text-ink"
          >
            All {COMPONENT_PAGES.length} component pages <IArrowRight size={14} />
          </Link>
        </div>
        <Reveal>
          <Sampler />
        </Reveal>
      </section>

      {/* --------------------------------------------------- usage ---- */}
      <section className="grid gap-6 pt-16 lg:grid-cols-2">
        <div>
          <div className="microlabel mb-2 flex items-center gap-2 !text-brand">
            <span aria-hidden>[</span> Two lines of setup{" "}
            <span aria-hidden>]</span>
          </div>
          <h2 className="text-[26px] leading-snug font-bold tracking-[-0.02em] text-ink">
            Install it like Tailwind. Use it like your own code.
          </h2>
          <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-2">
            One import for the stylesheet, one barrel for the components. The
            package ships types, ESM and the token sheet; nothing else is
            required at runtime beyond React.
          </p>
          <div className="mt-5 flex flex-col gap-2.5">
            {[
              "React 18 and 19, Vite or Next.js App Router",
              "Tailwind CSS v4 — tokens exposed through @theme inline",
              "75 tree-shakeable SVG icons, no icon package",
              "three.js only if you use <ThreeOrb />, as an optional peer",
            ].map((t) => (
              <span key={t} className="flex items-start gap-2.5 text-[13.5px] text-ink-2">
                <ICheck
                  size={12}
                  strokeWidth={3}
                  className="mt-1 shrink-0 rounded-full bg-emerald-500/15 p-0.5 text-emerald-600 dark:text-emerald-400"
                />
                {t}
              </span>
            ))}
          </div>
          <Link
            to="/docs/installation"
            className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink transition-colors hover:text-brand"
          >
            Read the installation guide <IArrowUpRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <CodeBlock
            filename="src/index.css"
            code={`@import "tailwindcss";
@import "hash-ui/css";`}
          />
          <CodeBlock
            filename="src/App.tsx"
            code={`import { ThemeProvider, ToastProvider, Button, StatusPill } from "hash-ui";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Button variant="green">Get started for Free</Button>
        <StatusPill tone="green">Accepted</StatusPill>
      </ToastProvider>
    </ThemeProvider>
  );
}`}
          />
        </div>
      </section>

      {/* ----------------------------------------------------- cta ---- */}
      <section className="pt-16">
        <Card
          floating
          className="grain relative overflow-hidden rounded-[26px] border-0 bg-[radial-gradient(130%_160%_at_85%_-20%,#14532d_0%,#0c2a1c_55%,#081f15_100%)] px-8 py-12 text-center"
        >
          <span className="mx-auto flex size-14 items-center justify-center rounded-[18px] border border-emerald-300/25 bg-emerald-400/10 text-emerald-300">
            <ISparkleFill size={24} />
          </span>
          <h2 className="mt-5 text-[30px] font-bold tracking-[-0.03em] text-white">
            Take the parts you need
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[14.5px] leading-relaxed text-emerald-100/70">
            Every component is served as a registry item, so{" "}
            <code className="font-mono text-emerald-300">shadcn add</code> drops
            the source straight into your repo — editable, yours, no dependency.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/docs/registry">
              <Button variant="green" size="lg" iconRight={<IArrowRight size={16} />}>
                How the registry works
              </Button>
            </Link>
            <a href={SITE.github} target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                size="lg"
                className="!border-white/20 !bg-white/5 !text-white hover:!bg-white/10"
                iconLeft={<IGithub size={16} />}
              >
                Star on GitHub
              </Button>
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
