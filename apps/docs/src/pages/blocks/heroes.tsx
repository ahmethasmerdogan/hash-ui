import { Section, Demo } from "@/components/Section";
import { Card } from "hash-ui";
import {
  HeroTerminal,
  HeroSplit,
  HeroNexus,
  HeroCinematic,
  SplineHero,
} from "@hash-ui/blocks";

const BLEED = "!block !min-h-0 !p-0";

/* The heroes ship their own navigation and are full-viewport by design, so
   each one is framed in a scroll box rather than dropped into the page —
   two sticky headers on one document would fight. */
function Frame({
  children,
  height = 560,
}: {
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <div
      className="w-full overflow-y-auto rounded-[15px] border border-line bg-canvas"
      style={{ height }}
    >
      {children}
    </div>
  );
}

export default function BlocksHeroesPage() {
  return (
    <>
      <Section
        id="hero-terminal"
        eyebrow="Blocks"
        title="HeroTerminal"
        desc="The developer-tool opening: an announcement chip, a headline whose second line drops to a muted tone, two calls to action, and the install actually running underneath."
        registry="hero-terminal"
        pkg="blocks"
        source="heroes/HeroTerminal.tsx"
      >
        <Demo
          label="HeroTerminal"
          imports={["HeroTerminal"]}
          contentClassName={BLEED}
          code={`<HeroTerminal
  badge={{ tag: "Update", label: "Next-gen architecture" }}
  title="Build faster."
  titleTrail="Scale infinitely."
  actions={[
    { label: "Start building", href: "/docs", variant: "white" },
    { label: "Documentation", href: "/docs", variant: "outline" },
  ]}
  lines={[
    { kind: "prompt", text: "npx create-hash-app@latest" },
    { kind: "step", text: "Resolving packages…" },
    { kind: "result", text: "Ready to deploy." },
  ]}
/>`}
        >
          <Frame height={620}>
            <HeroTerminal />
          </Frame>
        </Demo>
      </Section>

      <Section
        id="hero-split"
        eyebrow="Blocks"
        title="HeroSplit"
        desc="A real navigation bar, a left-aligned headline — not centred, which is what makes it read as a product site rather than a launch page — and a client strip below."
        registry="hero-split"
        pkg="blocks"
        source="heroes/HeroSplit.tsx"
      >
        <Demo
          label="HeroSplit"
          imports={["HeroSplit"]}
          contentClassName={BLEED}
          code={`<HeroSplit
  brand="hashui"
  links={[{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }]}
  navActions={[
    { label: "Login", href: "#", variant: "ghost" },
    { label: "Sign up", href: "#", variant: "dark" },
  ]}
  title="Ship 10× faster with HashUI"
  clients={[{ alt: "Vercel" }, { alt: "Supabase" }]}
/>`}
        >
          <Frame height={620}>
            <HeroSplit />
          </Frame>
        </Demo>
      </Section>

      <Section
        id="hero-nexus"
        eyebrow="Blocks"
        title="HeroNexus"
        desc="The SaaS opening with the parts that actually convert: grouped nav menus, an announcement pill, a headline whose last word cycles, and an inline capture form instead of a button that sends people elsewhere."
        registry="hero-nexus"
        pkg="blocks"
        source="heroes/HeroNexus.tsx"
      >
        <Demo
          label="HeroNexus"
          imports={["HeroNexus"]}
          contentClassName={BLEED}
          code={`<HeroNexus
  brand="Nexus"
  menus={[
    { label: "Product", href: "#" },
    { label: "Channels", href: "#", items: [{ label: "Chat", href: "#" }] },
  ]}
  title="Deliver"
  rotating={["collaborative", "unmistakable", "effortless"]}
  capture={{
    placeholder: "Your work email",
    submitLabel: "See Nexus in action",
    onSubmit: (email) => subscribe(email),
  }}
/>`}
        >
          <Frame height={680}>
            <HeroNexus />
          </Frame>
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The interactive grid.</span>{" "}
            Two dot fields stacked: the neutral texture everywhere, and a
            brand-tinted one revealed by a radial mask that follows the pointer.
            No canvas, no per-dot state — one mask-position repaint. The lit
            field is <em>tinted</em> rather than merely brighter because the
            neutral dot sits one shade off the canvas, so turning up its opacity
            changes nothing anyone can see.
          </p>
        </Card>
      </Section>

      <Section
        id="hero-cinematic"
        eyebrow="Blocks"
        title="HeroCinematic"
        desc="A full-bleed still or loop, a floating pill of navigation, and the brand set enormous along the bottom edge — cropped, because cropping the mark is what makes it a poster."
        registry="hero-cinematic"
        pkg="blocks"
        source="heroes/HeroCinematic.tsx"
      >
        <Demo
          label="HeroCinematic"
          imports={["HeroCinematic"]}
          contentClassName={BLEED}
          code={`<HeroCinematic
  media={
    <video autoPlay muted loop playsInline className="size-full object-cover">
      <source src="/reel.mp4" type="video/mp4" />
    </video>
  }
  title="Where the work goes quiet"
  wordmark="Prisma*"
/>`}
        >
          <div className="p-3">
            <HeroCinematic className="!min-h-[520px]" />
          </div>
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Bring your own media.</span>{" "}
            <code className="font-mono">media</code> takes any node — an{" "}
            <code className="font-mono">&lt;img&gt;</code>, a muted looping{" "}
            <code className="font-mono">&lt;video&gt;</code>, a canvas. Nothing is
            fetched for you; the demo above falls back to a drifting gradient so
            the block has something to show before you have picked a film.
          </p>
        </Card>
      </Section>

      <Section
        id="spline-scene"
        eyebrow="Blocks"
        title="SplineScene"
        desc="A Spline 3D scene, loaded only once it is about to be looked at. The runtime is an optional peer — a project that never renders a scene never pays for one."
        registry="spline-scene"
        pkg="blocks"
        source="heroes/SplineScene.tsx"
      >
        <Demo
          label="SplineHero"
          imports={["SplineScene", "SplineHero"]}
          contentClassName={BLEED}
          code={`// npm i @splinetool/react-spline

<SplineHero
  scene="https://prod.spline.design/…/scene.splinecode"
  title="Interactive 3D"
/>

// or place a bare scene yourself
<div className="h-[420px]">
  <SplineScene scene={url} fallback={<Skeleton />} />
</div>`}
        >
          <div className="p-3">
            <SplineHero />
          </div>
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">It takes a few seconds.</span>{" "}
            A Spline block is a ~2&nbsp;MB runtime plus a scene fetched from
            spline.design, so it is the one block here that cannot appear
            instantly. To keep that off the reader&rsquo;s path the component
            warms both while the page is idle, starts 600px before the block
            reaches the fold, and shows a designed plate rather than a bare
            spinner. If nothing arrives within{" "}
            <code className="font-mono">timeoutMs</code> it offers a retry
            instead of spinning forever.
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">If the peer is missing</span>{" "}
            the block renders its fallback and logs the install line rather than
            throwing the page away. Pass{" "}
            <code className="font-mono">prefetch={"{false}"}</code> when the
            scene sits far down a page most readers never reach.
          </p>
        </Card>
      </Section>
    </>
  );
}
