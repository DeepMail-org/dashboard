"use client";

import { Lock, Unlock, Plus, RotateCcw } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";

export function DashboardToolbar() {
  const isLocked = useDashboardStore((s) => s.isLocked);
  const toggleLocked = useDashboardStore((s) => s.toggleLocked);
  const setMarketplaceOpen = useDashboardStore((s) => s.setMarketplaceOpen);
  const resetToDefault = useDashboardStore((s) => s.resetToDefault);

  return (
    <div className="flex items-center gap-2">
      {/* Lock toggle */}
      <button
        onClick={toggleLocked}
        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          isLocked
            ? "text-muted hover:text-secondary hover:bg-surface-hover"
            : "bg-accent-soft text-accent"
        }`}
        title={isLocked ? "Unlock dashboard to edit" : "Lock dashboard"}
      >
        {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
        {isLocked ? "Locked" : "Editing"}
      </button>

      {/* Add widget + Reset (only when unlocked) */}
      {!isLocked && (
        <>
          <button
            onClick={() => setMarketplaceOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1.5 text-xs text-secondary transition-colors hover:bg-surface-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Widget
          </button>

          <button
            onClick={resetToDefault}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-secondary"
            title="Reset to default layout"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
