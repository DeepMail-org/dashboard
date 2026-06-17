"use client";

import { useState, useEffect, useRef } from "react";
import { useSandboxStore, SandboxTask } from "@/stores/sandbox-store";

interface TerminalLine {
  type: "prompt" | "cmd" | "output" | "info" | "warn" | "error" | "success" | "highlight";
  text: string;
}

const TERMINAL_LINES: TerminalLine[] = [
  { type: "prompt", text: "root@sandbox-worker-01:~# " },
  { type: "cmd", text: "deepmail-sandbox --analyze target --timeout 120" },
  { type: "output", text: "" },
  { type: "info", text: "[20:56:14] Initializing sandbox environment..." },
  { type: "output", text: "[20:56:14] VM: Windows 10 21H2 (x64) | RAM: 4GB | Network: Isolated" },
  { type: "output", text: "[20:56:15] Loading sample: target (2.4 MB)" },
  { type: "output", text: "[20:56:15] SHA-256: a8f3c2d1e9b74a2f8c1d3e5b7a9c0f2d4e6a8b0c..." },
  { type: "output", text: "" },
  { type: "info", text: "[20:56:16] ▶ Stage 1: Static Analysis" },
  { type: "output", text: "  PE Header: Valid | Sections: .text .rdata .data .rsrc" },
  { type: "output", text: "  Imports: kernel32.dll, ws2_32.dll, advapi32.dll" },
  { type: "warn", text: "  ⚠ Suspicious: UPX-packed binary detected" },
  { type: "warn", text: "  ⚠ Suspicious: Anti-VM checks (cpuid, rdtsc)" },
  { type: "output", text: "  Entropy: 7.82/8.0 (highly compressed/encrypted)" },
  { type: "output", text: "" },
  { type: "info", text: "[20:56:18] ▶ Stage 2: Dynamic Execution" },
  { type: "output", text: "  [+] Process created: target (PID 2847)" },
  { type: "warn", text: "  [!] Child process spawned: powershell.exe (PID 2891)" },
  { type: "error", text: '  [!!] PowerShell executing encoded command:' },
  { type: "highlight", text: '      IEX([System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("aW52b2...")))' },
  { type: "output", text: "  [+] Network connection: 185.220.101.34:443 (TLS)" },
  { type: "error", text: "  [!!] C2 beacon detected — interval: 30s, jitter: 20%" },
  { type: "output", text: "  [+] File dropped: %TEMP%\\svchost.exe (1.1 MB)" },
  { type: "error", text: "  [!!] Registry persistence: HKLM\\...\\Run\\svchost" },
  { type: "output", text: "" },
  { type: "info", text: "[20:56:42] ▶ Stage 3: Network Analysis" },
  { type: "output", text: "  DNS queries: evil-cdn.ru → 185.220.101.34" },
  { type: "output", text: "  HTTP POST /gate.php — exfiltrating system info" },
  { type: "error", text: "  [!!] Data exfiltration: hostname, username, installed AV" },
  { type: "output", text: "  TLS cert: CN=evil-cdn.ru, self-signed, expired" },
  { type: "output", text: "" },
  { type: "info", text: "[20:56:58] ▶ Stage 4: YARA Matching" },
  { type: "success", text: "  ✓ MATCH: rule Emotet_Dropper_2024 (DM-MAL-014)" },
  { type: "success", text: "  ✓ MATCH: rule PowerShell_Encoded_Exec (DM-C2-003)" },
  { type: "output", text: "  ✓ MATCH: rule UPX_Packed_PE (DM-MAL-022)" },
  { type: "output", text: "" },
  { type: "info", text: "[20:57:01] ▶ Analysis Complete" },
  { type: "error", text: "  ████████████████████████████████ VERDICT: MALICIOUS" },
  { type: "output", text: "  Confidence: 98.7% | Duration: 47s | Rules triggered: 3" },
  { type: "output", text: "  MITRE: T1059.001, T1547.001, T1071.001, T1027" },
  { type: "output", text: "" },
  { type: "success", text: "[20:57:01] ✓ Sample quarantined. Case CAS-8821 created." },
  { type: "success", text: "[20:57:01] ✓ IOCs pushed to blocklist. Threat feed updated." },
  { type: "output", text: "" },
  { type: "prompt", text: "root@sandbox-worker-01:~# " },
];

const LINE_COLORS: Record<TerminalLine["type"], string> = {
  prompt: "text-success",
  cmd: "text-fg",
  output: "text-muted",
  info: "text-blue-400",
  warn: "text-warning",
  error: "text-danger",
  success: "text-success",
  highlight: "text-accent",
};

const FILE_META = [
  { label: "Filename", value: "target" },
  { label: "Size", value: "2.4 MB" },
  { label: "Type", value: "PE32 Executable" },
  { label: "SHA-256", value: "a8f3c2d1e9b7...4f6a", small: true },
  { label: "Submitted", value: "2 min ago" },
  { label: "Duration", value: "47s" },
];

const MITRE = [
  { id: "T1059.001", name: "PowerShell Exec", color: "text-danger" },
  { id: "T1547.001", name: "Registry Run Key", color: "text-orange" },
  { id: "T1071.001", name: "HTTP C2 Channel", color: "text-danger" },
  { id: "T1027", name: "Obfuscated Files", color: "text-warning" },
];

const IOCS = [
  "185.220.101.34:443",
  "evil-cdn.ru/payload.bin",
  "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\svchost",
];

