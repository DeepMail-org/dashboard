"use client";

import { useState } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";

const CATEGORIES = [
  { label: "Phishing / BEC", value: 15_000, pct: 85, color: "rgba(168,85,247,0.8)" },
  { label: "Malware Attachment", value: 10_000, pct: 65, color: "rgba(139,92,246,0.8)" },
  { label: "C2 Callbacks", value: 7_200, pct: 45, color: "rgba(124,58,237,0.8)" },
  { label: "Credential Harvest", value: 5_000, pct: 30, color: "rgba(109,40,217,0.8)" },
  { label: "Spam / Graymail", value: 14_000, pct: 80, color: "rgba(147,51,234,0.8)" },
];

function formatCount(n: number): string {
  return n >= 1_000 ? `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k` : String(n);
}

export default function TopAlertCategories({ isLoading, containerWidth }: WidgetProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const isCompact = containerWidth < 350;
  const labelWidth = isCompact ? "w-24" : "w-36";

  return (
    <div className="flex h-full flex-col justify-center gap-2.5">
      {CATEGORIES.map((cat, i) => {
        const isHovered = hoveredIdx === i;
        return (
          <div
            key={cat.label}
            className="flex items-center gap-3 cursor-default transition-all duration-150"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ transform: isHovered ? "translateX(2px)" : "none" }}
          >
            <span className={`${labelWidth} shrink-0 truncate text-xs transition-colors ${isHovered ? "text-fg" : "text-muted"}`}>
              {cat.label}
            </span>
            <div className="relative flex-1 h-3 rounded-md border border-fg/5 bg-fg/3 overflow-hidden">
              <div
                className="h-full rounded-md transition-all duration-300"
                style={{
                  width: `${cat.pct}%`,
                  background: `linear-gradient(90deg, ${cat.color.replace("0.8", "0.3")}, ${cat.color})`,
                  boxShadow: isHovered
                    ? `0 0 16px ${cat.color.replace("0.8", "0.5")}`
                    : `0 0 12px ${cat.color.replace("0.8", "0.3")}`,
                }}
              />
              <span className={`absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] transition-colors ${isHovered ? "text-white" : "text-white/80"}`}>
                {formatCount(cat.value)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
