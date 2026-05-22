"use client";

import { GripVertical } from "lucide-react";

interface WidgetDragHandleProps {
  isLocked: boolean;
}

export function WidgetDragHandle({ isLocked }: WidgetDragHandleProps) {
  if (isLocked) return null;

  return (
    <div className="widget-drag-handle absolute left-0 top-0 z-10 flex h-6 w-full cursor-grab items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
      <GripVertical className="h-3.5 w-3.5 text-muted" />
    </div>
  );
}
