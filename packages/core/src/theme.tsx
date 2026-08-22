import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "system" | "light" | "dark";

/* Accent presets. The palette itself lives in uicean.css under
   [data-accent]; this table is only what a picker needs to draw itself. */
export type AccentId = "emerald" | "blue" | "violet" | "amber" | "rose";

export const ACCENTS: Record<
  AccentId,
  { label: string; note: string; swatch: string }
> = {
  emerald: { label: "Emerald", note: "The default", swatch: "#059669" },
  blue: { label: "Blue", note: "Calm, institutional", swatch: "#2563eb" },
  violet: { label: "Violet", note: "Product, playful", swatch: "#7c3aed" },
  amber: { label: "Amber", note: "Warm, editorial", swatch: "#b45309" },
  rose: { label: "Rose", note: "Bold, consumer", swatch: "#e11d48" },
};

const ACCENT_IDS = Object.keys(ACCENTS) as AccentId[];

/* ------------------------------------------------------------------ */
/* Sector themes                                                       */
/*                                                                     */
/* An accent moves one hue. A sector theme moves the whole room —      */
/* surfaces, ink, hairlines, corner radius and accent together —       */
/* because what separates a banking console from a recipe site is not  */
/* which green they picked.                                            */
/*                                                                     */
/* The two axes compose: `data-theme` sets the room, `data-accent`      */
/* still overrides the hue on top of it. The palettes live in           */
/* uicean.css under [data-theme]; this table is what a picker needs.    */
/* ------------------------------------------------------------------ */
export type ThemeId =
  | "default"
  | "fintech"
  | "health"
  | "commerce"
  | "editorial"
  | "studio"
  | "legal";

export const THEMES: Record<
  ThemeId,
  { label: string; note: string; swatch: string; radius: number }
> = {
  default: { label: "Default", note: "Warm neutral, emerald", swatch: "#059669", radius: 10 },
  fintech: { label: "Fintech", note: "Cool, exact, tight corners", swatch: "#1d4ed8", radius: 6 },
  health: { label: "Health", note: "Airy, unhurried, soft", swatch: "#0f766e", radius: 14 },
  commerce: { label: "Commerce", note: "Warm cream, price-tag orange", swatch: "#c2410c", radius: 10 },
  editorial: { label: "Editorial", note: "Paper, almost no radius", swatch: "#a3231b", radius: 2 },
  studio: { label: "Studio", note: "Dark first, one loud accent", swatch: "#6d28d9", radius: 12 },
  legal: { label: "Legal", note: "Sober, dense, navy", swatch: "#1e3a8a", radius: 4 },
};

const THEME_IDS = Object.keys(THEMES) as ThemeId[];

/* Typeface presets — Geist is the system default. */
export type FontId = "geist" | "inter" | "system";

export const FONTS: Record<
  FontId,
  { label: string; note: string; stack: string }
> = {
  geist: {
    label: "Geist",
    note: "Vercel · system default",
    stack:
      '"Geist Variable", "Inter Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  inter: {
    label: "Inter",
    note: "Rasmus Andersson",
    stack:
      '"Inter Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  system: {
    label: "System",
    note: "SF Pro / Segoe UI",
    stack:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  },
};

type ThemeCtx = {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (m: ThemeMode) => void;
  font: FontId;
  setFont: (f: FontId) => void;
  accent: AccentId;
  setAccent: (a: AccentId) => void;
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
};

const Ctx = createContext<ThemeCtx>({
  mode: "system",
  resolved: "light",
  setMode: () => {},
  font: "geist",
  setFont: () => {},
  accent: "emerald",
  setAccent: () => {},
  theme: "default",
  setTheme: () => {},
});

const STORAGE_KEY = "uicean-theme";
const FONT_KEY = "uicean-font";
const ACCENT_KEY = "uicean-accent";
const THEME_KEY = "uicean-sector";

/* Every browser global in this file goes through one of these three.

   The provider used to read localStorage and document inside its useState
   initialisers, which run during render — so importing it into a Next.js
   App Router layout, which the installation page documents, crashed on the
   server before the first byte went out.

   The stored value is now read in an effect instead. That means the first
   client render matches the server's, and the preference is applied a frame
   later; the flash that would otherwise cause is prevented by the inline
   script in `themeScript`, which runs before paint. */
const canUseDOM =
  typeof window !== "undefined" && typeof document !== "undefined";

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (!canUseDOM) return fallback;
  try {
    const v = window.localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    /* Safari in private mode throws on localStorage rather than returning
       null, and a theme preference is not worth taking the page down for. */
    return fallback;
  }
}

