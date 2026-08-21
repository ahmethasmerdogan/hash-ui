/* ------------------------------------------------------------------ */
/* UICean — portable component bundle                                  */
/*                                                                     */
/* This folder is self-contained: it imports nothing outside itself     */
/* except `react` / `react-dom`. Copy it into any Tailwind v4 project,  */
/* import ./uicean.css after tailwind, and you're done.                 */
/*                                                                     */
/*   import { Button, StatusPill, Modal, useToast } from "@/ui";        */
/*                                                                     */
/* Optional peer: `three` — only needed if you use <ThreeOrb />.        */
/* ------------------------------------------------------------------ */

/* primitives */
export * from "./Button.js";
export * from "./Badge.js";
export * from "./Avatar.js";
export * from "./Card.js";
export * from "./controls.js";
export * from "./Inputs.js";
export * from "./Form.js";

/* navigation & data */
export * from "./Tabs.js";
export * from "./Progress.js";
export * from "./Timeline.js";
export * from "./CommitGraph.js";
export * from "./Table.js";

/* feedback & overlays */
export * from "./Feedback.js";
export * from "./Overlay.js";
export * from "./overlay-primitives.js";
export * from "./Popover.js";
export * from "./Layout.js";
export * from "./Combobox.js";
export * from "./Calendar.js";
export * from "./Sheet.js";

/* motion */
export * from "./Motion.js";
export * from "./ThreeOrb.js";

/* theming — wrap your app in <ThemeProvider>, read with useTheme() */
export * from "./theme.js";

/* icon set (all hand-drawn SVG, tree-shakeable) */
export * from "./icons.js";

/* class-name helper */
export { cx } from "./cx.js";
