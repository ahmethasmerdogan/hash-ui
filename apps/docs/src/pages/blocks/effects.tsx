import { Section, Demo, DemoCol } from "@/components/Section";
import { Card, IArrowRight, IZap } from "hash-ui";
import {
  LiquidMetalButton,
  GeminiRibbon,
  NeuralVortex,
} from "@hash-ui/blocks";

/* The ribbon and the vortex both want more room than a demo tile has, so
   each gets a framed viewport it can scroll or bleed inside of. */

function RibbonDemo() {
  return (
    <div className="h-[520px] w-full overflow-y-auto rounded-[15px] bg-ink/95 dark:bg-black">
      <div className="dark h-[1600px] px-6 pt-10">
        <GeminiRibbon
          title="Scroll inside this frame"
          description="Five curves, five colours, one scroll position — drawn with dash offsets, not a motion library."
          action={{ label: "hashui.vercel.app", href: "/" }}
        />
      </div>
    </div>
  );
}

export default function BlocksEffectsPage() {
  return (
    <>
      <Section
        id="effects"
        eyebrow="Blocks"
        title="Effects"
        desc={
          <>
            The one layer of HashUI where glow is allowed. Everything here is
            opt-in by name — the <code className="font-mono text-[13px]">.fx-*</code>{" "}
            classes never touch a core component, so the rest of the system
            stays flat.
          </>
        }
        registry="liquid-metal-button"
        pkg="blocks"
        source="effects/LiquidMetalButton.tsx"
      >
        <Demo
          label="LiquidMetalButton"
          imports={["LiquidMetalButton"]}
          code={`<LiquidMetalButton label="Get started" />
<LiquidMetalButton viewMode="icon" aria-label="Sparkle" />
<LiquidMetalButton label="Ship it" size="lg" flow={0.45} />
<LiquidMetalButton label="Rim light" size="sm" glow />`}
        >
          <DemoCol>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <LiquidMetalButton label="Get started" />
              <LiquidMetalButton viewMode="icon" aria-label="Sparkle" />
              <LiquidMetalButton
                label="Ship it"
                size="lg"
                icon={<IZap size={16} />}
                flow={0.45}
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <LiquidMetalButton label="Rim light" size="sm" glow />
              <LiquidMetalButton viewMode="icon" size="sm" glow aria-label="Sparkle with rim light" />
            </div>
            <p className="max-w-md text-center text-[12.5px] leading-relaxed text-ink-3">
              A fragment shader, like the original. The chrome is a reflection
              of a room — bright sky over a dark floor with a hard horizon —
              off a height field that folds over itself as it moves. Without
              WebGL the button falls back to a still steel ramp.
            </p>
          </DemoCol>
        </Demo>
      </Section>

      <Section
        id="gemini-ribbon"
        level={2}
        eyebrow="Blocks"
        title="GeminiRibbon"
        desc="Five ribbons that draw themselves as the page passes, each trailing a blurred copy of itself for the light."
        registry="gemini-ribbon"
        pkg="blocks"
        source="effects/GeminiRibbon.tsx"
      >
        <Demo
          label="GeminiRibbon"
          imports={["GeminiRibbon"]}
          code={`{/* give the wrapper real height — the ribbons pin while it passes */}
<div className="h-[400vh]">
  <GeminiRibbon
    title="Build with HashUI"
    action={{ label: "hashui.vercel.app", href: "/" }}
  />
</div>`}
          contentClassName="!p-0 !block !min-h-0"
        >
          <RibbonDemo />
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Why it needs no library.</span>{" "}
            framer-motion&rsquo;s <code className="font-mono">pathLength</code> is
            <code className="font-mono"> stroke-dasharray</code> and{" "}
            <code className="font-mono">stroke-dashoffset</code> underneath.
            Setting <code className="font-mono">pathLength={"{1}"}</code> lets the
            component speak in fractions instead of measuring the real arc length
            of every curve, so scroll progress maps straight onto the offset.
          </p>
        </Card>
      </Section>

      <Section
        id="neural-vortex"
        level={2}
        eyebrow="Blocks"
        title="NeuralVortex"
        desc="A full-bleed backdrop of filaments that lean towards the pointer. One fragment shader, no dependencies."
        registry="neural-vortex"
        pkg="blocks"
        source="effects/NeuralVortex.tsx"
      >
        <Demo
          label="NeuralVortex"
          imports={["NeuralVortex"]}
          code={`<div className="relative isolate overflow-hidden rounded-2xl bg-black">
  <NeuralVortex color="#34d399" intensity={1} />

  {/* the field is bright by design — put a scrim under any copy */}
  <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_50%,rgba(0,0,0,0.82),transparent_75%)]" />

  <div className="relative px-8 py-24 text-center">…</div>
</div>`}
          contentClassName="!p-0 !block !min-h-0"
        >
          <div className="dark relative isolate h-[360px] overflow-hidden rounded-[15px] bg-black">
            <NeuralVortex color="#34d399" intensity={1} />
            {/* a backdrop this bright needs a scrim, or the copy sits in it */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_50%,rgba(0,0,0,0.82),transparent_75%)]"
            />
            <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
              <h3 className="text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
                Move your pointer
              </h3>
              <p className="mt-3 max-w-sm text-sm text-white/60">
                The field bends towards the cursor rather than following it, so
                the filaments stay put and only their shape reacts.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-medium text-white/80">
                WebGL, zero dependencies
                <IArrowRight size={13} />
              </span>
            </div>
          </div>
        </Demo>
      </Section>
    </>
  );
}
