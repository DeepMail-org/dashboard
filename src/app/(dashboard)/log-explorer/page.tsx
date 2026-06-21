"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, X, Download, RefreshCw, ChevronDown, Copy, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/charts/bar-chart";
import { Grid } from "@/components/charts/grid";
import { Bar } from "@/components/charts/bar";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { ChartTooltip } from "@/components/charts/tooltip";
import { BarChartLoading } from "@/components/charts/bar-chart-loading";
import { LinearGradient } from "@visx/gradient";

interface FacetGroup {
  title: string;
  items: { label: string; count: string; checked?: boolean; color?: string }[];
}

const INITIAL_FACETS: FacetGroup[] = [
  {
    title: "Source",
    items: [
      { label: "mail-interceptor", count: "42.1k", checked: true },
      { label: "sandbox-engine", count: "18.3k" },
      { label: "threat-intel", count: "8.7k" },
      { label: "api-gateway", count: "5.2k" },
    ],
  },
  {
    title: "Service",
    items: [
      { label: "email-scanner", count: "28.4k", checked: true },
      { label: "url-detonator", count: "12.1k" },
      { label: "attachment-analyzer", count: "9.8k" },
      { label: "header-parser", count: "6.3k" },
      { label: "yara-engine", count: "4.1k" },
    ],
  },
  {
    title: "Host",
    items: [
      { label: "scan-node-01", count: "15.2k" },
      { label: "scan-node-02", count: "14.8k" },
      { label: "sandbox-worker-01", count: "9.1k" },
      { label: "sandbox-worker-02", count: "8.4k" },
    ],
  },
  {
    title: "Status",
    items: [
      { label: "Error", count: "3.2k", checked: true, color: "text-danger" },
      { label: "Warn", count: "8.1k", color: "text-warning" },
      { label: "Info", count: "45.6k", color: "text-blue-400" },
      { label: "Ok", count: "12.4k", color: "text-success" },
    ],
  },
];

const dailyData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + i);
  return {
    day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Math.floor(50 + Math.sin(i / 7) * 30 + ((i * 7) % 37) - 18),
  };
});

const ALL_LOG_ENTRIES = [
  { date: "May 16 20:58:11.715", host: "scan-node-01", service: "email-scanner", level: "error" as const, error: "SMTPConnectionError:", content: "Connection to upstream relay timed out after 30000ms" },
  { date: "May 16 20:58:11.534", host: "scan-node-02", service: "email-scanner", level: "error" as const, error: "SMTPConnectionError:", content: "Connection to upstream relay timed out after 30000ms" },
  { date: "May 16 20:58:11.387", host: "scan-node-01", service: "email-scanner", level: "error" as const, error: "ThreatIntelFeedError:", content: "Feed sync failed — provider returned 503 Unavailable" },
  { date: "May 16 20:58:11.317", host: "scan-node-02", service: "email-scanner", level: "error" as const, error: "SMTPConnectionError:", content: "Connection to upstream relay timed out after 30000ms" },
  { date: "May 16 20:58:10.908", host: "sandbox-worker-01", service: "email-scanner", level: "error" as const, error: "SandboxTimeoutError:", content: "Detonation exceeded 120s limit for sample a8f3c..." },
  { date: "May 16 20:58:10.702", host: "scan-node-01", service: "email-scanner", level: "error" as const, error: "YARAEngineError:", content: "Rule compilation failed — malformed regex in DM-MAL-047" },
  { date: "May 16 20:58:10.597", host: "scan-node-02", service: "email-scanner", level: "error" as const, error: "AttachmentAnalyzerError:", content: "OLE extraction failed for msg_id=dm-2847291" },
  { date: "May 16 20:58:10.469", host: "scan-node-01", service: "email-scanner", level: "error" as const, error: "SMTPConnectionError:", content: "Connection to upstream relay timed out after 30000ms" },
  { date: "May 16 20:58:10.156", host: "sandbox-worker-02", service: "email-scanner", level: "error" as const, error: "Timeout::RequestTimeoutException:", content: "Request ran for longer than 30000ms" },
  { date: "May 16 20:58:09.685", host: "scan-node-01", service: "email-scanner", level: "error" as const, error: "ThreatIntelFeedError:", content: "Feed sync failed — provider returned 503 Unavailable" },
  { date: "May 16 20:58:09.503", host: "scan-node-02", service: "email-scanner", level: "error" as const, error: "AttachmentAnalyzerError:", content: "Email database shard for tenant tier: 'basic' returned 5xx" },
  { date: "May 16 20:58:09.334", host: "scan-node-01", service: "email-scanner", level: "error" as const, error: "SMTPConnectionError:", content: "Connection to upstream relay timed out after 30000ms" },
];

