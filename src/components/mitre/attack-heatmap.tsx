"use client";

import { useState, useEffect } from "react";
import { ExternalLink, X, Shield, ChevronRight } from "lucide-react";
import { MITRE_MATRIX_DATA, getTechniqueDetections, type MitreTechnique, type MitreTactic } from "@/lib/data-access/mitre";
import { SeverityPill } from "@/components/ui/severity-pill";
import { ExportButton } from "@/components/ui/export-button";
import { DrawerPanel } from "@/components/ui/drawer-panel";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import Link from "next/link";

// ── Heat color mapping (OKLCH) ────────────────────────────────────────────────
function getHeatStyle(count: number, maxCount: number): React.CSSProperties {
  if (count === 0) return {};
  const ratio = Math.min(count / maxCount, 1);
  // 0→surface, low→warning/orange, high→danger
  if (ratio < 0.05) return { background: "oklch(75% 0.15 70 / 0.15)" };
  if (ratio < 0.15) return { background: "oklch(72% 0.16 55 / 0.3)" };
  if (ratio < 0.35) return { background: "oklch(68% 0.18 40 / 0.45)" };
  if (ratio < 0.6)  return { background: "oklch(65% 0.2 30 / 0.55)" };
  return { background: "oklch(62% 0.22 25 / 0.7)" };
}

function getTextStyle(count: number, maxCount: number): string {
  const ratio = count / maxCount;
  if (ratio < 0.05) return "text-warning";
  if (ratio < 0.35) return "text-orange";
  return "text-danger";
}

// ── Technique Cell ─────────────────────────────────────────────────────────────
function TechniqueCell({
  technique,
  maxCount,
  onSelect,
}: {
  technique: MitreTechnique;
  maxCount: number;
  onSelect: (t: MitreTechnique) => void;
}) {
  const hasCount = technique.count > 0;
  return (
    <button
      onClick={() => onSelect(technique)}
      className={cn(
        "group w-full rounded text-left p-2 transition-all duration-150 border",
        hasCount
          ? "border-transparent hover:border-danger/30 cursor-pointer"
          : "border-border/30 cursor-default opacity-50",
      )}
      style={hasCount ? getHeatStyle(technique.count, maxCount) : {}}
      title={`${technique.name} (${technique.id}): ${technique.count} events`}
    >
      <div className="text-[10px] font-medium leading-tight text-fg/80 group-hover:text-fg line-clamp-2">
        {technique.name}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted">{technique.id}</span>
        {hasCount && (
          <span className={cn("font-mono text-[10px] font-semibold", getTextStyle(technique.count, maxCount))}>
            {technique.count}
          </span>
        )}
      </div>
    </button>
  );
}

// ── Technique Detail Drawer ────────────────────────────────────────────────────
function TechniqueDetailDrawer({
  technique,
  onClose,
}: {
  technique: MitreTechnique | null;
  onClose: () => void;
}) {
  const [detections, setDetections] = useState<Array<{ id: string; name: string; severity: string; time: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!technique || technique.count === 0) { setDetections([]); return; }
    setLoading(true);
    getTechniqueDetections(technique.id).then((r) => {
      setDetections(r);
      setLoading(false);
    });
  }, [technique]);

  return (
    <DrawerPanel
      open={!!technique}
      onClose={onClose}
      title={technique?.name}
      subtitle={technique?.id}
      width={400}
    >
      {technique && (
        <div className="px-6 py-5 space-y-5">
          {/* Count */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold font-mono"
              style={getHeatStyle(technique.count, MITRE_MATRIX_DATA.maxCount)}
            >
              <span className={getTextStyle(technique.count, MITRE_MATRIX_DATA.maxCount)}>
                {technique.count}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg">{technique.count} events detected</p>
              <p className="text-xs text-muted">Across your environment</p>
            </div>
          </div>

          {/* External link */}
          <a
            href={`https://attack.mitre.org/techniques/${technique.id.replace(".", "/")}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View on MITRE ATT&CK
          </a>

          {/* Related detections */}
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted">
              Related Detections
            </p>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-surface" />
                ))}
              </div>
            ) : detections.length === 0 ? (
              <p className="text-xs text-muted">No linked detections</p>
            ) : (
              <div className="space-y-2">
                {detections.map((d) => (
                  <div key={d.id} className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3">
                    <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-fg truncate">{d.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <SeverityPill severity={d.severity as "critical" | "high" | "medium" | "low"} size="xs" showDot={false} />
                        <span className="font-mono text-[10px] text-dimmed">
                          {format(parseISO(d.time), "HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter detections CTA */}
          <Link
            href="/detections"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent/10 px-4 py-2.5 text-[12px] font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Filter Detections by {technique.id}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </DrawerPanel>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function AttackHeatmap() {
  const matrix = MITRE_MATRIX_DATA;
  const [selectedTechnique, setSelectedTechnique] = useState<MitreTechnique | null>(null);

  return (
    <div className="space-y-4">
      {/* Scale legend */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-muted">Events / technique</span>
        <div className="flex items-center gap-0.5">
          <span className="text-[11px] text-dimmed">0</span>
          {[0.05, 0.15, 0.35, 0.6, 1].map((r, i) => (
            <div
              key={i}
              className="h-4 w-8 rounded-sm"
              style={getHeatStyle(Math.floor(r * matrix.maxCount), matrix.maxCount)}
            />
          ))}
          <span className="text-[11px] text-dimmed">{matrix.maxCount}</span>
        </div>
      </div>

      {/* Matrix grid */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${matrix.tactics.length}, minmax(160px, 1fr))` }}
        >
          {matrix.tactics.map((tactic: MitreTactic) => (
            <div key={tactic.id} className="flex flex-col gap-1">
              {/* Tactic header */}
              <div className="flex items-center justify-between rounded-md bg-fg/8 px-2 py-1.5">
                <span className="text-[11px] font-semibold text-fg">{tactic.name}</span>
                <span className="rounded-full bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                  {tactic.techniques.reduce((s, t) => s + t.count, 0)}
                </span>
              </div>

              {/* Techniques */}
              <div className="flex flex-col gap-0.5">
                {tactic.techniques.map((tech) => (
                  <TechniqueCell
                    key={tech.id}
                    technique={tech}
                    maxCount={matrix.maxCount}
                    onSelect={setSelectedTechnique}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail drawer */}
      <TechniqueDetailDrawer
        technique={selectedTechnique}
        onClose={() => setSelectedTechnique(null)}
      />
    </div>
  );
}
