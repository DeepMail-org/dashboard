"use client";

import type { WidgetProps } from "@/lib/dashboard/types";

const DEMO_SENDERS = [
  { email: "noreply@acc0unt-verify.com", domain: "acc0unt-verify.com", count: 47, risk: 98 },
  { email: "billing@fake-invoices.net", domain: "fake-invoices.net", count: 34, risk: 92 },
  { email: "admin@phish-corporate.org", domain: "phish-corporate.org", count: 28, risk: 87 },
  { email: "support@cred-harvest.com", domain: "cred-harvest.com", count: 21, risk: 84 },
  { email: "hr@spoofed-corp.io", domain: "spoofed-corp.io", count: 16, risk: 79 },
  { email: "security@bank-phish.com", domain: "bank-phish.com", count: 12, risk: 76 },
];

export default function TopMaliciousSenders({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const maxCount = DEMO_SENDERS[0]?.count ?? 1;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
        Top Malicious Senders (7d)
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {DEMO_SENDERS.map((s, i) => (
          <div key={s.email} className="group">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0 font-mono text-dimmed">{i + 1}.</span>
                <span className="truncate text-secondary">{s.domain}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-muted">{s.count}</span>
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                  s.risk >= 90 ? "bg-danger/20 text-danger" : "bg-orange/20 text-orange"
                }`}>
                  {s.risk}
                </span>
              </div>
            </div>
            <div className="mt-1 h-1 w-full rounded-full bg-border/50">
              <div
                className="h-full rounded-full bg-danger/60 transition-all"
                style={{ width: `${(s.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
