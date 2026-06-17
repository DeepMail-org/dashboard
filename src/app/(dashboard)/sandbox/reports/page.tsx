"use client";

import { useState } from "react";
import { FileText, Download, Filter, Search, Calendar, CheckCircle, ExternalLink } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { cn } from "@/lib/utils";

// Mock Data for Reports
const MOCK_REPORTS = [
  { id: "REP-9921", name: "Executive Summary - Q3 Threat Landscape", type: "PDF", date: "2026-06-16", size: "2.4 MB", status: "Ready", author: "System" },
  { id: "REP-9920", name: "Deep Analysis: Emotet Campaign Tracking", type: "PDF", date: "2026-06-15", size: "8.1 MB", status: "Ready", author: "Analyst J.Doe" },
  { id: "REP-9919", name: "IOC Export (Last 7 Days)", type: "CSV", date: "2026-06-14", size: "125 KB", status: "Ready", author: "System" },
  { id: "REP-9918", name: "Monthly Board View Security Report", type: "PDF", date: "2026-06-01", size: "4.2 MB", status: "Ready", author: "Admin" },
  { id: "REP-9917", name: "Raw PCAP Capture - Suspect Node 04", type: "PCAP", date: "2026-05-28", size: "145 MB", status: "Archived", author: "System" },
  { id: "REP-9916", name: "YARA Rule Match Summary", type: "JSON", date: "2026-05-25", size: "1.1 MB", status: "Ready", author: "System" },
  { id: "REP-9915", name: "Incident Report: Suspicious Lateral Movement", type: "PDF", date: "2026-05-20", size: "3.5 MB", status: "Ready", author: "Analyst J.Doe" },
  { id: "REP-9914", name: "Phishing Campaign Aggregation", type: "PDF", date: "2026-05-15", size: "5.6 MB", status: "Archived", author: "System" },
];

export default function SandboxReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = MOCK_REPORTS.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart: Daily Report Volume
  const volumeChartOptions = {
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
        data: [12, 18, 15, 25, 20, 8, 10],
        type: "bar",
        barWidth: "40%",
        itemStyle: {
          color: "#8b5cf6", // Purple glow
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: "#a78bfa",
            shadowColor: "rgba(139, 92, 246, 0.5)",
            shadowBlur: 10
          }
        }
      }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-white overflow-hidden">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f1115] shrink-0">
        <h1 className="text-lg font-bold text-white">Intelligence Reports</h1>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0f1115] border border-white/10 text-[11px] font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-400 hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all">
            <FileText className="h-3.5 w-3.5" /> Generate Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Top Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-5 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Total Reports</h3>
                <div className="text-xs text-gray-500 mt-1">This month</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white">128</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1">+14%</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-emerald-400" /> 124 Delivered</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Next scheduled: Tomorrow</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-5 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Generation Volume</h3>
                <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white">108</span>
              </div>
            </div>
            <div className="h-20 w-full mt-2">
              <ReactECharts option={volumeChartOptions} style={{ height: "100%", width: "100%" }} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-5 shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Storage Usage</h3>
                <div className="text-xs text-gray-500 mt-1">Report Archives</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white">4.2 GB</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                 <div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" style={{ width: '35%' }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>35% utilized</span>
                <span>12 GB Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="rounded-2xl border border-white/5 bg-[#0f1115] shadow-2xl flex flex-col h-[600px]">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
             <h3 className="text-sm font-bold text-white">Report Archives</h3>
             <div className="relative w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search reports..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-8 bg-black/40 border border-white/10 rounded-md pl-9 pr-3 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-gray-600"
               />
             </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 border-b border-white/5 sticky top-0 bg-[#0f1115] z-10">
                <tr>
                  <th className="px-5 py-3 font-medium">Report ID</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Generated</th>
                  <th className="px-5 py-3 font-medium">Size</th>
                  <th className="px-5 py-3 font-medium">Author</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3 text-gray-400 font-mono">{report.id}</td>
                    <td className="px-5 py-3 text-gray-200 font-medium group-hover:text-white transition-colors">{report.name}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-bold border",
                        report.type === "PDF" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                        report.type === "CSV" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{report.date}</td>
                    <td className="px-5 py-3 text-gray-400 font-mono">{report.size}</td>
                    <td className="px-5 py-3 text-gray-400">{report.author}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors tooltip-trigger" title="View">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors tooltip-trigger" title="Download">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
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
