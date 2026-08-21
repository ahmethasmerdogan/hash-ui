import { Section, Demo } from "@/components/Section";
import { Card } from "uicean";
import { DashboardShell, SidebarNav, RailSidebar } from "uicean-blocks";

const BLEED = "!block !min-h-0 !p-4";

export default function BlocksAppShellPage() {
  return (
    <>
      <Section
        id="dashboard-shell"
        eyebrow="Blocks"
        title="DashboardShell"
        desc="A workspace switcher, a nested navigation tree and a pinned footer group, wrapped in a collapsible rail with its own top bar and ⌘K overlay — the sidebar an application actually needs rather than a list of links."
        registry="dashboard-shell"
        pkg="blocks"
        source="shell/SidebarNav.tsx"
      >
        <Demo
          label="DashboardShell — try the tree, the switcher and search"
          imports={["DashboardShell", "SidebarNav", "WorkspaceSwitcher"]}
          contentClassName={BLEED}
          code={`<DashboardShell
  groups={[
    {
      heading: "Workspace",
      items: [
        {
          id: "projects",
          title: "Projects",
          icon: <IFolder size={16} />,
          children: [{ id: "p-active", title: "Active" }],
        },
        { id: "inbox", title: "Inbox", icon: <IMail size={16} />, badge: 12 },
      ],
    },
  ]}
>
  <YourPage />
</DashboardShell>`}
        >
          <DashboardShell />
        </Demo>

        <Demo
          label="SidebarNav — on its own"
          imports={["SidebarNav"]}
          contentClassName={BLEED}
          code={`<SidebarNav
  activeId={route}
  onSelect={navigate}
  groups={groups}
  footerItems={[{ id: "settings", title: "Settings", shortcut: "⌘," }]}
/>`}
        >
          <div className="h-150 overflow-hidden rounded-xl border border-line">
            <SidebarNav />
          </div>
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">
              The active row is an ink pill with a leading dot.
            </span>{" "}
            The reference used a pale grey fill — which reads as{" "}
            <em>hovered</em> on every other UICean surface and would have made
            the state ambiguous. The dot also holds the row&rsquo;s left edge
            steady, so nothing shifts when selection moves.
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Children animate on grid rows.</span>{" "}
            Expanding transitions{" "}
            <code className="font-mono">grid-template-rows</code> from{" "}
            <code className="font-mono">0fr</code> to{" "}
            <code className="font-mono">1fr</code> — the only way to animate to a
            height you cannot know in advance, and better than measuring{" "}
            <code className="font-mono">scrollHeight</code> in a layout effect.
          </p>
        </Card>
      </Section>

      <Section
        id="rail-sidebar"
        level={2}
        eyebrow="Blocks"
        title="RailSidebar"
        desc="The two-part navigation an admin tool grows into: a narrow rail of destinations on the far left, and a panel showing the tree for whichever rail item is selected."
        registry="rail-sidebar"
        pkg="blocks"
        source="shell/RailSidebar.tsx"
      >
        <Demo
          label="RailSidebar — the search field filters the tree"
          imports={["RailSidebar"]}
          contentClassName={BLEED}
          code={`<RailSidebar
  brand="Interfaces"
  panelTitle="Dashboard"
  rail={[{ id: "dash", label: "Dashboards", icon: <IGrid size={16} /> }]}
  groups={[
    {
      heading: "Dashboard types",
      items: [
        { id: "overview", label: "Overview" },
        { id: "exec", label: "Executive summary", expandable: true },
      ],
    },
  ]}
/>`}
        >
          <div className="h-150">
            <RailSidebar />
          </div>
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">When to reach for this one</span>{" "}
            instead of <code className="font-mono">SidebarNav</code>: the rail lets
            one product hold several unrelated trees without a mega-menu, and keeps
            the top-level switch reachable no matter how far the panel is scrolled.
          </p>
        </Card>
      </Section>
    </>
  );
}
