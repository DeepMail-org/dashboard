"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import { FlaskConical, Loader2, CheckCircle, XCircle } from "lucide-react";

const DEMO_JOBS = [
  { id: "sb-001", file: "invoice_q4_2024.pdf", status: "analyzing" as const, progress: 67, malicious: null },
  { id: "sb-002", file: "setup_patch.exe", status: "completed" as const, progress: 100, malicious: true },
  { id: "sb-003", file: "report.docm", status: "analyzing" as const, progress: 34, malicious: null },
  { id: "sb-004", file: "image_archive.zip", status: "completed" as const, progress: 100, malicious: false },
  { id: "sb-005", file: "driver_update.msi", status: "queued" as const, progress: 0, malicious: null },
  { id: "sb-006", file: "macro_sheet.xlsm", status: "completed" as const, progress: 100, malicious: true },
];

export default function SandboxQueue({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const analyzing = DEMO_JOBS.filter((j) => j.status === "analyzing").length;
  const queued = DEMO_JOBS.filter((j) => j.status === "queued").length;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs text-muted">{analyzing} analyzing · {queued} queued</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
        {DEMO_JOBS.map((job) => (
          <div key={job.id} className="flex items-center gap-2.5 rounded-md border border-border/50 bg-surface/50 px-2.5 py-2">
            {job.status === "analyzing" && <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />}
            {job.status === "completed" && job.malicious && <XCircle className="h-3.5 w-3.5 text-danger" />}
            {job.status === "completed" && !job.malicious && <CheckCircle className="h-3.5 w-3.5 text-success" />}
            {job.status === "queued" && <div className="h-3.5 w-3.5 rounded-full border border-dimmed" />}
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-[11px] text-secondary">{job.file}</div>
              {job.status === "analyzing" && (
                <div className="mt-1 h-1 w-full rounded-full bg-border/50">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${job.progress}%` }} />
                </div>
              )}
            </div>
            <span className={`text-[10px] capitalize ${
              job.status === "completed" ? (job.malicious ? "text-danger" : "text-success") : "text-dimmed"
            }`}>
              {job.status === "completed" ? (job.malicious ? "malicious" : "clean") : job.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
