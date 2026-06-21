import { useMemo } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";
import type { DashboardOverview } from "@/lib/api/types";
import { DEMO_DASHBOARD } from "@/lib/demo-data";
import { AreaChart, Area } from "@/components/charts/area-chart";
import { XAxis } from "@/components/charts/x-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { AreaChartLoading } from "@/components/charts/area-chart-loading";
import { ChartBrushLayout } from "@/components/charts/brush";
import { Background } from "@/components/charts/background";
import { curveNatural } from "@visx/curve";

export default function EmailVolumeTimeline({ data, isLoading }: WidgetProps) {
  const dashboard = (data as DashboardOverview) ?? DEMO_DASHBOARD;

  const chartData = useMemo(() => {
    const now = new Date();
    const sliceLength = dashboard.emailVolume.length;

    return dashboard.emailVolume.slice(0, sliceLength).map((d, i) => {
      const date = new Date(now);
      const stepsFromEnd = sliceLength - 1 - i;
      date.setHours(now.getHours() - stepsFromEnd * ((24 * 30) / Math.max(1, sliceLength - 1)));

      return {
        time: date,
        count: d.count,
      };
    });
  }, [dashboard.emailVolume]);

  const totalAnalyzed = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.count, 0);
  }, [chartData]);

  if (isLoading) return <AreaChartLoading loadingStyle="sweep" className="h-full w-full" />;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl font-bold text-fg">
            {totalAnalyzed.toLocaleString()}
          </span>
          <span className="text-xs text-muted">emails analyzed</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden pb-4" style={{ "--chart-line-primary": "#a855f7", "--chart-1": "#a855f7" } as React.CSSProperties}>
        <ChartBrushLayout
          data={chartData}
          enabled
          height={72}
          xDataKey="time"
          brushStrip={() => (
            <AreaChart data={chartData} className="h-full" margin={{ top: 0, right: 20, bottom: 0, left: 30 }} xDataKey="time">
              <Background />
              <Area dataKey="count" curve={curveNatural} fillOpacity={0.15} fadeEdges gradientToOpacity={0} showLine={true} showHighlight={true} fill="var(--chart-line-primary)" />
            </AreaChart>
          )}
        >
          {(layout) => (
            <AreaChart
              className="h-full"
              data={chartData}
              xDataKey="time"
              xDomain={layout.xDomain}
              margin={{ top: 8, right: 30, bottom: 30, left: 30 }}
              animationDuration={1600}
              animationEasing="cubic-bezier(0, 0, 0.58, 1)"
            >
              <Background />
              <Grid horizontal />
              <Area dataKey="count" curve={curveNatural} fill="var(--chart-line-primary)" fillOpacity={0.3} strokeWidth={2} fadeEdges gradientToOpacity={0} showLine={true} showHighlight={true} />
              <XAxis />
              <ChartTooltip />
            </AreaChart>
          )}
        </ChartBrushLayout>
      </div>
    </div>
  );
}