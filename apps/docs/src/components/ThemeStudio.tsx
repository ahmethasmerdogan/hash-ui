import { useEffect, useState } from "react";
import {
  ACCENTS,
  useTheme,
  useToast,
  cx,
  Button,
  Card,
  StatusPill,
  Switch,
  Checkbox,
  Toggle,
  Field,
  Separator,
  Spinner,
  Avatar,
  CountBadge,
  ProgressBar,
  ICheck,
  ICopy,
  ISun,
  IMoon,
  type AccentId,
  type ThemeMode,
} from "hash-ui";

/* ------------------------------------------------------------------ */
/* ThemeStudio                                                         */
/*                                                                     */
/* The theming page documented the tokens and stopped there: a reader   */
/* could see the palette but could not turn anything, and had to guess  */
/* what to paste into their own project.                                */
/*                                                                     */
/* This is the missing half. The controls write straight to the live    */
/* document — --radius on the root element, data-accent, the dark class */
/* — so the whole site, this preview included, reshapes underneath you. */
/* Nothing is simulated, which is the point: what you are looking at is */
/* the theme, not a picture of it.                                      */
/*                                                                     */
/* The block at the bottom is the actual output. It is generated from   */
/* whatever the controls are currently set to, so it cannot drift from  */
/* what the preview shows.                                              */
/* ------------------------------------------------------------------ */

const ACCENT_IDS = Object.keys(ACCENTS) as AccentId[];

/* the four radius steps, keyed to what the token produces at each stop */
const RADIUS_STOPS = [0, 4, 6, 8, 10, 12, 16] as const;

export function ThemeStudio() {
  const { accent, setAccent, mode, setMode } = useTheme();
  const { push } = useToast();
  const [radius, setRadius] = useState(10);
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [live, setLive] = useState(true);

  /* the slider is the token. Writing it on the root is what makes every
     button on the page — including the ones in the sidebar — follow. */
  useEffect(() => {
    document.documentElement.style.setProperty("--radius", `${radius}px`);
    return () => {
      document.documentElement.style.removeProperty("--radius");
    };
  }, [radius]);

  const css = `:root {
  /* corner radius — every step is derived from this one number */
  --radius: ${radius}px;
}

/* accent: ${ACCENTS[accent].label.toLowerCase()} — set it on <html> and the
   whole system follows, or copy the preset out of hashui.css to pin it */
<html data-accent="${accent}">`;

  const copy = () => {
    void navigator.clipboard
      .writeText(css)
      .then(() => push({ tone: "success", title: "Copied", desc: "Paste it over your :root block." }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      {/* ---------------------------------------------------------- */}
      {/* controls                                                    */}
      {/* ---------------------------------------------------------- */}
      <Card className="flex flex-col gap-6 p-5">
        <div>
          <p className="microlabel mb-3">Accent</p>
          <div className="grid grid-cols-1 gap-1.5">
            {ACCENT_IDS.map((id) => {
              const a = ACCENTS[id];
              const on = accent === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAccent(id)}
                  aria-pressed={on}
                  className={cx(
                    "flex items-center gap-2.5 rounded-[var(--radius)] border px-3 py-2 text-left transition-colors",
                    "outline-none focus-visible:ring-2 focus-visible:ring-brand/45",
                    on ? "border-line-strong bg-elev" : "border-transparent hover:bg-inset",
                  )}
                >
                  <span
                    aria-hidden
                    className="size-5 shrink-0 rounded-[calc(var(--radius)*0.5)]"
                    style={{ background: a.swatch }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-ink">
                      {a.label}
                    </span>
                    <span className="block truncate text-[11.5px] text-ink-3">{a.note}</span>
                  </span>
                  {on && <ICheck size={14} className="shrink-0 text-brand" />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <p className="microlabel">Radius</p>
            <code className="font-mono text-[12px] text-ink-2">{radius}px</code>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {RADIUS_STOPS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadius(r)}
                aria-pressed={radius === r}
                className={cx(
                  "h-8 flex-1 min-w-11 rounded-[var(--radius-btn-sm)] border text-[12px] font-medium transition-colors",
                  "outline-none focus-visible:ring-2 focus-visible:ring-brand/45",
                  radius === r
                    ? "border-transparent bg-ink text-canvas"
                    : "border-line text-ink-2 hover:bg-inset hover:text-ink",
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-[11.5px] leading-relaxed text-ink-3">
            Writes <code className="font-mono">--radius</code> on{" "}
            <code className="font-mono">&lt;html&gt;</code>. The sidebar and the
            header follow it too — this is the live document, not a preview
            frame.
          </p>
        </div>

        <div>
          <p className="microlabel mb-3">Mode</p>
          <div className="flex gap-1.5">
            {(
              [
                ["light", <ISun key="s" size={14} />, "Light"],
                ["dark", <IMoon key="m" size={14} />, "Dark"],
              ] as Array<[ThemeMode, React.ReactNode, string]>
            ).map(([m, icon, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={cx(
                  "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-btn-sm)] border text-[13px] font-medium transition-colors",
                  "outline-none focus-visible:ring-2 focus-visible:ring-brand/45",
                  mode === m
                    ? "border-transparent bg-ink text-canvas"
                    : "border-line text-ink-2 hover:bg-inset hover:text-ink",
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ---------------------------------------------------------- */}
      {/* live preview                                                */}
      {/* ---------------------------------------------------------- */}
      <div className="flex min-w-0 flex-col gap-4">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar name="Ahmet H. Erdoğan" size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-semibold text-ink">
                  Northwind workspace
                </span>
                <span className="block truncate text-[12px] text-ink-3">
                  Scale plan · 240 seats
                </span>
              </span>
            </div>
            <StatusPill tone="green">Live</StatusPill>
          </div>

          <Separator className="mb-4" />

          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Button variant="green" size="sm">
              Primary
            </Button>
            <Button variant="dark" size="sm">
              Dark
            </Button>
            <Button variant="outline" size="sm">
              Outline
            </Button>
            <Button variant="ghost" size="sm">
              Ghost
            </Button>
            <Button variant="green" size="sm" disabled>
              Disabled
            </Button>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Workspace name" hint="Shown to everyone you invite.">
              {(p) => (
                <input
                  {...p}
                  defaultValue="Northwind"
                  className="h-9.5 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/15"
                />
              )}
            </Field>
            <Field label="Handle" error="That handle is already taken.">
              {(p) => (
                <input
                  {...p}
                  defaultValue="admin"
                  className="h-9.5 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/15 aria-[invalid=true]:border-red-500"
                />
              )}
            </Field>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Switch checked={live} onChange={setLive} label="Publish workspace" />
            <Checkbox checked={agreed} onChange={setAgreed} label="Send weekly digest" />
            <Toggle pressed size="sm" aria-label="Bold">
              B
            </Toggle>
            <CountBadge>12</CountBadge>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[13px] text-ink-2"
              onClick={() => {
                setBusy(true);
                window.setTimeout(() => setBusy(false), 1400);
              }}
            >
              {busy ? <Spinner size={14} label={null} /> : null}
              {busy ? "Saving…" : "Trigger a spinner"}
            </button>
          </div>

          <ProgressBar value={62} />
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <p className="microlabel !mb-0">Paste this into your project</p>
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius-btn-sm)] border border-line bg-elev px-2.5 font-mono text-[11.5px] text-ink-2 transition-colors hover:text-ink"
            >
              <ICopy size={11} />
              copy
            </button>
          </div>
          <pre className="scroll-thin overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-ink-2">
            {css}
          </pre>
        </Card>
      </div>
    </div>
  );
}
