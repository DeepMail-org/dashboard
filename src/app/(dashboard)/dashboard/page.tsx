"use client";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { WidgetMarketplace } from "@/components/dashboard/widget-marketplace";

export default function DashboardPage() {
    return (
        <div className="h-full overflow-y-auto p-6 lg:p-8 space-y-4">
            <DashboardGrid />
            <WidgetMarketplace />
        </div>
    );
}
