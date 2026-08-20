import { Section, Demo } from "@/components/Section";
import { ThemeStudio } from "@/components/ThemeStudio";
import {
  ACCENTS,
  Button,
  Card,
  StatusPill,
  cx,
  useTheme,
  ICheck,
  type AccentId,
} from "hash-ui";
import { CodeBlock } from "@/components/Code";

const ACCENT_IDS = Object.keys(ACCENTS) as AccentId[];

/* The five presets, live. Clicking one swaps [data-accent] on <html>, so the
   sample beside it — and the entire site around it — recolours at once. */
function AccentPresets() {
  const { accent, setAccent } = useTheme();
  return (
    <div className="grid grid-cols-1 w-full gap-4 lg:grid-cols-[minmax(0,300px)_1fr]">
      <div className="flex flex-col gap-1.5">
        {ACCENT_IDS.map((id) => {
          const a = ACCENTS[id];
          const active = id === accent;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setAccent(id)}
              aria-pressed={active}
              className={cx(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                active
                  ? "border-line-strong bg-elev"
                  : "border-line bg-surface hover:bg-elev",
              )}
            >
              <span
                className="size-7 shrink-0 rounded-[9px] ring-1 ring-black/10 ring-inset"
                style={{ background: a.swatch }}
              />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-[13px] font-semibold text-ink">
                  {a.label}
                </span>
                <span className="block text-[11.5px] text-ink-3">{a.note}</span>
              </span>
              {active && <ICheck size={15} className="shrink-0 text-brand" />}
            </button>
          );
        })}
      </div>

      <Card className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="green">Primary action</Button>
          <Button variant="outline">Secondary</Button>
          <StatusPill tone="green">Live</StatusPill>
        </div>
        <div className="rounded-xl border border-brand/25 bg-brand-soft p-4">
          <div className="microlabel mb-1.5 !text-brand">Tinted surface</div>
          <p className="text-[13px] leading-relaxed text-ink-2">
            Text, borders and fills all resolve through the same four tokens, so
            a preset is a palette swap and never a layout change.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["--brand", "--brand-ink", "--brand-soft"] as const).map((v) => (
            <span
              key={v}
              className="rounded-lg border border-line bg-elev px-2.5 py-1 font-mono text-[11px] text-ink-2"
            >
              {v}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

const surfaceTokens = [
  { name: "canvas", cls: "bg-canvas", desc: "page" },
  { name: "surface", cls: "bg-surface", desc: "cards" },
  { name: "elev", cls: "bg-elev", desc: "nested" },
  { name: "inset", cls: "bg-inset", desc: "wells" },
  { name: "line", cls: "bg-line", desc: "hairlines" },
  { name: "ink", cls: "bg-ink", desc: "text" },
  { name: "ink-2", cls: "bg-ink-2", desc: "secondary" },
  { name: "ink-3", cls: "bg-ink-3", desc: "muted" },
];

const accents = [
  { name: "brand", hex: "#059669", note: "emerald — the recurring accent" },
  { name: "blue", hex: "#2563eb", note: "primary actions (iOS refs)" },
  { name: "orange", hex: "#f97316", note: "ops / navigation accent" },
  { name: "amber", hex: "#f59e0b", note: "time-sensitive" },
  { name: "red", hex: "#ef4444", note: "rejected / offline" },
  { name: "pink", hex: "#ec4899", note: "prospecting / new" },
  { name: "violet", hex: "#8b5cf6", note: "platform" },
  { name: "ring", hex: "#13703a", note: "1px ring under every button face" },
];

export default function Foundations() {
  return (
    <Section
      id="foundations"
      registry="tokens"
      source="hashui.css"
      eyebrow="Foundations"
      title="Theming & tokens"
      desc="Warm neutral canvas, hairline borders, one emerald accent surrounded by purposeful status hues. Depth is expressed with stacked surfaces — the system ships no drop shadows at all."
    >
      {/* The studio comes first: a reader who lands here wants to try the
          theme, not read the palette. The token tables below are the
          reference for when they have picked one. */}
      <Demo
        label="Theme studio — every control writes to this document"
        refName="live"
        contentClassName="!block !min-h-0 !p-4"
      >
        <ThemeStudio />
      </Demo>

      <Demo label="Surfaces & ink" refName="all references">
        <div className="grid w-full grid-cols-4 gap-3 md:grid-cols-8">
          {surfaceTokens.map((t) => (
            <div key={t.name} className="flex flex-col items-center gap-2">
              <span
                className={cx(
                  "h-14 w-full rounded-xl border border-line shadow-soft",
                  t.cls,
                )}
              />
              <span className="font-mono text-[11px] font-medium text-ink">
                {t.name}
              </span>
              <span className="-mt-1.5 text-[10px] text-ink-3">{t.desc}</span>
            </div>
          ))}
        </div>
      </Demo>

      <Demo
        label="Accent presets — click one, the whole site follows"
        contentClassName="!block !p-6"
      >
        <AccentPresets />
      </Demo>

      <Card className="p-5">
        <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">One attribute, five palettes.</span>{" "}
          The presets live in the token sheet under{" "}
          <code className="font-mono">[data-accent]</code>. Each supplies the
          same four values, so switching one is a palette swap — never a change
          in contrast, spacing or layout. The primary button face is built from
          them too, which is why <code className="font-mono">variant="green"</code>{" "}
          is whatever the current accent says it is.
        </p>
        <CodeBlock
          code={`import { useTheme, ACCENTS } from "hash-ui";

const { accent, setAccent } = useTheme();
setAccent("violet");   // persisted, applied to <html data-accent>

// or set it yourself, with no JavaScript at all:
// <html data-accent="violet">`}
        />
      </Card>

      <Demo label="Status vocabulary" refName="status pills across refs">
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          {accents.map((a) => (
            <div
              key={a.name}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 shadow-soft"
            >
              <span
                className="size-9 shrink-0 rounded-[10px] shadow-btn"
                style={{ background: a.hex }}
              />
              <span className="min-w-0 leading-tight">
                <span className="block font-mono text-[12px] font-semibold text-ink">
                  {a.name}
                </span>
                <span className="block truncate text-[11px] text-ink-3">
                  {a.note}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Demo>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="Type voices" refName="see Typography for the live switcher" contentClassName="!justify-start">
          <div className="flex w-full flex-col gap-5">
            <div className="rounded-xl border border-line bg-surface p-5 shadow-soft">
              <div className="microlabel mb-2">SANS — INTERFACE</div>
              <div className="text-[26px] font-bold tracking-[-0.02em] text-ink">
                Order tracking, built for review
              </div>
              <div className="mt-1 text-sm text-ink-2">
                Geist Variable · tight tracking on headings
              </div>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5 shadow-soft">
              <div className="microlabel mb-2">SANS — DISPLAY MOMENTS</div>
              <div className="text-[28px] font-bold tracking-[-0.035em] text-ink">
                A design foundation
              </div>
              <div className="mt-1 text-sm text-ink-2">
                Geist 700 · −0.035em tracking on hero & modal headlines
              </div>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5 shadow-soft">
              <div className="microlabel mb-2">MONO — METRICS & TIME</div>
              <div className="lcd text-[26px] font-bold text-ink">
                2h 50m · 340ms · 99.9%
              </div>
              <div className="mt-1 text-sm text-ink-2">
                Geist Mono · tabular numerals everywhere data lives
              </div>
            </div>
          </div>
        </Demo>

        <Demo label="Radius & surfaces" refName="all references">
          <div className="flex w-full flex-col gap-6">
            <div className="flex items-end justify-center gap-4">
              {[
                { r: "10px", label: "controls" },
                { r: "16px", label: "cards" },
                { r: "24px", label: "panels" },
                { r: "999px", label: "pills" },
              ].map((x) => (
                <div key={x.r} className="flex flex-col items-center gap-2">
                  <span
                    className="size-16 border border-line bg-surface shadow-soft"
                    style={{ borderRadius: x.r }}
                  />
                  <span className="font-mono text-[10.5px] text-ink-2">{x.r}</span>
                  <span className="-mt-1.5 text-[10px] text-ink-3">{x.label}</span>
                </div>
              ))}
            </div>
            {/* depth comes from stacked surfaces + hairlines, never shadows */}
            <div className="rounded-2xl border border-line bg-canvas p-3">
              <div className="rounded-xl border border-line bg-surface p-3">
                <div className="rounded-lg border border-line bg-elev p-3">
                  <div className="rounded-md bg-inset px-3 py-2 text-center font-mono text-[11px] text-ink-2">
                    canvas › surface › elev › inset
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-[12px] text-ink-3">
              Four stacked surfaces and one hairline replace every drop shadow.
            </p>
          </div>
        </Demo>
      </div>
    </Section>
  );
}
