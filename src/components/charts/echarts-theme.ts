export const DEEPMAIL_ECHARTS_THEME = {
  backgroundColor: "transparent",
  textStyle: {
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "oklch(65% 0.01 280)",
    fontSize: 11,
  },
  title: {
    textStyle: {
      fontFamily: "'Space Grotesk', sans-serif",
      color: "oklch(98% 0 0)",
      fontSize: 14,
      fontWeight: 600,
    },
  },
  color: [
    "#a855f7", // accent purple
    "#10b981", // success green
    "#ef4444", // danger red
    "#eab308", // warning amber
    "#f97316", // orange
    "#3b82f6", // info blue
    "#8b5cf6", // violet
    "#06b6d4", // cyan
  ],
  legend: {
    textStyle: {
      color: "oklch(65% 0.01 280)",
      fontSize: 11,
    },
  },
  tooltip: {
    backgroundColor: "oklch(19% 0.005 280)",
    borderColor: "oklch(26% 0.01 280)",
    borderWidth: 1,
    textStyle: {
      color: "oklch(98% 0 0)",
      fontSize: 12,
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    extraCssText: "box-shadow: 0 4px 16px oklch(0% 0 0 / 0.5); border-radius: 8px;",
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: "oklch(26% 0.01 280)" } },
    axisTick: { show: false },
    axisLabel: {
      color: "oklch(65% 0.01 280)",
      fontSize: 11,
      fontFamily: "'JetBrains Mono', monospace",
    },
    splitLine: {
      lineStyle: { color: "oklch(26% 0.01 280)", opacity: 0.3, type: "dashed" },
    },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: "oklch(65% 0.01 280)",
      fontSize: 11,
      fontFamily: "'JetBrains Mono', monospace",
    },
    splitLine: {
      lineStyle: { color: "oklch(26% 0.01 280)", opacity: 0.3, type: "dashed" },
    },
  },
  grid: {
    left: 48,
    right: 16,
    top: 32,
    bottom: 32,
    containLabel: false,
  },
  line: {
    smooth: true,
    lineStyle: { width: 2 },
    symbolSize: 4,
    emphasis: { lineStyle: { width: 3 } },
  },
  bar: {
    barMaxWidth: 24,
    itemStyle: { borderRadius: [3, 3, 0, 0] },
  },
  pie: {
    borderWidth: 0,
    label: { color: "oklch(65% 0.01 280)", fontSize: 11 },
  },
  radar: {
    axisLine: { lineStyle: { color: "oklch(26% 0.01 280)" } },
    splitLine: { lineStyle: { color: "oklch(26% 0.01 280)", opacity: 0.3 } },
    splitArea: { show: false },
    axisName: {
      color: "oklch(65% 0.01 280)",
      fontSize: 11,
    },
  },
  gauge: {
    axisLine: {
      lineStyle: {
        width: 12,
        color: [
          [0.3, "#10b981"],
          [0.7, "#eab308"],
          [1, "#ef4444"],
        ],
      },
    },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
    pointer: { width: 4 },
    title: { color: "oklch(65% 0.01 280)", fontSize: 12 },
    detail: {
      color: "oklch(98% 0 0)",
      fontSize: 28,
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700,
    },
  },
} as const;
