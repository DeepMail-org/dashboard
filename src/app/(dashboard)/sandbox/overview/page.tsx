"use client";

import { useState, useEffect } from "react";
import { useSandboxStore } from "@/stores/sandbox-store";
import { AreaChart, Area } from "@/components/charts/area-chart";
import { AreaChartLoading } from "@/components/charts/area-chart-loading";
import { XAxis } from "@/components/charts/x-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { PieChart, PieSlice, PieCenter } from "@/components/charts/pie-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";

import { Users, LayoutDashboard, CreditCard, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SandboxOverviewPage() {
    const tasks = useSandboxStore((s) => s.tasks);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);


    const areaChartData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        revenue: Math.floor(8000 + Math.sin(i / 5) * 4000 + ((i * 11) % 2000)),
        costs: Math.floor(5000 + Math.cos(i / 4) * 2000 + ((i * 7) % 1500)),
        desktop: Math.floor(5000 + Math.cos(i / 4) * 2000 + ((i * 7) % 1500)),
        mobile: Math.floor(2000 + Math.cos(i / 3) * 1000 + ((i * 5) % 800)),
    }));

    const stats = {
        total: tasks.length,
        running: tasks.filter((t) => t.status === "running").length,
        pending: tasks.filter((t) => t.status === "pending").length,
        completed: tasks.filter((t) => t.status === "completed").length,
        malicious: tasks.filter((t) => t.verdict === "malicious").length,
        suspicious: tasks.filter((t) => t.verdict === "suspicious").length,
        clean: tasks.filter((t) => t.verdict === "clean").length,
    };

    // 1. Glowing Line Chart Options (Tasks Executed over time)
    const lineChartOptions = {
        grid: { left: 0, right: 0, top: 10, bottom: 0 },
        xAxis: {
            type: "category",
            show: false,
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: { type: "value", show: false },
        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: "line",
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    color: "#00f2fe",
                    width: 3,
                    shadowColor: "rgba(0, 242, 254, 0.5)",
                    shadowBlur: 10,
                },
                areaStyle: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: "rgba(0, 242, 254, 0.4)" },
                            { offset: 1, color: "rgba(0, 242, 254, 0)" },
                        ],
                    },
                },
            },
        ],
    };

    // 2. Glowing Donut Chart Options (Verdict Distribution)
    const totalVerdicts = stats.malicious + stats.suspicious + stats.clean;
    const donutOptions = {
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        series: [
            {
                name: "Verdicts",
                type: "pie",
                radius: ["65%", "85%"],
                avoidLabelOverlap: false,
                label: { show: false },
                labelLine: { show: false },
                data: [
                    {
                        value: stats.malicious,
                        name: "Malicious",
                        itemStyle: {
                            color: "#ff4b4b",
                            shadowColor: "rgba(255, 75, 75, 0.5)",
                            shadowBlur: 10,
                        },
                    },
                    {
                        value: stats.suspicious,
                        name: "Suspicious",
                        itemStyle: {
                            color: "#facc15",
                            shadowColor: "rgba(250, 204, 21, 0.5)",
                            shadowBlur: 10,
                        },
                    },
                    {
                        value: stats.clean,
                        name: "Clean",
                        itemStyle: {
                            color: "#4ade80",
                            shadowColor: "rgba(74, 222, 128, 0.5)",
                            shadowBlur: 10,
                        },
                    },
                ],
                itemStyle: {
                    borderWidth: 4,
                    borderColor: "#0f1115",
                },
            },
        ],
    };

    const pieData = [
        { label: "Malicious", value: stats.malicious, color: "#f43f5e" },
        { label: "Suspicious", value: stats.suspicious, color: "#facc15" },
        { label: "Clean", value: stats.clean, color: "#10b981" },
    ];

    const volumeData = Array.from({ length: 7 }, (_, i) => ({
        name: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("en-US", { weekday: "short" }),
        volume: Math.floor(10 + Math.random() * 40)
    }));

    return (
        <div className="flex flex-col h-full bg-bg overflow-y-auto text-fg">
            <div className="p-6 space-y-6">
                {/* PREMIUM STAT CARDS (Image 3 Inspiration) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Total Submissions (Line Chart) */}
                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-sm font-semibold text-muted">
                                    Total Submissions
                                </h3>
                                <div className="text-xs text-dimmed mt-1">
                                    Last 7 days
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xl font-bold text-white">
                                    {stats.total}
                                </span>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1">
                                    +12.5%
                                </span>
                            </div>
                        </div>
                        <div className="h-24 w-full" style={{ "--chart-line-primary": "#10b981", "--chart-line-secondary": "#3b82f6", "--chart-1": "#10b981", "--chart-2": "#3b82f6" } as React.CSSProperties}>
                            {isLoading ? (
                                <AreaChartLoading className="h-full" margin={{ top: 8, right: 8, bottom: 40, left: 8 }} />
                            ) : (
                                <AreaChart className="h-full" data={areaChartData} xDataKey="date" margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
                                  <Grid horizontal />
                                  <Area dataKey="revenue" fill="var(--chart-line-primary)" fillOpacity={0.3} strokeWidth={2} />
                                  <Area dataKey="costs" fill="var(--chart-line-secondary)" fillOpacity={0.2} strokeWidth={1.5} />
                                  <XAxis />
                                  <ChartTooltip />
                                </AreaChart>
                            )}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-dimmed">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#00f2fe]" />{" "}
                                Apr 07 - Apr 14
                            </div>
                            <span className="text-white font-mono">
                                {stats.total}
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Verdicts (Donut Chart) */}
                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-muted">
                                    Threat Verdicts
                                </h3>
                                <div className="text-xs text-dimmed mt-1">
                                    Last 7 days
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xl font-bold text-white">
                                    {totalVerdicts}
                                </span>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1">
                                    +5.2%
                                </span>
                            </div>
                        </div>
                        <div className="h-40 w-full flex items-center justify-center relative my-2">
                            <PieChart data={pieData} size={150} innerRadius={45} cornerRadius={4} padAngle={0.05}>
                                {pieData.map((_, i) => <PieSlice key={i} index={i} />)}
                                <PieCenter>
                                    {() => (
                                        <div className="flex flex-col items-center">
                                            <div className="text-xl font-bold text-white">
                                                {Math.round((stats.malicious / (totalVerdicts || 1)) * 100)}%
                                            </div>
                                        </div>
                                    )}
                                </PieCenter>
                            </PieChart>
                        </div>
                        <div className="mt-2 text-center text-xs text-dimmed font-medium">
                            Malicious detection rate
                        </div>
                    </div>

                    {/* Card 3: Execution Progress (Progress Bar) */}
                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-sm font-semibold text-muted">
                                    Processing Metrics
                                </h3>
                                <div className="text-xs text-dimmed mt-1">
                                    Live
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1">
                                    86.5%
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 h-24 w-full" style={{ "--chart-line-primary": "#a855f7", "--chart-line-secondary": "#10b981", "--chart-1": "#a855f7", "--chart-2": "#10b981" } as React.CSSProperties}>
                            {isLoading ? (
                                <AreaChartLoading className="h-full" margin={{ top: 8, right: 8, bottom: 40, left: 8 }} />
                            ) : (
                                <AreaChart className="h-full" data={areaChartData} xDataKey="date" margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
                                  <Grid horizontal />
                                  <Area dataKey="desktop" fill="var(--chart-line-primary)" fillOpacity={0.3} strokeWidth={2} />
                                  <XAxis />
                                  <ChartTooltip />
                                </AreaChart>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                            <div className="text-xs font-semibold text-muted mb-2">
                                Recent Submitters
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full border-2 border-surface bg-surface-3 flex items-center justify-center text-[10px] font-bold z-10"
                                    >
                                        U{i}
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-surface bg-fg/10 flex items-center justify-center text-[10px] font-bold text-muted z-0">
                                    +4
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Daily Volume (Bar Chart) */}
                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-muted">
                                    Email Volume Timeline
                                </h3>
                                <div className="text-xs text-dimmed mt-1">
                                    Last 7 days
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xl font-bold text-white">
                                    {(stats.total / 7).toFixed(0)}
                                </span>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1">
                                    +18.2%
                                </span>
                            </div>
                        </div>

                        <div className="h-32 w-full mt-2">
                            <BarChart data={volumeData} xDataKey="name" aspectRatio="4/1" margin={{ top: 10, bottom: 0, left: 0, right: 0 }}>
                                <Bar dataKey="volume" fill="var(--color-primary)" lineCap={4} />
                            </BarChart>
                        </div>

                        <div className="mt-2 space-y-2">
                            <div className="flex justify-between text-xs text-dimmed">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded bg-blue-500" />{" "}
                                    Web Upload
                                </div>
                                <span className="text-fg">52%</span>
                            </div>
                            <div className="flex justify-between text-xs text-dimmed">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded bg-gray-600" />{" "}
                                    API / Integrations
                                </div>
                                <span className="text-fg">48%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dense Shoey Style Table Integration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-fg">
                                Recent High-Risk Submissions
                            </h3>
                            <button className="text-xs text-muted hover:text-fg transition-colors">
                                View All
                            </button>
                        </div>
                        <table className="w-full text-left text-xs">
                            <thead className="text-muted border-b border-border">
                                <tr>
                                    <th className="py-2 font-medium">
                                        Filename
                                    </th>
                                    <th className="py-2 font-medium text-right">
                                        Risk Score
                                    </th>
                                    <th className="py-2 font-medium text-right">
                                        Verdict
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tasks
                                    .filter(
                                        (t) =>
                                            t.status === "completed" &&
                                            t.verdict === "malicious",
                                    )
                                    .slice(0, 8)
                                    .map((task) => (
                                        <tr
                                            key={task.id}
                                            className="hover:bg-fg/5 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 text-secondary font-mono truncate max-w-[200px] pr-4">
                                                {task.name}
                                            </td>
                                            <td className="py-3 text-right font-mono text-rose-400">
                                                {task.risk || 95}
                                            </td>
                                            <td className="py-3 text-right">
                                                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold uppercase text-[9px] border border-rose-500/20">
                                                    Malicious
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-fg">
                                Top Target Tenants
                            </h3>
                            <button className="text-xs text-muted hover:text-fg transition-colors">
                                View All
                            </button>
                        </div>
                        <table className="w-full text-left text-xs">
                            <thead className="text-muted border-b border-border">
                                <tr>
                                    <th className="py-2 font-medium">Tenant</th>
                                    <th className="py-2 font-medium text-right">
                                        Malware Hits
                                    </th>
                                    <th className="py-2 font-medium text-right">
                                        Trend
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {[
                                    "Wayne Ent",
                                    "ACME Corp",
                                    "Stark Ind",
                                    "Globex",
                                    "Initech",
                                    "CyberDyne",
                                    "Umbrella",
                                ].map((tenant, i) => (
                                    <tr
                                        key={tenant}
                                        className="hover:bg-fg/5 transition-colors cursor-pointer"
                                    >
                                        <td className="py-3 text-secondary flex items-center gap-2">
                                            <div className="w-4 h-4 rounded bg-fg/10 flex items-center justify-center text-[8px] font-bold text-muted">
                                                {tenant[0]}
                                            </div>
                                            {tenant}
                                        </td>
                                        <td className="py-3 text-right font-mono text-fg">
                                            {Math.floor(100 / (i + 1)) + 12}
                                        </td>
                                        <td className="py-3 text-right">
                                            <span
                                                className={cn(
                                                    "font-mono",
                                                    i % 2 === 0
                                                        ? "text-emerald-400"
                                                        : "text-rose-400",
                                                )}
                                            >
                                                {i % 2 === 0 ? "+" : "-"}
                                                {(Math.random() * 10).toFixed(
                                                    1,
                                                )}
                                                %
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