interface SandboxTerminalProps {
  task: SandboxTask;
}

export function SandboxTerminal({ task }: SandboxTerminalProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const updateTaskStatus = useSandboxStore((s) => s.updateTaskStatus);

  useEffect(() => {
    // Reset terminal if task changes
    if (task.status === "completed") {
      setVisibleLines(TERMINAL_LINES.length);
      return;
    }
    
    if (task.status !== "running") return;
    
    if (visibleLines >= TERMINAL_LINES.length) {
      updateTaskStatus(task.id, "COMPLETE");
      return;
    }
    
    const delay = TERMINAL_LINES[visibleLines]?.type === "output" && TERMINAL_LINES[visibleLines]?.text === "" ? 100 : 50;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleLines, task.status, task.id, updateTaskStatus]);

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight });
  }, [visibleLines]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left: Metadata & IOCs */}
      <div className="w-80 shrink-0 space-y-4 overflow-y-auto border-r border-border p-6 bg-bg">
        {/* Verdict (Only show if completed or towards end of running) */}
        {task.status === "completed" ? (
          <div className="flex items-center gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4">
            <div className="h-3 w-3 animate-pulse rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <div>
              <div className="text-sm font-bold tracking-wide text-danger">MALICIOUS</div>
              <div className="text-[11px] text-muted">Confidence: 98.7%</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-warning border-t-transparent" />
            <div>
              <div className="text-sm font-bold tracking-wide text-warning">ANALYZING</div>
              <div className="text-[11px] text-muted">Running dynamic execution...</div>
            </div>
          </div>
        )}

        {/* File Metadata */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-3 text-xs font-semibold text-fg">File Metadata</h3>
          <div className="space-y-2">
            {FILE_META.map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-[11px] text-muted">{m.label}</span>
                <span className={`font-mono text-fg ${m.small ? "text-[9px]" : "text-[11px]"}`}>
                  {m.value.replace("target", task.name)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MITRE Techniques */}
        {task.status === "completed" && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="mb-3 text-xs font-semibold text-fg">MITRE Techniques</h3>
            <div className="space-y-2">
              {MITRE.map((t) => (
                <div key={t.id} className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted">{t.id}</span>
                  <span className={`font-mono text-[11px] ${t.color}`}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted IOCs */}
        {task.status === "completed" && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="mb-3 text-xs font-semibold text-fg">Extracted IOCs</h3>
            <div className="space-y-1.5">
              {IOCS.map((ioc) => (
                <div key={ioc} className="rounded-md bg-bg px-2.5 py-1.5 font-mono text-[10px] text-accent break-all">
                  {ioc}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sandbox Environment */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-3 text-xs font-semibold text-fg">Sandbox Environment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted">Status</span>
              <span className={`flex items-center gap-1.5 text-[11px] font-medium ${task.status === "completed" ? "text-muted" : "text-success"}`}>
                {task.status === "running" && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                )}
                {task.status === "completed" ? "Terminated" : "Active (Live)"}
              </span>
            </div>
            <div className="space-y-1.5">
               <div className="flex items-center justify-between">
                 <span className="text-[11px] text-muted">CPU Usage</span>
                 <span className="font-mono text-[11px] text-fg">{task.status === "completed" ? "0%" : "84%"}</span>
               </div>
               <div className="h-1.5 w-full overflow-hidden rounded-full bg-fg/10">
                 <div className={`h-full bg-warning transition-all ${task.status === "completed" ? "w-0" : "w-[84%]"}`} />
               </div>
            </div>
            <div className="space-y-1.5">
               <div className="flex items-center justify-between">
                 <span className="text-[11px] text-muted">RAM Consumption</span>
                 <span className="font-mono text-[11px] text-fg">{task.status === "completed" ? "0 / 4.0 GB" : "2.8 / 4.0 GB"}</span>
               </div>
               <div className="h-1.5 w-full overflow-hidden rounded-full bg-fg/10">
                 <div className={`h-full bg-accent transition-all ${task.status === "completed" ? "w-0" : "w-[70%]"}`} />
               </div>
            </div>
            <div className="pt-2 border-t border-border mt-1 flex flex-col gap-2">
               <div className="flex items-center justify-between">
                 <span className="text-[11px] text-muted">Virtual Machine</span>
                 <span className="font-mono text-[11px] text-fg capitalize">{task.config.os.replace("windows", "Win ")}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-[11px] text-muted">Cost Rate</span>
                 <span className="font-mono text-[11px] text-fg">0.05 Cr / min</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Glass Terminal */}
      <div className="flex flex-1 flex-col p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bg via-bg to-[#0a0a0c]">
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0c]/60 backdrop-blur-xl shadow-2xl relative ring-1 ring-white/5">
        {/* Inner glass highlight */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 pointer-events-none" />
        
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3 relative z-10">
          <div className="flex items-center gap-2 w-20">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-[11px] text-muted/60 flex-1 text-center font-medium tracking-wide">
            deepmail-sandbox — bash — 120×40
          </span>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Terminal body */}
        <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={LINE_COLORS[line.type]}>
              {line.text.replace("target", task.name) || " "}
            </div>
          ))}
          {visibleLines < TERMINAL_LINES.length && task.status === "running" && (
            <span className="inline-block h-3.5 w-1.5 animate-pulse bg-fg" />
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
