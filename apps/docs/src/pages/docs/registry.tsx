import { useState } from "react";
import {
  Alert,
  Card,
  SearchField,
  StatusPill,
  cx,
  useToast,
  IArrowUpRight,
  ICopy,
  IDatabase,
  ILayers,
} from "uicean";
import { Section } from "@/components/Section";
import { CodeBlock } from "@/components/Code";
import { REGISTRY_ITEMS } from "@/lib/registry-items";
import { REGISTRY_BASE, SITE, registryUrl } from "@/lib/site";

function ItemRow({
  item,
}: {
  item: (typeof REGISTRY_ITEMS)[number];
}) {
  const { push } = useToast();
  const url = registryUrl(item.name);
  const copy = () =>
    navigator.clipboard
      .writeText(`npx shadcn@latest add ${url}`)
      .then(() => push({ tone: "success", title: `${item.name} command copied` }));

  return (
    <div className="flex flex-col gap-2 border-b border-line px-4 py-3.5 last:border-0 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 sm:w-56 sm:shrink-0">
        <div className="flex items-center gap-2">
          <code className="font-mono text-[13px] font-semibold text-ink">
            {item.name}
          </code>
          {item.type === "registry:theme" && (
            <StatusPill tone="violet" size="sm">
              theme
            </StatusPill>
          )}
          {item.name === "uicean" && (
            <StatusPill tone="green" size="sm">
              all
            </StatusPill>
          )}
        </div>
        <div className="mt-0.5 font-mono text-[10.5px] text-ink-3">
          → {item.target}
        </div>
      </div>

      <p className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-ink-2">
        {item.description}
      </p>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy install command for ${item.name}`}
          className="flex h-7 items-center gap-1.5 rounded-[8px] border border-line bg-elev px-2 font-mono text-[10.5px] font-medium text-ink-2 transition-colors hover:bg-inset hover:text-ink"
        >
          <ICopy size={11} /> add
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${item.name}.json`}
          className="flex h-7 items-center gap-1 rounded-[8px] border border-line bg-elev px-2 font-mono text-[10.5px] font-medium text-ink-2 transition-colors hover:bg-inset hover:text-ink"
        >
          json <IArrowUpRight size={10} />
        </a>
      </div>
    </div>
  );
}

