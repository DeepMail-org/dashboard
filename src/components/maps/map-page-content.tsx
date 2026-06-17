"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
	ArrowLeft,
	ChevronRight,
	ChevronLeft,
	Target,
	Globe,
} from "lucide-react";
import {
	Map,
	MapControls,
	MapClusterLayer,
	MapArc,
	MapPopup,
	MapMarker,
	MarkerContent,
	useMap,
	type MapArcDatum,
	Map3DBuildings,
} from "@/components/ui/map";
import { MapToolbar } from "@/components/maps/map-toolbar";
import { MapPopupContent } from "@/components/maps/map-popup-content";
import {
	SEVERITY_COLORS,
	CARTO_DARK_STYLE,
	CARTO_LIGHT_STYLE,
	MAP_STYLES,
	getDefaultMapStyle,
	type MapStyleId,
} from "@/components/maps/map-theme";
import {
	MOCK_GEO_POINTS,
	HOME_LOCATION,
	buildArcData,
	toGeoJson,
	type GeoMapPoint,
	type GeoArcDatum,
} from "@/lib/data-access/geo-points";
import { SeverityPill } from "@/components/ui/severity-pill";
import { cn } from "@/lib/utils";

// ── Arc datum type extended with severity for paint expressions ───────────
interface SeverityArcDatum extends MapArcDatum {
	severity: string;
	count: number;
	countryName: string;
}

function MapInner({
	points,
	mode,
	clustersEnabled,
	view3d,
	mapStyle,
	onSelectPoint,
	selectedIp,
}: {
	points: GeoMapPoint[];
	mode: "arcs" | "2d";
	clustersEnabled: boolean;
	view3d: boolean;
	mapStyle: MapStyleId;
	onSelectPoint: (p: GeoMapPoint | null) => void;
	selectedIp: string | null;
}) {
	const { map, isLoaded } = useMap();
	const [selectedPopup, setSelectedPopup] = useState<{
		coords: [number, number];
		data: GeoMapPoint;
	} | null>(null);

	// 3D pitch
	useEffect(() => {
		if (!isLoaded || !map) return;
		map.easeTo({
			pitch: view3d ? 60 : 0,
			bearing: view3d ? -20 : 0,
			duration: 1000,
		});
	}, [view3d, isLoaded, map]);

	// Smoothly fly to selected IP
	useEffect(() => {
		if (!isLoaded || !map || !selectedIp) return;
		const p = points.find((point) => point.ip === selectedIp);
		if (p) {
			map.flyTo({
				center: [p.lon, p.lat],
				zoom: 4,
				duration: 1500,
				essential: true,
			});
			setSelectedPopup({ coords: [p.lon, p.lat], data: p });
		}
	}, [selectedIp, isLoaded, map, points]);

	// Style switching is handled by the parent <Map> component via the `styles` prop.

	const geoJSON = useMemo(() => toGeoJson(points), [points]);

	const arcData: SeverityArcDatum[] = useMemo(
		() =>
			buildArcData(points).map((a) => ({
				...a,
				severity: a.severity,
				count: a.count,
				countryName: a.countryName,
			})),
		[points],
	);

	const handlePointClick = (
		feature: GeoJSON.Feature<GeoJSON.Point>,
		coords: [number, number],
	) => {
		const props = feature.properties as unknown as GeoMapPoint;
		setSelectedPopup({ coords, data: props });
		onSelectPoint(props);
	};

	return (
		<>
			<MapControls
				position="bottom-right"
				showZoom
				showCompass
				showFullscreen
			/>

			<Map3DBuildings enabled={view3d && mapStyle.startsWith("carto")} />

			{mode === "arcs" && (
				<>
					<MapArc<SeverityArcDatum>
						data={arcData}
						curvature={0.3}
						paint={{
							"line-color": [
								"match",
								["get", "severity"],
								"critical",
								"#e54040",
								"high",
								"#e58040",
								"medium",
								"#c8a030",
								"low",
								"#7c6fcd",
								"#7c6fcd",
							] as unknown as string,
							"line-width": 2,
							"line-opacity": 0.85,
						}}
						hoverPaint={{
							"line-width": 4,
							"line-opacity": 1,
						}}
						onClick={(e) => {
							const point = points.find(
								(p) => p.countryName === e.arc.countryName,
							);
							if (point) {
								setSelectedPopup({
									coords: [point.lon, point.lat],
									data: point,
								});
								onSelectPoint(point);
							}
						}}
					/>

					{/* Home marker */}
					<MapMarker
						longitude={HOME_LOCATION.lon}
						latitude={HOME_LOCATION.lat}
					>
						<MarkerContent>
							<div className="flex flex-col items-center">
								<div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent bg-accent/30 shadow-lg">
									<Target className="h-3 w-3 text-accent" />
								</div>
								<span className="mt-1 whitespace-nowrap rounded bg-surface/90 px-1.5 py-0.5 text-[9px] font-medium text-accent backdrop-blur-sm border border-border/50">
									{HOME_LOCATION.label}
								</span>
							</div>
						</MarkerContent>
					</MapMarker>

					{/* Origin markers */}
					{points.map((p) => (
						<MapMarker
							key={p.ip}
							longitude={p.lon}
							latitude={p.lat}
						>
							<MarkerContent>
								<button
									onClick={() => {
										setSelectedPopup({
											coords: [p.lon, p.lat],
											data: p,
										});
										onSelectPoint(p);
									}}
									className="group flex flex-col items-center"
								>
									<div
										className="h-3 w-3 rounded-full border border-white/30 shadow-lg transition-transform group-hover:scale-150"
										style={{
											backgroundColor:
												SEVERITY_COLORS[p.severity],
										}}
									/>
								</button>
							</MarkerContent>
						</MapMarker>
					))}
				</>
			)}

			{mode === "2d" && (
				<MapClusterLayer
					data={geoJSON}
					clusterMaxZoom={clustersEnabled ? 14 : 0}
					clusterRadius={clustersEnabled ? 50 : 1}
					clusterColors={[
						SEVERITY_COLORS.low,
						SEVERITY_COLORS.medium,
						SEVERITY_COLORS.critical,
					]}
					clusterThresholds={
						clustersEnabled ? [5, 20] : [9999, 99999]
					}
					pointColor={SEVERITY_COLORS.high}
					onPointClick={handlePointClick}
				/>
			)}

			{selectedPopup && (
				<MapPopup
					longitude={selectedPopup.coords[0]}
					latitude={selectedPopup.coords[1]}
					closeButton
					onClose={() => setSelectedPopup(null)}
				>
					<MapPopupContent point={selectedPopup.data} />
				</MapPopup>
			)}
		</>
	);
}

