import { Section, Demo, DemoCol } from "@/components/Section";
import {
  BorderBeam,
  Button,
  Card,
  GradientText,
  Marquee,
  Meteors,
  NumberTicker,
  Reveal,
  ShimmerButton,
  Spotlight,
  StatusPill,
  ThreeOrb,
  TiltCard,
  Typewriter,
  IArrowRight,
  IBox,
  ICompass,
  ICube,
  IDatabase,
  IGrid,
  ILayers,
  ISparkleFill,
  IZap,
} from "hash-ui";

function MarqueeLogos() {
  const logos = [
    { icon: <ISparkleFill size={15} />, name: "HashUI" },
    { icon: <ICube size={15} />, name: "Spherule" },
    { icon: <IZap size={15} />, name: "Railspeed" },
    { icon: <IGrid size={15} />, name: "Peregrin" },
    { icon: <ILayers size={15} />, name: "Pollinate" },
    { icon: <IDatabase size={15} />, name: "Eclipseful" },
    { icon: <ICompass size={15} />, name: "Solaris" },
    { icon: <IBox size={15} />, name: "Magnolia" },
  ];
  return (
    <div className="flex w-full flex-col gap-5">
      <Marquee duration={24}>
        {logos.map((l) => (
          <span
            key={l.name}
            className="flex items-center gap-2 text-[15px] font-semibold text-ink-3"
          >
            <span className="text-ink-2">{l.icon}</span>
            {l.name}
          </span>
        ))}
      </Marquee>
      <Marquee duration={30} reverse>
        {logos.map((l) => (
          <span
            key={l.name}
            className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-[13.5px] font-medium text-ink-2 shadow-soft"
          >
            {l.icon}
            {l.name}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export default function MotionSection() {
  return (
    <Section
      id="motion"
      registry={["motion", "three-orb"]}
      source="Motion.tsx"
      eyebrow="Components"
      title="Motion & effects"
      desc="MagicUI-style animation primitives — tickers, typewriters, marquees, shimmer borders, spotlights and meteors — all dependency-free, plus a lazy-loaded three.js scene."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Number ticker" refName="hashui motion" contentClassName="py-10">
          <div className="grid w-full max-w-md grid-cols-3 gap-3">
            {[
              { v: 58980, l: "USERS", suffix: "+" },
              { v: 148, l: "AVG POINTS", prefix: "+" },
              { v: 4.98, l: "RATING", decimals: 2 },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-line bg-surface px-3 py-4 text-center shadow-soft"
              >
                <div className="text-[22px] font-bold text-ink">
                  <NumberTicker
                    value={s.v}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    decimals={s.decimals}
                  />
                </div>
                <div className="microlabel mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </Demo>

        <Demo label="Typewriter & gradient text" refName="hashui motion" contentClassName="py-10">
          <DemoCol>
            <div className="text-center text-[26px] leading-snug font-bold tracking-tight text-ink">
              Build{" "}
              <Typewriter
                words={["dashboards", "landing pages", "AI panels", "design systems"]}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div className="text-[26px] font-bold tracking-tight">
              <GradientText>Distilled from the wild.</GradientText>
            </div>
          </DemoCol>
        </Demo>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Shimmer button & border beam" refName="hashui motion" variant="dark" contentClassName="py-12">
          <DemoCol className="w-full max-w-sm">
            <ShimmerButton>
              <ISparkleFill size={14} /> Get Early Access
            </ShimmerButton>
            <Card className="relative w-full rounded-2xl p-5">
              <BorderBeam radius={16} />
              <div className="flex items-center justify-between">
                <span className="text-[14.5px] font-bold text-ink">Pro plan</span>
                <StatusPill tone="green" size="sm">
                  Most popular
                </StatusPill>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
                Sectoral templates, Figma library, priority support.
              </p>
              <div className="mt-3 font-mono text-[15px] font-bold text-ink">
                $16 / mo
              </div>
            </Card>
          </DemoCol>
        </Demo>

        <Demo label="Meteors" refName="hashui motion" variant="dark" contentClassName="py-12">
          <Card className="relative w-full max-w-sm overflow-hidden rounded-2xl p-6">
            <Meteors count={10} />
            <StatusPill tone="green" size="sm" dot>
              Live
            </StatusPill>
            <div className="mt-3 text-[19px] font-bold text-ink">
              99.9% uptime, every region
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
              Meteors are pure CSS — position, delay and duration are derived
              deterministically per index.
            </p>
          </Card>
        </Demo>
      </div>

      <Demo label="Marquee" refName="hashui motion" contentClassName="py-10 !px-0">
        <MarqueeLogos />
      </Demo>

      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Spotlight card" refName="hashui motion" contentClassName="py-10">
          <Spotlight className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-card">
            <div className="text-[15px] font-bold text-ink">
              Hover me — the light follows
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
              A radial highlight tracks the cursor via two CSS variables. Zero
              dependencies, works in both themes.
            </p>
            <Button variant="outline" size="sm" className="mt-4" iconRight={<IArrowRight size={13} />}>
              Learn more
            </Button>
          </Spotlight>
        </Demo>

        <Demo label="Tilt card" refName="hashui motion" contentClassName="py-10">
          <TiltCard className="w-full max-w-sm">
            <Card floating className="rounded-2xl p-6">
              <span className="flex size-10 items-center justify-center rounded-[12px] bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-btn">
                <ICube size={18} />
              </span>
              <div className="mt-3 text-[15px] font-bold text-ink">
                3D perspective on hover
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                rotateX / rotateY are computed from the cursor position inside
                the card.
              </p>
            </Card>
          </TiltCard>
        </Demo>
      </div>

      <Demo label="Scroll reveal" refName="hashui motion" contentClassName="py-10">
        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
          {[0, 120, 240].map((d, i) => (
            <Reveal key={d} delay={d}>
              <Card className="rounded-2xl p-5 text-center">
                <div className="font-mono text-[20px] font-bold text-ink">
                  0{i + 1}
                </div>
                <div className="mt-1 text-[12.5px] text-ink-2">
                  delay {d}ms
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Demo>

      <Demo label="3D orb — three.js (lazy chunk)" refName="hashui motion" variant="dark" contentClassName="!p-2">
        <ThreeOrb className="bg-[radial-gradient(120%_120%_at_50%_0%,#0f2a1e_0%,#0b0b0e_60%)]" />
      </Demo>
    </Section>
  );
}
