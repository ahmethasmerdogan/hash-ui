import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "system" | "light" | "dark";

/* Accent presets. The palette itself lives in hashui.css under
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
};

const Ctx = createContext<ThemeCtx>({
  mode: "system",
  resolved: "light",
  setMode: () => {},
  font: "geist",
  setFont: () => {},
  accent: "emerald",
  setAccent: () => {},
});

const STORAGE_KEY = "hashui-theme";
const FONT_KEY = "hashui-font";
const ACCENT_KEY = "hashui-accent";

function systemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/* The default accent sets no attribute at all, so a project that never
   touches this still gets the plain :root palette and nothing extra to
   reason about in devtools. */
function applyAccent(a: AccentId) {
  const el = document.documentElement;
  if (a === "emerald") el.removeAttribute("data-accent");
  else el.setAttribute("data-accent", a);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    return s === "light" || s === "dark" || s === "system" ? s : "system";
  });
  const [resolved, setResolved] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [font, setFontState] = useState<FontId>(() => {
    const f = localStorage.getItem(FONT_KEY);
    return f === "inter" || f === "system" || f === "geist" ? f : "geist";
  });
  const [accent, setAccentState] = useState<AccentId>(() => {
    const a = localStorage.getItem(ACCENT_KEY) as AccentId | null;
    return a && ACCENT_IDS.includes(a) ? a : "emerald";
  });

  const apply = useCallback((m: ThemeMode) => {
    const dark = m === "dark" || (m === "system" && systemDark());
    document.documentElement.classList.toggle("dark", dark);
    setResolved(dark ? "dark" : "light");
  }, []);

  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m);
      localStorage.setItem(STORAGE_KEY, m);
      apply(m);
    },
    [apply],
  );

  const setFont = useCallback((f: FontId) => {
    setFontState(f);
    localStorage.setItem(FONT_KEY, f);
    document.documentElement.style.setProperty(
      "--font-sans-pick",
      FONTS[f].stack,
    );
  }, []);

  useEffect(() => {
    apply(mode);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) ?? "system") === "system")
        apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [apply, mode]);

  const setAccent = useCallback((a: AccentId) => {
    setAccentState(a);
    localStorage.setItem(ACCENT_KEY, a);
    applyAccent(a);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-sans-pick",
      FONTS[font].stack,
    );
  }, [font]);

  useEffect(() => {
    applyAccent(accent);
  }, [accent]);

  return (
    <Ctx.Provider
      value={{ mode, resolved, setMode, font, setFont, accent, setAccent }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  return useContext(Ctx);
}
