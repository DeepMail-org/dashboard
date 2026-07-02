"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { arc, pie, type PieArcDatum } from "d3-shape";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import NumberFlow, { type Format as NumberFlowFormat } from "@number-flow/react";

export interface PieData {
  label: string;
  value: number;
  color?: string;
  fill?: string;
}

export interface PieChartProps {
  data: PieData[];
  size?: number;
  innerRadius?: number;
  padAngle?: number;
  cornerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  hoveredIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
  className?: string;
  children: React.ReactNode;
}

interface PieChartContextValue {
  data: PieData[];
  arcs: PieArcDatum<PieData>[];
  outerRadius: number;
  innerRadius: number;
  cornerRadius: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

const PieChartContext = createContext<PieChartContextValue | null>(null);

export function usePieChart() {
  const ctx = useContext(PieChartContext);
  if (!ctx) throw new Error("Pie components must be rendered inside <PieChart>");
  return ctx;
}

export function PieChart({
  data,
  size,
  innerRadius = 0,
  padAngle = 0,
  cornerRadius = 0,
  startAngle = -Math.PI / 2,
  endAngle = (3 * Math.PI) / 2,
  hoveredIndex: controlledHoveredIndex,
  onHoverChange,
  className,
  children,
}: PieChartProps) {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<number | null>(null);
  
  const isControlled = controlledHoveredIndex !== undefined;
  const hoveredIndex = isControlled ? controlledHoveredIndex : internalHoveredIndex;
  
  const setHoveredIndex = (index: number | null) => {
    if (!isControlled) setInternalHoveredIndex(index);
    if (onHoverChange) onHoverChange(index);
  };

  const pieGenerator = useMemo(
    () => pie<PieData>()
      .startAngle(startAngle)
      .endAngle(endAngle)
      .padAngle(padAngle)
      .value((d) => d.value)
      .sort(null),
    [startAngle, endAngle, padAngle]
  );

  const arcs = useMemo(() => pieGenerator(data), [pieGenerator, data]);

  const renderContent = (width: number, height: number) => {
    const actualSize = size || Math.min(width, height);
    if (actualSize <= 0) return null;
    
    const outerRadius = actualSize / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    const actualInnerRadius = Math.min(innerRadius, Math.max(0, outerRadius * 0.8));

    const contextValue: PieChartContextValue = {
      data,
      arcs,
      outerRadius,
      innerRadius: actualInnerRadius,
      cornerRadius,
      hoveredIndex,
      setHoveredIndex,
    };

    return (
      <PieChartContext.Provider value={contextValue}>
        <svg width={width} height={height} className="overflow-visible">
          <g transform={`translate(${centerX}, ${centerY})`}>
            {children}
          </g>
        </svg>
      </PieChartContext.Provider>
    );
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      {size ? (
        renderContent(size, size)
      ) : (
        <ParentSize>
          {({ width, height }) => renderContent(width, height)}
        </ParentSize>
      )}
    </div>
  );
}

export interface PieSliceProps {
  index: number;
  color?: string;
  fill?: string;
  animate?: boolean;
  showGlow?: boolean;
  hoverEffect?: "translate" | "grow" | "none";
  hoverOffset?: number;
}

export function PieSlice({
  index,
  color,
  fill,
  animate = true,
  showGlow = true,
  hoverEffect = "translate",
  hoverOffset = 10,
}: PieSliceProps) {
  const { arcs, outerRadius, innerRadius, cornerRadius, hoveredIndex, setHoveredIndex } = usePieChart();
  const arcDatum = arcs[index];
  if (!arcDatum) return null;

  const isHovered = hoveredIndex === index;
  const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

  const arcGenerator = arc<PieArcDatum<PieData>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(cornerRadius);

  const path = arcGenerator(arcDatum) || "";

  // Color resolution: custom color > data.color > theme fallback
  const resolvedColor = color || arcDatum.data.color || `var(--chart-${(index % 5) + 1})`;
  const resolvedFill = fill || arcDatum.data.fill || resolvedColor;

  return (
    <motion.path
      d={path}
      fill={resolvedFill}
      initial={false}
      animate={{ 
        opacity: isOtherHovered ? 0.4 : 1, 
        scale: isHovered && hoverEffect === "grow" ? 1.05 : 1,
        x: isHovered && hoverEffect === "translate" ? Math.sin(arcDatum.startAngle + (arcDatum.endAngle - arcDatum.startAngle) / 2) * hoverOffset : 0,
        y: isHovered && hoverEffect === "translate" ? -Math.cos(arcDatum.startAngle + (arcDatum.endAngle - arcDatum.startAngle) / 2) * hoverOffset : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      style={{
        transformOrigin: "center center",
        filter: isHovered && showGlow ? `drop-shadow(0 0 8px ${resolvedColor}80)` : "none",
        cursor: "pointer",
        outline: "none",
      }}
    />
  );
}

export interface PieCenterProps {
  defaultLabel?: string;
  formatOptions?: NumberFlowFormat;
  prefix?: string;
  suffix?: string;
  children?: (props: { hoveredData: PieData | null; total: number }) => React.ReactNode;
  className?: string;
}

export function PieCenter({
  defaultLabel = "Total",
  formatOptions,
  prefix = "",
  suffix = "",
  children,
  className,
}: PieCenterProps) {
  const { data, innerRadius, hoveredIndex } = usePieChart();

  if (innerRadius <= 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null;
  const displayValue = hoveredData ? hoveredData.value : total;
  const displayLabel = hoveredData ? hoveredData.label : defaultLabel;

  if (children) {
    return (
      <foreignObject x={-innerRadius} y={-innerRadius} width={innerRadius * 2} height={innerRadius * 2}>
        <div className={cn("flex h-full w-full flex-col items-center justify-center", className)}>
          {children({ hoveredData, total })}
        </div>
      </foreignObject>
    );
  }

  return (
    <foreignObject x={-innerRadius} y={-innerRadius} width={innerRadius * 2} height={innerRadius * 2}>
      <div className={cn("flex h-full w-full flex-col items-center justify-center pointer-events-none", className)}>
        <span className="text-xs text-muted-foreground font-medium">{displayLabel}</span>
        <div className="flex items-center text-xl font-bold text-foreground">
          {prefix && <span>{prefix}</span>}
          <NumberFlow value={displayValue} format={formatOptions} />
          {suffix && <span>{suffix}</span>}
        </div>
      </div>
    </foreignObject>
  );
}
