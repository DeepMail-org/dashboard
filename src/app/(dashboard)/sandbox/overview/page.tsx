"use client";

import { useSandboxStore } from "@/stores/sandbox-store";
import ReactECharts from "echarts-for-react";
import { Users, LayoutDashboard, CreditCard, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SandboxOverviewPage() {
  const tasks = useSandboxStore((s) => s.tasks);

  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === "running").length,
    pending: tasks.filter(t => t.status === "pending").length,
    completed: tasks.filter(t => t.status === "completed").length,
    malicious: tasks.filter(t => t.verdict === "malicious").length,
    suspicious: tasks.filter(t => t.verdict === "suspicious").length,
    clean: tasks.filter(t => t.verdict === "clean").length,
  };

  // 1. Glowing Line Chart Options (Tasks Executed over time)
  const lineChartOptions = {
    grid: { left: 0, right: 0, top: 10, bottom: 0 },
    xAxis: { type: "category", show: false, data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
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
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(0, 242, 254, 0.4)" },
              { offset: 1, color: "rgba(0, 242, 254, 0)" }
            ]
          }
        }
      }
    ]
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
          { value: stats.malicious, name: "Malicious", itemStyle: { color: "#ff4b4b", shadowColor: "rgba(255, 75, 75, 0.5)", shadowBlur: 10 } },
          { value: stats.suspicious, name: "Suspicious", itemStyle: { color: "#facc15", shadowColor: "rgba(250, 204, 21, 0.5)", shadowBlur: 10 } },
          { value: stats.clean, name: "Clean", itemStyle: { color: "#4ade80", shadowColor: "rgba(74, 222, 128, 0.5)", shadowBlur: 10 } }
        ],
        itemStyle: {
          borderWidth: 4,
          borderColor: "#0f1115",
        }
      }
    ]
  };

  // 3. Mini Bar Chart Options (Daily submissions)
  const barOptions = {
    grid: { left: 0, right: 0, top: 10, bottom: 20 },
    xAxis: { 
      type: "category", 
      data: ["M", "T", "W", "T", "F", "S", "S"],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#6b7280", fontSize: 10, margin: 8 }
    },
    yAxis: { type: "value", show: false },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
        barWidth: "30%",
        itemStyle: {
          color: "#3b82f6",
          borderRadius: [4, 4, 4, 4]
        },
        emphasis: {
          itemStyle: {
            color: "#60a5fa",
            shadowColor: "rgba(59, 130, 246, 0.5)",
            shadowBlur: 10
          }
        }
      }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] overflow-y-auto text-white">
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <h1 className="text-lg font-bold text-white">Dashboard Overview</h1>
      </div>

      <div className="p-6 space-y-6">
        
        {/* PREMIUM STAT CARDS (Image 3 Inspiration) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Submissions (Line Chart) */}
          <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-5 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Total Submissions</h3>
                <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-white">{stats.total}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1">+12.5%</span>
              </div>
            </div>
            <div className="h-24 w-full -mx-2">
              <ReactECharts option={lineChartOptions} style={{ height: "100%", width: "100%" }} />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
               <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00f2fe]" /> Apr 07 - Apr 14</div>
               <span className="text-white font-mono">{stats.total}</span>
            </div>
          </div>

          {/* Card 2: Verdicts (Donut Chart) */}
          <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-5 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Threat Verdicts</h3>
                <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-white">{totalVerdicts}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1">+5.2%</span>
              </div>
            </div>
            <div className="h-32 w-full flex items-center justify-center relative">
              <ReactECharts option={donutOptions} style={{ height: "100%", width: "100%" }} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white font-bold text-lg">
                {Math.round((stats.malicious / (totalVerdicts || 1)) * 100)}%
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-gray-500 font-medium">
               Malicious detection rate
            </div>
          </div>

          {/* Card 3: Execution Progress (Progress Bar) */}
          <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-5 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Current Workloads</h3>
                <div className="text-xs text-gray-500 mt-1">Live</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1">86.5%</span>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-bold text-white">{stats.running}</span>
                <span className="text-sm font-bold text-white">{stats.pending} pending</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                 <div className="h-full bg-emerald-400" style={{ width: '86.5%', boxShadow: '0 0 10px rgba(52, 211, 153, 0.8)' }} />
              </div>
              <div className="mt-2 text-xs text-gray-500">Worker utilization: 18/22</div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="text-xs font-semibold text-gray-400 mb-2">Recent Submitters</div>
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f1115] bg-gray-700 flex items-center justify-center text-[10px] font-bold z-10">U{i}</div>
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-[#0f1115] bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 z-0">+4</div>
              </div>
            </div>
          </div>

          {/* Card 4: Daily Volume (Bar Chart) */}
          <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-5 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Processing Volume</h3>
                <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-white">{(stats.total / 7).toFixed(0)}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1">+18.2%</span>
              </div>
            </div>
            
            <div className="h-28 w-full">
              <ReactECharts option={barOptions} style={{ height: "100%", width: "100%" }} />
            </div>

            <div className="mt-2 space-y-2">
               <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500" /> Web Upload</div>
                  <span className="text-white">52%</span>
               </div>
               <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-gray-600" /> API / Integrations</div>
                  <span className="text-white">48%</span>
               </div>
            </div>
          </div>

        </div>

        {/* Dense Shoey Style Table Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Recent High-Risk Submissions</h3>
              <button className="text-xs text-gray-400 hover:text-white transition-colors">View All</button>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 border-b border-white/5">
                <tr><th className="py-2 font-medium">Filename</th><th className="py-2 font-medium text-right">Risk Score</th><th className="py-2 font-medium text-right">Verdict</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tasks.filter(t => t.status === "completed" && t.verdict === "malicious").slice(0, 8).map(task => (
                  <tr key={task.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="py-3 text-gray-300 font-mono truncate max-w-[200px] pr-4">{task.name}</td>
                    <td className="py-3 text-right font-mono text-rose-400">{task.risk || 95}</td>
                    <td className="py-3 text-right"><span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold uppercase text-[9px] border border-rose-500/20">Malicious</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Top Target Tenants</h3>
              <button className="text-xs text-gray-400 hover:text-white transition-colors">View All</button>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 border-b border-white/5">
                <tr><th className="py-2 font-medium">Tenant</th><th className="py-2 font-medium text-right">Malware Hits</th><th className="py-2 font-medium text-right">Trend</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {["Wayne Ent", "ACME Corp", "Stark Ind", "Globex", "Initech", "CyberDyne", "Umbrella"].map((tenant, i) => (
                  <tr key={tenant} className="hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="py-3 text-gray-300 flex items-center gap-2">
                       <div className="w-4 h-4 rounded bg-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-400">{tenant[0]}</div>
                       {tenant}
                    </td>
                    <td className="py-3 text-right font-mono text-white">{Math.floor(100 / (i + 1)) + 12}</td>
                    <td className="py-3 text-right">
                       <span className={cn("font-mono", i % 2 === 0 ? "text-emerald-400" : "text-rose-400")}>
                         {i % 2 === 0 ? "+" : "-"}{(Math.random() * 10).toFixed(1)}%
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
