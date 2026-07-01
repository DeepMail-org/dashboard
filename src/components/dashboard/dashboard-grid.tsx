"use client";

import { useMemo, useCallback } from "react";
import { ResponsiveGridLayout, useContainerWidth, type Layout, type ResponsiveLayouts } from "react-grid-layout";
import { useDashboardStore } from "@/stores/dashboard-store";
import { WidgetSlot } from "./widget-slot";
import { BREAKPOINTS, COLS, ROW_HEIGHT, MARGIN } from "@/lib/dashboard/breakpoints";
import { useMounted } from "@/hooks/use-mounted";
import type { Breakpoint } from "@/lib/dashboard/types";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export function DashboardGrid() {
  const mounted = useMounted();
  const isHydrated = useDashboardStore((s) => s.isHydrated);
  const activeWidgets = useDashboardStore((s) => s.activeWidgets);
  const layouts = useDashboardStore((s) => s.layouts);
  const isLocked = useDashboardStore((s) => s.isLocked);
  const updateBreakpointLayout = useDashboardStore((s) => s.updateBreakpointLayout);

  const { width, mounted: widthMounted, containerRef } = useContainerWidth({
    initialWidth: 1280,
  });

  const handleLayoutChange = useCallback(
    (layout: Layout, allLayouts: ResponsiveLayouts) => {
      for (const [bp, items] of Object.entries(allLayouts)) {
        if (items) updateBreakpointLayout(bp as Breakpoint, [...items]);
      }
    },
    [updateBreakpointLayout],
  );

  const children = useMemo(
    () =>
      activeWidgets.map((id) => (
        <div key={id}>
          <WidgetSlot widgetId={id} />
        </div>
      )),
    [activeWidgets],
  );

  const gridHeight = useMemo(() => {
    const bp = Object.keys(BREAKPOINTS).find(
      (k) => width >= BREAKPOINTS[k as Breakpoint],
    ) as Breakpoint | undefined;
    const currentBp = bp ?? "xs";
    const currentLayout = layouts[currentBp] ?? [];
    if (currentLayout.length === 0) return 400;
    const maxBottom = currentLayout.reduce(
      (max, item) => Math.max(max, item.y + item.h),
      0,
    );
    return maxBottom * ROW_HEIGHT + (maxBottom - 1) * MARGIN[1] + 40;
  }, [layouts, width]);

  if (!mounted || !isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-60 animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ minHeight: gridHeight }}>
      {widthMounted && (
        <ResponsiveGridLayout
          width={width}
          layouts={layouts}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={ROW_HEIGHT}
          margin={MARGIN}
          containerPadding={[0, 0]}
          dragConfig={{
            enabled: !isLocked,
            handle: ".widget-drag-handle",
          }}
          resizeConfig={{
            enabled: !isLocked,
          }}

          autoSize={false}
          onLayoutChange={handleLayoutChange}
        >
          {children}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}