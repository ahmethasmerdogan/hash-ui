import { Section, Demo } from "@/components/Section";
import { Card, FONTS, cx, type FontId, useTheme, ICheck } from "hash-ui";

const SCALE = [
  { px: 44, w: 700, label: "Display", sample: "A design foundation" },
  { px: 28, w: 700, label: "Heading", sample: "Change-tracking grid" },
  { px: 19, w: 600, label: "Subheading", sample: "Order tracking, built for review" },
  { px: 15, w: 400, label: "Body", sample: "Every color, radius and motion token lives in one CSS block." },
  { px: 13, w: 500, label: "Label", sample: "Assigned unit" },
  { px: 11, w: 600, label: "Micro", sample: "EVENTS TODAY" },
];

const WEIGHTS = [
  [300, "Light"],
  [400, "Regular"],
  [500, "Medium"],
  [600, "SemiBold"],
  [700, "Bold"],
  [800, "ExtraBold"],
] as const;

function FontPicker() {
  const { font, setFont } = useTheme();
  return (
    <div className="grid grid-cols-1 w-full gap-3 sm:grid-cols-3">
      {(Object.keys(FONTS) as FontId[]).map((id) => {
        const f = FONTS[id];
        const on = font === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setFont(id)}
            className={cx(
              "rounded-2xl border-2 px-4 py-4 text-left transition-colors",
              on
                ? "border-brand bg-brand/6"
                : "border-line bg-surface hover:border-line-strong",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[24px] font-semibold tracking-tight text-ink"
                style={{ fontFamily: f.stack }}
              >
                Ag
              </span>
              <span
                className={cx(
                  "flex size-5 items-center justify-center rounded-full border transition-colors",
                  on
                    ? "border-brand bg-brand text-white"
                    : "border-line-strong",
                )}
              >
                {on && <ICheck size={11} strokeWidth={3.5} />}
              </span>
            </div>
            <div className="mt-2.5 text-[14px] font-semibold text-ink">
              {f.label}
            </div>
            <div className="text-[12px] text-ink-3">{f.note}</div>
          </button>
        );
      })}
    </div>
  );
}

export default function TypographySection() {
  const { font } = useTheme();
  return (
    <Section
      id="typography"
      registry="theme"
      source="theme.tsx"
      eyebrow="Foundations"
      title="Typography"
      desc="Geist is the system typeface and Geist Mono carries every number, timestamp and code sample. Switch the sans stack below — the entire site re-renders live, so you can judge the system in a different voice."
    >
      <Demo label="Typeface (live switch)" refName="hashui foundation">
        <FontPicker />
      </Demo>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Demo label="Type scale" refName="hashui foundation" contentClassName="!items-stretch !justify-start py-8">
          <div className="flex w-full flex-col gap-5">
            {SCALE.map((s) => (
              <div key={s.label} className="flex items-baseline gap-5">
                <span className="w-20 shrink-0 font-mono text-[10.5px] text-ink-3 tabular-nums">
                  {s.px}px
                </span>
                <span
                  className="min-w-0 truncate text-ink"
                  style={{ fontSize: s.px, fontWeight: s.w, letterSpacing: s.px > 30 ? "-0.02em" : undefined }}
                >
                  {s.sample}
                </span>
              </div>
            ))}
          </div>
        </Demo>

        <Demo label="Weights" refName="variable axis 100–900" contentClassName="!items-stretch !justify-start py-8">
          <div className="flex w-full flex-col gap-3.5">
            {WEIGHTS.map(([w, name]) => (
              <div key={w} className="flex items-baseline gap-4">
                <span className="w-8 shrink-0 font-mono text-[10.5px] text-ink-3 tabular-nums">
                  {w}
                </span>
                <span
                  className="text-[19px] text-ink"
                  style={{ fontWeight: w }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </Demo>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="Geist Mono — data voice" refName="all metric refs" contentClassName="!items-stretch py-8">
          <Card className="w-full rounded-2xl p-5">
            <div className="microlabel mb-3">TABULAR NUMERALS</div>
            <div className="flex flex-col gap-1.5 font-mono text-[15px] text-ink tabular-nums">
              <span>$15,900,000</span>
              <span>$8,500,000</span>
              <span>$10,700,000</span>
            </div>
            <div className="microlabel mt-5 mb-3">METRICS &amp; TIME</div>
            <div className="lcd text-[24px] font-bold text-ink">
              2h 50m · 340ms · 99.9%
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["0123456789", "IiLl1 · Oo0", "{ } [ ] ( ) => !=="].map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-line bg-elev px-2.5 py-1 font-mono text-[12.5px] text-ink-2"
                >
                  {s}
                </span>
              ))}
            </div>
          </Card>
        </Demo>

        <Demo label="Paragraph specimen" refName="hashui foundation" contentClassName="!items-stretch py-8">
          <Card className="w-full rounded-2xl p-5">
            <div className="microlabel mb-2">
              CURRENT SANS · {FONTS[font].label.toUpperCase()}
            </div>
            <p className="text-[15px] leading-relaxed text-ink-2">
              HashUI turns a folder of curated interface screenshots into a
              reusable React + Tailwind system. Every component links back to
              the reference it came from, so the design decisions stay
              traceable — tokens, primitives and patterns, in light and dark.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
              The type stack is deliberately narrow:{" "}
              <span className="font-semibold text-ink">one sans</span> for the
              interface,{" "}
              <span className="font-mono text-[14px] text-ink">
                one mono
              </span>{" "}
              for anything a machine produced.
            </p>
          </Card>
        </Demo>
      </div>
    </Section>
  );
}
