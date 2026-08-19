import type { ReactNode } from "react";
import {
  cx,
  Marquee,
  ICube,
  IDatabase,
  IGitBranch,
  ILayers,
  ICommand,
  IBox,
  IZap,
  IHash,
} from "hash-ui";
import { ActionButton, useRise, RISE_ATTR, type Action } from "../parts.js";

/* ------------------------------------------------------------------ */
/* IntegrationsMarquee                                                 */
/*                                                                     */
/* Three rows of integration chips drifting past each other behind a   */
/* radial mask, with your own mark held still in the middle.           */
/*                                                                     */
/* The original ships a 90-line `InfiniteSlider` built on framer-motion */
/* and react-use-measure. Core already has <Marquee>, which does the    */
/* same job on a CSS keyframe, so the port is mostly deletion. One      */
/* behavioural difference worth knowing: upstream *slows* on hover,     */
/* core's Marquee *pauses* — the HashUI convention, kept on purpose.    */
/* ------------------------------------------------------------------ */

export type Integration = {
  /** the accessible name, also the tooltip */
  name: string;
  icon: ReactNode;
};

const size = 20;

const DEMO: Integration[] = [
  { name: "Git", icon: <IGitBranch size={size} /> },
  { name: "Containers", icon: <IBox size={size} /> },
  { name: "Editor", icon: <ICommand size={size} /> },
  { name: "Postgres", icon: <IDatabase size={size} /> },
  { name: "Registry", icon: <ICube size={size} /> },
  { name: "Design", icon: <ILayers size={size} /> },
  { name: "Webhooks", icon: <IZap size={size} /> },
  { name: "Channels", icon: <IHash size={size} /> },
];

function Chip({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      title={label}
      className={cx(
        "flex size-12 items-center justify-center rounded-full border border-line bg-surface text-ink-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** rotate the list per row so the three tracks never line up vertically */
function rotate<T>(list: T[], by: number) {
  const n = list.length;
  return list.map((_, i) => list[(i + by) % n]);
}

export type IntegrationsMarqueeProps = {
  integrations?: Integration[];
  /** your own mark, pinned in the centre */
  centre?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: Action;
  className?: string;
};

export function IntegrationsMarquee({
  integrations = DEMO,
  centre,
  title = "Integrate with your favourite tools",
  description = "Connect seamlessly with the platforms and services your workflow already runs on.",
  action = { label: "Get started", href: "#" },
  className,
}: IntegrationsMarqueeProps) {
  const rows = [rotate(integrations, 0), rotate(integrations, 3), rotate(integrations, 5)];
  const [ref, rise] = useRise<HTMLElement>();

  return (
    <section ref={ref} className={cx("w-full py-24 md:py-32", className)}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative isolate mx-auto max-w-md">
          {/* the ruled grid the chips travel over */}
          <div
            aria-hidden
            className="fx-grid fx-mask-radial absolute inset-0 -z-10 opacity-50"
          />

          {/* the mask is what sells the drift: rows arrive from nowhere and
              leave the same way, so the loop seam is never on screen */}
          <div className="fx-mask-radial space-y-6 py-4">
            {rows.map((row, i) => (
              <Marquee
                key={i}
                duration={34}
                reverse={i === 1}
                fade={false}
              >
                {row.map((item, j) => (
                  <Chip key={`${item.name}-${j}`} label={item.name}>
                    {item.icon}
                  </Chip>
                ))}
              </Marquee>
            ))}
          </div>

          {/* the still point. Frosted rather than solid so the rows read as
              passing behind it rather than being clipped by it. */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Chip
              label="Your app"
              className="fx-glass size-16 border-line-strong text-ink [&_svg]:size-8"
            >
              {centre ?? <ICube size={32} />}
            </Chip>
          </div>
        </div>

        <div {...RISE_ATTR} style={rise(1)} className="mx-auto mt-12 max-w-lg space-y-5 text-center">
          <h2 className="text-3xl font-bold tracking-[-0.035em] text-balance text-ink md:text-4xl">
            {title}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-2">{description}</p>
          {action && (
            <div className="flex justify-center pt-1">
              <ActionButton action={action} size="sm" fallbackVariant="outline" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
