import { Link } from "react-router-dom";
import { IArrowLeft, IArrowRight, IArrowUpRight } from "hash-ui";
import { LogoMark } from "@/components/Logo";
import { neighbours } from "@/lib/routes";
import { SITE } from "@/lib/site";
import { IGithub, INpm } from "@/app/Topbar";

/** previous / next pager, shadcn-style, at the bottom of every docs page */
export function Pager({ path }: { path: string }) {
  const { prev, next } = neighbours(path);
  if (!prev && !next) return null;
  return (
    <div className="mt-4 mb-14 flex items-stretch gap-3 border-t border-line pt-8">
      {prev && (
        <Link
          to={prev.path}
          className="group/p flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-line-strong"
        >
          <IArrowLeft size={15} className="shrink-0 text-ink-3" />
          <span className="min-w-0 text-left">
            <span className="microlabel block">PREVIOUS</span>
            <span className="mt-0.5 block truncate text-[14px] font-semibold text-ink">
              {prev.label}
            </span>
          </span>
        </Link>
      )}
      {next && (
        <Link
          to={next.path}
          className="group/n flex min-w-0 flex-1 items-center justify-end gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-line-strong"
        >
          <span className="min-w-0 text-right">
            <span className="microlabel block">NEXT</span>
            <span className="mt-0.5 block truncate text-[14px] font-semibold text-ink">
              {next.label}
            </span>
          </span>
          <IArrowRight size={15} className="shrink-0 text-ink-3" />
        </Link>
      )}
    </div>
  );
}

const EXPLORE: Array<[string, string]> = [
  ["/docs/components/button", "Button"],
  ["/docs/components/inputs", "Inputs & selection"],
  ["/docs/components/feedback", "Feedback & overlays"],
  ["/docs/components/table", "Data table"],
  ["/docs/components/icons", "Icon library"],
];

const RESOURCES: Array<[string, string]> = [
  ["/docs/installation", "Installation"],
  ["/docs/registry", "Registry & CLI"],
  ["/docs/theming", "Theming & tokens"],
  ["/docs/patterns/templates", "Templates"],
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/50">
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <span className="text-[15px] font-bold tracking-[-0.03em] text-ink">
              {SITE.name}
            </span>
            <span className="rounded-full border border-line bg-elev px-2 py-0.5 font-mono text-[10px] text-ink-2">
              {SITE.version}
            </span>
          </div>
          <p className="mt-3.5 max-w-72 text-[13px] leading-relaxed text-ink-3">
            {SITE.description}
          </p>
          <code className="mt-4 inline-block rounded-lg border border-line bg-elev px-3 py-1.5 font-mono text-[11.5px] text-ink-2">
            npm install {SITE.pkg}
          </code>
          <div className="mt-4 flex items-center gap-2">
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="flex size-8.5 items-center justify-center rounded-[10px] border border-line bg-surface text-ink-2 transition-colors hover:text-ink"
              aria-label="GitHub repository"
            >
              <IGithub size={15} />
            </a>
            <a
              href={SITE.npm}
              target="_blank"
              rel="noreferrer"
              className="flex size-8.5 items-center justify-center rounded-[10px] border border-line bg-surface text-ink-2 transition-colors hover:text-ink"
              aria-label="npm package"
            >
              <INpm size={15} />
            </a>
          </div>
        </div>

        <div>
          <div className="microlabel mb-3">EXPLORE</div>
          <div className="flex flex-col gap-2 text-[13.5px]">
            {EXPLORE.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="w-fit font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="microlabel mb-3">RESOURCES</div>
          <div className="flex flex-col gap-2 text-[13.5px]">
            {RESOURCES.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="w-fit font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {label}
              </Link>
            ))}
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1 font-medium text-ink-2 transition-colors hover:text-ink"
            >
              GitHub <IArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-[12px] text-ink-3 md:px-10">
          <span>
            MIT licensed. Built by recreating great interfaces, pixel by pixel.
          </span>
          <a
            href={SITE.authorUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono transition-colors hover:text-ink-2"
          >
            {SITE.pkg} · {SITE.author}
          </a>
        </div>
      </div>
    </footer>
  );
}
