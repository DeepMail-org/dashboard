"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";

// ─── ChartBrushLayout ────────────────────────────────────────────────
// Wraps a main chart (children) and a mini brush strip.
// The brush strip shows the full dataset; when the user drags handles
// on the HTML-based brush overlay, the main chart zooms to that range.

export interface ChartBrushLayoutProps {
  data: any[];
  enabled?: boolean;
  height?: number;
  /** Renders the mini area chart in the brush strip area. */
  brushStrip: (layout: {
    brushSelection: null;
    onBrushSelectionChange: () => void;
  }) => React.ReactNode;
  children: (layout: {
    xDomain: [Date, Date] | undefined;
    xDomainSlotCount: number | undefined;
  }) => React.ReactNode;
  /** Key in data items for the date value. Default: first Date field. */
  xDataKey?: string;
}

export function ChartBrushLayout({
  data,
  enabled = true,
  height = 72,
  brushStrip,
  children,
  xDataKey,
}: ChartBrushLayoutProps) {
  // Brush selection as normalized [0..1, 0..1] range
  const [selStart, setSelStart] = useState(0);
  const [selEnd, setSelEnd] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // Compute date domain from data based on brush selection
  const xDomain = useMemo<[Date, Date] | undefined>(() => {
    if (!enabled || data.length < 2) return undefined;
    if (selStart <= 0 && selEnd >= 1) return undefined; // full range, no filter

    // Find the date accessor key
    let dateKey = xDataKey;
    if (!dateKey) {
      const firstItem = data[0];
      for (const key of Object.keys(firstItem)) {
        if (firstItem[key] instanceof Date) {
          dateKey = key;
          break;
        }
      }
    }
    if (!dateKey) return undefined;

    const dates = data.map((d) => {
      const v = d[dateKey!];
      return v instanceof Date ? v : new Date(v);
    });
    const minTime = dates[0].getTime();
    const maxTime = dates[dates.length - 1].getTime();
    const range = maxTime - minTime;

    const startTime = minTime + range * selStart;
    const endTime = minTime + range * selEnd;

    return [new Date(startTime), new Date(endTime)];
  }, [data, enabled, selStart, selEnd, xDataKey]);

  if (!enabled) {
    return <>{children({ xDomain: undefined, xDomainSlotCount: undefined })}</>;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1">
        {children({
          xDomain,
          xDomainSlotCount: data.length,
        })}
      </div>
      <div style={{ height, flexShrink: 0 }} className="relative mt-2 w-full">
        {/* Mini chart (no brush interaction — purely visual) */}
        {brushStrip({
          brushSelection: null,
          onBrushSelectionChange: () => {},
        })}
        {/* HTML brush overlay on top of the mini chart */}
        <BrushOverlay
          height={height}
          selStart={selStart}
          selEnd={selEnd}
          onSelStartChange={setSelStart}
          onSelEndChange={setSelEnd}
          isDragging={isDragging}
          onDraggingChange={setIsDragging}
        />
      </div>
    </div>
  );
}

// ─── BrushOverlay ────────────────────────────────────────────────────
// A pure HTML/CSS brush with two draggable handles and a draggable
// selection region. No dependency on chart scales or context.

interface BrushOverlayProps {
  height: number;
  selStart: number;
  selEnd: number;
  onSelStartChange: (v: number) => void;
  onSelEndChange: (v: number) => void;
  isDragging: boolean;
  onDraggingChange: (v: boolean) => void;
}

