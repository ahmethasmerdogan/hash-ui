import { useState, useEffect, type ReactNode } from "react";
import { Section, Demo } from "@/components/Section";
import {
  Avatar,
  BorderBeam,
  Button,
  Card,
  Checkbox,
  GoalBar,
  GradientText,
  Marquee,
  Meteors,
  NumberTicker,
  ProgressBar,
  RainbowMeter,
  Reveal,
  SearchField,
  ShimmerButton,
  StatusPill,
  Switch,
  TiltCard,
  Typewriter,
  cx,
  IArrowLeft,
  IArrowRight,
  IBell,
  ICheck,
  IDatabase,
  IFileText,
  IGrid,
  IHome,
  IPulse,
  ISettings,
  ISparkleFill,
  IUsers,
  IZap,
} from "uicean";

/* ------------------------------------------------------------------ */

function TemplateOverlay({
  open,
  onClose,
  name,
  children,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[85] overflow-y-auto bg-canvas">
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-surface/85 px-4 py-2.5 backdrop-blur-lg">
        <Button variant="outline" size="sm" iconLeft={<IArrowLeft size={13} />} onClick={onClose}>
          Back to docs
        </Button>
        <span className="text-[13px] font-semibold text-ink">{name}</span>
        <span className="ml-auto font-mono text-[11px] text-ink-3">
          template preview · built 100% with UICean
        </span>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TEMPLATE 1 — Landing                                                */
/* ------------------------------------------------------------------ */

function LandingTemplate() {
  const logos = ["Spherule", "Railspeed", "Peregrin", "Pollinate", "Eclipseful", "Solaris", "Magnolia"];
  return (
    <div>
      {/* nav */}
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <span className="flex items-center gap-2 text-[15px] font-bold text-ink">
          <span className="flex size-7.5 items-center justify-center rounded-[9px] bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-btn">
            <ISparkleFill size={14} />
          </span>
          Nimbus
        </span>
        <span className="hidden gap-5 text-[13.5px] font-medium text-ink-2 md:flex">
          <span>Product</span>
          <span>Pricing</span>
          <span>Reviews</span>
          <span>Docs</span>
        </span>
        <span className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button variant="white" size="sm">
            Start for free
          </Button>
        </span>
      </div>

      {/* hero */}
      <div className="dot-grid relative overflow-hidden border-y border-line">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-3.5 pl-2 text-[13px] font-medium text-ink shadow-soft">
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                <ISparkleFill size={10} />
              </span>
              Powered by GPT-4o
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-[44px] leading-[1.05] font-bold tracking-[-0.02em] text-ink md:text-[56px]">
              Ship <GradientText>beautiful</GradientText>
              <br />
              <Typewriter
                words={["dashboards", "landing pages", "design systems"]}
                className="text-ink"
              />
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-2">
              The fastest way to turn curated references into production
              interfaces. Guaranteed polish, or your tokens back.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <ShimmerButton>
                Get Early Access <IArrowRight size={15} />
              </ShimmerButton>
              <Button variant="white" shape="rect" iconRight={<IArrowRight size={14} className="text-ink-3" />}>
                Live Demo
              </Button>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                { v: 58980, s: "+", l: "USERS" },
                { v: 148, p: "+", l: "AVG POINTS" },
                { v: 99.9, s: "%", d: 1, l: "UPTIME" },
              ].map((x) => (
                <div key={x.l} className="rounded-xl border border-line bg-surface px-3 py-3.5 shadow-soft">
                  <div className="text-[20px] font-bold text-ink">
                    <NumberTicker value={x.v} prefix={x.p} suffix={x.s} decimals={x.d} />
                  </div>
                  <div className="microlabel mt-0.5">{x.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* logos marquee */}
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="microlabel mb-5 text-center">TRUSTED BY TEAMS AT</div>
        <Marquee duration={22}>
          {logos.map((n) => (
            <span key={n} className="text-[15px] font-semibold tracking-tight text-ink-3">
              {n}
            </span>
          ))}
        </Marquee>
      </div>

      {/* pricing */}
      <div className="border-t border-line bg-elev/60">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-center text-[28px] font-bold tracking-tight text-ink">
            Simple pricing
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="rounded-2xl p-6">
              <div className="text-[15px] font-bold text-ink">Free</div>
              <p className="mt-1 text-[13px] text-ink-2">
                40+ base components, open-source forever.
              </p>
              <div className="mt-4 font-mono text-[24px] font-bold text-ink">
                $0<span className="text-[13px] text-ink-3"> / mo</span>
              </div>
              <Button variant="outline" className="mt-5 w-full">
                Start building
              </Button>
            </Card>
            <Card floating className="relative rounded-2xl p-6">
              <BorderBeam radius={16} duration={5} />
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-ink">Pro</span>
                <StatusPill tone="green" size="sm">
                  Most popular
                </StatusPill>
              </div>
              <p className="mt-1 text-[13px] text-ink-2">
                Sectoral templates, Figma library, priority support.
              </p>
              <div className="mt-4 font-mono text-[24px] font-bold text-ink">
                $16<span className="text-[13px] text-ink-3"> / mo</span>
              </div>
              <Button variant="green" className="mt-5 w-full" iconRight={<IArrowRight size={14} />}>
                Get started for Free
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* dark CTA footer */}
      <div className="dark relative overflow-hidden bg-[#0e0e11] py-16 text-center">
        <Meteors count={12} />
        <div className="relative mx-auto max-w-xl px-6">
          <h2 className="text-[28px] font-bold tracking-tight text-white">
            Ready when you are.
          </h2>
          <p className="mt-2 text-[14px] text-white/60">
            No spam. Priority access only.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="green" size="lg" className="!px-10">
              Get Early Access
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TEMPLATE 2 — Dashboard                                              */
/* ------------------------------------------------------------------ */

function DashboardTemplate() {
  const navItems = [
    { icon: <IHome size={16} />, on: false },
    { icon: <IPulse size={16} />, on: true },
    { icon: <IUsers size={16} />, on: false },
    { icon: <IDatabase size={16} />, on: false },
    { icon: <ISettings size={16} />, on: false },
  ];
  const rows = [
    { name: "Santi Carloza", org: "Microsoft", v: "$15,900,000", tone: "amber" as const, s: "In Negotiation" },
    { name: "Arlene McCoy", org: "MAC Tools", v: "$8,500,000", tone: "green" as const, s: "Accepted" },
    { name: "Kae Sank Pank", org: "Spherule", v: "$9,850,000", tone: "blue" as const, s: "Under Review" },
    { name: "Giebran Reka", org: "Sisyphus", v: "$10,700,000", tone: "pink" as const, s: "Prospecting" },
  ];
  return (
    <div className="flex min-h-[calc(100vh-49px)]">
      {/* icon rail */}
      <div className="hidden w-16 flex-col items-center gap-2 border-r border-line bg-surface py-4 md:flex">
        <span className="mb-2 flex size-9 items-center justify-center rounded-[10px] bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-btn">
          <ISparkleFill size={15} />
        </span>
        {navItems.map((n, i) => (
          <span
            key={i}
            className={cx(
              "flex size-9 items-center justify-center rounded-[10px]",
              n.on
                ? "border border-line bg-elev text-ink shadow-soft"
                : "text-ink-3",
            )}
          >
            {n.icon}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        {/* topbar */}
        <div className="flex items-center gap-3 border-b border-line bg-surface px-5 py-3">
          <span className="text-[17px] font-bold tracking-tight text-ink">
            Emissions dashboard
          </span>
          <span className="ml-auto hidden w-64 md:block">
            <SearchField />
          </span>
          <IBell size={16} className="text-ink-3" />
          <Avatar name="Stephen S." size="sm" />
        </div>

        <div className="mx-auto max-w-5xl p-5 md:p-7">
          {/* stat row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { l: "CO₂e emitted", v: 1223, u: "kg", d: "↓ 22.1%", good: true },
              { l: "CO₂e saved", v: 42500, u: "kg", d: "↑ 22.1%", good: true },
              { l: "Emission intensity", v: 2.29, u: "t/km", d: "↓ 2.2%", good: true, dec: 2 },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 90}>
                <Card className="rounded-2xl p-4.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-ink-2">{s.l}</span>
                    <span className="text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {s.d}
                    </span>
                  </div>
                  <div className="mt-2 text-[26px] font-bold text-ink">
                    <NumberTicker value={s.v} decimals={s.dec ?? 0} />{" "}
                    <span className="text-[13px] font-medium text-ink-3">{s.u}</span>
                  </div>
                  <div className="microlabel mt-1">LAST 30 DAYS</div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* goal + score */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Reveal>
              <Card className="rounded-2xl p-5">
                <div className="text-[13.5px] font-semibold text-ink">
                  Goal: 80% emissions reduction by 2030
                </div>
                <div className="mt-1 text-[12px] text-ink-3">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">3%</span>{" "}
                  closer to your goal
                </div>
                <GoalBar className="mt-4" value={27} target={80} marks={[0, 27, 80, 100]} />
              </Card>
            </Reveal>
            <Reveal delay={100}>
              <Card className="rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-semibold text-ink">Fleet score</span>
                  <StatusPill tone="green" size="sm" dot>
                    Improving
                  </StatusPill>
                </div>
                <RainbowMeter className="mt-4" ticks={48} />
                <div className="mt-3 flex items-center justify-between">
                  <span className="microlabel">SCORE 700–850 = EFFECTIVE</span>
                  <span className="font-mono text-[13px] font-bold text-ink">
                    <NumberTicker value={812} />
                  </span>
                </div>
              </Card>
            </Reveal>
          </div>

          {/* table */}
          <Reveal delay={120}>
            <Card className="mt-4 overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-[14px] font-bold text-ink">Partners</span>
                <span className="flex items-center gap-2.5 text-[12.5px] text-ink-2">
                  Show changes <Switch size="sm" checked label="Show changes" />
                </span>
              </div>
              <div className="scroll-thin overflow-x-auto">
                <table className="w-full min-w-[560px] text-[13px]">
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.name} className="border-b border-line last:border-0 hover:bg-elev">
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-2.5 font-medium whitespace-nowrap text-ink">
                            <Avatar name={r.name} size="sm" /> {r.name}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-ink-2">{r.org}</td>
                        <td className="px-4 py-2.5 font-mono whitespace-nowrap text-ink tabular-nums">
                          {r.v}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <StatusPill tone={r.tone} size="sm">
                            {r.s}
                          </StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-line px-4 py-2.5">
                <ProgressBar value={75} />
                <div className="mt-1.5 flex justify-between">
                  <span className="microlabel">Q3 TARGET</span>
                  <span className="microlabel">75% COMPLETE</span>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TEMPLATE 3 — Auth                                                   */
/* ------------------------------------------------------------------ */

function AuthField({
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
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] text-ink-2">{label}</span>
      <span
        className={cx(
          "flex h-12 items-center gap-2 rounded-[10px] border bg-surface px-3.5 transition-all",
          focus
            ? "border-emerald-500 ring-[3px] ring-emerald-500/15"
            : "border-line-strong",
        )}
      >
        <input
          defaultValue={value}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-ink-3"
        />
        {right}
      </span>
    </label>
  );
}

/* the miniature product shot that peeks in from the bottom of the panel */
function PostdripsMock() {
  return (
    <div className="w-[560px] overflow-hidden rounded-t-[18px] border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="flex size-5 items-center justify-center rounded-[6px] bg-emerald-600 text-[8px] font-black text-white">
          PD
        </span>
        <span className="text-[13.5px] font-bold text-ink">Postdrips</span>
      </div>
      <div className="flex">
        <div className="w-40 shrink-0 border-r border-line p-3">
          <div className="flex gap-1.5">
            {["Drafts", "Queue"].map((t, i) => (
              <span
                key={t}
                className={cx(
                  "flex h-7 flex-1 items-center justify-center gap-1 rounded-[8px] text-[11.5px] font-medium",
                  i === 0
                    ? "border border-line bg-surface text-ink"
                    : "text-ink-3",
                )}
              >
                <IFileText size={11} />
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3 flex h-28 flex-col items-center justify-center gap-2 rounded-[10px] border border-line bg-elev">
            <span className="flex flex-col gap-1">
              {[16, 22, 12].map((w, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full bg-line-strong"
                  style={{ width: w * 1.6 }}
                />
              ))}
            </span>
            <span className="text-[10.5px] text-ink-3">No drafts to display</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 p-3">
          <div className="flex gap-1.5">
            {[
              { l: "AI Writer", on: true },
              { l: "Snippets", on: false },
              { l: "Comment", on: false },
            ].map((t) => (
              <span
                key={t.l}
                className={cx(
                  "flex h-7 shrink-0 items-center gap-1.5 rounded-[8px] px-2.5 text-[11.5px] font-medium whitespace-nowrap",
                  t.on
                    ? "border border-emerald-500/50 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300"
                    : "border border-line text-ink-2",
                )}
              >
                <ISparkleFill size={10} />
                {t.l}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-ink-2">
            Scheduling LinkedIn posts is a great way to ensure you reach your
            audience when they are most likely to be online and engaged.
          </p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            You can schedule posts to be published at any time, no matter what
            their schedule is like.
          </p>
        </div>
        <div className="w-36 shrink-0 border-l border-line p-3">
          <div className="text-[12px] font-bold text-ink">AI Writer</div>
          <div className="mt-2 flex flex-col gap-1.5">
            {[
              ["Expand", "Let AI write"],
              ["Wrap Up", "Write engaging"],
              ["Fix Grammar", "Fix the grammar"],
            ].map(([t, d]) => (
              <span
                key={t}
                className="rounded-[8px] border border-line px-2 py-1.5"
              >
                <span className="block text-[11px] font-semibold text-ink">
                  {t}
                </span>
                <span className="block text-[9.5px] text-ink-3">{d}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthTemplate() {
  return (
    <div className="grid grid-cols-1 min-h-[calc(100vh-49px)] lg:grid-cols-2">
      {/* ---- form side ---- */}
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-[380px]">
          <span className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-[9px] bg-emerald-600 text-[9px] font-black text-white">
              PD
            </span>
            <span className="text-[19px] font-bold tracking-tight text-ink">
              Postdrips
            </span>
          </span>

          <h1 className="mt-11 text-[27px] font-bold tracking-tight text-ink">
            Create an account
          </h1>

          <button
            type="button"
            className="mt-6 flex h-12 w-full items-center justify-center gap-2.5 rounded-[10px] border border-line-strong bg-surface text-[14.5px] font-medium text-ink transition-colors hover:bg-elev"
          >
            <GoogleGlyph /> Sign up with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[12.5px] text-ink-3">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AuthField label="First name" value="Luke" />
            <AuthField label="Last name" value="Dalton" />
          </div>
          <div className="mt-4">
            <AuthField label="Email" value="luke@exaltstudio.co" focus />
          </div>
          <div className="mt-4">
            <AuthField
              label="Password"
              placeholder=""
              right={<IEyeOffGlyph />}
            />
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <span className="mt-0.5">
              <Checkbox label="Remember me" />
            </span>
            <span className="text-[13px] leading-snug text-ink-2">
              I don’t want to receive emails about Postdrips feature updates and
              best practices.
            </span>
          </label>

          <p className="mt-5 text-[13px] leading-snug text-ink-2">
            By creating an account, you agree to our{" "}
            <span className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400">
              Privacy Policy
            </span>
            .
          </p>

          <Button variant="green" className="mt-7 w-full" size="lg">
            Create account
          </Button>
        </div>
      </div>

      {/* ---- testimonial side ---- */}
      <div className="relative hidden overflow-hidden bg-[linear-gradient(105deg,#04140d_0%,#05261a_28%,#0c6b45_62%,#22c07a_100%)] lg:block">
        <span className="blueprint absolute inset-y-0 right-0 w-2/3" />
        <div className="relative flex h-full flex-col justify-between px-12 pt-20">
          <div>
            <p className="max-w-lg text-[26px] leading-[1.35] font-bold text-white">
              “My experience with this platform so far has been great.
              Everything is easy, from creating visuals to scheduling,
              collaboration and many more”
            </p>
            <div className="mt-7 flex items-center gap-3.5">
              <span className="flex size-11 items-center justify-center rounded-[12px] bg-emerald-300/90 text-[22px] leading-none font-black text-emerald-900">
                “
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-semibold text-white">
                  Bettie Porter
                </span>
                <span className="block text-[13px] text-white/60">
                  Senior Marketing Manager
                </span>
              </span>
            </div>
          </div>

          <div className="mt-14 flex justify-center pl-16">
            <PostdripsMock />
          </div>
        </div>
      </div>
    </div>
  );
}

function IEyeOffGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-3">
      <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-2.2 3.1M6.6 6.6A16.6 16.6 0 0 0 2.5 12S6 19 12 19c1.5 0 2.9-.4 4.1-1M3 3l18 18" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
function GoogleGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION                                                             */
/* ------------------------------------------------------------------ */

const TEMPLATES = [
  {
    id: "landing",
    name: "Nimbus — Landing",
    desc: "Hero with typewriter + shimmer CTA, marquee, pricing with border beam, meteor footer.",
    cover: "bg-[linear-gradient(135deg,#059669_0%,#22d3ee_50%,#8b5cf6_100%)]",
    icon: <IZap size={18} />,
  },
  {
    id: "dashboard",
    name: "Emissions — Dashboard",
    desc: "Icon rail, animated stat tickers, goal bar, rainbow meter and a partners table.",
    cover: "bg-[linear-gradient(135deg,#065f46_0%,#059669_55%,#a7f3d0_100%)]",
    icon: <IGrid size={18} />,
  },
  {
    id: "auth",
    name: "Postdrips — Auth",
    desc: "Split sign-up with green focus rings, spotlight testimonial and a tilting app card.",
    cover: "bg-[linear-gradient(135deg,#0f766e_0%,#34d399_60%,#fbbf24_110%)]",
    icon: <ICheck size={18} />,
  },
] as const;

export default function TemplatesSection() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Section
      id="templates"
      eyebrow="Patterns"
      title="Templates"
      desc="Three full-screen demo sites assembled entirely from UICean primitives and the new motion layer — open them like real products."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {TEMPLATES.map((t, i) => (
          <Reveal key={t.id} delay={i * 100}>
            <TiltCard max={6}>
              <Card floating className="overflow-hidden rounded-[20px]">
                <div className={cx("grain relative h-36", t.cover)}>
                  <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-[12px] border border-white/40 bg-white/25 text-white backdrop-blur-md">
                    {t.icon}
                  </span>
                </div>
                <div className="p-4.5">
                  <div className="text-[14.5px] font-bold text-ink">{t.name}</div>
                  <p className="mt-1 min-h-14 text-[12.5px] leading-relaxed text-ink-2">
                    {t.desc}
                  </p>
                  <Button
                    variant="dark"
                    size="sm"
                    className="mt-3 w-full"
                    iconRight={<IArrowRight size={13} />}
                    onClick={() => setOpen(t.id)}
                  >
                    Open preview
                  </Button>
                </div>
              </Card>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <TemplateOverlay
        open={open === "landing"}
        onClose={() => setOpen(null)}
        name="Nimbus — Landing"
      >
        <LandingTemplate />
      </TemplateOverlay>
      <TemplateOverlay
        open={open === "dashboard"}
        onClose={() => setOpen(null)}
        name="Emissions — Dashboard"
      >
        <DashboardTemplate />
      </TemplateOverlay>
      <TemplateOverlay
        open={open === "auth"}
        onClose={() => setOpen(null)}
        name="Postdrips — Auth"
      >
        <AuthTemplate />
      </TemplateOverlay>
    </Section>
  );
}
