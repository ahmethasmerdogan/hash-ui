import { useMemo, useState, type ComponentType } from "react";
import * as UICean from "uicean";
import {
  Card,
  SearchField,
  SegmentedControl,
  cx,
  useToast,
  type IconProps,
} from "uicean";
import { Section, Demo } from "@/components/Section";
import { CodeBlock } from "@/components/Code";

/* Every export whose name looks like an icon — so a new icon in the package
   shows up here without anyone remembering to update a list. */
type IconEntry = { name: string; Icon: ComponentType<IconProps> };

const ICONS: IconEntry[] = Object.entries(UICean as Record<string, unknown>)
  .filter(([name, value]) => /^I[A-Z]/.test(name) && typeof value === "function")
  .map(([name, value]) => ({ name, Icon: value as ComponentType<IconProps> }))
  .sort((a, b) => a.name.localeCompare(b.name));

/* the drawing style splits cleanly in two: outlined strokes, and the handful
   of filled glyphs used for brands and emphasis */
const FILLED = new Set([
  "IStarFill",
  "ISparkleFill",
  "IVerified",
  "ICheckCircleFill",
  "IXSocial",
  "ILinkedIn",
  "IHeartFill",
  "IDots",
]);

type Filter = "all" | "outline" | "filled";

export default function Icons() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [size, setSize] = useState(20);
  const { push } = useToast();

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ICONS.filter(({ name }) => {
      if (filter === "filled" && !FILLED.has(name)) return false;
      if (filter === "outline" && FILLED.has(name)) return false;
      return !needle || name.toLowerCase().includes(needle);
    });
  }, [q, filter]);

  const copy = (name: string) =>
    navigator.clipboard
      .writeText(`import { ${name} } from "uicean";`)
      .then(() => push({ tone: "success", title: `${name} copied` }));

  return (
    <Section
      id="icons-library"
      registry="icons"
      source="icons.tsx"
      eyebrow="Components"
      title="Icon library"
      desc={`All ${ICONS.length} icons are hand-drawn on a 24px grid with the same 1.8 stroke, sized by a single size prop and coloured by currentColor. They are plain components in one file — no icon package, and unused ones are tree-shaken away.`}
    >
      <Demo label="Usage" code={`import { IZap, ISearch } from "uicean";

<IZap size={16} />
<ISearch size={14} className="text-ink-3" />

// stroke, fill and everything else on <svg> passes through
<IZap size={20} strokeWidth={2.4} className="text-emerald-600" />`}>
        <div className="flex flex-wrap items-center justify-center gap-7 text-ink">
          <UICean.IZap size={28} />
          <UICean.ISearch size={28} className="text-ink-3" />
          <UICean.ISparkleFill size={28} className="text-emerald-600" />
          <UICean.IGitBranch size={28} className="text-blue-600" />
          <UICean.IWarning size={28} className="text-amber-500" />
          <UICean.IHeartFill size={28} className="text-red-500" />
        </div>
      </Demo>

      {/* ------------------------------------------------- the grid ---- */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:max-w-xs">
          <SearchField
            value={q}
            onChange={setQ}
            kbd={false}
            placeholder={`Search ${ICONS.length} icons…`}
          />
        </div>
        <SegmentedControl<Filter>
          size="sm"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "outline", label: "Outline" },
            { value: "filled", label: "Filled" },
          ]}
        />
        <SegmentedControl<string>
          size="sm"
          value={String(size)}
          onChange={(v) => setSize(Number(v))}
          options={[
            { value: "16", label: "16" },
            { value: "20", label: "20" },
            { value: "24", label: "24" },
          ]}
        />
        <span className="ml-auto font-mono text-[12px] text-ink-3 tabular-nums">
          {shown.length} / {ICONS.length}
        </span>
      </div>

      <Card className="overflow-hidden rounded-2xl !p-0">
        {shown.length === 0 ? (
          <div className="px-4 py-16 text-center text-[13.5px] text-ink-3">
            No icon matches “{q}”
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
            {shown.map(({ name, Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => copy(name)}
                title={`import { ${name} } from "uicean"`}
                className={cx(
                  "group/i flex aspect-square flex-col items-center justify-center gap-2.5 border-r border-b border-line transition-colors last:border-r-0 hover:bg-elev",
                )}
              >
                <span className="text-ink-2 transition-colors group-hover/i:text-ink">
                  <Icon size={size} />
                </span>
                <span className="max-w-full truncate px-1.5 font-mono text-[10px] text-ink-3 transition-colors group-hover/i:text-ink-2">
                  {name}
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>

      <p className="-mt-2 text-[12.5px] text-ink-3">
        Click any icon to copy its import statement.
      </p>

      {/* ------------------------------------------------ authoring ---- */}
      <div>
        <h2 className="mb-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          Adding your own
        </h2>
        <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
          One <code className="font-mono text-[12.5px]">base()</code> helper carries
          the shared defaults, so a new icon is a path and a name. Keep the 24px
          grid and the 1.8 stroke and it will sit correctly next to every
          existing glyph.
        </p>
        <CodeBlock
          filename="icons.tsx"
          code={`export const IRocket = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3c4 2.5 6 6.5 6 11l-4 4H10l-4-4c0-4.5 2-8.5 6-11Z" />
    <path d="M6 16c-1.5 2-1 5-1 5s3 .5 5-1" />
  </svg>
);

// base() supplies: width/height = size, viewBox "0 0 24 24",
// fill none, stroke currentColor, strokeWidth 1.8, round caps —
// and spreads the rest, so className and strokeWidth still win.`}
        />
      </div>
    </Section>
  );
}
