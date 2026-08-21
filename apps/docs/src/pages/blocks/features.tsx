import { Section, Demo } from "@/components/Section";
import { FeaturesBento, FeaturesTerminal, FeaturesCrop } from "uicean-blocks";

/* Feature grids are page-width by nature, so each demo drops the tile's
   usual padding and lets the block bleed to the edges of the frame. */
const BLEED = "!block !min-h-0 !p-0";

export default function BlocksFeaturesPage() {
  return (
    <>
      <Section
        id="features-bento"
        eyebrow="Blocks"
        title="FeaturesBento"
        desc="An uneven grid — a wide claim across the top, then cards that change width as the row goes on. Every illustration is drawn, not imported."
        registry="features-bento"
        pkg="blocks"
        source="features/FeaturesBento.tsx"
      >
        <Demo
          label="FeaturesBento"
          imports={["FeaturesBento"]}
          contentClassName={BLEED}
          code={`<FeaturesBento
  items={[
    { title: "Customizable", span: 4, visual: <StatDial value="100%" /> },
    { title: "Secure by default", span: 4, visual: <FingerprintMark />, body: "…" },
    { title: "Faster than light", span: 4, visual: <Sparkline />, body: "…" },
    { title: "Built to be read", span: 5, copyFirst: true, body: "…" },
    { title: "Keep your team in the loop", span: 7, copyFirst: true, body: "…" },
  ]}
/>`}
        >
          <FeaturesBento className="!py-10" />
        </Demo>
      </Section>

      <Section
        id="features-terminal"
        level={2}
        eyebrow="Blocks"
        title="FeaturesTerminal"
        desc="The developer-platform grid: every card opens with a terminal or an API exchange, and the prose is its caption. The log is data, so a renamed route is a text edit rather than a re-exported PNG."
        registry="features-terminal"
        pkg="blocks"
        source="features/FeaturesTerminal.tsx"
      >
        <Demo
          label="FeaturesTerminal"
          imports={["FeaturesTerminal", "TerminalMock"]}
          contentClassName={BLEED}
          code={`<FeaturesTerminal
  eyebrow="Platform capabilities"
  title="Everything you need."
  titleTrail="Nothing you don't."
  items={[
    {
      title: "Sub-50ms execution",
      span: 7,
      icon: <IZap size={15} />,
      lines: [
        { kind: "prompt", text: "latency_check --region global", meta: "[OK]" },
        { kind: "output", text: "resolving edge nodes…", meta: "12ms" },
        { kind: "result", text: "global deployment active (34ms total)" },
      ],
    },
  ]}
/>`}
        >
          <FeaturesTerminal className="!py-10" />
        </Demo>
      </Section>

      <Section
        id="features-crop"
        level={2}
        eyebrow="Blocks"
        title="FeaturesCrop"
        desc="Cards under printer's crop marks, closed by a full-width plate with a row of captioned glyphs. Four hairline ticks are about the only decoration a flat system can afford."
        registry="features-crop"
        pkg="blocks"
        source="features/FeaturesCrop.tsx"
      >
        <Demo
          label="FeaturesCrop"
          imports={["FeaturesCrop", "CropMarks", "SetGlyph"]}
          contentClassName={BLEED}
          code={`<FeaturesCrop
  items={[
    {
      label: "Real-time location tracking",
      icon: <IMapPin size={14} />,
      title: "Advanced tracking system, instantly locate all your assets.",
      visual: <Sparkline />,
    },
  ]}
  footerTitle="Smart scheduling with automated reminders for maintenance."
  footerItems={[
    { caption: "Inclusion", glyph: <SetGlyph mode="union" /> },
    { caption: "Join", glyph: <SetGlyph mode="join" /> },
  ]}
/>`}
        >
          <FeaturesCrop className="!py-10" />
        </Demo>
      </Section>
    </>
  );
}
