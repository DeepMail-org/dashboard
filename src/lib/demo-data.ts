import type {
  DashboardOverview,
  ThreatEntry,
  PipelineStage,
} from "./api/types";

export const DEMO_DASHBOARD: DashboardOverview = {
  threatScore: 72,
  emailVolume: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600_000).toISOString(),
    count: Math.floor(Math.random() * 800 + 200),
  })),
  severityBreakdown: [
    { severity: "Critical", count: 12, color: "oklch(65% 0.2 25)" },
    { severity: "High", count: 34, color: "oklch(70% 0.17 45)" },
    { severity: "Medium", count: 89, color: "oklch(75% 0.15 70)" },
    { severity: "Low", count: 156, color: "oklch(60% 0.15 280)" },
    { severity: "Info", count: 243, color: "oklch(65% 0.01 280)" },
  ],
  processingRate: 847,
  totalAnalyzed: 12_847,
  totalThreats: 291,
};

export const DEMO_THREATS: ThreatEntry[] = [
  {
    id: "t-001",
    subject: "Urgent: Account verification required",
    sender: "noreply@acc0unt-verify.com",
    severity: "critical",
    type: "Credential Phishing",
    timestamp: new Date(Date.now() - 120_000).toISOString(),
    status: "quarantined",
  },
  {
    id: "t-002",
    subject: "Invoice #INV-2024-8832 attached",
    sender: "billing@fake-invoices.net",
    severity: "high",
    type: "Malware Attachment",
    timestamp: new Date(Date.now() - 300_000).toISOString(),
    status: "blocked",
  },
  {
    id: "t-003",
    subject: "Re: Q4 Budget Review",
    sender: "cfo-spoof@company-mail.org",
    severity: "high",
    type: "BEC/Impersonation",
    timestamp: new Date(Date.now() - 600_000).toISOString(),
    status: "detected",
  },
  {
    id: "t-004",
    subject: "Shared document: Project Roadmap",
    sender: "drive-share@g00gle-docs.com",
    severity: "medium",
    type: "Phishing Link",
    timestamp: new Date(Date.now() - 900_000).toISOString(),
    status: "quarantined",
  },
  {
    id: "t-005",
    subject: "Your package delivery notification",
    sender: "tracking@delivery-scam.com",
    severity: "medium",
    type: "Credential Phishing",
    timestamp: new Date(Date.now() - 1_200_000).toISOString(),
    status: "blocked",
  },
  {
    id: "t-006",
    subject: "Weekly newsletter digest",
    sender: "news@suspicious-domain.ru",
    severity: "low",
    type: "Suspicious Origin",
    timestamp: new Date(Date.now() - 1_800_000).toISOString(),
    status: "delivered",
  },
  {
    id: "t-007",
    subject: "Meeting invite: Strategy call",
    sender: "calendar@spoofed-corp.com",
    severity: "medium",
    type: "BEC/Impersonation",
    timestamp: new Date(Date.now() - 2_400_000).toISOString(),
    status: "quarantined",
  },
  {
    id: "t-008",
    subject: "Password reset confirmation",
    sender: "security@bank-phish.com",
    severity: "critical",
    type: "Credential Phishing",
    timestamp: new Date(Date.now() - 3_000_000).toISOString(),
    status: "blocked",
  },
];

export const DEMO_PIPELINE: PipelineStage[] = [
  { name: "Ingestion", status: "healthy", throughput: 847, latency: 12, errorRate: 0.1 },
  { name: "Header Analysis", status: "healthy", throughput: 845, latency: 23, errorRate: 0.2 },
  { name: "Content Scan", status: "healthy", throughput: 840, latency: 89, errorRate: 0.3 },
  { name: "ML Classification", status: "degraded", throughput: 812, latency: 156, errorRate: 1.2 },
  { name: "Threat Scoring", status: "healthy", throughput: 810, latency: 34, errorRate: 0.1 },
  { name: "Policy Engine", status: "healthy", throughput: 808, latency: 18, errorRate: 0.0 },
];
