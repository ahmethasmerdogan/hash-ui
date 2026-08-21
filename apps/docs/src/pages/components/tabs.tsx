import { Section, Demo } from "@/components/Section";
import {
  DotTabs,
  NotchTabs,
  PillNav,
  PillTabs,
  UnderlineTabs,
  IClock,
  ICompass,
  ICube,
  IDatabase,
  IFolder,
  IGrid,
  IHome,
  ILayers,
  IPersonX,
  IPulse,
  IUser,
} from "uicean";

/* ------------------------------------------------------------------ */
/* TABS                                                                */
/* ------------------------------------------------------------------ */

const darkTabs = [
  { id: "discover", label: "Discover", icon: <ICompass /> },
  { id: "models", label: "3D Models", icon: <ICube /> },
  { id: "avatars", label: "Avatars", icon: <IUser /> },
  { id: "animations", label: "Animations", icon: <ILayers /> },
  { id: "uikit", label: "UI Kit", icon: <IPersonX /> },
];

export default function TabsSection() {
  return (
    <Section
      id="tabs"
      registry="tabs"
      source="Tabs.tsx"
      eyebrow="Components"
      title="Tabs & navigation"
      desc="Three dark tab treatments from the 3D-marketplace reference — raised pill, browser notch, accent dot — plus the light underline and pill navs."
    >
      <Demo label="v.1 — raised pill" imports={["PillTabs"]} refName="tabs-design-0001" variant="dark" contentClassName="py-10">
        <PillTabs items={darkTabs} accentFirst value="discover" onChange={() => {}} />
      </Demo>

      <Demo label="v.2 — browser notch" refName="tabs-design-0001" variant="dark" contentClassName="py-10">
        <NotchTabs
          items={[
            { id: "discover", label: "", name: "Discover", icon: <ICompass /> },
            { id: "models", label: "3D Models", icon: <ICube /> },
            { id: "avatars", label: "Avatars", icon: <IUser /> },
            { id: "animations", label: "Animations", icon: <ILayers /> },
            { id: "uikit", label: "UI Kit", icon: <IPersonX />, divider: true },
          ]}
        />
      </Demo>

      <Demo label="v.3 — accent dot state" refName="tabs-design-0001" variant="dark" contentClassName="py-10">
        <DotTabs
          items={[
            { id: "discover", label: "Discover" },
            { id: "models", label: "3D Models" },
            { id: "avatars", label: "Avatars" },
            { id: "animations", label: "Animations" },
          ]}
          dotted="discover"
        />
      </Demo>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="Underline tabs" refName="menu-design-001">
          <UnderlineTabs
            items={[
              { id: "flow", label: "Flow view", icon: <IPulse /> },
              { id: "capacity", label: "Capacity view", icon: <IGrid /> },
              { id: "history", label: "History", icon: <IClock /> },
              { id: "log", label: "Action log", icon: <IFolder /> },
            ]}
          />
        </Demo>

        <Demo label="Pill nav" refName="active-node-0001">
          <PillNav
            items={[
              { id: "home", label: "Home", icon: <IHome /> },
              { id: "nodes", label: "My Nodes", icon: <IGrid /> },
              { id: "staking", label: "Staking", icon: <IDatabase /> },
            ]}
          />
        </Demo>
      </div>
    </Section>
  );
}
