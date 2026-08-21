import { useState } from "react";
import { Section, Demo } from "@/components/Section";
import {
  Card,
  cx,
  type ThemeMode,
  useTheme,
  ICheck,
  IContrast,
  IMoon,
  ISun,
} from "uicean";

/* 4-point sparkle used across the icon refs */
function Star4({ size = 30, fill = "white" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M32 5c2.2 15.8 11.2 24.8 27 27-15.8 2.2-24.8 11.2-27 27-2.2-15.8-11.2-24.8-27-27 15.8-2.2 24.8-11.2 27-27Z"
        fill={fill}
      />
    </svg>
  );
}

const TILE =
  "flex size-16 items-center justify-center rounded-[22%] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-transform duration-150 hover:-translate-y-0.5";

function AppIconGrid() {
  return (
    <div className="grid grid-cols-4 gap-5 rounded-[28px] bg-[#111113] p-7 shadow-float md:grid-cols-6">
      {/* orbit star — logo-0001 */}
      <span className={cx(TILE, "relative bg-gradient-to-b from-[#6db6ff] to-[#1668f0]")}>
        <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 8c2 14.4 9.6 22 24 24-14.4 2-22 9.6-24 24-2-14.4-9.6-22-24-24 14.4-2 22-9.6 24-24Z"
            fill="url(#star-glass)"
          />
          <ellipse
            cx="32"
            cy="32"
            rx="26"
            ry="9"
            transform="rotate(-24 32 32)"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2.5"
          />
          <path d="m48 12 1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2 1.2-3Z" fill="#fff" />
          <defs>
            <linearGradient id="star-glass" x1="32" y1="8" x2="32" y2="56">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#cfe1ff" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      {/* purple sparkle */}
      <span className={cx(TILE, "bg-[radial-gradient(120%_120%_at_30%_15%,#c084fc_0%,#7c3aed_55%,#4c1d95_100%)]")}>
        <Star4 size={34} />
      </span>

      {/* siri orb */}
      <span className={cx(TILE, "bg-[#1a1a1e]")}>
        <span
          className="size-9 rounded-full blur-[3px]"
          style={{
            background:
              "conic-gradient(from 210deg, #22d3ee, #a78bfa, #f472b6, #fbbf24, #34d399, #22d3ee)",
          }}
        />
      </span>

      {/* esc key */}
      <span className={cx(TILE, "bg-gradient-to-b from-[#ff7a3d] to-[#ea3d12]")}>
        <span className="flex h-9 w-11 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#ff8d55] to-[#f14e1f] text-[13px] font-semibold text-white shadow-[inset_0_2px_3px_rgba(255,255,255,0.35)]">
          esc
        </span>
      </span>

      {/* LCD timer */}
      <span className={cx(TILE, "flex-col gap-1 bg-gradient-to-b from-[#3a3a40] to-[#141416]")}>
        <span className="flex h-7 w-12 items-center justify-center rounded-md bg-black font-mono text-[13px] font-bold tracking-[0.1em] text-emerald-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] [text-shadow:0_0_8px_rgba(52,211,153,0.9)]">
          00:02
        </span>
      </span>

      {/* white asterisk on black */}
      <span className={cx(TILE, "bg-[#f5f5f4]")}>
        <svg width="34" height="34" viewBox="0 0 64 64" fill="#111113">
          <path d="M29 8h6v18.2l15.8-9.1 3 5.2L38 31.4l15.8 9.1-3 5.2L35 36.6V56h-6V36.6l-15.8 9.1-3-5.2L26 31.4l-15.8-9.1 3-5.2L29 26.2V8Z" />
        </svg>
      </span>

      {/* green dots flower */}
      <span className={cx(TILE, "bg-gradient-to-b from-[#0d9478] to-[#065f46]")}>
        <svg width="34" height="34" viewBox="0 0 64 64" fill="#86efac">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle
              key={a}
              cx={32 + 13 * Math.cos((a * Math.PI) / 180)}
              cy={32 + 13 * Math.sin((a * Math.PI) / 180)}
              r="5.5"
            />
          ))}
          <circle cx="32" cy="32" r="5" fill="#bbf7d0" />
        </svg>
      </span>

      {/* X tile */}
      <span className={cx(TILE, "bg-gradient-to-b from-white to-[#d9d9de]")}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#111113">
          <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.9L17.8 3Zm-1.1 16.1h1.7L7.5 4.7H5.7l11 14.4Z" />
        </svg>
      </span>

      {/* chat bubble red */}
      <span className={cx(TILE, "bg-gradient-to-b from-[#ff6b5e] to-[#dc2626]")}>
        <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 12c12.7 0 23 8.5 23 19s-10.3 19-23 19c-2.6 0-5.2-.4-7.5-1L13 53l3-8.6C11.7 41 9 36.3 9 31c0-10.5 10.3-19 23-19Z"
            fill="url(#bub)"
          />
          <defs>
            <linearGradient id="bub" x1="32" y1="12" x2="32" y2="53">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#ffd9d4" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      {/* wallet */}
      <span className={cx(TILE, "bg-gradient-to-b from-[#a9743f] to-[#6b4423]")}>
        <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
          <rect x="12" y="18" width="40" height="30" rx="7" fill="#4a2f18" />
          <rect x="12" y="24" width="40" height="24" rx="7" fill="#8a5a2e" />
          <rect x="34" y="30" width="18" height="11" rx="5.5" fill="#4a2f18" />
          <circle cx="44" cy="35.5" r="3" fill="#e7c08a" />
          <text x="20" y="43" fontSize="12" fontWeight="700" fill="#e7c08a">
            $
          </text>
        </svg>
      </span>

      {/* blue snow/asterisk on blueprint */}
      <span
        className={cx(TILE, "bg-gradient-to-b from-[#4d9bff] to-[#1d5fe0]")}
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(180deg,#4d9bff,#1d5fe0)",
          backgroundSize: "12px 12px, 12px 12px, 100% 100%",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 64 64" fill="white">
          <path d="M29.5 6h5v20.4L52 16.2l2.5 4.3L36.7 31l17.8 10.5-2.5 4.3-17.5-10.2V56h-5V35.6L12 45.8l-2.5-4.3L27.3 31 9.5 20.5l2.5-4.3 17.5 10.2V6Z" />
        </svg>
      </span>

      {/* smiley chat violet */}
      <span className={cx(TILE, "bg-gradient-to-b from-[#818cf8] to-[#4f46e5]")}>
        <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 11c13 0 23.5 8.8 23.5 19.6S45 50.2 32 50.2c-2.4 0-4.7-.3-6.9-.9L14 53l2.8-8C13 41.6 8.5 36.6 8.5 30.6 8.5 19.8 19 11 32 11Z"
            fill="#fff"
          />
          <circle cx="24.5" cy="28" r="2.6" fill="#4f46e5" />
          <circle cx="39.5" cy="28" r="2.6" fill="#4f46e5" />
          <path
            d="M24 36c2.2 2.6 4.9 3.9 8 3.9s5.8-1.3 8-3.9"
            stroke="#4f46e5"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
}

