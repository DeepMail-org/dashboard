"use client";

import { useSandboxStore, SandboxTask, SandboxConfig } from "@/stores/sandbox-store";
import { Play, Settings2, ShieldAlert, CheckCircle, Clock } from "lucide-react";

interface SandboxConfigProps {
  task: SandboxTask;
}

const OS_OPTIONS = [
  { id: "windows10", label: "Windows 10 21H2 (x64)" },
  { id: "windows11", label: "Windows 11 22H2 (x64)" },
  { id: "ubuntu22", label: "Ubuntu 22.04 LTS" },
];

const NETWORK_OPTIONS = [
  { id: "isolated", label: "Isolated (Air-gapped)" },
  { id: "internet", label: "Full Internet Access" },
  { id: "proxy", label: "Routed through Tor Proxy" },
];

export function SandboxConfigPanel({ task }: SandboxConfigProps) {
  const updateConfig = useSandboxStore((s) => s.updateTaskConfig);
  const updateStatus = useSandboxStore((s) => s.updateTaskStatus);

  const handleConfigChange = (key: keyof SandboxConfig, value: string | number) => {
    updateConfig(task.id, { [key]: value });
  };

  const handleRun = () => {
    updateStatus(task.id, "running");
  };

  if (task.status === "completed") {
    return (
      <div className="flex h-full flex-col p-6 items-center justify-center text-center">
        <CheckCircle className="h-16 w-16 text-success mb-4 opacity-80" />
        <h2 className="text-xl font-bold text-fg mb-2">Analysis Complete</h2>
        <p className="text-sm text-muted max-w-md">
          The file {task.name} has been successfully analyzed. The malicious indicators have been extracted and pushed to the blocklist.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-surface p-4 text-left w-full max-w-md">
          <h3 className="mb-3 text-xs font-semibold text-fg">Sandbox Environment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted">Final Status</span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-success">
                Terminated (Clean)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted">Virtual Machine</span>
              <span className="font-mono text-[11px] text-fg">
                {OS_OPTIONS.find(o => o.id === task.config.os)?.label || task.config.os}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted">Execution Time</span>
              <span className="font-mono text-[11px] text-fg">47s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted">Cost</span>
              <span className="font-mono text-[11px] text-fg">0.04 Credits</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
          <Settings2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-fg">Configure Environment</h2>
          <p className="text-xs text-muted">Set up the sandbox virtual machine for {task.name}</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* OS Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-fg">Operating System</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {OS_OPTIONS.map((os) => (
              <button
                key={os.id}
                onClick={() => handleConfigChange("os", os.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  task.config.os === os.id
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-surface hover:bg-surface-hover"
                }`}
              >
                <div className="text-sm font-medium text-fg mb-1">{os.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Network Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-fg">Network Configuration</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {NETWORK_OPTIONS.map((net) => (
              <button
                key={net.id}
                onClick={() => handleConfigChange("network", net.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  task.config.network === net.id
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-surface hover:bg-surface-hover"
                }`}
              >
                <div className="text-sm font-medium text-fg mb-1">{net.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Timeout */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-fg flex items-center justify-between">
            <span>Execution Timeout (Seconds)</span>
            <span className="font-mono text-accent">{task.config.timeout}s</span>
          </label>
          <input
            type="range"
            min="30"
            max="300"
            step="10"
            value={task.config.timeout}
            onChange={(e) => handleConfigChange("timeout", parseInt(e.target.value))}
            className="w-full accent-accent"
          />
        </div>

        <div className="pt-6 mt-2 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-warning bg-warning/10 px-3 py-2 rounded-lg border border-warning/20">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-xs font-medium">This file may be malicious. Execution is strictly isolated.</span>
          </div>
          <button
            onClick={handleRun}
            className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Launch Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
