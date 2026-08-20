import type { ReactNode } from "react";
import { cx, IMapPin, ICalendar } from "hash-ui";
import { CropMarks, SetGlyph, IconTile, Sparkline } from "./visuals.js";
import { useRise, RISE_ATTR } from "../parts.js";

/* ------------------------------------------------------------------ */
/* FeaturesCrop                                                        */
/*                                                                     */
/* Two feature cards under printer's crop marks, then a full-width     */
/* card that closes the section with a row of captioned glyphs.        */
/*                                                                     */
/* The marks are the whole idea: they say "this is a plate, not a      */
/* window", which is the one decoration a flat system can afford —     */
/* four hairline ticks, no shadow, no border radius fighting them.     */
/* ------------------------------------------------------------------ */

export type CropFeature = {
  /** the small label with a glyph above the title */
  label?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** the illustration below the copy */
  visual?: ReactNode;
};

export type CropFooterItem = {
  caption: ReactNode;
  glyph?: ReactNode;
};

function Plate({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      data-fx-rise
      style={style}
      className={cx(
        "relative border border-line bg-surface p-6 md:p-8",
        className,
      )}
    >
      <CropMarks />
      {children}
    </div>
  );
}

const DEMO: CropFeature[] = [
  {
    label: "Real-time location tracking",
    icon: <IMapPin size={14} />,
    title: "Advanced tracking system, instantly locate all your assets.",
    visual: (
      <div className="mt-6 rounded-lg border border-line bg-inset p-4">
        <Sparkline seed={5} className="h-20" strokeClassName="text-brand" />
      </div>
    ),
  },
  {
    label: "Advanced scheduling",
    icon: <ICalendar size={14} />,
    title: "Scheduling system, plan the week without leaving the record.",
    visual: (
      <div className="mt-6 space-y-2">
        {["Mon 09:00", "Tue 14:30", "Thu 11:15"].map((slot, i) => (
          <div
            key={slot}
            className="flex items-center justify-between rounded-lg border border-line bg-inset px-3 py-2"
          >
            <span className="font-mono text-[12px] text-ink-2">{slot}</span>
            <span
              className={cx(
                "size-1.5 rounded-full",
                i === 0 ? "bg-brand" : "bg-ink-3/40",
              )}
            />
          </div>
        ))}
      </div>
    ),
  },
];

const DEMO_FOOTER: CropFooterItem[] = [
  { caption: "Inclusion", glyph: <SetGlyph mode="union" /> },
  { caption: "Intersect", glyph: <SetGlyph mode="intersect" /> },
  { caption: "Join", glyph: <SetGlyph mode="join" /> },
  { caption: "Exclusion", glyph: <SetGlyph mode="exclude" /> },
];

export type FeaturesCropProps = {
  items?: CropFeature[];
  footerTitle?: ReactNode;
  footerItems?: CropFooterItem[];
  className?: string;
};

export function FeaturesCrop({
  items = DEMO,
  footerTitle = "Smart scheduling with automated reminders for maintenance.",
  footerItems = DEMO_FOOTER,
  className,
}: FeaturesCropProps) {
  const [ref, rise] = useRise<HTMLElement>();

  return (
    <section ref={ref} className={cx("w-full py-20 md:py-28", className)}>
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <Plate key={i} style={rise(i)}>
              {item.label && (
                <div className="mb-4 flex items-center gap-2 text-[12.5px] font-medium text-ink-2">
                  {item.icon && <span className="text-ink-3">{item.icon}</span>}
                  {item.label}
                </div>
              )}
              <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.025em] text-balance text-ink">
                {item.title}
              </h3>
              {item.body && (
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-2">
                  {item.body}
                </p>
              )}
              {item.visual}
            </Plate>
          ))}
        </div>

        {(footerTitle || footerItems?.length) && (
          <Plate style={rise(items.length)} className="mt-4 text-center">
            {footerTitle && (
              <h3 className="mx-auto max-w-md text-[17px] leading-snug font-semibold tracking-[-0.025em] text-balance text-ink">
                {footerTitle}
              </h3>
            )}
            {footerItems && (
              <div className="mt-7 flex flex-wrap items-start justify-center gap-8">
                {footerItems.map((f, i) => (
                  <div key={i} className="flex w-16 flex-col items-center gap-2">
                    <IconTile className="text-ink-2">{f.glyph}</IconTile>
                    <span className="text-[11.5px] text-ink-3">{f.caption}</span>
                  </div>
                ))}
              </div>
            )}
          </Plate>
        )}
      </div>
    </section>
  );
}
