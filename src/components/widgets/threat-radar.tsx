"use client";

import { useState } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";

const BLIPS = [
  { cx: 130, cy: 55, r: 4, color: "#ef4444", delay: 0, severity: "Critical" },
  { cx: 60, cy: 75, r: 3, color: "#f97316", delay: 0.5, severity: "High" },
  { cx: 145, cy: 120, r: 5, color: "#ef4444", delay: 1, severity: "Critical" },
  { cx: 80, cy: 140, r: 3, color: "#eab308", delay: 1.5, severity: "Medium" },
  { cx: 120, cy: 85, r: 3, color: "#f97316", delay: 0.8, severity: "High" },
  { cx: 50, cy: 110, r: 4, color: "#ef4444", delay: 1.2, severity: "Critical" },
];

const LEGEND = [
  { color: "#ef4444", label: "Critical", count: 3 },
  { color: "#f97316", label: "High", count: 2 },
  { color: "#eab308", label: "Medium", count: 1 },
];

export default function ThreatRadar({ isLoading, containerWidth }: WidgetProps) {
  const [hoveredBlip, setHoveredBlip] = useState<number | null>(null);

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const isCompact = containerWidth < 300;

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      <svg viewBox="0 0 200 200" className="h-full max-h-full w-auto">
        <defs>
          <radialGradient id="sweepGrad">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
          <style>{`
            @keyframes radar-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes radar-blip { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
            .sweep-anim { animation: radar-sweep 4s linear infinite; transform-origin: 100px 100px; }
            .blip-anim { animation: radar-blip 2s ease-in-out infinite; }
          `}</style>
        </defs>

        {[90, 65, 40, 15].map((r) => (
          <circle
            key={r}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={r === 15 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"}
            strokeWidth="1"
          />
        ))}

        <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        <g className="sweep-anim">
          <path
            d="M100,100 L100,10 A90,90 0 0,1 163,37 Z"
            fill="url(#sweepGrad)"
            opacity="0.6"
          />
        </g>

        {BLIPS.map((b, i) => (
          <g key={i}>
            <circle
              cx={b.cx}
              cy={b.cy}
              r={hoveredBlip === i ? b.r + 3 : b.r}
              fill={b.color}
              className="blip-anim"
              opacity={hoveredBlip === i ? 1 : 0.9}
              style={{
                animationDelay: `${b.delay}s`,
                cursor: "pointer",
                transition: "r 0.15s ease",
                filter: hoveredBlip === i ? `drop-shadow(0 0 8px ${b.color})` : "none",
              }}
              onMouseEnter={() => setHoveredBlip(i)}
              onMouseLeave={() => setHoveredBlip(null)}
            />
            {hoveredBlip === i && (
              <g>
                <rect
                  x={b.cx + 8}
                  y={b.cy - 14}
                  width="60"
                  height="20"
                  rx="4"
                  fill="rgba(0,0,0,0.85)"
                  stroke={b.color}
                  strokeWidth="0.5"
                />
                <text
                  x={b.cx + 38}
                  y={b.cy}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {b.severity}
                </text>
              </g>
            )}
          </g>
        ))}

        <circle cx="100" cy="100" r="3" fill="#10b981" opacity="0.8" />
      </svg>

      <div className={`absolute right-2 top-2 flex flex-col gap-1.5 ${isCompact ? "hidden" : ""}`}>
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-[10px] text-muted">
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
            />
            {item.label} ({item.count})
          </div>
        ))}
      </div>
    </div>
  );
}
