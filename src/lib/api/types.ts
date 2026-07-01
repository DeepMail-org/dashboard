export interface DashboardOverview {
  threatScore: number;
  emailVolume: { timestamp: string; count: number }[];
  severityBreakdown: { severity: string; count: number; color: string }[];
  processingRate: number;
  totalAnalyzed: number;
  totalThreats: number;
}

export interface ThreatEntry {
  id: string;
  subject: string;
  sender: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  type: string;
  timestamp: string;
  status: "detected" | "quarantined" | "blocked" | "delivered";
}

export interface PipelineStage {
  name: string;
  status: "healthy" | "degraded" | "down";
  throughput: number;
  latency: number;
  errorRate: number;
}
