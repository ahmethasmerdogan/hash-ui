import "maplibre-gl/dist/maplibre-gl.css";
import { Section, Demo } from "@/components/Section";
import { Card } from "uicean";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerDot,
  MarkerTooltip,
  MarkerLabel,
  GlobeFlights,
} from "uicean-blocks";

const TOOLTIP_PLACES = [
  { id: 1, name: "Empire State Building", lng: -73.9857, lat: 40.7484 },
  { id: 2, name: "Central Park", lng: -73.9654, lat: 40.7829 },
  { id: 3, name: "Times Square", lng: -73.9851, lat: 40.758 },
];

const LABEL_PLACES = [
  { id: 1, name: "The Met", label: "Museum", lng: -73.9632, lat: 40.7794 },
  { id: 2, name: "Brooklyn Bridge", label: "Landmark", lng: -73.9969, lat: 40.7061 },
  { id: 3, name: "Grand Central", label: "Transit", lng: -73.9772, lat: 40.7527 },
];

export default function BlocksGeoPage() {
  return (
    <>
      <Section
        id="map"
        eyebrow="Blocks"
        title="Map"
        desc="A composable MapLibre surface. Markers are React children rather than imperative marker calls, so a pin can be any UICean component and its tooltip is ordinary JSX."
        registry="map"
        pkg="blocks"
        source="geo/Map.tsx"
      >
        <Demo
          label="MarkerTooltip — hover a pin"
          imports={["Map", "MapMarker", "MarkerContent", "MarkerTooltip"]}
          contentClassName="!block !min-h-0 !p-4"
          code={`// npm i maplibre-gl
// import "maplibre-gl/dist/maplibre-gl.css";

<div className="h-[420px]">
  <Map center={[-73.9857, 40.7484]} zoom={11}>
    {places.map((p) => (
      <MapMarker key={p.id} longitude={p.lng} latitude={p.lat}>
        <MarkerContent>
          <MarkerDot tone="blue" />
        </MarkerContent>
        <MarkerTooltip>{p.name}</MarkerTooltip>
      </MapMarker>
    ))}
  </Map>
</div>`}
        >
          <div className="h-[380px] overflow-hidden rounded-xl border border-line">
            <Map center={[-73.9857, 40.7484]} zoom={11}>
              {TOOLTIP_PLACES.map((p) => (
                <MapMarker key={p.id} longitude={p.lng} latitude={p.lat}>
                  <MarkerContent>
                    <MarkerDot tone="blue" />
                  </MarkerContent>
                  <MarkerTooltip>{p.name}</MarkerTooltip>
                </MapMarker>
              ))}
            </Map>
          </div>
        </Demo>

        <Demo
          label="MarkerLabel — always visible"
          imports={["MapMarker", "MarkerLabel"]}
          contentClassName="!block !min-h-0 !p-4"
          code={`<MapMarker longitude={p.lng} latitude={p.lat}>
  <MarkerContent>
    <MarkerDot tone="red" />
  </MarkerContent>
  <MarkerLabel>{p.label}</MarkerLabel>
</MapMarker>`}
        >
          <div className="h-[380px] overflow-hidden rounded-xl border border-line">
            <Map center={[-73.9851, 40.758]} zoom={10.5}>
              {LABEL_PLACES.map((p) => (
                <MapMarker key={p.id} longitude={p.lng} latitude={p.lat}>
                  <MarkerContent>
                    <MarkerDot tone="red" />
                  </MarkerContent>
                  <MarkerLabel>{p.label}</MarkerLabel>
                </MapMarker>
              ))}
            </Map>
          </div>
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Why markers are children.</span>{" "}
            Coordinates are projected through the map on every move rather than
            handing DOM nodes to MapLibre. That keeps markers inside React&rsquo;s
            tree — they can hold state, read context and unmount cleanly — at the
            cost of one <code className="font-mono">project()</code> call per
            marker per frame, which is nothing at the scale these are for.
          </p>
        </Card>
      </Section>

      <Section
        id="globe-flights"
        level={2}
        eyebrow="Blocks"
        title="GlobeFlights"
        desc="A slowly turning globe with great-circle routes drawn over it and a marker riding each arc."
        registry="globe-flights"
        pkg="blocks"
        source="geo/GlobeFlights.tsx"
      >
        <Demo
          label="GlobeFlights"
          imports={["GlobeFlights"]}
          code={`// npm i cobe

<GlobeFlights
  flights={[
    { from: [40.71, -74.01], to: [51.51, -0.13], progress: 0.45 },
    { from: [35.68, 139.69], to: [37.77, -122.42], progress: 0.3 },
  ]}
  marker="✈️"
  size={480}
/>`}
        >
          <GlobeFlights size={420} />
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The one hard part.</span> cobe
            draws the sphere but has no concept of a route, so the arcs are an SVG
            overlay that projects both endpoints itself and walks the great circle
            between them. Each path breaks wherever it crosses to the far
            hemisphere — without that visibility test the arcs cut straight through
            the planet.
          </p>
        </Card>
      </Section>
    </>
  );
}
