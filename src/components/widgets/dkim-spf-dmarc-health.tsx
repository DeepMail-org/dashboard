"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import { CheckCircle, XCircle } from "lucide-react";

const DEMO_AUTH = {
  dkim: { pass: 11420, fail: 127, total: 11547 },
  spf: { pass: 11302, fail: 245, total: 11547 },
  dmarc: { pass: 10980, fail: 567, total: 11547 },
};

function HealthRow({ label, pass, total }: { label: string; pass: number; total: number }) {
  const rate = total > 0 ? (pass / total) * 100 : 0;
  const isHealthy = rate >= 95;

  return (
    <div className="rounded-lg border border-border/50 bg-surface/50 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <CheckCircle className="h-4 w-4 text-success" />
          ) : (
            <XCircle className="h-4 w-4 text-warning" />
          )}
          <span className="font-display text-sm font-semibold text-fg">{label}</span>
        </div>
        <span className={`font-mono text-sm font-bold ${isHealthy ? "text-success" : "text-warning"}`}>
          {rate.toFixed(1)}%
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-border/50">
        <div
          className={`h-full rounded-full transition-all ${isHealthy ? "bg-success" : "bg-warning"}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-dimmed">
        <span>{pass.toLocaleString()} pass</span>
        <span>{(total - pass).toLocaleString()} fail</span>
      </div>
    </div>
  );
}

export default function DkimSpfDmarcHealth({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full flex-col gap-2">
      <HealthRow label="DKIM" pass={DEMO_AUTH.dkim.pass} total={DEMO_AUTH.dkim.total} />
      <HealthRow label="SPF" pass={DEMO_AUTH.spf.pass} total={DEMO_AUTH.spf.total} />
      <HealthRow label="DMARC" pass={DEMO_AUTH.dmarc.pass} total={DEMO_AUTH.dmarc.total} />
    </div>
  );
}
