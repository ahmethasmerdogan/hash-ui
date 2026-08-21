/* Single source of truth for the identity strings used across the docs. */

export const SITE = {
  name: "UICean",
  version: "0.6.2",
  pkg: "uicean",
  tagline: "A design foundation, distilled from the wild.",
  description:
    "A flat, shadow-free React 19 + Tailwind CSS v4 design system — 96 components, 21 page blocks and 83 hand-drawn icons, in light and dark, with five accent themes.",
  url: "https://uicean.vercel.app",
  github: "https://github.com/ahmethasmerdogan/uicean",
  npm: "https://www.npmjs.com/package/uicean",
  author: "Ahmet Hâşim Erdoğan",
  authorUrl: "https://github.com/ahmethasmerdogan",
} as const;

export const GITHUB_TREE = `${SITE.github}/blob/main`;

/** Where the shadcn CLI pulls registry items from. */
export const REGISTRY_BASE = `${SITE.url}/r`;

export const registryUrl = (name: string) => `${REGISTRY_BASE}/${name}.json`;
