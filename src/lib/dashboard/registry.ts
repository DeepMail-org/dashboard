import type { WidgetDefinition, WidgetCategory } from "./types";

class WidgetRegistry {
  private widgets = new Map<string, WidgetDefinition>();
  private listeners = new Set<() => void>();

  register(definition: WidgetDefinition): void {
    this.widgets.set(definition.id, definition);
    this.notify();
  }

  unregister(id: string): void {
    this.widgets.delete(id);
    this.notify();
  }

  get(id: string): WidgetDefinition | undefined {
    return this.widgets.get(id);
  }

  getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }

  getByCategory(): Map<WidgetCategory, WidgetDefinition[]> {
    const grouped = new Map<WidgetCategory, WidgetDefinition[]>();
    for (const w of this.widgets.values()) {
      const list = grouped.get(w.category) ?? [];
      list.push(w);
      grouped.set(w.category, list);
    }
    return grouped;
  }

  getDefaults(): WidgetDefinition[] {
    return this.getAll().filter((w) => w.isDefault);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): Map<string, WidgetDefinition> {
    return this.widgets;
  }

  private notify(): void {
    for (const fn of this.listeners) fn();
  }
}

export const widgetRegistry = new WidgetRegistry();

function registerBuiltinWidgets(): void {
  widgetRegistry.register({
    id: "threat-score",
    name: "Threat Score Gauge",
    description: "Aggregate threat detection score",
    icon: "ShieldCheck",
    category: "core",
    size: { default: { w: 3, h: 2 }, min: { w: 2, h: 2 }, max: { w: 6, h: 4 } },
    dataSource: { type: "rest", endpoint: "/dashboard", pollInterval: 60_000, staleTime: 30_000 },
    loader: () => import("@/components/widgets/threat-score-gauge"),
    isDefault: true,
    tags: ["threat", "score", "gauge", "overview"],
  });

  widgetRegistry.register({
    id: "email-volume",
    name: "Email Volume Timeline",
    description: "Inbound email volume over time",
    icon: "BarChart3",
    category: "core",
    size: { default: { w: 5, h: 2 }, min: { w: 3, h: 2 }, max: { w: 12, h: 4 } },
    dataSource: { type: "rest", endpoint: "/dashboard", pollInterval: 30_000 },
    loader: () => import("@/components/widgets/email-volume-timeline"),
    isDefault: true,
    tags: ["email", "volume", "timeline", "chart"],
  });

  widgetRegistry.register({
    id: "severity-breakdown",
    name: "Severity Breakdown",
    description: "Threat severity distribution",
    icon: "PieChart",
    category: "core",
    size: { default: { w: 4, h: 2 }, min: { w: 2, h: 2 }, max: { w: 6, h: 4 } },
    dataSource: { type: "rest", endpoint: "/dashboard", pollInterval: 60_000 },
    loader: () => import("@/components/widgets/severity-breakdown"),
    isDefault: true,
    tags: ["severity", "breakdown", "donut", "chart"],
  });

  widgetRegistry.register({
    id: "recent-threats",
    name: "Recent Threats",
    description: "Live threat feed with severity indicators",
    icon: "AlertTriangle",
    category: "core",
    size: { default: { w: 7, h: 3 }, min: { w: 3, h: 2 }, max: { w: 12, h: 6 } },
    dataSource: { type: "websocket", channel: "threats", initialFetchEndpoint: "/dashboard/threats" },
    loader: () => import("@/components/widgets/recent-threats-table"),
    isDefault: true,
    tags: ["threats", "recent", "table", "live"],
  });

  widgetRegistry.register({
    id: "pipeline-status",
    name: "Pipeline Status",
    description: "Real-time analysis pipeline health",
    icon: "Workflow",
    category: "core",
    size: { default: { w: 5, h: 3 }, min: { w: 3, h: 2 }, max: { w: 8, h: 4 } },
    dataSource: { type: "websocket", channel: "pipeline" },
    loader: () => import("@/components/widgets/pipeline-status"),
    isDefault: true,
    tags: ["pipeline", "status", "health", "processing"],
  });

  widgetRegistry.register({
    id: "geo-threat-map",
    name: "Geo Threat Map",
    description: "Interactive global threat map with clustering, arc visualization, and rich popups. Expandable to full-page view.",
    icon: "Globe",
    category: "intelligence",
    size: { default: { w: 5, h: 3 }, min: { w: 3, h: 2 }, max: { w: 12, h: 6 } },
    dataSource: { type: "websocket", channel: "geo_threats" },
    loader: () => import("@/components/widgets/geo-threat-map"),
    isDefault: false,
    tags: ["geo", "map", "threats", "clustering", "arcs", "interactive"],
  });

  widgetRegistry.register({
    id: "threat-origins",
    name: "Threat Origins",
    description: "Top threat source countries ranked by volume",
    icon: "MapPin",
    category: "intelligence",
    size: { default: { w: 4, h: 3 }, min: { w: 2, h: 2 }, max: { w: 6, h: 5 } },
    dataSource: { type: "rest", endpoint: "/dashboard/geo", pollInterval: 60_000 },
    loader: () => import("@/components/widgets/threat-origins"),
    isDefault: false,
    tags: ["threat", "origins", "countries", "geo"],
  });

  widgetRegistry.register({
    id: "attack-vector",
    name: "Attack Vector Radar",
    description: "Attack type distribution radar chart",
    icon: "Radar",
    category: "intelligence",
    size: { default: { w: 4, h: 3 }, min: { w: 2, h: 2 }, max: { w: 6, h: 4 } },
    dataSource: { type: "rest", endpoint: "/dashboard", pollInterval: 60_000 },
    loader: () => import("@/components/widgets/attack-vector-radar"),
    isDefault: false,
    tags: ["attack", "vector", "radar", "chart"],
  });

  widgetRegistry.register({
    id: "top-senders",
    name: "Top Malicious Senders",
    description: "Most frequent malicious email senders",
    icon: "UserX",
    category: "intelligence",
    size: { default: { w: 4, h: 3 }, min: { w: 2, h: 2 }, max: { w: 6, h: 5 } },
    dataSource: { type: "rest", endpoint: "/dashboard/senders", pollInterval: 60_000 },
    loader: () => import("@/components/widgets/top-malicious-senders"),
    isDefault: false,
    tags: ["senders", "malicious", "top", "list"],
  });

  widgetRegistry.register({
    id: "active-iocs",
    name: "Active IOCs",
    description: "Top indicators of compromise",
    icon: "Fingerprint",
    category: "intelligence",
    size: { default: { w: 4, h: 3 }, min: { w: 2, h: 2 }, max: { w: 6, h: 5 } },
    dataSource: { type: "rest", endpoint: "/dashboard/iocs", pollInterval: 60_000 },
    loader: () => import("@/components/widgets/active-iocs"),
    isDefault: false,
    tags: ["iocs", "indicators", "compromise"],
  });

  widgetRegistry.register({
    id: "dkim-spf-dmarc",
    name: "DKIM/SPF/DMARC Health",
    description: "Email authentication protocol status",
    icon: "CheckCircle",
    category: "operational",
    size: { default: { w: 3, h: 3 }, min: { w: 2, h: 2 }, max: { w: 6, h: 4 } },
    dataSource: { type: "rest", endpoint: "/dashboard/auth-health", pollInterval: 120_000 },
    loader: () => import("@/components/widgets/dkim-spf-dmarc-health"),
    isDefault: false,
    tags: ["dkim", "spf", "dmarc", "authentication"],
  });

  widgetRegistry.register({
    id: "threat-intel-feed",
    name: "Threat Intel Feed",
    description: "Aggregated threat intelligence feed",
    icon: "Rss",
    category: "intelligence",
    size: { default: { w: 4, h: 3 }, min: { w: 3, h: 2 }, max: { w: 8, h: 5 } },
    dataSource: { type: "websocket", channel: "threat_intel" },
    loader: () => import("@/components/widgets/threat-intel-feed"),
    isDefault: false,
    tags: ["threat", "intel", "feed", "live"],
  });

  widgetRegistry.register({
    id: "sandbox-queue",
    name: "Sandbox Queue",
    description: "File analysis job queue status",
    icon: "FlaskConical",
    category: "sandbox",
    size: { default: { w: 4, h: 3 }, min: { w: 3, h: 2 }, max: { w: 6, h: 4 } },
    dataSource: { type: "websocket", channel: "sandbox" },
    loader: () => import("@/components/widgets/sandbox-queue"),
    isDefault: false,
    tags: ["sandbox", "queue", "analysis"],
  });

  widgetRegistry.register({
    id: "infra-health",
    name: "Infrastructure Health",
    description: "Service health and uptime monitoring",
    icon: "Server",
    category: "platform",
    size: { default: { w: 6, h: 3 }, min: { w: 3, h: 2 }, max: { w: 12, h: 4 } },
    dataSource: { type: "rest", endpoint: "/health", pollInterval: 30_000 },
    loader: () => import("@/components/widgets/infra-health"),
    isDefault: false,
    tags: ["infrastructure", "health", "services", "uptime"],
  });

  widgetRegistry.register({
    id: "billing-usage",
    name: "Billing Usage",
    description: "Plan usage and quota overview",
    icon: "CreditCard",
    category: "platform",
    size: { default: { w: 6, h: 3 }, min: { w: 3, h: 2 }, max: { w: 8, h: 4 } },
    dataSource: { type: "rest", endpoint: "/billing/usage", pollInterval: 300_000 },
    loader: () => import("@/components/widgets/billing-usage"),
    isDefault: false,
    tags: ["billing", "usage", "quota", "plan"],
  });

  widgetRegistry.register({
    id: "mitre-heatmap",
    name: "MITRE ATT&CK Heatmap",
    description: "MITRE framework coverage heatmap",
    icon: "Grid3x3",
    category: "intelligence",
    size: { default: { w: 6, h: 3 }, min: { w: 3, h: 2 }, max: { w: 12, h: 5 } },
    dataSource: { type: "rest", endpoint: "/dashboard/mitre", pollInterval: 300_000 },
    loader: () => import("@/components/widgets/mitre-attack-heatmap"),
    isDefault: false,
    tags: ["mitre", "attack", "heatmap", "framework"],
  });
  widgetRegistry.register({
    id: "incident-report",
    name: "Incident Report",
    description: "Latest critical incident timeline and metrics",
    icon: "FileWarning",
    category: "operational",
    size: { default: { w: 6, h: 4 }, min: { w: 4, h: 3 }, max: { w: 12, h: 6 } },
    dataSource: { type: "rest", endpoint: "/dashboard/incidents/latest", pollInterval: 60_000 },
    loader: () => import("@/components/widgets/incident-report"),
    isDefault: false,
    tags: ["incident", "report", "timeline", "critical"],
  });

  widgetRegistry.register({
    id: "public-stats",
    name: "Platform Stats",
    description: "Key platform performance metrics at a glance",
    icon: "TrendingUp",
    category: "platform",
    size: { default: { w: 4, h: 2 }, min: { w: 3, h: 2 }, max: { w: 8, h: 3 } },
    dataSource: { type: "rest", endpoint: "/dashboard/stats", pollInterval: 60_000 },
    loader: () => import("@/components/widgets/platform-stats"),
    isDefault: false,
    tags: ["stats", "platform", "uptime", "performance"],
  });

  widgetRegistry.register({
    id: "api-usage",
    name: "Processing Metrics",
    description: "API usage and email processing volume over time",
    icon: "Cpu",
    category: "platform",
    size: { default: { w: 5, h: 3 }, min: { w: 3, h: 3 }, max: { w: 8, h: 5 } },
    dataSource: { type: "rest", endpoint: "/dashboard/processing", pollInterval: 30_000 },
    loader: () => import("@/components/widgets/api-usage"),
    isDefault: false,
    tags: ["api", "usage", "processing", "chart"],
  });

  widgetRegistry.register({
    id: "threat-volume-timeline",
    name: "Threat Volume Timeline",
    description: "Grouped vertical bar chart of threat volume over time",
    icon: "BarChart3",
    category: "core",
    size: { default: { w: 5, h: 3 }, min: { w: 3, h: 2 }, max: { w: 8, h: 5 } },
    dataSource: { type: "rest", endpoint: "/dashboard", pollInterval: 60_000 },
    loader: () => import("@/components/widgets/threat-volume-timeline"),
    isDefault: false,
    tags: ["threat", "volume", "timeline", "bar", "chart"],
  });

  widgetRegistry.register({
    id: "top-alert-categories",
    name: "Top Alert Categories",
    description: "Horizontal bar breakdown of alert categories by volume",
    icon: "ListOrdered",
    category: "core",
    size: { default: { w: 6, h: 3 }, min: { w: 4, h: 2 }, max: { w: 10, h: 5 } },
    dataSource: { type: "rest", endpoint: "/dashboard", pollInterval: 60_000 },
    loader: () => import("@/components/widgets/top-alert-categories"),
    isDefault: false,
    tags: ["alert", "categories", "bar", "chart", "top"],
  });

  widgetRegistry.register({
    id: "threat-radar",
    name: "Threat Radar",
    description: "Live animated radar showing active threat positions by severity",
    icon: "Radar",
    category: "intelligence",
    size: { default: { w: 4, h: 3 }, min: { w: 3, h: 3 }, max: { w: 6, h: 5 } },
    dataSource: { type: "websocket", channel: "threats" },
    loader: () => import("@/components/widgets/threat-radar"),
    isDefault: false,
    tags: ["threat", "radar", "live", "animated", "intelligence"],
  });
}

registerBuiltinWidgets();