const PATTERNS = [
  { matches: "≈15.6K", service: "email-scanner", text: "ThreatIntelFeedError: Feed sync failed — provider returned 503" },
  { matches: "≈12.2K", service: "email-scanner", text: "SMTPConnectionError: Connection to upstream relay timed out" },
  { matches: "≈8.23K", service: "email-scanner", text: "AttachmentAnalyzerError: OLE extraction failed for msg_id=*" },
  { matches: "≈5.18K", service: "email-scanner", text: "SandboxTimeoutError: Detonation exceeded 120s limit for sample *" },
  { matches: "≈4.98K", service: "email-scanner", text: "Timeout::RequestTimeoutException: Request ran for longer than 30000ms" },
];

type LogTab = "logs" | "patterns" | "transactions";
type LogLevel = "error" | "warning" | "info";

const LOG_LEVEL_STYLE: Record<LogLevel, string> = {
  error: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
  info: "bg-blue-400/10 text-blue-400",
};

export default function LogExplorerPage() {
  const [activeTab, setActiveTab] = useState<LogTab>("logs");
  const [searchPills, setSearchPills] = useState(["Service:email-scanner", "ERROR"]);
  const [searchInput, setSearchInput] = useState("");
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [facets, setFacets] = useState(INITIAL_FACETS);
  const [collapsedFacets, setCollapsedFacets] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const removePill = useCallback((pill: string) => {
    setSearchPills((prev) => prev.filter((p) => p !== pill));
  }, []);

  const addPill = useCallback(() => {
    const trimmed = searchInput.trim();
    if (trimmed && !searchPills.includes(trimmed)) {
      setSearchPills((prev) => [...prev, trimmed]);
      setSearchInput("");
    }
  }, [searchInput, searchPills]);

  const toggleFacet = useCallback((groupIdx: number, itemIdx: number) => {
    setFacets((prev) =>
      prev.map((g, gi) =>
        gi === groupIdx
          ? {
              ...g,
              items: g.items.map((item, ii) =>
                ii === itemIdx ? { ...item, checked: !item.checked } : item,
              ),
            }
          : g,
      ),
    );
  }, []);

  const toggleFacetCollapse = useCallback((title: string) => {
    setCollapsedFacets((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  }, []);

  const handleCopyLog = useCallback((idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }, []);

  const handleExport = useCallback(() => {
    const headers = ["Date", "Host", "Service", "Level", "Error", "Content"];
    const rows = ALL_LOG_ENTRIES.map((e) => [e.date, e.host, e.service, e.level, e.error, e.content]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deepmail-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const filteredLogs = useMemo(() => {
    const activeServices = facets
      .find((g) => g.title === "Service")
      ?.items.filter((i) => i.checked)
      .map((i) => i.label) ?? [];

    const activeHosts = facets
      .find((g) => g.title === "Host")
      ?.items.filter((i) => i.checked)
      .map((i) => i.label) ?? [];

    return ALL_LOG_ENTRIES.filter((entry) => {
      if (activeServices.length > 0 && !activeServices.includes(entry.service)) return false;
      if (activeHosts.length > 0 && !activeHosts.includes(entry.host)) return false;

      for (const pill of searchPills) {
        const lower = pill.toLowerCase();
        if (pill.startsWith("Service:")) {
          if (!entry.service.includes(pill.split(":")[1])) return false;
        } else if (lower === "error" && entry.level !== "error") {
          return false;
        } else if (!pill.startsWith("Service:") && lower !== "error") {
          const text = `${entry.error} ${entry.content} ${entry.host}`.toLowerCase();
          if (!text.includes(lower)) return false;
        }
      }
      return true;
    });
  }, [facets, searchPills]);

  const tabs: { key: LogTab; label: string }[] = [
    { key: "logs", label: "Aggregate as" },
    { key: "patterns", label: "Patterns" },
    { key: "transactions", label: "Transactions" },
  ];

  return (
    <PageWrapper noPadding>
      <div className="flex h-full overflow-hidden">
      {/* Facets Panel */}
      <div className="w-64 shrink-0 overflow-y-auto border-r border-border p-4">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">Facets</h3>
        {facets.map((group, gi) => (
          <div key={group.title} className="mb-4">
            <button
              onClick={() => toggleFacetCollapse(group.title)}
              className="mb-2 flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-secondary hover:text-fg transition-colors"
            >
              {group.title}
              <ChevronDown className={`h-3 w-3 text-muted transition-transform ${collapsedFacets[group.title] ? "-rotate-90" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {!collapsedFacets[group.title] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1">
                    {group.items.map((item, ii) => (
                      <label
                        key={item.label}
                        className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-fg/3 transition-colors"
                      >
                        <button
                          onClick={() => toggleFacet(gi, ii)}
                          className={`h-3 w-3 shrink-0 rounded-sm border transition-colors ${
                            item.checked
                              ? "border-accent bg-accent"
                              : "border-border bg-transparent hover:border-accent/50"
                          }`}
                        >
                          {item.checked && <Check className="h-2.5 w-2.5 text-white" />}
                        </button>
                        <span className={item.color ?? "text-muted"}>{item.label}</span>
                        <span className="ml-auto font-mono text-[10px] text-dimmed">{item.count}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Log Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Search Bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted" />
          {searchPills.map((pill) => (
            <span
              key={pill}
              className={`flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${
                pill.includes("ERROR")
                  ? "bg-danger/10 text-danger"
                  : "bg-accent/10 text-accent"
              }`}
            >
              {pill}
              <button onClick={() => removePill(pill)} className="hover:opacity-70 transition-opacity">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addPill();
              if (e.key === "Backspace" && searchInput === "" && searchPills.length > 0) {
                removePill(searchPills[searchPills.length - 1]);
              }
            }}
            placeholder='Search logs... (e.g. "connection failed" OR status:500)'
            className="flex-1 bg-transparent text-xs text-fg placeholder:text-dimmed outline-none"
          />
          <button
            onClick={handleRefresh}
            className="rounded p-1 text-muted hover:text-fg hover:bg-fg/5 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Histogram */}
        <div className="border-b border-border px-4 py-3">
          {isLoading ? (
            <div className="h-24 w-full mt-2">
              <BarChartLoading className="h-full" margin={{ top: 8, right: 8, bottom: 40, left: 8 }} />
            </div>
          ) : (
            <div className="h-24 w-full mt-2" style={{ "--chart-line-primary": "#ef4444", "--chart-1": "#ef4444" } as React.CSSProperties}>
              <BarChart className="h-full" barGap={0.1} data={dailyData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} xDataKey="day">
                <LinearGradient id="logGradient" from="rgba(239,68,68,0.8)" to="rgba(239,68,68,0.2)" />
                <Grid horizontal />
                <Bar dataKey="value" lineCap="butt" fill="url(#logGradient)" stroke="rgba(239,68,68,0.5)" />
                <BarXAxis maxLabels={8} />
                <ChartTooltip />
              </BarChart>
            </div>
          )}
        </div>

        {/* Tabs + Results count */}
        <div className="flex items-center justify-between border-b border-border px-4">
          <div className="flex gap-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-md px-3 py-1.5 text-[11px] transition-colors ${
                  activeTab === tab.key
                    ? "bg-fg/8 text-fg"
                    : "text-muted hover:text-fg hover:bg-fg/3"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">
              <strong className="text-fg">{filteredLogs.length === ALL_LOG_ENTRIES.length ? "66,939" : filteredLogs.length.toLocaleString()}</strong> results found
            </span>
            <button
              onClick={handleExport}
              className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-muted hover:text-fg hover:border-accent/40 transition-colors"
            >
              <Download className="h-3 w-3" /> Export
            </button>
          </div>
        </div>

        {/* Log Table / Patterns */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "logs" && (
            <div className="divide-y divide-border">
              {filteredLogs.map((entry, i) => {
                const isExpanded = expandedLog === i;
                const level: LogLevel = entry.level;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setExpandedLog(isExpanded ? null : i)}
                      className="flex w-full items-center gap-4 border-l-2 border-l-danger/50 px-4 py-2.5 text-left transition-colors hover:bg-danger/3"
                    >
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="h-3.5 w-3.5 text-muted" />
                      </motion.div>
                      <Badge variant="secondary" className={`shrink-0 text-[10px] capitalize ${LOG_LEVEL_STYLE[level]}`}>
                        {level}
                      </Badge>
                      <span className="w-40 shrink-0 font-mono text-[11px] text-muted">{entry.date}</span>
                      <span className="w-28 shrink-0 font-mono text-[11px] text-accent">{entry.service}</span>
                      <span className="flex-1 truncate font-mono text-[11px]">
                        <span className="text-danger">{entry.error}</span>{" "}
                        <span className="text-muted">{entry.content}</span>
                      </span>
                      <span className="w-28 shrink-0 font-mono text-[11px] text-muted">{entry.host}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden border-l-2 border-l-danger/30 bg-fg/2"
                        >
                          <div className="space-y-3 px-4 py-3">
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Full Message</p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyLog(i, `${entry.error} ${entry.content}`);
                                  }}
                                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted hover:text-fg hover:bg-fg/5 transition-colors"
                                >
                                  {copiedIdx === i ? (
                                    <><Check className="h-2.5 w-2.5 text-success" /> Copied</>
                                  ) : (
                                    <><Copy className="h-2.5 w-2.5" /> Copy</>
                                  )}
                                </button>
                              </div>
                              <p className="rounded bg-bg p-2.5 font-mono text-[11px] text-fg select-all">
                                {entry.error} {entry.content}
                              </p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">Host</p>
                                <p className="font-mono text-[11px] text-fg">{entry.host}</p>
                              </div>
                              <div>
                                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">Service</p>
                                <p className="font-mono text-[11px] text-accent">{entry.service}</p>
                              </div>
                              <div>
                                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">Timestamp</p>
                                <p className="font-mono text-[11px] text-fg">{entry.date}</p>
                              </div>
                            </div>
                            <div>
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Tags</p>
                              <div className="flex gap-1.5">
                                <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-accent/10 transition-colors">{entry.service}</Badge>
                                <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-danger/10 transition-colors">error</Badge>
                                <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-accent/10 transition-colors">{entry.host}</Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              {filteredLogs.length === 0 && (
                <div className="flex items-center justify-center py-20 text-sm text-muted">
                  No logs match current filters
                </div>
              )}
            </div>
          )}

          {activeTab === "patterns" && (
            <div className="p-4">
              <div className="mb-3 text-xs text-muted">
                <strong className="text-fg">40 patterns found</strong> (based on 10,000 samples over 65,492 events)
              </div>
              <div className="grid grid-cols-[80px_100px_100px_1fr] border-b border-border px-3 py-2 text-[10px] uppercase tracking-wider text-muted">
                <span>Matches</span>
                <span>~Volume</span>
                <span>Service</span>
                <span>Pattern</span>
              </div>
              {PATTERNS.map((p, i) => (
                <div key={i} className="grid grid-cols-[80px_100px_100px_1fr] items-center border-b border-fg/3 px-3 py-2.5 hover:bg-fg/3 transition-colors cursor-pointer">
                  <span className="font-mono text-[11px] text-fg">{p.matches}</span>
                  <div className="flex items-end gap-px h-5">
                    {[30, 50, 70, 85, 60, 40, 25].map((h, j) => (
                      <div key={j} className="w-1.5 rounded-t-sm bg-danger/40" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <span className="font-mono text-[11px] text-accent">{p.service}</span>
                  <span className="font-mono text-[11px] text-muted truncate">{p.text}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="flex flex-col items-center justify-center py-20 text-sm text-muted gap-2">
              <span>Transaction view requires correlated trace IDs</span>
              <span className="text-[11px] text-dimmed">Enable distributed tracing in pipeline settings to use this view</span>
            </div>
          )}
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}
