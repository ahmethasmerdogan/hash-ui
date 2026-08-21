import { Section, Demo } from "@/components/Section";
import { Card } from "uicean";
import {
  LogoCloud,
  LogoCloudPlus,
  LogoCloudSection,
  IntegrationsMarquee,
} from "uicean-blocks";

const BLEED = "!block !min-h-0 !p-0";

export default function BlocksLogosPage() {
  return (
    <>
      <Section
        id="logo-cloud"
        eyebrow="Blocks"
        title="LogoCloud"
        desc="The social-proof grid, in the two treatments from the references. Logos are data: src renders the mark, srcDark swaps it on a dark canvas, and anything with neither falls back to a typeset wordmark."
        registry="logo-cloud"
        pkg="blocks"
        source="logos/LogoCloud.tsx"
      >
        <Demo
          label="LogoCloud — plain"
          imports={["LogoCloud"]}
          contentClassName="!block !min-h-0 !p-6"
          code={`<LogoCloud
  logos={[
    { alt: "Vercel", src: "/logos/vercel.svg", srcDark: "/logos/vercel-dark.svg" },
    { alt: "Supabase", src: "/logos/supabase.svg" },
    { alt: "OpenAI" },  // no src → typeset wordmark
  ]}
/>`}
        >
          <LogoCloud />
        </Demo>

        <Demo
          label="LogoCloudPlus — plus marks and checkerboard"
          imports={["LogoCloudPlus"]}
          contentClassName="!block !min-h-0 !p-6"
          code={`<LogoCloudPlus columns={4} logos={logos} />`}
        >
          <LogoCloudPlus />
        </Demo>

        <Demo
          label="LogoCloudSection — heading and grid together"
          imports={["LogoCloudSection"]}
          contentClassName={BLEED}
          code={`<LogoCloudSection
  title="Companies we"
  highlight="collaborate with."
  variant="plus"
  logos={logos}
/>`}
        >
          <div className="py-10">
            <LogoCloudSection title="Companies we" highlight="collaborate with." />
          </div>
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Two details worth keeping.</span>{" "}
            The plus marks sit on interior crossings only — one on the outer
            ring reads as a stray glyph rather than as grid hardware. And the
            marks are grayscale at rest: a wall of twelve brand palettes fights
            everything around it, so colour is what hover restores. The demo
            above pulls its wordmarks from svgl.app.
          </p>
        </Card>
      </Section>

      <Section
        id="integrations-marquee"
        level={2}
        eyebrow="Blocks"
        title="IntegrationsMarquee"
        desc="Three rows of integration chips drifting past each other behind a radial mask, with your own mark held still in the middle."
        registry="integrations-marquee"
        pkg="blocks"
        source="logos/IntegrationsMarquee.tsx"
      >
        <Demo
          label="IntegrationsMarquee"
          imports={["IntegrationsMarquee"]}
          contentClassName={BLEED}
          code={`<IntegrationsMarquee
  integrations={[
    { name: "Git", icon: <IGitBranch size={20} /> },
    { name: "Postgres", icon: <IDatabase size={20} /> },
  ]}
  centre={<YourLogo />}
  title="Integrate with your favourite tools"
  action={{ label: "Get started", href: "/docs" }}
/>`}
        >
          <IntegrationsMarquee className="!py-10" />
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">What this replaced.</span> The
            original ships a 90-line <code className="font-mono">InfiniteSlider</code>{" "}
            built on framer-motion and react-use-measure. Core already has{" "}
            <code className="font-mono">&lt;Marquee&gt;</code> on a CSS keyframe, so
            the port was mostly deletion. One behavioural difference kept on
            purpose: upstream <em>slows</em> on hover, UICean <em>pauses</em>.
          </p>
        </Card>
      </Section>
    </>
  );
}
