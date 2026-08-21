import { useState } from "react";
import { cx, useToast, ICopy, ICheck } from "uicean";
import { SITE, registryUrl } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* InstallTabs — the two ways to get a component                        */
/*                                                                     */
/*   CLI     copies the source into your repo (shadcn registry)         */
/*   npm     imports it from the published package                      */
/* ------------------------------------------------------------------ */

type Mode = "cli" | "npm";
const PMS = ["npm", "pnpm", "yarn", "bun"] as const;
type Pm = (typeof PMS)[number];

const CLI: Record<Pm, (url: string) => string> = {
  npm: (u) => `npx shadcn@latest add ${u}`,
  pnpm: (u) => `pnpm dlx shadcn@latest add ${u}`,
  yarn: (u) => `yarn dlx shadcn@latest add ${u}`,
  bun: (u) => `bunx --bun shadcn@latest add ${u}`,
};

const ADD: Record<Pm, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

export function InstallTabs({
  items,
  defaultMode = "cli",
  className,
}: {
  /** registry item names, e.g. ["button"] */
  items: string[];
  /** which route to show first — the package is the shorter command */
  defaultMode?: Mode;
  className?: string;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [pm, setPm] = useState<Pm>("npm");
  const [copied, setCopied] = useState(false);
  const { push } = useToast();

  const command =
    mode === "cli"
      ? CLI[pm](items.map(registryUrl).join(" "))
      : `${ADD[pm]} ${SITE.pkg}`;

  const copy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      push({ tone: "success", title: "Command copied" });
    });
  };

  return (
    <div
      className={cx(
        "overflow-hidden rounded-2xl border border-line bg-surface",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2.5">
        <span className="inline-flex items-center rounded-[9px] bg-ink/6 p-0.5 dark:bg-white/8">
          {(
            [
              ["cli", "CLI"],
              ["npm", "Package"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setMode(v)}
              className={cx(
                "rounded-[7px] px-3 py-1 text-[12px] font-semibold transition-all",
                mode === v
                  ? "bg-surface text-ink shadow-soft"
                  : "text-ink-3 hover:text-ink-2",
              )}
            >
              {label}
            </button>
          ))}
        </span>

        <span className="ml-auto flex items-center gap-0.5">
          {PMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPm(p)}
              className={cx(
                "rounded-[7px] px-2.5 py-1 font-mono text-[11.5px] transition-colors",
                pm === p
                  ? "bg-inset font-semibold text-ink"
                  : "text-ink-3 hover:text-ink-2",
              )}
            >
              {p}
            </button>
          ))}
        </span>
      </div>

      <div className="flex items-center gap-3 bg-[#0e0e12] px-4 py-3.5">
        <span aria-hidden className="font-mono text-[13px] text-emerald-400">
          $
        </span>
        <code className="scroll-thin min-w-0 flex-1 overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-[#d6d7dc]">
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy command"
          className="flex size-7 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-white/5 text-[#b9bcc4] transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <ICheck size={12} strokeWidth={3} /> : <ICopy size={12} />}
        </button>
      </div>

      <p className="border-t border-line px-4 py-2.5 text-[12px] text-ink-3">
        {mode === "cli"
          ? "Copies the source into your project — yours to edit, no dependency added."
          : `Imports from the published package: import { … } from "${SITE.pkg}".`}
      </p>
    </div>
  );
}