export default function Registry() {
  const [q, setQ] = useState("");
  const items = REGISTRY_ITEMS.filter((i) =>
    `${i.name} ${i.title} ${i.description}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Section
      id="registry"
      eyebrow="Getting started"
      title="Registry & CLI"
      desc={
        <>
          Every component is also published as a shadcn registry item. Point the
          CLI at a URL and the source lands in your repo — no dependency, no
          wrapper, yours to edit. The same URLs are a plain JSON API, so you can
          read the library programmatically too.
        </>
      }
    >
      <Alert tone="info" title="Requires a shadcn-initialised project">
        The CLI needs a <code className="font-mono">components.json</code> and the{" "}
        <code className="font-mono">@/</code> path alias. Run{" "}
        <code className="font-mono">npx shadcn@latest init</code> once first — you
        do not have to use any shadcn component afterwards.
      </Alert>

      {/* ------------------------------------------------------ how ---- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[
          {
            icon: <ILayers size={17} />,
            title: "1 · Pick an item",
            body: "Each row below is one source file in packages/core. Its registryDependencies pull in whatever it needs — cx, the icons, the tokens.",
          },
          {
            icon: <IDatabase size={17} />,
            title: "2 · Run the CLI",
            body: "shadcn resolves the dependency graph, rewrites imports to your aliases and writes the files into components/uicean.",
          },
          {
            icon: <ICopy size={17} />,
            title: "3 · Own it",
            body: "The files are ordinary TypeScript in your repo. Rename them, strip the variants you never use, change the gradient.",
          },
        ].map((s) => (
          <Card key={s.title} className="rounded-2xl p-5">
            <span className="flex size-9 items-center justify-center rounded-[11px] border border-line bg-elev text-ink-2">
              {s.icon}
            </span>
            <div className="mt-3 text-[14px] font-bold text-ink">{s.title}</div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
              {s.body}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CodeBlock
          filename="terminal — one component"
          code={`npx shadcn@latest add ${registryUrl("button")}

# writes:
#   components/uicean/button.tsx
#   lib/uicean/cx.ts          (registry dependency)
#   styles/uicean.css         (registry dependency)`}
        />
        <CodeBlock
          filename="terminal — the whole library"
          code={`npx shadcn@latest add ${registryUrl("uicean")}

# every component, the icon set, the theme provider
# and the token stylesheet, in one pass`}
        />
      </div>

      {/* -------------------------------------------------- the api ---- */}
      <div>
        <h2 className="mb-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          It is also just JSON
        </h2>
        <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
          The registry is static JSON served from{" "}
          <code className="font-mono text-[12.5px]">{REGISTRY_BASE}</code> with
          permissive CORS, so anything that speaks HTTP can read it — a codegen
          script, an editor extension, an agent.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CodeBlock
            filename="terminal"
            code={`# the index — every item, with its files and deps
curl ${REGISTRY_BASE}/registry.json

# one item, source included
curl ${registryUrl("button")} | jq -r '.files[0].content'`}
          />
          <CodeBlock
            filename="fetch.ts"
            code={`const res = await fetch("${REGISTRY_BASE}/registry.json");
const registry = await res.json();

for (const item of registry.items) {
  console.log(item.name, "→", item.files[0].target);
}

// pull one component's source straight out
const button = await fetch("${registryUrl("button")}").then((r) => r.json());
await writeFile("src/ui/button.tsx", button.files[0].content);`}
          />
        </div>
      </div>

      {/* ------------------------------------------------- the items ---- */}
      <div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.02em] text-ink">
              {REGISTRY_ITEMS.length} items
            </h2>
            <p className="mt-1 text-[13.5px] text-ink-2">
              Generated from{" "}
              <code className="font-mono text-[12.5px]">packages/core/src</code> on
              every build, so this list can never drift from the source.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <SearchField
              value={q}
              onChange={setQ}
              kbd={false}
              placeholder="Filter registry…"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13.5px] text-ink-3">
              Nothing matches “{q}”
            </div>
          ) : (
            items.map((item) => <ItemRow key={item.name} item={item} />)
          )}
        </div>
      </div>

      {/* ------------------------------------------------ vs package ---- */}
      <div>
        <h2 className="mb-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          CLI or package?
        </h2>
        <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
          Both routes ship the same code. Pick by how much you expect to change.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              tone: "green" as const,
              label: "CLI",
              title: "Copy it in",
              pros: [
                "Source lives in your repo — edit anything",
                "No version to track, no breaking upgrade",
                "Take one component, leave the rest",
              ],
              cons: ["Updates are manual: re-run add"],
            },
            {
              tone: "blue" as const,
              label: "npm",
              title: `install ${SITE.pkg}`,
              pros: [
                "One dependency, one import path",
                "Upgrades arrive with npm update",
                "Types and the token sheet come with it",
              ],
              cons: ["Customising means overriding, not editing"],
            },
          ].map((c) => (
            <Card key={c.label} className="rounded-2xl p-5">
              <StatusPill tone={c.tone} size="sm">
                {c.label}
              </StatusPill>
              <div className="mt-3 text-[15px] font-bold text-ink">{c.title}</div>
              <div className="mt-3 flex flex-col gap-1.5">
                {c.pros.map((p) => (
                  <span key={p} className="flex gap-2 text-[12.5px] text-ink-2">
                    <span className="text-emerald-600 dark:text-emerald-400">+</span>
                    {p}
                  </span>
                ))}
                {c.cons.map((p) => (
                  <span key={p} className="flex gap-2 text-[12.5px] text-ink-3">
                    <span className="text-ink-3">−</span>
                    {p}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
