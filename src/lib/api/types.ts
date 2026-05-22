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

export interface SenderEntry {
  email: string;
  domain: string;
  threatCount: number;
  lastSeen: string;
  riskScore: number;
}

export interface IocEntry {
  id: string;
  type: "ip" | "domain" | "hash" | "url" | "email";
  value: string;
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  firstSeen: string;
  lastSeen: string;
}

export interface AuthHealthStatus {
  dkim: { pass: number; fail: number; total: number };
  spf: { pass: number; fail: number; total: number };
  dmarc: { pass: number; fail: number; total: number };
}

export interface GeoThreat {
  lat: number;
  lng: number;
  country: string;
  city: string;
  count: number;
  severity: "critical" | "high" | "medium" | "low";
}
