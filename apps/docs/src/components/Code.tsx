import type { ReactNode } from "react";
import { cx, useToast, ICopy } from "uicean";

/* ------------------------------------------------------------------ */
/* Tiny dependency-free JSX highlighter                                */
/* ------------------------------------------------------------------ */

const TOKEN =
  /(\/\/[^\n]*)|("[^"\n]*"|'[^'\n]*')|(\b(?:import|from|export|const|let|return|default|function|type|true|false|null)\b)|(<\/?[A-Z][A-Za-z0-9]*)|(<\/?[a-z][a-zA-Z0-9]*)|([A-Za-z_][A-Za-z0-9_]*(?==))|([{}=/>])/g;

const CLASSES = [
  "text-[#7b8494] italic", // comment
  "text-emerald-300", // string
  "text-violet-300", // keyword
  "text-sky-300", // Component tag
  "text-orange-300", // html tag
  "text-amber-200", // attr name
  "text-[#8b8f9a]", // punctuation
];

export function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(TOKEN)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(code.slice(last, idx));
    const gi = m.slice(1).findIndex((g) => g !== undefined);
    out.push(
      <span key={key++} className={CLASSES[gi]}>
        {m[0]}
      </span>,
    );
    last = idx + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

/* ------------------------------------------------------------------ */
/* Code block — always dark, docs-style                                */
/* ------------------------------------------------------------------ */

export function CodeBlock({
  code,
  filename,
  className,
}: {
  code: string;
  filename?: string;
  className?: string;
}) {
  const { push } = useToast();
  const copy = () =>
    navigator.clipboard
      .writeText(code)
      .then(() => push({ tone: "success", title: "Code copied" }));
  return (
    <div
      className={cx(
        "w-full overflow-hidden rounded-xl border border-white/8 bg-[#0e0e12] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/7 px-4 py-2">
        <span className="font-mono text-[11px] text-[#8b8f9a]">
          {filename ?? "example.tsx"}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="flex h-6.5 items-center gap-1.5 rounded-[7px] border border-white/10 bg-white/5 px-2 font-mono text-[10.5px] text-[#b9bcc4] transition-colors hover:bg-white/10 hover:text-white"
        >
          <ICopy size={11} /> copy
        </button>
      </div>
      <pre className="scroll-thin overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.7] text-[#d6d7dc]">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* API reference table                                                 */
/* ------------------------------------------------------------------ */

export type ApiRow = {
  prop: string;
  type: string;
  def?: string;
  desc: string;
};

export function ApiTable({
  component,
  rows,
  className,
}: {
  component: string;
  rows: ApiRow[];
  className?: string;
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-2xl border border-line bg-surface shadow-card",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        <span className="microlabel !text-brand">API</span>
        <span className="font-mono text-[13px] font-semibold text-ink">
          {"<"}
          {component}
          {" />"}
        </span>
      </div>
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line bg-elev">
              {["Prop", "Type", "Default", "Description"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-[11.5px] font-semibold whitespace-nowrap text-ink-2"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.prop} className="border-b border-line last:border-0">
                <td className="px-4 py-2.5 font-mono text-[12px] font-semibold whitespace-nowrap text-ink">
                  {r.prop}
                </td>
                <td className="max-w-95 px-4 py-2.5 font-mono text-[11.5px] break-words text-emerald-700 dark:text-emerald-300">
                  {r.type}
                </td>
                <td className="px-4 py-2.5 font-mono text-[11.5px] whitespace-nowrap text-ink-3">
                  {r.def ?? "—"}
                </td>
                <td className="min-w-55 px-4 py-2.5 text-[12.5px] text-ink-2">
                  {r.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
