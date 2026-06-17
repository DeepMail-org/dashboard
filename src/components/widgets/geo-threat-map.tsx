"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { Map, MapControls, MapClusterLayer, MapPopup, useMap, Map3DBuildings } from "@/components/ui/map";
import { MapToolbar } from "@/components/maps/map-toolbar";
import { MapPopupContent } from "@/components/maps/map-popup-content";
import { SEVERITY_COLORS, CARTO_DARK_STYLE, CARTO_LIGHT_STYLE, MAP_STYLES, getDefaultMapStyle, type MapStyleId } from "@/components/maps/map-theme";
import { MOCK_GEO_POINTS, toGeoJson, type GeoMapPoint } from "@/lib/data-access/geo-points";
import type { WidgetProps } from "@/lib/dashboard/types";

// Inner component that has access to useMap()
function MapInner({
  points,
  clustersEnabled,
  view3d,
  mapStyle,
}: {
  points: GeoMapPoint[];
  clustersEnabled: boolean;
  view3d: boolean;
  mapStyle: MapStyleId;
}) {
  const { map, isLoaded } = useMap();
  const [selectedPoint, setSelectedPoint] = useState<{
    coords: [number, number];
    data: GeoMapPoint;
  } | null>(null);

  // Handle 3D pitch toggle
  useEffect(() => {
    if (!isLoaded || !map) return;
    if (view3d) {
      map.easeTo({ pitch: 60, bearing: -20, duration: 1000 });
    } else {
      map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
    }
  }, [view3d, isLoaded, map]);

  // Style switching is handled by the parent <Map> component via the `styles` prop.

  const geoJSON = useMemo(() => toGeoJson(points), [points]);

  return (
    <>
      <MapControls
        position="bottom-right"
        showZoom
        showCompass
        showFullscreen
      />
      
      <Map3DBuildings enabled={view3d && mapStyle.startsWith("carto")} />

      {clustersEnabled ? (
        <MapClusterLayer
          data={geoJSON}
          clusterMaxZoom={14}
          clusterRadius={50}
          clusterColors={[SEVERITY_COLORS.low, SEVERITY_COLORS.medium, SEVERITY_COLORS.critical]}
          clusterThresholds={[5, 20]}
          pointColor={SEVERITY_COLORS.high}
          onPointClick={(feature, coords) => {
            const props = feature.properties as unknown as GeoMapPoint;
            setSelectedPoint({ coords, data: props });
          }}
        />
      ) : (
        <MapClusterLayer
          data={geoJSON}
          clusterMaxZoom={0}
          clusterRadius={1}
          clusterColors={[SEVERITY_COLORS.low, SEVERITY_COLORS.medium, SEVERITY_COLORS.critical]}
          clusterThresholds={[9999, 99999]}
          pointColor={SEVERITY_COLORS.high}
          onPointClick={(feature, coords) => {
            const props = feature.properties as unknown as GeoMapPoint;
            setSelectedPoint({ coords, data: props });
          }}
        />
      )}

      {selectedPoint && (
        <MapPopup
          longitude={selectedPoint.coords[0]}
          latitude={selectedPoint.coords[1]}
          closeButton
          onClose={() => setSelectedPoint(null)}
        >
          <MapPopupContent point={selectedPoint.data} />
        </MapPopup>
      )}
    </>
  );
}

export default function GeoThreatMap({ data, isLoading }: WidgetProps) {
  const { resolvedTheme } = useTheme();
  const points: GeoMapPoint[] = (data as GeoMapPoint[] | null) ?? MOCK_GEO_POINTS;
  const defaultStyle = getDefaultMapStyle(resolvedTheme);
  const [mapStyle, setMapStyle] = useState<MapStyleId>(defaultStyle);
  const [clustersEnabled, setClustersEnabled] = useState(true);
  const [view3d, setView3d] = useState(false);

  // Sync map style when theme changes
  useEffect(() => {
    const target = getDefaultMapStyle(resolvedTheme);
    setMapStyle(target);
  }, [resolvedTheme]);

  const handleReset = () => {
    setView3d(false);
    setClustersEnabled(true);
    setMapStyle(getDefaultMapStyle(resolvedTheme));
  };

  const currentStyle = MAP_STYLES[mapStyle]?.style ?? (resolvedTheme === "light" ? CARTO_LIGHT_STYLE : CARTO_DARK_STYLE);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md">
      <Map
        center={[30, 25]}
        zoom={1.5}
        projection={{ type: "globe" } as any}
        className="h-full w-full"
        loading={isLoading}
        styles={{ dark: currentStyle }}
        theme="dark"
      >
        <MapInner
          points={points}
          clustersEnabled={clustersEnabled}
          view3d={view3d}
          mapStyle={mapStyle}
        />
      </Map>

      {/* Toolbar overlay */}
      <div className="absolute top-2 left-2 z-10">
        <MapToolbar
          activeStyle={mapStyle}
          onStyleChange={setMapStyle}
          clustersEnabled={clustersEnabled}
          onToggleClusters={() => setClustersEnabled((v) => !v)}
          view3d={view3d}
          onToggle3d={() => setView3d((v) => !v)}
          onReset={handleReset}
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 flex items-center gap-3 rounded-lg border border-border bg-surface/90 px-3 py-2 backdrop-blur-sm">
        {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
          <div key={sev} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] capitalize text-muted">{sev}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
