"use client";

import { Globe, Layers, RotateCcw, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapStyleId } from "./map-theme";

interface MapToolbarProps {
    activeStyle: MapStyleId;
    onStyleChange: (style: MapStyleId) => void;
    clustersEnabled: boolean;
    onToggleClusters: () => void;
    view3d: boolean;
    onToggle3d: () => void;
    onReset: () => void;
    className?: string;
}

export function MapToolbar({
    activeStyle,
    onStyleChange,
    clustersEnabled,
    onToggleClusters,
    view3d,
    onToggle3d,
    onReset,
    className,
}: MapToolbarProps) {
    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            {/* Style switcher */}
            <div className="flex overflow-hidden rounded-lg border border-border bg-surface/90 backdrop-blur-sm">
                <button
                    onClick={() => onStyleChange("carto")}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                        activeStyle === "carto"
                            ? "bg-accent/15 text-accent"
                            : "text-muted hover:text-secondary hover:bg-surface-hover",
                    )}
                >
                    <Map className="h-3 w-3" />
                    Carto
                </button>
                <button
                    onClick={() => onStyleChange("maptiler")}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                        activeStyle === "maptiler"
                            ? "bg-accent/15 text-accent"
                            : "text-muted hover:text-secondary hover:bg-surface-hover",
                    )}
                >
                    <Globe className="h-3 w-3" />
                    Satellite
                </button>
            </div>

            {/* Cluster toggle */}
            <button
                onClick={onToggleClusters}
                className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors backdrop-blur-sm",
                    clustersEnabled
                        ? "border-accent/30 bg-accent/15 text-accent"
                        : "border-border bg-surface/90 text-muted hover:text-secondary hover:bg-surface-hover",
                )}
            >
                <Layers className="h-3 w-3" />
                Clusters
            </button>

            {/* 3D toggle */}
            <button
                onClick={onToggle3d}
                className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors backdrop-blur-sm",
                    view3d
                        ? "border-accent/30 bg-accent/15 text-accent"
                        : "border-border bg-surface/90 text-muted hover:text-secondary hover:bg-surface-hover",
                )}
            >
                <Globe className="h-3 w-3" />
                3D
            </button>

            {/* Reset */}
            <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface/90 px-2.5 py-1.5 text-[11px] font-medium text-muted backdrop-blur-sm transition-colors hover:text-secondary hover:bg-surface-hover"
            >
                <RotateCcw className="h-3 w-3" />
                Reset
            </button>
        </div>
    );
}
