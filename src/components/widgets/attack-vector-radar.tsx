"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import { RadarChart } from "@/components/charts/radar-chart";
import { RadarGrid } from "@/components/charts/radar-grid";
import { RadarAxis } from "@/components/charts/radar-axis";
import { RadarLabels } from "@/components/charts/radar-labels";
import { RadarArea } from "@/components/charts/radar-area";

const metrics = [
  { key: "phishing", label: "Phishing" },
  { key: "malware", label: "Malware" },
  { key: "bec", label: "BEC" },
  { key: "ransomware", label: "Ransomware" },
  { key: "dataExfil", label: "Data Exfil" },
  { key: "zeroDay", label: "Zero-Day" },
];

const radarData = [
  {
    label: "Attack Vectors",
    color: "#a855f7",
    values: { phishing: 85, malware: 62, bec: 48, ransomware: 33, dataExfil: 27, zeroDay: 15 }
  }
];

export default function AttackVectorRadar({ isLoading, containerWidth }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const isCompact = containerWidth < 300;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex-1 min-h-0 relative flex items-center justify-center">
        <div className="absolute inset-0">
          <RadarChart data={radarData} metrics={metrics}>
            <RadarGrid showLabels={false} />
            <RadarAxis />
            <RadarLabels offset={isCompact ? 16 : 24} fontSize={isCompact ? 9 : 10} />
            {radarData.map((item, index) => (
              <RadarArea key={item.label} index={index} showPoints={!isCompact} />
            ))}
          </RadarChart>
        </div>
      </div>
    </div>
  );
}
