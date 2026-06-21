"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";

import { useState } from "react";
import { Search, Network, ChevronRight, Filter, Download } from "lucide-react";
import {
  Mail, Shield, Globe, FileCode, User, Skull,
  AlertTriangle, Server, Key, Cpu,
} from "lucide-react";
import { N8nWorkflowBlock, type WorkflowNode, type WorkflowConnection } from "@/components/ui/n8n-workflow-block";
import { cn } from "@/lib/utils";

// ── Color classes for n8n node styling ────────────────────────────────────────
const NODE_COLOR_CLASSES: Record<string, string> = {
  red:    "border-danger/30 text-danger",
  blue:   "border-info/30 text-info",
  amber:  "border-warning/30 text-warning",
  purple: "border-purple/30 text-purple",
  cyan:   "border-accent/30 text-accent",
  orange: "border-orange/30 text-orange",
  green:  "border-success/30 text-success",
  emerald: "border-success/40 text-success",
};

// ── Node type legend ──────────────────────────────────────────────────────────
const NODE_TYPE_COLORS: Record<string, { color: string; icon: React.ElementType }> = {
  ip:        { color: "#ef4444", icon: Globe },
  domain:    { color: "#3b82f6", icon: Server },
  hash:      { color: "#f59e0b", icon: FileCode },
  email:     { color: "#8b5cf6", icon: Mail },
  host:      { color: "#06b6d4", icon: Cpu },
  adversary: { color: "#f97316", icon: Skull },
};

// ── Email Threat Investigation Workflow ───────────────────────────────────────
const INVESTIGATION_NODES: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "trigger",
    title: "Phishing Alert",
    description: "New phishing email detected by ML model with 98.2% confidence",
    icon: AlertTriangle,
    color: "red",
    position: { x: 50, y: 120 },
  },
  {
    id: "action-1",
    type: "action",
    title: "Extract IOCs",
    description: "Parse URLs, IPs, domains, and file hashes from email body & attachments",
    icon: Search,
    color: "blue",
    position: { x: 300, y: 60 },
  },
  {
    id: "action-2",
    type: "action",
    title: "Header Analysis",
    description: "Validate SPF/DKIM/DMARC, trace mail relay path, check X-headers",
    icon: Mail,
    color: "purple",
    position: { x: 300, y: 220 },
  },
  {
    id: "condition-1",
    type: "condition",
    title: "Sandbox Verdict",
    description: "Detonate attachments in isolated sandbox, analyze runtime behavior",
    icon: Shield,
    color: "amber",
    position: { x: 550, y: 60 },
  },
  {
    id: "action-3",
    type: "action",
    title: "Threat Intel Lookup",
    description: "Cross-reference IOCs against VirusTotal, AbuseIPDB, MISP feeds",
    icon: Globe,
    color: "cyan",
    position: { x: 550, y: 220 },
  },
  {
    id: "action-4",
    type: "action",
    title: "MITRE Mapping",
    description: "Map TTPs to MITRE ATT&CK framework — T1566.001 Spearphishing",
    icon: Key,
    color: "orange",
    position: { x: 800, y: 120 },
  },
  {
    id: "action-5",
    type: "action",
    title: "Create Case",
    description: "Generate incident report, assign to SOC analyst, set SLA timer",
    icon: FileCode,
    color: "green",
    position: { x: 1050, y: 120 },
  },
];

const INVESTIGATION_CONNECTIONS: WorkflowConnection[] = [
  { from: "trigger-1", to: "action-1" },
  { from: "trigger-1", to: "action-2" },
  { from: "action-1", to: "condition-1" },
  { from: "action-2", to: "action-3" },
  { from: "condition-1", to: "action-4" },
  { from: "action-3", to: "action-4" },
  { from: "action-4", to: "action-5" },
];

// ── Lateral Movement Detection Workflow ──────────────────────────────────────
const LATERAL_NODES: WorkflowNode[] = [
  {
    id: "lat-trigger",
    type: "trigger",
    title: "RDP Brute Force",
    description: "Excessive RDP login attempts from internal host SE-KTH-RDP",
    icon: AlertTriangle,
    color: "red",
    position: { x: 50, y: 150 },
  },
  {
    id: "lat-action-1",
    type: "action",
    title: "Auth Log Correlation",
    description: "Correlate failed logins with successful auth events across domain controllers",
    icon: Key,
    color: "purple",
    position: { x: 300, y: 80 },
  },
  {
    id: "lat-action-2",
    type: "action",
    title: "Network Flow Analysis",
    description: "Analyze NetFlow data for unusual port usage, SMB/WMI lateral traffic",
    icon: Network,
    color: "cyan",
    position: { x: 300, y: 250 },
  },
  {
    id: "lat-condition",
    type: "condition",
    title: "Behavior Score",
    description: "ML-based anomaly detection score: 94/100 — high-confidence threat",
    icon: Shield,
    color: "amber",
    position: { x: 550, y: 150 },
  },
  {
    id: "lat-action-3",
    type: "action",
    title: "Isolate Host",
    description: "Quarantine affected endpoint via EDR API, block at network level",
    icon: Cpu,
    color: "red",
    position: { x: 800, y: 150 },
  },
];

