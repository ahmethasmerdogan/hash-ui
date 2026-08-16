import { Section, Demo } from "@/components/Section";
import { cx } from "hash-ui";

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
  { name: "ring", hex: "#178a47", note: "1px ring under every button face" },
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

      <Demo label="Accent system" refName="status pills across refs">
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

      <div className="grid gap-6 lg:grid-cols-2">
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
