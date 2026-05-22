"use client";

import type { ReactNode } from "react";
import { X, Maximize2, RefreshCw } from "lucide-react";
import { WidgetDragHandle } from "./widget-drag-handle";

interface WidgetCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  isLocked: boolean;
  onRemove?: () => void;
  onExpand?: () => void;
  onRefresh?: () => void;
}

export function WidgetCard({
  title,
  icon,
  children,
  isLocked,
  onRemove,
  onExpand,
  onRefresh,
}: WidgetCardProps) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_100%)] shadow-card">
      <WidgetDragHandle isLocked={isLocked} />

      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted">{icon}</span>}
          <h3 className="font-display text-xs font-semibold tracking-tight text-secondary">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="rounded p-1 text-muted transition-colors hover:bg-surface-hover hover:text-fg"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          )}
          {!isLocked && onExpand && (
            <button
              onClick={onExpand}
              className="rounded p-1 text-muted transition-colors hover:bg-surface-hover hover:text-fg"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          )}
          {!isLocked && onRemove && (
            <button
              onClick={onRemove}
              className="rounded p-1 text-muted transition-colors hover:bg-surface-hover hover:text-danger"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">{children}</div>
    </div>
  );
}
