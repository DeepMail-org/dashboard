"use client";

import { FileText, Download, Clock, Plus, Calendar } from "lucide-react";

const SCHEDULED_REPORTS = [
  { name: "Weekly Threat Summary", frequency: "Every Monday 9:00 AM", lastRun: "May 12, 2026", recipients: 5, format: "PDF" },
  { name: "Monthly Executive Brief", frequency: "1st of month", lastRun: "May 1, 2026", recipients: 3, format: "PDF" },
  { name: "Daily Detection Log", frequency: "Daily 6:00 AM", lastRun: "May 16, 2026", recipients: 8, format: "CSV" },
  { name: "Quarterly Compliance", frequency: "Every quarter", lastRun: "Apr 1, 2026", recipients: 2, format: "PDF" },
];

const RECENT_EXPORTS = [
  { name: "threat-summary-2026-w20.pdf", generated: "May 13, 2026 09:01", size: "2.4 MB", type: "Scheduled" },
  { name: "detection-log-20260516.csv", generated: "May 16, 2026 06:00", size: "8.1 MB", type: "Scheduled" },
  { name: "case-export-CAS-8821.pdf", generated: "May 16, 2026 21:50", size: "340 KB", type: "On-demand" },
  { name: "ioc-blocklist-2026-05.json", generated: "May 15, 2026 14:20", size: "1.2 MB", type: "On-demand" },
  { name: "sandbox-report-a8f3c2d1.pdf", generated: "May 16, 2026 20:58", size: "890 KB", type: "On-demand" },
];

export default function ReportsPage() {
  return (
    <div className="mx-auto w-full max-w-350 p-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-lg font-medium text-fg">Reports</h1>
        <button className="flex items-center gap-2 rounded-md bg-fg px-4 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-90">
          <Plus className="h-3.5 w-3.5" />
          New Report
        </button>
      </div>

      {/* Scheduled Reports */}
      <h2 className="mb-3 text-sm font-medium text-fg">Scheduled Reports</h2>
      <div className="mb-8 grid grid-cols-2 gap-4">
        {SCHEDULED_REPORTS.map((r) => (
          <div key={r.name} className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-hover">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-fg">{r.name}</span>
              </div>
              <span className="rounded bg-fg/5 px-2 py-0.5 text-[10px] text-muted">{r.format}</span>
            </div>
            <div className="space-y-1 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {r.frequency}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Last run: {r.lastRun}
              </div>
              <div>{r.recipients} recipients</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Exports */}
      <h2 className="mb-3 text-sm font-medium text-fg">Recent Exports</h2>
      <div className="overflow-hidden rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 shadow-card">
        <table className="w-full text-left">
          <thead>
            <tr>
              {["Filename", "Generated", "Size", "Type", ""].map((col) => (
                <th key={col} className="border-b border-border bg-fg/2 px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-muted">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_EXPORTS.map((e) => (
              <tr key={e.name} className="transition-colors hover:bg-fg/3">
                <td className="border-b border-fg/3 px-5 py-3 font-mono text-xs text-fg">{e.name}</td>
                <td className="border-b border-fg/3 px-5 py-3 text-xs text-muted">{e.generated}</td>
                <td className="border-b border-fg/3 px-5 py-3 font-mono text-xs text-muted">{e.size}</td>
                <td className="border-b border-fg/3 px-5 py-3">
                  <span className={`rounded px-2 py-0.5 text-[10px] ${
                    e.type === "Scheduled" ? "bg-accent/10 text-accent" : "bg-fg/5 text-muted"
                  }`}>
                    {e.type}
                  </span>
                </td>
                <td className="border-b border-fg/3 px-5 py-3 text-right">
                  <button className="flex items-center gap-1 text-[11px] text-accent hover:underline">
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