// ── Sidebar Panel ────────────────────────────────────────────────────────
function ThreatSidebar({
	points,
	selectedIp,
	onSelect,
	collapsed,
	onToggle,
}: {
	points: GeoMapPoint[];
	selectedIp: string | null;
	onSelect: (p: GeoMapPoint) => void;
	collapsed: boolean;
	onToggle: () => void;
}) {
	const sorted = useMemo(
		() => [...points].sort((a, b) => b.count - a.count),
		[points],
	);

	return (
		<div className="relative flex shrink-0">
			{/* Sidebar content */}
			<div
				className={cn(
					"flex flex-col border-r border-border bg-surface transition-all duration-300 overflow-hidden",
					collapsed ? "w-0" : "w-80",
				)}
			>
				<div className="border-b border-border px-4 py-3 shrink-0">
					<h2 className="text-xs font-semibold text-fg">
						Threat Origins
					</h2>
					<p className="mt-0.5 text-[10px] text-muted">
						{points.length} locations ·{" "}
						{points
							.reduce((s, p) => s + p.count, 0)
							.toLocaleString()}{" "}
						total threats
					</p>
				</div>

				{/* Table header */}
				<div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-border/50 px-4 py-2 text-[9px] font-medium uppercase tracking-wider text-dimmed shrink-0">
					<span>Country</span>
					<span>Severity</span>
					<span className="text-right">Count</span>
				</div>

				{/* Rows */}
				<div className="flex-1 overflow-y-auto">
					{sorted.map((p) => (
						<button
							key={p.ip}
							onClick={() => onSelect(p)}
							className={cn(
								"grid w-full grid-cols-[1fr_auto_auto] items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-fg/4",
								selectedIp === p.ip &&
									"bg-accent/8 border-l-2 border-l-accent",
							)}
						>
							<div className="min-w-0">
								<p className="text-[11px] font-medium text-fg truncate">
									{p.countryName}
								</p>
								<p className="font-mono text-[9px] text-dimmed truncate">
									{p.ip}
								</p>
							</div>
							<SeverityPill
								severity={p.severity}
								size="xs"
								showDot={false}
							/>
							<span className="font-mono text-[11px] font-semibold text-fg text-right tabular-nums">
								{p.count}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Toggle button — placed OUTSIDE the collapsing div so it's always visible */}
			<button
				onClick={onToggle}
				className="absolute -right-7 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-r-lg border border-l-0 border-border bg-surface text-muted transition-colors hover:bg-surface-hover hover:text-fg"
			>
				{collapsed ? (
					<ChevronRight className="h-3.5 w-3.5" />
				) : (
					<ChevronLeft className="h-3.5 w-3.5" />
				)}
			</button>
		</div>
	);
}

// ── Main Component ───────────────────────────────────────────────────────
export default function MapPageContent() {
	const router = useRouter();
	const { resolvedTheme } = useTheme();
	const points = MOCK_GEO_POINTS;
	const [mode, setMode] = useState<"arcs" | "2d">("2d");
	const defaultStyle = getDefaultMapStyle(resolvedTheme);
	const [mapStyle, setMapStyle] = useState<MapStyleId>(defaultStyle);
	const [clustersEnabled, setClustersEnabled] = useState(true);
	const [view3d, setView3d] = useState(false);
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [selectedIp, setSelectedIp] = useState<string | null>(null);

	// Sync map style with theme
	useEffect(() => {
		setMapStyle(getDefaultMapStyle(resolvedTheme));
	}, [resolvedTheme]);

	const handleSelectPoint = (p: GeoMapPoint | null) => {
		setSelectedIp(p?.ip ?? null);
	};

	const handleSidebarSelect = (p: GeoMapPoint) => {
		setSelectedIp(p.ip);
	};

	const handleReset = () => {
		setView3d(false);
		setClustersEnabled(true);
		setMapStyle(getDefaultMapStyle(resolvedTheme));
		setMode("arcs");
	};

	return (
		<div className="flex h-[calc(100dvh-64px)] flex-col overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-border bg-surface/80 px-5 py-2.5 backdrop-blur-sm">
				<div className="flex items-center gap-3">
					<button
						onClick={() => router.push("/dashboard")}
						className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-fg"
					>
						<ArrowLeft className="h-3.5 w-3.5" />
						Dashboard
					</button>
					<div className="flex items-center gap-2">
						<Globe className="h-4 w-4 text-accent" />
						<h1 className="font-display text-sm font-semibold text-fg">
							Geo Threat Map
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-3">
					{/* Mode toggle */}
					<div className="flex overflow-hidden rounded-lg border border-border bg-surface/90">
						<button
							onClick={() => setMode("arcs")}
							className={cn(
								"px-3 py-1.5 text-[11px] font-medium transition-colors",
								mode === "arcs"
									? "bg-accent/15 text-accent"
									: "text-muted hover:text-secondary",
							)}
						>
							Arcs
						</button>
						<button
							onClick={() => setMode("2d")}
							className={cn(
								"px-3 py-1.5 text-[11px] font-medium transition-colors",
								mode === "2d"
									? "bg-accent/15 text-accent"
									: "text-muted hover:text-secondary",
							)}
						>
							2D
						</button>
					</div>

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
			</div>

			{/* Map + Sidebar */}
			<div className="flex flex-1 overflow-hidden">
				<ThreatSidebar
					points={points}
					selectedIp={selectedIp}
					onSelect={handleSidebarSelect}
					collapsed={sidebarCollapsed}
					onToggle={() => setSidebarCollapsed((v) => !v)}
				/>

				<div className="relative flex-1">
					<Map
						center={[20, 25]}
						zoom={2}
						projection={{ type: "globe" } as any}
						className="h-full w-full"
						styles={{
							dark:
								MAP_STYLES[mapStyle]?.style ??
								(resolvedTheme === "light"
									? CARTO_LIGHT_STYLE
									: CARTO_DARK_STYLE),
						}}
						theme="dark"
					>
						<MapInner
							points={points}
							mode={mode}
							clustersEnabled={clustersEnabled}
							view3d={view3d}
							mapStyle={mapStyle}
							onSelectPoint={handleSelectPoint}
							selectedIp={selectedIp}
						/>

						{/* Bottom Left Controls: Stats & Legend */}
						<div className="absolute bottom-4 left-4 z-10 flex flex-col gap-3 pointer-events-none">
							{/* Stats overlay */}
							<div className="grid grid-cols-2 gap-2">
								{[
									{
										label: "Total Threats",
										value: points
											.reduce((s, p) => s + p.count, 0)
											.toLocaleString(),
										color: "text-fg",
									},
									{
										label: "Critical Sources",
										value: points
											.filter(
												(p) =>
													p.severity === "critical",
											)
											.length.toString(),
										color: "text-danger",
									},
									{
										label: "Countries",
										value: new Set(
											points.map((p) => p.country),
										).size.toString(),
										color: "text-accent",
									},
									{
										label: "Active Arcs",
										value: points.length.toString(),
										color: "text-info",
									},
								].map((s) => (
									<div
										key={s.label}
										className="rounded-lg border border-border bg-surface/90 px-3 py-2 backdrop-blur-sm shadow-card pointer-events-auto"
									>
										<div
											className={cn(
												"font-display text-lg font-bold",
												s.color,
											)}
										>
											{s.value}
										</div>
										<div className="text-[9px] text-muted">
											{s.label}
										</div>
									</div>
								))}
							</div>

							{/* Severity legend */}
							<div className="flex items-center gap-3 rounded-xl border border-border bg-surface/90 px-4 py-2.5 backdrop-blur-sm shadow-card pointer-events-auto">
								{Object.entries(SEVERITY_COLORS).map(
									([sev, color]) => (
										<div
											key={sev}
											className="flex items-center gap-1.5"
										>
											<span
												className="h-2.5 w-2.5 rounded-full"
												style={{
													backgroundColor: color,
												}}
											/>
											<span className="text-[10px] capitalize text-muted">
												{sev}
											</span>
										</div>
									),
								)}
								<span className="mx-1 h-3 w-px bg-border" />
								<div className="flex items-center gap-1.5">
									<Target className="h-3 w-3 text-accent" />
									<span className="text-[10px] text-accent">
										HQ
									</span>
								</div>
							</div>
						</div>
					</Map>
				</div>
			</div>
		</div>
	);
}
