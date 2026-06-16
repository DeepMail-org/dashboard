import { SEVERITY_COLORS } from "./map-theme";
import type { GeoMapPoint } from "@/lib/data-access/geo-points";

interface MapPopupContentProps {
  point: GeoMapPoint;
}

export function MapPopupContent({ point }: MapPopupContentProps) {
  return (
    <div
      className="min-w-[220px] max-w-[280px] rounded-lg border border-border p-0 text-fg"
      style={{ background: "oklch(19% 0.005 280 / 0.97)", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: SEVERITY_COLORS[point.severity] }}
        />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-fg truncate">{point.label}, {point.countryName}</p>
          <p className="text-[10px] capitalize" style={{ color: SEVERITY_COLORS[point.severity] }}>
            {point.severity} · {point.count} threats
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5 px-3 py-2">
        <Row label="IP Address" value={point.ip} />
        <Row label="ASN Org" value={point.asnOrg} />
        <Row label="City" value={point.label} />
        <Row label="Country" value={`${point.countryName} (${point.country})`} />
        <Row label="Coordinates" value={`${point.lat.toFixed(4)}°, ${point.lon.toFixed(4)}°`} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border/50 px-3 py-2">
        <button
          className="flex-1 rounded-md border border-border bg-surface px-2 py-1 text-[10px] text-secondary transition-colors hover:bg-surface-hover hover:text-fg"
        >
          View Details
        </button>
        <button
          className="flex-1 rounded-md border border-border bg-surface px-2 py-1 text-[10px] text-secondary transition-colors hover:bg-surface-hover hover:text-fg"
        >
          Create Case
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] text-muted">{label}</span>
      <span className="text-[10px] text-secondary text-right truncate max-w-[150px]">{value}</span>
    </div>
  );
}