function BrushOverlay({
  height,
  selStart,
  selEnd,
  onSelStartChange,
  onSelEndChange,
  isDragging,
  onDraggingChange,
}: BrushOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    type: "left" | "right" | "center";
    startX: number;
    origStart: number;
    origEnd: number;
  } | null>(null);

  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  const getRelativeX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return (clientX - rect.left) / rect.width;
  }, []);

  const handlePointerDown = useCallback(
    (type: "left" | "right" | "center", e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragState.current = {
        type,
        startX: e.clientX,
        origStart: selStart,
        origEnd: selEnd,
      };
      onDraggingChange(true);
    },
    [selStart, selEnd, onDraggingChange]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const ds = dragState.current;
      if (!ds) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;

      const deltaPx = e.clientX - ds.startX;
      const deltaNorm = deltaPx / rect.width;

      if (ds.type === "left") {
        const newStart = clamp(ds.origStart + deltaNorm);
        if (newStart < selEnd - 0.02) {
          onSelStartChange(newStart);
        }
      } else if (ds.type === "right") {
        const newEnd = clamp(ds.origEnd + deltaNorm);
        if (newEnd > selStart + 0.02) {
          onSelEndChange(newEnd);
        }
      } else {
        // center drag — move the entire selection
        const span = ds.origEnd - ds.origStart;
        let newStart = ds.origStart + deltaNorm;
        let newEnd = ds.origEnd + deltaNorm;
        if (newStart < 0) {
          newStart = 0;
          newEnd = span;
        }
        if (newEnd > 1) {
          newEnd = 1;
          newStart = 1 - span;
        }
        onSelStartChange(clamp(newStart));
        onSelEndChange(clamp(newEnd));
      }
    },
    [selStart, selEnd, onSelStartChange, onSelEndChange]
  );

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
    onDraggingChange(false);
  }, [onDraggingChange]);

  // Click on the unselected area to jump the selection
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (dragState.current) return;
      const rel = getRelativeX(e.clientX);
      const span = selEnd - selStart;
      const center = rel;
      let newStart = center - span / 2;
      let newEnd = center + span / 2;
      if (newStart < 0) {
        newStart = 0;
        newEnd = span;
      }
      if (newEnd > 1) {
        newEnd = 1;
        newStart = 1 - span;
      }
      onSelStartChange(clamp(newStart));
      onSelEndChange(clamp(newEnd));
    },
    [selStart, selEnd, getRelativeX, onSelStartChange, onSelEndChange]
  );

  const leftPct = `${selStart * 100}%`;
  const rightPct = `${(1 - selEnd) * 100}%`;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      style={{ height, cursor: isDragging ? "grabbing" : "default" }}
      onClick={handleBackgroundClick}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Dimmed regions outside selection */}
      <div
        className="absolute top-0 bottom-0 left-0"
        style={{
          width: leftPct,
          background: "var(--color-background, #0a0a0a)",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute top-0 bottom-0 right-0"
        style={{
          width: rightPct,
          background: "var(--color-background, #0a0a0a)",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Selected region (draggable center) */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: leftPct,
          right: rightPct,
          cursor: "grab",
          borderTop: "2px solid oklch(0.7 0.15 280 / 0.6)",
          borderBottom: "2px solid oklch(0.7 0.15 280 / 0.6)",
        }}
        onPointerDown={(e) => handlePointerDown("center", e)}
      />

      {/* Left handle */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: `calc(${leftPct} - 4px)`,
          width: 8,
          cursor: "ew-resize",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPointerDown={(e) => handlePointerDown("left", e)}
      >
        <div
          style={{
            width: 3,
            height: 24,
            borderRadius: 2,
            background: "oklch(0.7 0.15 280)",
          }}
        />
      </div>

      {/* Right handle */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: `calc(${selEnd * 100}% - 4px)`,
          width: 8,
          cursor: "ew-resize",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPointerDown={(e) => handlePointerDown("right", e)}
      >
        <div
          style={{
            width: 3,
            height: 24,
            borderRadius: 2,
            background: "oklch(0.7 0.15 280)",
          }}
        />
      </div>
    </div>
  );
}

// ─── ChartBrush (no-op compatibility shim) ───────────────────────────
// Kept so existing imports don't break. The actual brush interaction
// is now handled entirely by the HTML BrushOverlay inside ChartBrushLayout,
// so this component renders nothing.

export interface ChartBrushProps {
  initialSelection?: { start: number; end: number };
  onSelectionChange?: (domain: any) => void;
  height?: number;
}

export function ChartBrush(_props: ChartBrushProps) {
  return null;
}
