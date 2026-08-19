import type { ReactNode } from "react";
import { cx, Card, StatusPill } from "hash-ui";
import { useRise, RISE_ATTR } from "../parts.js";
import {
  StatDial,
  FingerprintMark,
  Sparkline,
  AvatarStack,
} from "./visuals.js";

/* ------------------------------------------------------------------ */
/* FeaturesBento                                                       */
/*                                                                     */
/* The uneven feature grid: a wide claim across the top, then cards    */
/* that change width as the row goes on, each carrying its own drawn   */
/* illustration.                                                       */
/*                                                                     */
/* `span` is the only layout knob. Twelve columns underneath means a   */
/* row can be 4+4+4, 5+7, or one full-width card without the caller    */
/* having to think about breakpoints — everything collapses to a       */
/* single column below `md`.                                           */
/* ------------------------------------------------------------------ */

export type BentoItem = {
  title: ReactNode;
  body?: ReactNode;
  /** the drawing above the copy */
  visual?: ReactNode;
  /** how many of the twelve columns to take on md and up (default 4) */
  span?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12;
  /** puts the copy above the illustration instead of below it */
  copyFirst?: boolean;
};

const SPAN: Record<number, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  12: "md:col-span-12",
};

const DEMO: BentoItem[] = [
  {
    title: "Customizable",
    span: 4,
    visual: <StatDial value="100%" />,
    copyFirst: false,
  },
  {
    title: "Secure by default",
    body: "Every token, every route and every mutation is denied until something says otherwise.",
    span: 4,
    visual: <FingerprintMark />,
  },
  {
    title: "Faster than light",
    body: "Reads resolve at the edge nearest the request, so the number below is the boring case.",
    span: 4,
    visual: (
      <div className="w-full px-1 py-3">
        <div className="mb-2 flex items-center justify-between">
          <StatusPill tone="green">Live</StatusPill>
          <span className="font-mono text-[12px] text-ink-2">14.54 mbps</span>
        </div>
        <Sparkline seed={11} />
      </div>
    ),
  },
  {
    title: "Built to be read",
    body: "No generated class soup and no runtime CSS — what you inspect is what you wrote.",
    span: 5,
    copyFirst: true,
    visual: <Sparkline seed={29} className="h-24" />,
  },
  {
    title: "Keep your team in the loop",
    body: "Presence, mentions and review state travel with the record rather than with the notification.",
    span: 7,
    copyFirst: true,
    visual: <AvatarStack />,
  },
];

export type FeaturesBentoProps = {
  items?: BentoItem[];
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function FeaturesBento({
  items = DEMO,
  eyebrow,
  title,
  description,
  className,
}: FeaturesBentoProps) {
  const [ref, rise] = useRise<HTMLElement>();

  return (
    <section ref={ref} className={cx("w-full py-20 md:py-28", className)}>
      <div className="mx-auto max-w-5xl px-6">
        {(eyebrow || title || description) && (
          <div {...RISE_ATTR} style={rise(0)} className="mx-auto mb-12 max-w-2xl text-center">
            {eyebrow && <div className="microlabel mb-3 !text-brand">{eyebrow}</div>}
            {title && (
              <h2 className="text-3xl font-bold tracking-[-0.04em] text-balance text-ink md:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {items.map((item, i) => (
            <Card
              key={i}
              {...RISE_ATTR}
              style={rise(i + 1)}
              className={cx(
                "flex flex-col justify-between gap-4 p-6",
                SPAN[item.span ?? 4],
              )}
            >
              {item.copyFirst ? (
                <>
                  <Copy item={item} />
                  {item.visual}
                </>
              ) : (
                <>
                  {item.visual}
                  <Copy item={item} />
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Copy({ item }: { item: BentoItem }) {
  return (
    <div>
      <h3 className="text-center text-[15px] font-semibold tracking-[-0.02em] text-ink">
        {item.title}
      </h3>
      {item.body && (
        <p className="mt-2 text-center text-[13.5px] leading-relaxed text-ink-2">
          {item.body}
        </p>
      )}
    </div>
  );
}
