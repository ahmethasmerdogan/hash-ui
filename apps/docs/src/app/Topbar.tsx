import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  cx,
  SegmentedControl,
  useTheme,
  type ThemeMode,
  IContrast,
  IMenu,
  IMoon,
  ISearch,
  ISun,
} from "uicean";
import { LogoMark } from "@/components/Logo";
import { AccentPicker } from "@/components/AccentPicker";
import { SITE } from "@/lib/site";

/* one description of each theme mode, so the segmented control and the
   narrow-screen toggle can never drift apart */
const THEME_MODES: Record<ThemeMode, { icon: ReactNode; name: string }> = {
  system: { icon: <IContrast size={14} />, name: "Match the system theme" },
  light: { icon: <ISun size={14} />, name: "Light theme" },
  dark: { icon: <IMoon size={14} />, name: "Dark theme" },
};
const THEME_ORDER: ThemeMode[] = ["system", "light", "dark"];
const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const TABS = [
  { to: "/docs", label: "Docs", match: (p: string) => p === "/docs" },
  {
    to: "/docs/components/button",
    label: "Components",
    match: (p: string) => p.startsWith("/docs/components"),
  },
  {
    to: "/docs/patterns/templates",
    label: "Templates",
    match: (p: string) => p.startsWith("/docs/patterns"),
  },
];

function IGithub({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.8c-2.92.64-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.08 1.61 1.09 1.61 1.09.94 1.6 2.47 1.14 3.07.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.19 0-1.15.41-2.08 1.09-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.89 1.08a10 10 0 0 1 5.26 0c2-1.36 2.88-1.08 2.88-1.08.58 1.45.22 2.52.11 2.79.68.74 1.09 1.67 1.09 2.82 0 4.03-2.46 4.92-4.8 5.18.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}

function INpm({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 6h20v11h-9.5v2H8v-2H2V6Zm2.5 2.5v6H7v-4h1.7v4h2.1v-6H4.5Zm8.3 0v6h2.2v-4h1.7v4h2.1v-4h1.7v4h.9v-6h-8.6Z" />
    </svg>
  );
}

export function Topbar({
  onMenu,
  onSearch,
}: {
  onMenu: () => void;
  onSearch: () => void;
}) {
  const { mode, setMode } = useTheme();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-lg">
      <div className="mx-auto flex h-15 max-w-[1440px] items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-surface text-ink-2 lg:hidden"
        >
          <IMenu size={16} />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <LogoMark size={28} />
          <span className="text-[16px] font-bold tracking-[-0.03em] text-ink">
            {SITE.name}
          </span>
          <span className="hidden rounded-full border border-line bg-elev px-2 py-0.5 font-mono text-[10px] font-medium text-ink-2 sm:inline">
            {SITE.version}
          </span>
        </Link>

        {/* these appear at lg, with the sidebar. At md they turned on 274px
            of tabs into a row that had no room for them — 768px, the width
            of a portrait tablet, was the one size where the header did not
            fit. Below lg the same destinations are in the drawer, which is
            what the navigation button is for. */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {TABS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={cx(
                "rounded-full px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                t.match(pathname)
                  ? "bg-inset text-ink"
                  : "text-ink-2 hover:text-ink",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="flex h-9 items-center gap-2 rounded-[10px] border border-line bg-elev px-3 text-[13px] text-ink-3 transition-colors hover:border-line-strong hover:text-ink-2"
          >
            <ISearch size={14} />
            <span className="hidden sm:inline">Search docs…</span>
            <span className="ml-1 hidden rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10.5px] whitespace-nowrap sm:inline">
              ⌘K
            </span>
          </button>

          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="UICean on GitHub"
            className="hidden size-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-surface text-ink-2 transition-colors hover:text-ink sm:flex"
          >
            <IGithub />
          </a>
          <a
            href={SITE.npm}
            target="_blank"
            rel="noreferrer"
            aria-label="uicean on npm"
            className="hidden size-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-surface text-ink-2 transition-colors hover:text-ink md:flex"
          >
            <INpm />
          </a>

          <AccentPicker />

          {/* Three segments cost 108px. Below sm that is the difference
              between a header that fits a 320px screen and one that does
              not — and WCAG 1.4.10 asks for no horizontal scrolling at
              exactly that width. The same three modes, one at a time. */}
          <button
            type="button"
            onClick={() => setMode(NEXT_MODE[mode])}
            aria-label={`${THEME_MODES[mode].name}. Activate for ${THEME_MODES[NEXT_MODE[mode]].name.toLowerCase()}`}
            title={THEME_MODES[mode].name}
            className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-surface text-ink-2 transition-colors hover:text-ink sm:hidden"
          >
            {THEME_MODES[mode].icon}
          </button>

          <SegmentedControl<ThemeMode>
            className="max-sm:hidden"
            size="sm"
            value={mode}
            onChange={setMode}
            options={THEME_ORDER.map((value) => ({
              value,
              label: THEME_MODES[value].icon,
              name: THEME_MODES[value].name,
            }))}
          />
        </div>
      </div>
    </header>
  );
}

export { IGithub, INpm };
