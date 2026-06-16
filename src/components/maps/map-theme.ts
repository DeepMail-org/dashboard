import type { StyleSpecification } from "maplibre-gl";

export const SEVERITY_COLORS: Record<string, string> = {
  critical: "#e54040",
  high: "#e58040",
  medium: "#c8a030",
  low: "#7c6fcd",
};

export const SEVERITY_BG: Record<string, string> = {
  critical: "oklch(65% 0.2 25 / 0.1)",
  high: "oklch(70% 0.17 45 / 0.1)",
  medium: "oklch(75% 0.15 70 / 0.1)",
  low: "oklch(60% 0.15 280 / 0.1)",
};

export const CARTO_DARK_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "carto-dark-layer",
      type: "raster",
      source: "carto-dark",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "osm-layer",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export type MapStyleId = "carto" | "osm";

export const MAP_STYLES: Record<MapStyleId, { label: string; style: StyleSpecification }> = {
  carto: { label: "Carto Dark", style: CARTO_DARK_STYLE },
  osm: { label: "OSM", style: OSM_STYLE },
};
