function getCSSVar(name: string, fallback: string): string {
	if (typeof window === "undefined") return fallback;
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim();
	return value || fallback;
}

export function getEchartsTheme() {
	const fg = getCSSVar("--color-fg", "oklch(98% 0 0)");
	const muted = getCSSVar("--color-muted", "oklch(65% 0.01 280)");
	const dimmed = getCSSVar("--color-dimmed", "oklch(45% 0.01 280)");
	const border = getCSSVar("--color-border", "oklch(26% 0.01 280)");
	const surface = getCSSVar("--color-surface", "oklch(19% 0.005 280)");
	const accent = getCSSVar("--color-accent", "oklch(60% 0.15 280)");

	return {
		backgroundColor: "transparent",
		textStyle: {
			fontFamily: "'Inter', system-ui, sans-serif",
			color: muted,
			fontSize: 11,
		},
		title: {
			textStyle: {
				fontFamily: "'Space Grotesk', sans-serif",
				color: fg,
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
				color: muted,
				fontSize: 11,
			},
		},
		tooltip: {
			backgroundColor: surface,
			borderColor: border,
			borderWidth: 1,
			textStyle: {
				color: fg,
				fontSize: 12,
				fontFamily: "'Inter', system-ui, sans-serif",
			},
			extraCssText:
				"box-shadow: 0 4px 16px oklch(0% 0 0 / 0.25); border-radius: 8px;",
		},
		categoryAxis: {
			axisLine: { lineStyle: { color: border } },
			axisTick: { show: false },
			axisLabel: {
				color: muted,
				fontSize: 11,
				fontFamily: "'JetBrains Mono', monospace",
			},
			splitLine: {
				lineStyle: {
					color: border,
					opacity: 0.3,
					type: "dashed" as const,
				},
			},
		},
		valueAxis: {
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: {
				color: muted,
				fontSize: 11,
				fontFamily: "'JetBrains Mono', monospace",
			},
			splitLine: {
				lineStyle: {
					color: border,
					opacity: 0.3,
					type: "dashed" as const,
				},
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
			label: { color: muted, fontSize: 11 },
		},
		radar: {
			axisLine: { lineStyle: { color: border } },
			splitLine: { lineStyle: { color: border, opacity: 0.3 } },
			splitArea: { show: false },
			axisName: {
				color: muted,
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
			title: { color: muted, fontSize: 12 },
			detail: {
				color: fg,
				fontSize: 28,
				fontFamily: "'Space Grotesk', sans-serif",
				fontWeight: 700,
			},
		},
	};
}

// Keep static export for backward compat during SSR — but prefer getEchartsTheme()
const DEEPMAIL_ECHARTS_THEME = {
	backgroundColor: "transparent",
	textStyle: {
		fontFamily: "'Inter', system-ui, sans-serif",
		color: "var(--color-muted, oklch(65% 0.01 280))",
		fontSize: 11,
	},
	title: {
		textStyle: {
			fontFamily: "'Space Grotesk', sans-serif",
			color: "var(--color-fg, oklch(98% 0 0))",
			fontSize: 14,
			fontWeight: 600,
		},
	},
	color: [
		"#a855f7",
		"#10b981",
		"#ef4444",
		"#eab308",
		"#f97316",
		"#3b82f6",
		"#8b5cf6",
		"#06b6d4",
	],
	legend: {
		textStyle: {
			color: "var(--color-muted, oklch(65% 0.01 280))",
			fontSize: 11,
		},
	},
	tooltip: {
		backgroundColor: "var(--color-surface, oklch(19% 0.005 280))",
		borderColor: "var(--color-border, oklch(26% 0.01 280))",
		borderWidth: 1,
		textStyle: { color: "var(--color-fg, oklch(98% 0 0))", fontSize: 12 },
		extraCssText:
			"box-shadow: 0 4px 16px oklch(0% 0 0 / 0.25); border-radius: 8px;",
	},
	categoryAxis: {
		axisLine: {
			lineStyle: { color: "var(--color-border, oklch(26% 0.01 280))" },
		},
		axisTick: { show: false },
		axisLabel: {
			color: "var(--color-muted)",
			fontSize: 11,
			fontFamily: "'JetBrains Mono', monospace",
		},
		splitLine: {
			lineStyle: {
				color: "var(--color-border, oklch(26% 0.01 280))",
				opacity: 0.3,
				type: "dashed" as const,
			},
		},
	},
	valueAxis: {
		axisLine: { show: false },
		axisTick: { show: false },
		axisLabel: {
			color: "var(--color-muted)",
			fontSize: 11,
			fontFamily: "'JetBrains Mono', monospace",
		},
		splitLine: {
			lineStyle: {
				color: "var(--color-border)",
				opacity: 0.3,
				type: "dashed" as const,
			},
		},
	},
	grid: { left: 48, right: 16, top: 32, bottom: 32, containLabel: false },
	line: {
		smooth: true,
		lineStyle: { width: 2 },
		symbolSize: 4,
		emphasis: { lineStyle: { width: 3 } },
	},
	bar: { barMaxWidth: 24, itemStyle: { borderRadius: [3, 3, 0, 0] } },
	pie: {
		borderWidth: 0,
		label: { color: "var(--color-muted)", fontSize: 11 },
	},
	radar: {
		axisLine: { lineStyle: { color: "var(--color-border)" } },
		splitLine: {
			lineStyle: { color: "var(--color-border)", opacity: 0.3 },
		},
		splitArea: { show: false },
		axisName: { color: "var(--color-muted)", fontSize: 11 },
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
		title: { color: "var(--color-muted)", fontSize: 12 },
		detail: {
			color: "var(--color-fg)",
			fontSize: 28,
			fontFamily: "'Space Grotesk', sans-serif",
			fontWeight: 700,
		},
	},
} as const;
