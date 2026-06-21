"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";

import { MITRE_MATRIX_DATA } from "@/lib/data-access/mitre";
import { AttackHeatmap } from "@/components/mitre/attack-heatmap";
import { ExportButton } from "@/components/ui/export-button";
import { Grid3x3 } from "lucide-react";

export default function MitreAttackPage() {
  const matrix = MITRE_MATRIX_DATA;
  const totalEvents = matrix.tactics.reduce(
    (sum, t) => sum + t.techniques.reduce((s, tech) => s + tech.count, 0),
    0,
  );
  const coveredTechniques = matrix.tactics.reduce(
    (sum, t) => sum + t.techniques.filter((tech) => tech.count > 0).length,
    0,
  );
  const totalTechniques = matrix.tactics.reduce(
    (sum, t) => sum + t.techniques.length,
    0,
  );

  const STATS = [
    { label: "Total Events",          value: totalEvents.toString(),              color: "text-fg" },
    { label: "Techniques Covered",    value: `${coveredTechniques}/${totalTechniques}`, color: "text-accent" },
    { label: "Tactics Covered",       value: matrix.tactics.length.toString(),    color: "text-success" },
    { label: "Peak Technique",        value: "T1056 (146)",                        color: "text-danger" },
  ];

  return (
    <PageWrapper
      header={
        <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5 text-accent" />
            <h1 className="dm-heading text-xl text-fg">MITRE ATT&amp;CK® Matrix</h1>
          </div>
          <p className="mt-1 text-xs text-muted">
            Heatmap of detected techniques across your environment. Click any cell for details.
          </p>
        </div>
        <ExportButton
          onExport={(fmt) => {
            void fmt;
            return new Promise((r) => setTimeout(r, 600));
          }}
          formats={["csv", "json"]}
        />
        </div>
      }
    >
      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 px-4 py-3 shadow-card">
            <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="mt-0.5 text-[11px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <AttackHeatmap />
    </PageWrapper>
  );
}
