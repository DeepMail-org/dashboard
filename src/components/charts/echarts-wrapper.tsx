"use client";

import { useEffect, useRef, memo } from "react";
import { DEEPMAIL_ECHARTS_THEME } from "./echarts-theme";
interface EChartsWrapperProps {
  option: Record<string, unknown>;
  style?: React.CSSProperties;
  className?: string;
}

export const EChartsWrapper = memo(function EChartsWrapper({
  option,
  style,
  className,
}: EChartsWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<import("echarts").ECharts | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const echarts = await import("echarts");
      if (!mounted || !containerRef.current) return;

      if (!chartRef.current) {
        echarts.registerTheme("deepmail", DEEPMAIL_ECHARTS_THEME);
        chartRef.current = echarts.init(containerRef.current, "deepmail", {
          renderer: "canvas",
          devicePixelRatio: Math.max(window.devicePixelRatio ?? 1, 2),
        });
      }

      chartRef.current.setOption(option, { notMerge: true });
    }

    init();

    return () => {
      mounted = false;
    };
  }, [option]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      chartRef.current?.resize({ animation: { duration: 200 } });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
});