const LATERAL_CONNECTIONS: WorkflowConnection[] = [
  { from: "lat-trigger", to: "lat-action-1" },
  { from: "lat-trigger", to: "lat-action-2" },
  { from: "lat-action-1", to: "lat-condition" },
  { from: "lat-action-2", to: "lat-condition" },
  { from: "lat-condition", to: "lat-action-3" },
];

// ── Node templates for adding new nodes ──────────────────────────────────────
const NODE_TEMPLATES: Omit<WorkflowNode, "id" | "position">[] = [
  { type: "action", title: "Enrichment", description: "Enrich indicator with external threat feeds", icon: Globe, color: "cyan" },
  { type: "condition", title: "Threshold Check", description: "Check if score exceeds configured threshold", icon: Shield, color: "amber" },
  { type: "action", title: "Notification", description: "Send alert to Slack/Teams/PagerDuty", icon: Mail, color: "green" },
  { type: "action", title: "Block Rule", description: "Push IOC to firewall/proxy blocklist", icon: Key, color: "red" },
];

// ── IOC Details Panel ─────────────────────────────────────────────────────────
function IOCDetailPanel({ selectedType }: { selectedType: string | null }) {
  if (!selectedType) return null;

  const config = NODE_TYPE_COLORS[selectedType];
  if (!config) return null;
  const Icon = config.icon;

  const sampleIOCs: Record<string, { value: string; source: string; risk: string }[]> = {
    ip: [
      { value: "185.220.101.34", source: "AbuseIPDB", risk: "Critical" },
      { value: "103.224.182.250", source: "VirusTotal", risk: "High" },
    ],
    domain: [
      { value: "evil-cdn.ru", source: "MISP", risk: "Critical" },
      { value: "dhl-tracking.info", source: "PhishTank", risk: "Medium" },
    ],
    hash: [
      { value: "a1b2c3d4e5f6...7890", source: "Sandbox", risk: "High" },
    ],
    email: [
      { value: "alice.kim@acme.com", source: "Internal", risk: "Target" },
    ],
    host: [
      { value: "SE-KTH-RDP", source: "EDR", risk: "Compromised" },
    ],
    adversary: [
      { value: "TA542 (Emotet)", source: "MITRE", risk: "APT" },
    ],
  };

  const iocs = sampleIOCs[selectedType] ?? [];

  return (
    <div className="w-72 shrink-0 border-l border-border bg-surface overflow-y-auto">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${config.color}20` }}>
            <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">IOC Type</p>
            <h2 className="font-display text-[13px] font-bold capitalize text-fg">{selectedType}</h2>
          </div>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-[10px] uppercase tracking-wider text-muted">Related Indicators</p>
        {iocs.map((ioc, i) => (
          <div key={i} className="rounded-lg border border-border bg-bg px-3 py-2.5 space-y-1">
            <p className="font-mono text-[11px] text-fg break-all">{ioc.value}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-dimmed">{ioc.source}</span>
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-medium"
                style={{
                  backgroundColor: `${config.color}15`,
                  color: config.color,
                }}
              >
                {ioc.risk}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
type WorkflowTab = "investigation" | "lateral";

export default function GraphAnalysisPage() {
  const [activeTab, setActiveTab] = useState<WorkflowTab>("investigation");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <PageWrapper
      noPadding
      header={
        <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-fg">Graph Analysis</span>
          </div>

          {/* Workflow tabs */}
          <div className="flex overflow-hidden rounded-lg border border-border bg-surface/90">
            <button
              onClick={() => setActiveTab("investigation")}
              className={cn(
                "px-3 py-1.5 text-[11px] font-medium transition-colors",
                activeTab === "investigation"
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-secondary",
              )}
            >
              Email Investigation
            </button>
            <button
              onClick={() => setActiveTab("lateral")}
              className={cn(
                "px-3 py-1.5 text-[11px] font-medium transition-colors",
                activeTab === "lateral"
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-secondary",
              )}
            >
              Lateral Movement
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Node type legend */}
          <div className="hidden lg:flex gap-1">
            {Object.entries(NODE_TYPE_COLORS).map(([type, { color }]) => (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className={cn(
                  "flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors",
                  selectedType === type
                    ? "bg-fg/10 text-fg"
                    : "text-muted hover:bg-fg/5",
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-dimmed">
            <span>Drag nodes to reposition</span>
          </div>
        </div>
        </div>
      }
    >
      {/* Canvas + Detail panel */}
      <div className="flex flex-1 overflow-hidden h-full">
        <div className="flex-1 overflow-hidden">
          {activeTab === "investigation" && (
            <N8nWorkflowBlock
              initialNodes={INVESTIGATION_NODES}
              initialConnections={INVESTIGATION_CONNECTIONS}
              nodeTemplates={NODE_TEMPLATES}
              colorClasses={NODE_COLOR_CLASSES}
              title="Email Threat Investigation"
              statusLabel="Active"
              statusColor="emerald"
            />
          )}
          {activeTab === "lateral" && (
            <N8nWorkflowBlock
              initialNodes={LATERAL_NODES}
              initialConnections={LATERAL_CONNECTIONS}
              nodeTemplates={NODE_TEMPLATES}
              colorClasses={NODE_COLOR_CLASSES}
              title="Lateral Movement Detection"
              statusLabel="Monitoring"
              statusColor="amber"
            />
          )}
        </div>

        {/* IOC Detail Panel */}
        <IOCDetailPanel selectedType={selectedType} />
      </div>
    </PageWrapper>
  );
}
