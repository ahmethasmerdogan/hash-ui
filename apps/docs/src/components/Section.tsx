import { useState, type ReactNode } from "react";
import { cx, useToast, ICopy, ILink, IArrowUpRight } from "hash-ui";
import { CodeBlock } from "@/components/Code";
import { InstallTabs } from "@/components/InstallTabs";
import { SNIPPETS } from "@/components/snippets";
import { GITHUB_TREE } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Section — the header of a docs page                                 */
/*                                                                     */
/* One page documents one source file in packages/core/src, so the     */
/* header can offer both install routes (npm, shadcn CLI) and a link   */
/* straight to the file the page is about.                             */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  eyebrow,
  title,
  desc,
  registry,
  source,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  desc?: ReactNode;
  /** registry item name(s) — renders the install block */
  registry?: string | string[];
  /** file name inside packages/core/src, e.g. "Button.tsx" */
  source?: string;
  children: ReactNode;
  className?: string;
}) {
  const { push } = useToast();
  const items = registry
    ? Array.isArray(registry)
      ? registry
      : [registry]
    : [];

  const copyLink = () => {
    navigator.clipboard
      .writeText(`${location.origin}${location.pathname}#${id}`)
      .then(() =>
        push({ tone: "success", title: "Link copied", desc: `#${id}` }),
      );
  };

  return (
    <section id={id} data-section className={cx("scroll-mt-24 pt-10 pb-14", className)}>
      <div className="mb-8 max-w-2xl">
        <div className="microlabel mb-3 flex items-center gap-2 !text-brand">
          <span aria-hidden>[</span>
          {eyebrow}
          <span aria-hidden>]</span>
        </div>
        <div className="group/h flex items-center gap-2.5">
          <h1 className="text-[34px] leading-tight font-bold tracking-[-0.03em] text-ink md:text-[38px]">
            {title}
          </h1>
          <button
            type="button"
            onClick={copyLink}
            aria-label={`Copy link to ${title}`}
            className="mt-1 flex size-7 items-center justify-center rounded-lg border border-line bg-surface text-ink-3 opacity-0 transition-all duration-150 group-hover/h:opacity-100 hover:text-ink focus-visible:opacity-100"
          >
            <ILink size={13} />
          </button>
        </div>
        {desc && (
          <p className="mt-3.5 text-[15.5px] leading-relaxed text-ink-2">{desc}</p>
        )}
        {source && (
          <a
            href={`${GITHUB_TREE}/packages/core/src/${source}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11.5px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            packages/core/src/{source}
            <IArrowUpRight size={12} />
          </a>
        )}
      </div>

      {items.length > 0 && <InstallTabs items={items} className="mb-10" />}

      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </section>
  );
}

/* Bordered preview canvas with the dotted-grid backdrop from the refs */
export function Demo({
  label,
  refName,
  imports,
  code,
  variant = "auto",
  children,
  className,
  contentClassName,
}: {
  label?: string;
  refName?: string; // source image credit
  imports?: string[]; // component names → copyable import statement
  code?: string; // usage snippet; falls back to SNIPPETS[label]
  variant?: "auto" | "dark";
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const { push } = useToast();
  const snippet = code ?? (label ? SNIPPETS[label] : undefined);
  const [view, setView] = useState<"preview" | "code">("preview");
  const copyImport = () => {
    const stmt = `import { ${imports!.join(", ")} } from "hash-ui";`;
    navigator.clipboard
      .writeText(stmt)
      .then(() => push({ tone: "success", title: "Import copied", desc: stmt }));
  };
  const inner = (
    <div
      className={cx(
        "dot-grid relative flex min-h-44 flex-wrap items-center justify-center gap-6 rounded-[15px] bg-canvas p-8 max-md:overflow-x-auto md:p-10",
        contentClassName,
      )}
    >
      {children}
    </div>
  );
  return (
    <figure
      className={cx(
        "min-w-0 max-w-full rounded-2xl border border-line bg-surface p-1.5",
        className,
      )}
    >
      {(label || refName || imports || snippet) && (
        <figcaption className="flex items-center justify-between gap-4 px-3.5 pt-2 pb-2.5">
          <span className="flex items-center gap-3 text-[13px] font-semibold text-ink">
            {label}
            {snippet && (
              <span className="inline-flex items-center rounded-[8px] bg-ink/6 p-0.5 dark:bg-white/8">
                {(["preview", "code"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={cx(
                      "rounded-[6px] px-2 py-0.5 text-[11px] font-medium capitalize transition-all",
                      view === v
                        ? "bg-surface text-ink shadow-soft"
                        : "text-ink-3 hover:text-ink-2",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </span>
            )}
          </span>
          <span className="flex items-center gap-2.5">
            {refName && (
              <span className="hidden font-mono text-[10.5px] text-ink-3 sm:inline">
                {refName}
              </span>
            )}
            {imports && (
              <button
                type="button"
                onClick={copyImport}
                aria-label="Copy import statement"
                title={`import { ${imports.join(", ")} }`}
                className="flex h-6.5 items-center gap-1.5 rounded-[7px] border border-line bg-elev px-2 font-mono text-[10.5px] font-medium text-ink-2 transition-colors hover:bg-inset hover:text-ink"
              >
                <ICopy size={11} />
                import
              </button>
            )}
          </span>
        </figcaption>
      )}
      {view === "code" && snippet ? (
        <CodeBlock code={snippet} className="rounded-[15px]" />
      ) : variant === "dark" ? (
        <div className="dark">{inner}</div>
      ) : (
        inner
      )}
    </figure>
  );
}

export function DemoCol({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col items-center gap-4", className)}>
      {children}
    </div>
  );
}
