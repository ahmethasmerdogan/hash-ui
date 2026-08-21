import type { ReactNode } from "react";
import { cx, IXSocial, ILinkedIn, IGitBranch, IMail } from "uicean";
import { useRise, RISE_ATTR } from "../parts.js";

/* ------------------------------------------------------------------ */
/* GridFooter                                                          */
/*                                                                     */
/* A footer built as an exposed grid rather than as stacked columns:   */
/* social marks, a description and the link list all sit in cells of   */
/* one ruled table, and the rules are the design.                      */
/*                                                                     */
/* Upstream this block pulls in next, three, @react-three/fiber,       */
/* react-icons and framer-motion to light one cell. Here that cell is  */
/* a radial gradient behind a mask — the same read, nothing installed. */
/* ------------------------------------------------------------------ */

export type GridFooterLink = { label: ReactNode; href: string };
export type GridFooterSocial = { label: string; href: string; icon: ReactNode };

const DEMO_SOCIAL: GridFooterSocial[] = [
  { label: "X", href: "#", icon: <IXSocial size={16} /> },
  { label: "LinkedIn", href: "#", icon: <ILinkedIn size={16} /> },
  { label: "GitHub", href: "#", icon: <IGitBranch size={16} /> },
  { label: "Email", href: "#", icon: <IMail size={16} /> },
];

const DEMO_LINKS: GridFooterLink[] = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Status", href: "#" },
];

export type GridFooterProps = {
  headline?: ReactNode;
  description?: ReactNode;
  social?: GridFooterSocial[];
  links?: GridFooterLink[];
  /** the centred fine print at the very bottom */
  fineprint?: ReactNode;
  /** light the wide cell — the one place this block glows */
  glow?: boolean;
  className?: string;
};

export function GridFooter({
  headline = (
    <>
      Footer component
      <br />
      built as a grid
    </>
  ),
  description = "Your company description goes here. Describe your products or services in a way that engages your visitors — this cell can hold several sentences about your mission, vision and values.",
  social = DEMO_SOCIAL,
  links = DEMO_LINKS,
  fineprint = "UICean © 2026. All rights reserved.",
  glow = true,
  className,
}: GridFooterProps) {
  /* Two rows of two link cells each — the reference reads as a table, and a
     table needs its cells to line up. Anything past four links wraps into
     the second row's cell rather than growing a third column. */
  const [l1, l2, l3, l4] = [links[0], links[1], links[2], links[3]];
  const topLinks = [l1, l2].filter(Boolean);
  const bottomLinks = [l3, l4].filter(Boolean);
  const overflow = links.slice(4);
  const [ref, rise] = useRise<HTMLElement>();

  return (
    <footer
      ref={ref}
      className={cx(
        "dark relative w-full overflow-hidden bg-[#08080a] text-white",
        className,
      )}
    >
      {headline && (
        <div {...RISE_ATTR} style={rise(0)} className="px-6 py-20 text-center md:py-28">
          <h2 className="text-3xl leading-[1.15] font-light tracking-[-0.03em] text-balance text-white/90 md:text-5xl">
            {headline}
          </h2>
        </div>
      )}

      {/* One ruled table, twelve columns: a 1px gap over a line-coloured bed
          gives every cell its border without any of them doubling up.

          Row 1 — four social marks, the lit cell, two links.
          Row 2 — the description across the same span, two more links. */}
      <div
        {...RISE_ATTR}
        style={rise(1)}
        className="grid grid-cols-4 gap-px border-y border-white/10 bg-white/10 md:grid-cols-12"
      >
        {social.slice(0, 4).map((s) => (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            className="flex h-16 items-center justify-center bg-[#08080a] text-white/55 transition-colors hover:bg-white/5 hover:text-white md:col-span-1"
          >
            {s.icon}
          </a>
        ))}

        {/* the lit cell — the one place this footer glows */}
        <div className="relative col-span-4 hidden h-16 bg-[#08080a] md:col-span-4 md:block">
          {glow && (
            <span
              aria-hidden
              className="fx-sweep pointer-events-none absolute inset-0 bg-[radial-gradient(60%_150%_at_50%_100%,var(--fx-aurora-1),transparent_70%)]"
            />
          )}
        </div>

        {topLinks.map((l) => (
          <FooterCell key={String(l.label)} link={l} />
        ))}

        <div className="relative col-span-4 flex items-center bg-[#08080a] px-6 py-6 md:col-span-8">
          <p className="max-w-xl text-[12.5px] leading-relaxed text-white/45">
            {description}
          </p>
        </div>

        {bottomLinks.map((l) => (
          <FooterCell key={String(l.label)} link={l} />
        ))}

        {overflow.length > 0 && (
          <div className="col-span-4 flex flex-wrap items-center gap-x-5 gap-y-2 bg-[#08080a] px-6 py-4 md:col-span-12">
            {overflow.map((l) => (
              <a
                key={String(l.label)}
                href={l.href}
                className="text-[12.5px] text-white/45 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {fineprint && (
        <p className="px-6 py-7 text-center text-[11.5px] text-white/35">
          {fineprint}
        </p>
      )}
    </footer>
  );
}

function FooterCell({ link }: { link: GridFooterLink }) {
  return (
    <a
      href={link.href}
      className="col-span-2 flex h-16 items-center bg-[#08080a] px-5 text-[13px] text-white/60 transition-colors hover:bg-white/5 hover:text-white md:col-span-2"
    >
      {link.label}
    </a>
  );
}
