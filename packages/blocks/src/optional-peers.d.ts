/* ------------------------------------------------------------------ */
/* Ambient shims for the optional peers.                               */
/*                                                                     */
/* These three packages are declared `optional: true` in               */
/* peerDependenciesMeta, so they are legitimately absent while this    */
/* package is developed and in most projects that install it. Without  */
/* a shim, `tsc` fails on the dynamic import inside the block that     */
/* guards against exactly that absence.                                */
/*                                                                     */
/* The shapes below are deliberately minimal — only what the blocks    */
/* touch. A consumer who installs the real package gets the real       */
/* types, because a node_modules declaration wins over these.          */
/* ------------------------------------------------------------------ */

declare module "@splinetool/react-spline" {
  import type { ComponentType } from "react";
  const Spline: ComponentType<{
    scene: string;
    className?: string;
    onLoad?: (app: unknown) => void;
  }>;
  export default Spline;
}

declare module "cobe" {
  export type Marker = {
    location: [number, number];
    size: number;
    color?: [number, number, number];
  };
  /** cobe >= 2 draws routes natively */
  export type Arc = {
    from: [number, number];
    to: [number, number];
    color?: [number, number, number];
  };
  export type COBEOptions = {
    devicePixelRatio?: number;
    width: number;
    height: number;
    phi: number;
    theta: number;
    dark: number;
    diffuse: number;
    mapSamples: number;
    mapBrightness: number;
    mapBaseBrightness?: number;
    baseColor: [number, number, number];
    markerColor: [number, number, number];
    glowColor: [number, number, number];
    markers?: Marker[];
    arcs?: Arc[];
    arcColor?: [number, number, number];
    arcWidth?: number;
    arcHeight?: number;
    markerElevation?: number;
    scale?: number;
    offset?: [number, number];
    opacity?: number;
    onRender?: (state: Record<string, unknown>) => void;
  };
  export default function createGlobe(
    canvas: HTMLCanvasElement,
    options: COBEOptions,
  ): { update: (state: Partial<COBEOptions>) => void; destroy: () => void };
}

declare module "maplibre-gl" {
  export type LngLatLike = [number, number] | { lng: number; lat: number };
  export class Map {
    constructor(options: Record<string, unknown>);
    on(type: string, listener: (...args: unknown[]) => void): this;
    off(type: string, listener: (...args: unknown[]) => void): this;
    remove(): void;
    project(lnglat: LngLatLike): { x: number; y: number };
    getZoom(): number;
    resize(): void;
  }
  const maplibregl: { Map: typeof Map };
  export default maplibregl;
}