function writeStored(key: string, value: string) {
  if (!canUseDOM) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* see above */
  }
}

function systemDark() {
  return canUseDOM && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/* The default accent sets no attribute at all, so a project that never
   touches this still gets the plain :root palette and nothing extra to
   reason about in devtools. */
function applyAccent(a: AccentId) {
  if (!canUseDOM) return;
  const el = document.documentElement;
  if (a === "emerald") el.removeAttribute("data-accent");
  else el.setAttribute("data-accent", a);
}

/* Same reasoning as applyAccent: the default sets no attribute, so a
   project that never picks a sector has nothing extra in its devtools. */
function applyTheme(t: ThemeId) {
  if (!canUseDOM) return;
  const el = document.documentElement;
  if (t === "default") el.removeAttribute("data-theme");
  else el.setAttribute("data-theme", t);
}

const MODES = ["system", "light", "dark"] as const;
const FONT_IDS = ["geist", "inter", "system"] as const;

export function ThemeProvider({ children }: { children: ReactNode }) {
  /* Defaults on both sides of the hydration boundary; the stored preference
     arrives in the effect below. */
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");
  const [font, setFontState] = useState<FontId>("geist");
  const [accent, setAccentState] = useState<AccentId>("emerald");
  const [theme, setThemeState] = useState<ThemeId>("default");

  useEffect(() => {
    setModeState(readStored(STORAGE_KEY, MODES, "system"));
    setFontState(readStored(FONT_KEY, FONT_IDS, "geist"));
    setAccentState(readStored(ACCENT_KEY, ACCENT_IDS, "emerald"));
    setThemeState(readStored(THEME_KEY, THEME_IDS, "default"));
  }, []);

  const apply = useCallback((m: ThemeMode) => {
    if (!canUseDOM) return;
    const dark = m === "dark" || (m === "system" && systemDark());
    document.documentElement.classList.toggle("dark", dark);
    setResolved(dark ? "dark" : "light");
  }, []);

  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m);
      writeStored(STORAGE_KEY, m);
      apply(m);
    },
    [apply],
  );

  const setFont = useCallback((f: FontId) => {
    setFontState(f);
    writeStored(FONT_KEY, f);
    if (canUseDOM) {
      document.documentElement.style.setProperty(
        "--font-sans-pick",
        FONTS[f].stack,
      );
    }
  }, []);

  useEffect(() => {
    if (!canUseDOM) return;
    apply(mode);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStored(STORAGE_KEY, MODES, "system") === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [apply, mode]);

  const setAccent = useCallback((a: AccentId) => {
    setAccentState(a);
    writeStored(ACCENT_KEY, a);
    applyAccent(a);
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    writeStored(THEME_KEY, t);
    applyTheme(t);
  }, []);

  useEffect(() => {
    if (!canUseDOM) return;
    document.documentElement.style.setProperty(
      "--font-sans-pick",
      FONTS[font].stack,
    );
  }, [font]);

  useEffect(() => {
    applyAccent(accent);
  }, [accent]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Ctx.Provider
      value={{ mode, resolved, setMode, font, setFont, accent, setAccent, theme, setTheme }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  return useContext(Ctx);
}

/* ------------------------------------------------------------------ */

/**
 * The blocking script that applies the stored theme before the first paint.
 *
 * `ThemeProvider` reads the preference in an effect so it can be rendered on
 * a server, which means React applies it one frame after hydration — long
 * enough to see the wrong theme. This runs first, straight from the document
 * head, and sets the same class and attribute the provider would.
 *
 * Server-rendered apps need it. A pure client app does not, because there is
 * nothing painted before React runs.
 *
 *   // app/layout.tsx
 *   import { themeScript } from "uicean";
 *
 *   <head>
 *     <script dangerouslySetInnerHTML={{ __html: themeScript }} />
 *   </head>
 *
 * It is a fixed string built at module scope, not from user input — there is
 * nothing to interpolate and nothing to escape.
 */
export const themeScript = `(function(){try{
var d=document.documentElement;
var m=localStorage.getItem("${STORAGE_KEY}")||"system";
var dark=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
d.classList.toggle("dark",dark);
var a=localStorage.getItem("${ACCENT_KEY}");
if(a&&a!=="emerald")d.setAttribute("data-accent",a);
var t=localStorage.getItem("${THEME_KEY}");
if(t&&t!=="default")d.setAttribute("data-theme",t);
var f=localStorage.getItem("${FONT_KEY}");
var s={geist:'"Geist Variable","Inter Variable",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',inter:'"Inter Variable",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',system:'-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif'}[f];
if(s)d.style.setProperty("--font-sans-pick",s);
}catch(e){}})();`;