/* ---- Luma-style appearance panel, wired to the real site theme ---------- */

const STAR_VARIANTS = [
  {
    id: "default",
    label: "Default",
    tile: "bg-white",
    star: "#111113",
    extra: "iridescent",
  },
  {
    id: "iridescent",
    label: "Iridescent",
    tile: "bg-[radial-gradient(120%_120%_at_30%_10%,#c4b5fd_0%,#6d28d9_50%,#1e1b4b_100%)]",
    star: "white",
  },
  {
    id: "diamond",
    label: "Diamond",
    tile: "bg-[radial-gradient(130%_130%_at_70%_20%,#f0abfc_0%,#a21caf_55%,#4a044e_100%)]",
    star: "white",
  },
  {
    id: "gradient",
    label: "Gradient",
    tile: "bg-[linear-gradient(135deg,#22d3ee_0%,#818cf8_30%,#e879f9_60%,#fb923c_100%)]",
    star: "white",
  },
  {
    id: "candy",
    label: "Candy",
    tile: "bg-[#17171a]",
    star: "url(#candy-g)",
  },
  {
    id: "zen",
    label: "Zen",
    tile: "bg-[#f7f1e8]",
    star: "#1c1917",
  },
  {
    id: "lux",
    label: "Lux",
    tile: "bg-[#111113]",
    star: "white",
  },
  {
    id: "cloud",
    label: "Cloud",
    tile: "bg-[linear-gradient(180deg,#bfdbfe_0%,#fbcfe8_100%)]",
    star: "#4c1d95",
  },
];

