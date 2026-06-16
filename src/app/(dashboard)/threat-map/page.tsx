"use client";

import { useState } from "react";
import { ArrowLeft, Layers, Network } from "lucide-react";
import Link from "next/link";
import { Map, MapControls, MapClusterLayer, MapArc, MapPopup, type MapArcDatum } from "@/components/ui/map";

// Mock data - same as widget
const THREAT_DATA = [
  { ip: "185.220.101.45", lat: 55.75, lon: 37.62, label: "Moscow", country: "RU", asn_org: "AS12345 Example ISP", severity: "critical" },
  { ip: "61.160.223.77", lat: 39.91, lon: 116.40, label: "Beijing", country: "CN", asn_org: "ChinaNet", severity: "high" },
  { ip: "105.112.45.12", lat: 6.52, lon: 3.38, label: "Lagos", country: "NG", asn_org: "MTN Nigeria", severity: "high" },
  { ip: "200.142.175.23", lat: -23.55, lon: -46.63, label: "São Paulo", country: "BR", asn_org: "Telefonica Brazil", severity: "medium" },
  { ip: "2.187.245.89", lat: 35.69, lon: 51.39, label: "Tehran", country: "IR", asn_org: "Pars Online", severity: "high" },
  { ip: "103.21.149.88", lat: 19.08, lon: 72.88, label: "Mumbai", country: "IN", asn_org: "Reliance Jio", severity: "medium" },
  { ip: "89.36.224.102", lat: 44.43, lon: 26.10, label: "Bucharest", country: "RO", asn_org: "RCS&RDS", severity: "medium" },
  { ip: "171.244.139.56", lat: 21.03, lon: 105.85, label: "Hanoi", country: "VN", asn_org: "VNPT", severity: "low" },
];

const SEVERITY_COLORS = {
  critical: "#e54040",
  high: "#e58040",
  medium: "#c8a030",
  low: "#7c6fcd",
};

// Simulated target (your server location)
const TARGET = { lon: -74.006, lat: 40.7128, label: "NYC Server", ip: "10.0.0.1" };

type ThreatPoint = typeof THREAT_DATA[number];
type ViewMode = "cluster" | "arcs";

export default function ThreatMapPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cluster");
  const [selectedPoint, setSelectedPoint] = useState<{ coords: [number, number]; data: ThreatPoint } | null>(null);

  const geoJSON: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: "FeatureCollection",
    features: THREAT_DATA.map((t) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [t.lon, t.lat] },
      properties: { ...t, color: SEVERITY_COLORS[t.severity as keyof typeof SEVERITY_COLORS] },
    })),
  };

  // Generate arcs from threats to target
  const arcs: (MapArcDatum & { severity: string; label: string })[] = THREAT_DATA.map((t, i) => ({
    id: i,
    from: [t.lon, t.lat],
    to: [TARGET.lon, TARGET.lat],
    severity: t.severity,
    label: t.label,
    color: SEVERITY_COLORS[t.severity as keyof typeof SEVERITY_COLORS],
  }));

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-surface-hover hover:text-fg transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-semibold text-fg">Global Threat Map</h1>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-border bg-bg p-1">
          <button
            onClick={() => setViewMode("cluster")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "cluster"
                ? "bg-accent text-white shadow-sm"
                : "text-secondary hover:bg-surface hover:text-fg"
            }`}
          >
            <Layers className="size-3.5" />
            Clusters
          </button>
          <button
            onClick={() => setViewMode("arcs")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "arcs"
                ? "bg-accent text-white shadow-sm"
                : "text-secondary hover:bg-surface hover:text-fg"
            }`}
          >
            <Network className="size-3.5" />
            Flow
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        <Map
          center={viewMode === "cluster" ? [30, 25] : [-20, 30]}
          zoom={viewMode === "cluster" ? 1.5 : 1.8}
          className="h-full w-full"
        >
          <MapControls
            position="bottom-right"
            showZoom
            showCompass
            showLocate
            showFullscreen
          />

          {viewMode === "cluster" ? (
            <MapClusterLayer
              data={geoJSON}
              clusterMaxZoom={14}
              clusterRadius={50}
              clusterColors={[SEVERITY_COLORS.low, SEVERITY_COLORS.medium, SEVERITY_COLORS.critical]}
              clusterThresholds={[10, 50]}
              pointColor={SEVERITY_COLORS.high}
              onPointClick={(feature, coords) => {
                setSelectedPoint({ coords, data: feature.properties as ThreatPoint });
              }}
            />
          ) : (
            <MapArc
              data={arcs}
              curvature={0.3}
              samples={80}
              paint={{
                "line-color": ["get", "color"],
                "line-width": 2,
                "line-opacity": 0.7,
              }}
              hoverPaint={{
                "line-width": 3,
                "line-opacity": 1,
              }}
              interactive
            />
          )}

          {selectedPoint && (
            <MapPopup
              longitude={selectedPoint.coords[0]}
              latitude={selectedPoint.coords[1]}
              closeButton
              onClose={() => setSelectedPoint(null)}
              className="max-w-[280px] bg-surface border-border text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-fg">{selectedPoint.data.label}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                    style={{
                      backgroundColor: `${SEVERITY_COLORS[selectedPoint.data.severity as keyof typeof SEVERITY_COLORS]}20`,
                      color: SEVERITY_COLORS[selectedPoint.data.severity as keyof typeof SEVERITY_COLORS],
                    }}
                  >
                    {selectedPoint.data.severity}
                  </span>
                </div>
                
                <div className="space-y-1 text-secondary">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted">IP:</span>
                    <span className="font-mono text-[11px]">{selectedPoint.data.ip}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted">Country:</span>
                    <span>{selectedPoint.data.country}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted">ASN:</span>
                    <span className="text-[11px]">{selectedPoint.data.asn_org}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted">Coordinates:</span>
                    <span className="font-mono text-[11px]">
                      {selectedPoint.data.lat.toFixed(4)}, {selectedPoint.data.lon.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </MapPopup>
          )}

          {/* Legend */}
          <div className="absolute bottom-10 left-2 z-10 rounded-md border border-border bg-surface/95 backdrop-blur-sm p-3 shadow-lg">
            <div className="mb-2 text-xs font-semibold text-fg">Threat Severity</div>
            <div className="space-y-1.5">
              {Object.entries(SEVERITY_COLORS).map(([severity, color]) => (
                <div key={severity} className="flex items-center gap-2 text-xs">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="capitalize text-secondary">{severity}</span>
                </div>
              ))}
            </div>
          </div>
        </Map>
      </div>
    </div>
  );
}
