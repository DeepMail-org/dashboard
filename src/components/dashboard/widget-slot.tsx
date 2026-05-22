"use client";

import { Suspense, lazy, useMemo, memo, useRef } from "react";
import { WidgetErrorBoundary } from "./widget-error-boundary";
import { WidgetSkeleton } from "./widget-skeleton";
import { WidgetCard } from "./widget-card";
import { widgetRegistry } from "@/lib/dashboard/registry";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useContainerSize } from "@/hooks/use-container-size";
import { useWidgetQuery } from "@/hooks/use-widget-query";
import type { WidgetProps } from "@/lib/dashboard/types";
import * as LucideIcons from "lucide-react";

interface WidgetSlotProps {
  widgetId: string;
}

const WidgetDataBridge = memo(function WidgetDataBridge({
  widgetId,
  definition,
  refetchRef,
}: {
  widgetId: string;
  definition: NonNullable<ReturnType<typeof widgetRegistry.get>>;
  refetchRef: React.MutableRefObject<(() => void) | null>;
}) {
  const [containerRef, containerSize] = useContainerSize();
  const { data, isLoading, error, refetch } = useWidgetQuery(
    widgetId,
    definition.dataSource,
  );

  refetchRef.current = refetch;

  const LazyWidget = useMemo(() => lazy(definition.loader), [definition]);

  const widgetProps: WidgetProps = {
    widgetId,
    data,
    isLoading,
    error,
    refetch,
    containerWidth: containerSize.width,
    containerHeight: containerSize.height,
  };

  return (
    <div ref={containerRef} className="h-full w-full">
      <Suspense fallback={<WidgetSkeleton />}>
        <LazyWidget {...widgetProps} />
      </Suspense>
    </div>
  );
});

export const WidgetSlot = memo(function WidgetSlot({ widgetId }: WidgetSlotProps) {
  const definition = widgetRegistry.get(widgetId);
  const isLocked = useDashboardStore((s) => s.isLocked);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const refetchRef = useRef<(() => void) | null>(null);

  if (!definition) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-surface">
        <span className="text-xs text-muted">Unknown widget: {widgetId}</span>
      </div>
    );
  }

  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const IconComponent = icons[definition.icon];
  const icon = IconComponent ? <IconComponent className="h-3.5 w-3.5" /> : null;

  return (
    <WidgetErrorBoundary widgetId={widgetId} onRemove={() => removeWidget(widgetId)}>
      <WidgetCard
        title={definition.name}
        icon={icon}
        isLocked={isLocked}
        onRemove={() => removeWidget(widgetId)}
        onRefresh={() => refetchRef.current?.()}
      >
        <WidgetDataBridge widgetId={widgetId} definition={definition} refetchRef={refetchRef} />
      </WidgetCard>
    </WidgetErrorBoundary>
  );
});
