/* ------------------------------------------------------------------ */
/* uicean-blocks — marketing and application blocks                  */
/*                                                                     */
/* Composed sections, not primitives. Everything here is built out of  */
/* `uicean` core and inherits its tokens, so a block dropped into an  */
/* existing UICean app already matches it.                             */
/*                                                                     */
/*   import { HeroTerminal, FeaturesBento } from "uicean-blocks";     */
/*                                                                     */
/* Import the stylesheet after the core one:                           */
/*   @import "uicean/css";                                            */
/*   @import "uicean-blocks/css";                                    */
/*                                                                     */
/* Optional peers, each behind a dynamic import so it only costs you   */
/* if you use the block that needs it:                                 */
/*   @splinetool/react-spline — <SplineScene />                        */
/*   cobe                     — <GlobeFlights />                       */
/*   maplibre-gl              — <Map /> and friends                    */
/* ------------------------------------------------------------------ */

/* shared pieces the blocks are assembled from */
export * from "./parts.js";

/* logos & integrations */
export * from "./logos/LogoCloud.js";
export * from "./logos/IntegrationsMarquee.js";

/* features */
export * from "./features/visuals.js";
export * from "./features/FeaturesBento.js";
export * from "./features/FeaturesTerminal.js";
export * from "./features/FeaturesCrop.js";

/* heroes */
export * from "./heroes/HeroTerminal.js";
export * from "./heroes/HeroSplit.js";
export * from "./heroes/HeroNexus.js";
export * from "./heroes/HeroCinematic.js";
export * from "./heroes/SplineScene.js";
export * from "./heroes/HeroStack.js";
export * from "./heroes/HeroMarquee.js";
export * from "./heroes/HeroMetrics.js";
export * from "./heroes/HeroEditorial.js";

/* footers */
export * from "./footers/CinematicFooter.js";

/* auth */
export * from "./auth/AuthCard.js";
export * from "./auth/AuthSplit.js";
export * from "./auth/RegisterCard.js";
export * from "./footers/GridFooter.js";

/* application shell */
export * from "./shell/SidebarNav.js";
export * from "./shell/RailSidebar.js";

/* maps & globe */
export * from "./geo/Map.js";
export * from "./geo/GlobeFlights.js";

/* effects — the layer where glow is allowed */
export * from "./effects/LiquidMetalButton.js";
export * from "./effects/GeminiRibbon.js";
export * from "./effects/NeuralVortex.js";

/* shared hooks, exported because the blocks are meant to be taken apart */
export * from "./hooks.js";