function AppearancePanel() {
  const { mode, setMode } = useTheme();
  const [icon, setIcon] = useState("default");

  const schemes: Array<{ id: ThemeMode; label: string; icon: React.ReactNode }> = [
    { id: "system", label: "System", icon: <IContrast size={20} /> },
    { id: "light", label: "Light", icon: <ISun size={20} /> },
    { id: "dark", label: "Dark", icon: <IMoon size={20} /> },
  ];

  return (
    <Card floating className="w-full max-w-105 rounded-[26px] p-6">
      <div className="text-center text-[16px] font-bold text-ink">Appearance</div>

      <div className="mt-5 text-[15px] font-semibold text-ink">Color Scheme</div>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-3">
        Turn on dark mode, or let UICean visually match your device settings.
        This card drives the real site theme.
      </p>
      <div className="mt-3.5 grid grid-cols-3 gap-2.5">
        {schemes.map((s) => {
          const on = mode === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setMode(s.id)}
              className={cx(
                "flex flex-col items-start gap-4 rounded-2xl border-2 px-4 pt-4 pb-3.5 transition-all",
                on
                  ? "border-ink text-ink"
                  : "border-line text-ink-3 hover:border-line-strong",
              )}
            >
              {s.icon}
              <span className={cx("text-[14px]", on ? "font-bold" : "font-medium")}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-[15px] font-semibold text-ink">App Icon</div>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="candy-g" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fb923c" />
            <stop offset="0.5" stopColor="#f472b6" />
            <stop offset="1" stopColor="#e879f9" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-3.5 grid grid-cols-4 gap-x-2 gap-y-4">
        {STAR_VARIANTS.map((v) => {
          const on = icon === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setIcon(v.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={cx(
                  "flex size-15 items-center justify-center rounded-[22%] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-transform hover:-translate-y-0.5",
                  v.tile,
                )}
              >
                <Star4 size={30} fill={v.star} />
              </span>
              <span
                className={cx(
                  "text-[12px]",
                  on ? "font-semibold text-ink" : "text-ink-2",
                )}
              >
                {v.label}
              </span>
              <span
                className={cx(
                  "flex size-4.5 items-center justify-center rounded-full",
                  on ? "bg-ink text-canvas" : "bg-transparent",
                )}
              >
                {on && <ICheck size={11} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default function IconsSection() {
  return (
    <Section
      id="icons"
      eyebrow="Brand"
      title="App icons"
      desc="Squircle icon treatments rebuilt in CSS and SVG — glass stars, LCD screens, orbs — plus the appearance sheet, wired to the actual site theme."
    >
      <Demo label="Icon set" refName="logo-0001 · logo-0002 · logo-design-0001" contentClassName="py-10">
        <AppIconGrid />
      </Demo>
      <Demo label="Appearance sheet (functional)" refName="logo-001" contentClassName="py-10">
        <AppearancePanel />
      </Demo>
    </Section>
  );
}
