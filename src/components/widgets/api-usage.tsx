import { useMemo } from "react";
import { Cpu, ExternalLink } from "lucide-react";
import type { WidgetProps } from "@/lib/dashboard/types";
import { DEMO_DASHBOARD } from "@/lib/demo-data";
import type { DashboardOverview } from "@/lib/api/types";
import { AreaChart, Area } from "@/components/charts/area-chart";
import { XAxis } from "@/components/charts/x-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { AreaChartLoading } from "@/components/charts/area-chart-loading";
import { ChartBrushLayout } from "@/components/charts/brush";
import { Background } from "@/components/charts/background";
import { curveNatural } from "@visx/curve";

const STATS = [
  { label: "Daily API Calls", value: "12.4K" },
  { label: "Emails Processed", value: "8,847" },
  { label: "Threats Detected", value: "291" },
];

export default function ApiUsage({ data, isLoading }: WidgetProps) {
  const dashboard = (data as DashboardOverview) ?? DEMO_DASHBOARD;

  const chartData = useMemo(() => {
    const now = new Date();
    const sliceLength = dashboard.emailVolume.length;

    return dashboard.emailVolume.slice(0, sliceLength).map((d, i) => {
      const date = new Date(now);
      const stepsFromEnd = sliceLength - 1 - i;
      date.setHours(now.getHours() - stepsFromEnd * ((24 * 30) / Math.max(1, sliceLength - 1)));

      const emailCount = d.count;
      return {
        time: date,
        emails: emailCount,
        threats: Math.floor(emailCount * (0.02 + ((i % 5) * 0.006))),
      };
    });
  }, [dashboard.emailVolume]);

  const stats = useMemo(() => {
    const totalEmails = chartData.reduce((sum, d) => sum + d.emails, 0);
    const totalThreats = chartData.reduce((sum, d) => sum + d.threats, 0);
    const totalAPI = Math.floor(totalEmails * 1.4);

    return [
      { label: "Daily API Calls", value: totalAPI > 1000 ? `${(totalAPI / 1000).toFixed(1)}K` : totalAPI.toString() },
      { label: "Emails Processed", value: totalEmails.toLocaleString() },
      { label: "Threats Detected", value: totalThreats.toLocaleString() },
    ];
  }, [chartData]);

  if (isLoading) return <AreaChartLoading loadingStyle="sweep" className="h-full w-full" />;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-accent" />
            <span className="font-display font-medium text-fg">
              Processing Metrics
            </span>
          </div>
          <span className="text-[10px] text-muted">DeepMail Engine v2.4</span>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i}>
            <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted">
              {stat.label}
            </div>
            <div className="font-display text-xl font-bold text-fg">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="min-h-0 flex-1 overflow-hidden pb-4" style={{ "--chart-line-primary": "#a855f7", "--chart-line-secondary": "#e54040", "--chart-1": "#a855f7", "--chart-2": "#e54040" } as React.CSSProperties}>
        <ChartBrushLayout
          data={chartData}
          enabled
          height={72}
          xDataKey="time"
          brushStrip={() => (
            <AreaChart data={chartData} className="h-full" margin={{ top: 0, right: 20, bottom: 0, left: 30 }} xDataKey="time">
              <Background />
              <Area dataKey="emails" curve={curveNatural} fillOpacity={0.15} fill="var(--chart-line-primary)" />
              <Area dataKey="threats" curve={curveNatural} fillOpacity={0.15} fill="var(--chart-line-secondary)" />
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
              <Area dataKey="emails" curve={curveNatural} fadeEdges gradientToOpacity={0} showLine={true} showHighlight={true} fill="var(--chart-line-primary)" fillOpacity={0.3} strokeWidth={2} />
              <Area dataKey="threats" curve={curveNatural} fadeEdges gradientToOpacity={0} showLine={true} showHighlight={true} fill="var(--chart-line-secondary)" fillOpacity={0.3} strokeWidth={2} />
              <XAxis />
              <ChartTooltip />
            </AreaChart>
          )}
        </ChartBrushLayout>
      </div>

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between border-t border-border/50 pt-2">
        <span className="text-[10px] text-muted">Avg Processing: 1.2s</span>
        <button className="flex items-center gap-1 text-[10px] text-accent hover:underline">
          API Docs <ExternalLink className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}