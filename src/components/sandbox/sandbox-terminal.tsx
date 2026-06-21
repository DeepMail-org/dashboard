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
    // Determine the target lines based on status
    if (task.status === "completed" || task.status === "failed" || task.status === "cancelled") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleLines(TERMINAL_LINES.length);
      return;
    }
    
    if (task.status === "pending") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleLines(1); // Show just the prompt when pending
      return;
    }
    
    // For running status
    if (visibleLines >= TERMINAL_LINES.length) {
      // We reached the end of the predefined logs. Auto-complete for mock realism
      updateTaskStatus(task.id, "COMPLETE");
      return;
    }
    
    const currentLine = TERMINAL_LINES[visibleLines];
    const isOutputLine = currentLine?.type === "output" && currentLine?.text === "";
    const isStageLine = currentLine?.type === "info" && currentLine?.text.includes("Stage");
    
    // Create realistic delays based on line type
    let delay = 50;
    if (isOutputLine) delay = 150;
    if (isStageLine) delay = 800;
    
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleLines, task.status, task.id, updateTaskStatus]);

  useEffect(() => {
    // Smooth scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div className="flex h-full w-full overflow-hidden p-6 bg-transparent">
      {/* Full-width Glass Terminal */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0c] backdrop-blur-xl shadow-2xl relative ring-1 ring-white/5">
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
  );
}
