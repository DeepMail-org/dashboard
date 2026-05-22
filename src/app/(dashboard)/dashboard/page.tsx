"use client";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { WidgetMarketplace } from "@/components/dashboard/widget-marketplace";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-fg">Dashboard</h2>
          <p className="mt-0.5 text-sm text-muted">Real-time threat intelligence overview</p>
        </div>
        <DashboardToolbar />
      </div>

      <DashboardGrid />
      <WidgetMarketplace />
    </div>
  );
}
