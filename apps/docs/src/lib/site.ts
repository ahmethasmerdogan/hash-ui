/* Single source of truth for the identity strings used across the docs. */

export const SITE = {
  name: "HashUI",
  version: "v0.6",
  pkg: "hash-ui",
  tagline: "A design foundation, distilled from the wild.",
  description:
    "A flat, shadow-free React 19 + Tailwind CSS v4 design system — 70+ components, 21 page blocks and 83 hand-drawn icons, distilled from curated interface references.",
  url: "https://hashui.vercel.app",
  github: "https://github.com/ahmethasmerdogan/hash-ui",
  npm: "https://www.npmjs.com/package/hash-ui",
  author: "Ahmet Hâşim Erdoğan",
  authorUrl: "https://github.com/ahmethasmerdogan",
} as const;

export const GITHUB_TREE = `${SITE.github}/blob/main`;

/** Where the shadcn CLI pulls registry items from. */
export const REGISTRY_BASE = `${SITE.url}/r`;

export const registryUrl = (name: string) => `${REGISTRY_BASE}/${name}.json`;
