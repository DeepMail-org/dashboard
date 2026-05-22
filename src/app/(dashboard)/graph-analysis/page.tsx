"use client";

import { Activity, Database, FolderOpen, Globe, Mail, ShieldAlert, UserX } from "lucide-react";
import {
  N8nWorkflowBlock,
  type WorkflowNode,
  type WorkflowConnection,
} from "@/components/ui/n8n-workflow-block";

const COLOR_CLASSES: Record<string, string> = {
  red: "border-red-400/40 bg-red-400/10 text-red-400",
  blue: "border-blue-400/40 bg-blue-400/10 text-blue-400",
  amber: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  purple: "border-purple-400/40 bg-purple-400/10 text-purple-400",
  indigo: "border-indigo-400/40 bg-indigo-400/10 text-indigo-400",
  emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  orange: "border-orange-400/40 bg-orange-400/10 text-orange-400",
};

const INITIAL_NODES: WorkflowNode[] = [
  {
    id: "node-1",
    type: "trigger",
    title: "Phishing Email",
    description: "Inbound phishing email detected by analysis pipeline",
    icon: Mail,
    color: "red",
    position: { x: 50, y: 80 },
  },
  {
    id: "node-2",
    type: "action",
    title: "IP Lookup",
    description: "Resolve sender IP against threat intelligence feeds",
    icon: Globe,
    color: "blue",
    position: { x: 300, y: 80 },
  },
  {
    id: "node-3",
    type: "condition",
    title: "Threat Score Check",
    description: "Evaluate aggregate threat score against policy threshold",
    icon: ShieldAlert,
    color: "amber",
    position: { x: 550, y: 80 },
  },
  {
    id: "node-4",
    type: "action",
    title: "Block Sender",
    description: "Add sender to blocklist and quarantine pending messages",
    icon: UserX,
    color: "purple",
    position: { x: 800, y: 20 },
  },
  {
    id: "node-5",
    type: "action",
    title: "Create Case",
    description: "Open SOC investigation case with collected evidence",
    icon: FolderOpen,
    color: "indigo",
    position: { x: 800, y: 180 },
  },
  {
    id: "node-6",
    type: "action",
    title: "Enrich IOCs",
    description: "Query Neo4j graph for related indicators of compromise",
    icon: Database,
    color: "emerald",
    position: { x: 1050, y: 20 },
  },
  {
    id: "node-7",
    type: "action",
    title: "Alert SOC",
    description: "Push notification to SOC analysts via incident channel",
    icon: Activity,
    color: "orange",
    position: { x: 1050, y: 180 },
  },
];

const INITIAL_CONNECTIONS: WorkflowConnection[] = [
  { from: "node-1", to: "node-2" },
  { from: "node-2", to: "node-3" },
  { from: "node-3", to: "node-4" },
  { from: "node-3", to: "node-5" },
  { from: "node-4", to: "node-6" },
  { from: "node-5", to: "node-7" },
];

export default function GraphAnalysisPage() {
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-8 py-4">
        <div className="flex items-center gap-3">
          <Activity className="h-4 w-4 text-accent" />
          <h1 className="font-display text-lg font-medium text-fg">
            Threat Investigation Workflow
          </h1>
          <span className="rounded bg-fg/5 px-2 py-0.5 font-mono text-[10px] text-muted">
            Neo4j · Demo Mode
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              Neo4j Connected
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <N8nWorkflowBlock
          initialNodes={INITIAL_NODES}
          initialConnections={INITIAL_CONNECTIONS}
          nodeTemplates={[]}
          colorClasses={COLOR_CLASSES}
          title="Threat Investigation Pipeline"
          statusLabel="Live"
          statusColor="emerald"
          readOnly
        />
      </div>
    </div>
  );
}
