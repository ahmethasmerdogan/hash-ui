import { Section, Demo } from "@/components/Section";
import { Card } from "hash-ui";
import { CinematicFooter, GridFooter } from "@hash-ui/blocks";
import { CodeBlock } from "@/components/Code";

const BLEED = "!block !min-h-0 !p-0";

/* The reveal only exists relative to the content it uncovers, so the demo
   ships its own miniature page to scroll. */
function RevealDemo() {
  return (
    <div className="h-[520px] w-full overflow-y-auto rounded-[15px] border border-line bg-canvas">
      <div className="relative">
        <main className="relative z-10 flex h-[70vh] min-h-96 flex-col items-center justify-center rounded-b-3xl border-b border-line bg-canvas">
          <p className="microlabel !text-ink-3">Scroll down to reveal</p>
          <span className="mt-6 h-24 w-px bg-linear-to-b from-line-strong to-transparent" />
        </main>
        <CinematicFooter sticky wordmark="HashUI" />
      </div>
    </div>
  );
}

export default function BlocksFootersPage() {
  return (
    <>
      <Section
        id="cinematic-footer"
        eyebrow="Blocks"
        title="CinematicFooter"
        desc="The closing frame: a tilted marquee band, an enormous sign-off, two magnetic pills, and the brand left as a watermark behind it all."
        registry="cinematic-footer"
        pkg="blocks"
        source="footers/CinematicFooter.tsx"
      >
        <Demo
          label="CinematicFooter — scroll the frame"
          imports={["CinematicFooter"]}
          contentClassName={BLEED}
          code={`<div className="relative">
  <main className="relative z-10 bg-canvas">…your page…</main>
  <CinematicFooter
    sticky
    headline="Ready to begin?"
    marquee={["Accountability redefined", "Transparent tracking"]}
    actions={[{ label: "Download iOS", href: "#" }]}
    wordmark="HashUI"
  />
</div>`}
        >
          <RevealDemo />
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">
              The curtain is two declarations.
            </span>{" "}
            Upstream this is GSAP ScrollTrigger. Here the footer is the last
            child of a <code className="font-mono">relative</code> wrapper and
            pins itself to the bottom of the viewport; the content above it
            carries <code className="font-mono">z-10</code> and an opaque
            background, so the page simply slides off it.
          </p>
          <CodeBlock
            code={`<div className="relative">
  <main className="relative z-10 bg-canvas">…</main>
  <CinematicFooter sticky />
</div>`}
          />
        </Card>

        <Demo
          label="CinematicFooter — on its own"
          imports={["CinematicFooter"]}
          contentClassName={BLEED}
          code={`<CinematicFooter headline="Ready to begin?" />`}
        >
          <CinematicFooter />
        </Demo>
      </Section>

      <Section
        id="grid-footer"
        eyebrow="Blocks"
        title="GridFooter"
        desc="A footer built as an exposed grid rather than as stacked columns: social marks, a description and the link list all sit in cells of one ruled table, and the rules are the design."
        registry="grid-footer"
        pkg="blocks"
        source="footers/GridFooter.tsx"
      >
        <Demo
          label="GridFooter"
          imports={["GridFooter"]}
          contentClassName={BLEED}
          code={`<GridFooter
  headline={<>Footer component<br />built as a grid</>}
  social={[{ label: "X", href: "#", icon: <IXSocial size={16} /> }]}
  links={[{ label: "Product", href: "#" }, { label: "Pricing", href: "#" }]}
  fineprint="HashUI © 2026. All rights reserved."
/>`}
        >
          <GridFooter />
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">What it cost upstream.</span>{" "}
            The original pulls in <code className="font-mono">next</code>,{" "}
            <code className="font-mono">three</code>,{" "}
            <code className="font-mono">@react-three/fiber</code>,{" "}
            <code className="font-mono">react-icons</code> and{" "}
            <code className="font-mono">framer-motion</code> — largely to light
            one cell. Here that cell is a radial gradient: same read, nothing
            installed. Pass <code className="font-mono">glow={"{false}"}</code> to
            turn it off.
          </p>
        </Card>
      </Section>
    </>
  );
}
