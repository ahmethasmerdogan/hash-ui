import { Section, Demo, DemoCol } from "@/components/Section";
import { Avatar, AvatarGroup, Card, EntityChip, IVerified } from "uicean";

/* ------------------------------------------------------------------ */
/* AVATARS                                                             */
/* ------------------------------------------------------------------ */

export default function AvatarsSection() {
  return (
    <Section
      id="avatars"
      registry="avatar"
      source="Avatar.tsx"
      eyebrow="Components"
      title="Avatar"
      desc="Gradient-initial avatars with presence, overlapping groups from the invite card, and the memoji social-proof cards rebuilt with emoji tints."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Demo label="Sizes & presence" imports={["Avatar","AvatarGroup"]} refName="datatable-0002">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Avatar name="Santi Carloza" size="xs" />
            <Avatar name="Fast Respone" size="sm" />
            <Avatar name="Arlene McCoy" size="md" status="online" />
            <Avatar name="Jerome Bell" size="lg" status="away" ring />
            <Avatar name="Cody Fisher" size="xl" status="busy" ring />
            <Avatar name="Mina Park" emoji="🙂" tint="pink" size="xl" ring />
          </div>
        </Demo>

        <Demo label="Groups & entities" refName="button-001 · datatable-0001">
          <DemoCol>
            <AvatarGroup
              size="md"
              people={[
                { name: "Ava Miller", emoji: "😄", tint: "blue" },
                { name: "Noah Kim", emoji: "😊", tint: "green" },
                { name: "Liam Ortiz", emoji: "😎", tint: "yellow" },
                { name: "Zoe Adams", emoji: "🤠", tint: "pink" },
                { name: "Kai Wong" },
                { name: "Maya Ross" },
              ]}
            />
            <div className="flex flex-wrap items-center justify-center gap-4">
              <EntityChip name="Peregrin" hue="#0ea5e9" />
              <EntityChip name="Pollinate" hue="#8b5cf6" />
              <EntityChip name="Eclipseful" hue="#111113" />
              <EntityChip name="Solaris Energy" hue="#f59e0b" />
            </div>
          </DemoCol>
        </Demo>
      </div>

      <Demo label="Social proof cards" refName="user-alerts-001" contentClassName="py-12">
        <div className="flex flex-col items-center gap-7">
          <Card floating className="w-88 rounded-[26px] px-6 py-6 text-center">
            <div className="flex justify-center">
              <AvatarGroup
                size="lg"
                people={[
                  { name: "Tim Weber", emoji: "🧑‍🎤", tint: "green" },
                  { name: "Omar Reed", emoji: "😌", tint: "blue" },
                  { name: "Marie Kern", emoji: "😉", tint: "yellow" },
                ]}
              />
            </div>
            <p className="mt-3.5 text-[17px] leading-snug font-semibold text-ink">
              Tim, Marie{" "}
              <IVerified size={17} className="inline text-blue-500" /> und{" "}
              <span className="rounded-lg bg-blue-600 px-2 py-0.5 text-white shadow-btn">
                25.246
              </span>{" "}
              andere sind begeistert!
            </p>
          </Card>

          <Card floating className="w-88 overflow-hidden rounded-[26px] text-center">
            <div className="bg-gradient-to-b from-sky-300/60 to-sky-100/40 px-6 pt-5 pb-4 dark:from-sky-500/25 dark:to-sky-500/5">
              <div className="flex items-center justify-center gap-1">
                <span className="-mr-2 text-lg">⭐️</span>
                <AvatarGroup
                  size="lg"
                  people={[
                    { name: "Ben Fox", emoji: "🧔", tint: "blue" },
                    { name: "Tim Weber", emoji: "🧑‍🎤", tint: "pink" },
                    { name: "Aylin Kaya", emoji: "🧕", tint: "green" },
                  ]}
                />
                <span className="-ml-2 text-lg">❤️</span>
              </div>
            </div>
            <p className="px-6 pt-3 pb-5 text-[17px] leading-snug font-semibold text-ink">
              Tim, Marie{" "}
              <IVerified size={17} className="inline text-blue-500" /> und{" "}
              <span className="rounded-lg bg-blue-500/15 px-2 py-0.5 text-blue-600 dark:text-blue-300">
                25.246
              </span>{" "}
              andere sind begeistert!
            </p>
          </Card>
        </div>
      </Demo>
    </Section>
  );
}
