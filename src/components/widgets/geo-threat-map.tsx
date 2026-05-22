"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { WidgetProps } from "@/lib/dashboard/types";

const THREAT_ORIGINS = [
  { country: "Russia", lat: 55.75, lng: 37.62, count: 847, severity: "critical" as const },
  { country: "China", lat: 39.91, lng: 116.40, count: 623, severity: "high" as const },
  { country: "Nigeria", lat: 6.52, lng: 3.38, count: 412, severity: "high" as const },
  { country: "Brazil", lat: -23.55, lng: -46.63, count: 298, severity: "medium" as const },
  { country: "Iran", lat: 35.69, lng: 51.39, count: 234, severity: "high" as const },
  { country: "India", lat: 19.08, lng: 72.88, count: 189, severity: "medium" as const },
  { country: "Romania", lat: 44.43, lng: 26.10, count: 156, severity: "medium" as const },
  { country: "Vietnam", lat: 21.03, lng: 105.85, count: 134, severity: "low" as const },
];

const SEV_COLORS: Record<string, string> = {
  critical: "#e54040",
  high: "#e58040",
  medium: "#c8a030",
  low: "#7c6fcd",
};

export default function GeoThreatMap({ isLoading, containerWidth, containerHeight }: WidgetProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
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
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
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
      },
      center: [30, 25],
      zoom: 1.5,
      attributionControl: false,
    });

    map.on("load", () => {
      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: THREAT_ORIGINS.map((t) => ({
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [t.lng, t.lat] },
          properties: {
            country: t.country,
            count: t.count,
            severity: t.severity,
            color: SEV_COLORS[t.severity],
            radius: Math.max(8, Math.sqrt(t.count) * 1.2),
          },
        })),
      };

      map.addSource("threats", { type: "geojson", data: geojson });

      map.addLayer({
        id: "threat-glow",
        type: "circle",
        source: "threats",
        paint: {
          "circle-radius": ["get", "radius"],
          "circle-color": ["get", "color"],
          "circle-opacity": 0.25,
          "circle-blur": 1,
        },
      });

      map.addLayer({
        id: "threat-points",
        type: "circle",
        source: "threats",
        paint: {
          "circle-radius": ["*", ["get", "radius"], 0.5],
          "circle-color": ["get", "color"],
          "circle-opacity": 0.9,
          "circle-stroke-width": 1,
          "circle-stroke-color": ["get", "color"],
          "circle-stroke-opacity": 0.5,
        },
      });

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: "dm-map-popup",
      });

      map.on("mouseenter", "threat-points", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = e.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const coords = feature.geometry.coordinates.slice() as [number, number];
        const props = feature.properties;
        popup
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:Inter,sans-serif;font-size:11px;color:#e8e8e8;padding:2px 0;">
              <strong>${props?.country}</strong><br/>
              <span style="color:${props?.color}">${props?.count} threats</span>
              <span style="opacity:0.5"> · ${props?.severity}</span>
            </div>`
          )
          .addTo(map);
      });

      map.on("mouseleave", "threat-points", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && containerWidth && containerHeight) {
      mapRef.current.resize();
    }
  }, [containerWidth, containerHeight]);

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md">
      <div ref={mapContainer} className="h-full w-full" />
      <style>{`
        .dm-map-popup .maplibregl-popup-content {
          background: oklch(19% 0.005 280 / 0.95);
          border: 1px solid oklch(26% 0.01 280);
          border-radius: 6px;
          padding: 6px 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .dm-map-popup .maplibregl-popup-tip {
          border-top-color: oklch(19% 0.005 280 / 0.95);
        }
      `}</style>
    </div>
  );
}
