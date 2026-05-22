"use client";

import { useState, useMemo } from "react";
import { Plus, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table, TableHeader, TableHead, TableBody, TableRow, TableCell,
} from "@/components/ui/table";

type Severity = "critical" | "high" | "medium" | "low";
type RuleTab = "all" | "custom" | "yara" | "sigma" | "ml";

interface DetectionRule {
  id: string;
  name: string;
  category: string;
  severity: Severity;
  hits24h: number;
  status: "Enabled" | "Testing" | "Disabled";
  lastTriggered: string;
  tab: RuleTab;
}

const DEMO_RULES: DetectionRule[] = [
  { id: "DM-PHI-001", name: "BEC Wire Transfer Pattern", category: "Phishing", severity: "critical", hits24h: 47, status: "Enabled", lastTriggered: "2 min ago", tab: "custom" },
  { id: "DM-MAL-014", name: "Emotet Dropper Signature", category: "Malware", severity: "critical", hits24h: 23, status: "Enabled", lastTriggered: "8 min ago", tab: "yara" },
  { id: "DM-CRD-007", name: "Credential Harvest Login Clone", category: "Credential", severity: "high", hits24h: 18, status: "Enabled", lastTriggered: "15 min ago", tab: "custom" },
  { id: "DM-C2-003", name: "C2 Beacon DNS Pattern", category: "C2", severity: "high", hits24h: 9, status: "Enabled", lastTriggered: "32 min ago", tab: "sigma" },
  { id: "DM-PHI-019", name: "Impersonation Display Name", category: "Phishing", severity: "medium", hits24h: 14, status: "Enabled", lastTriggered: "1h ago", tab: "custom" },
  { id: "DM-MAL-022", name: "Macro-Enabled Doc Heuristic", category: "Malware", severity: "medium", hits24h: 7, status: "Enabled", lastTriggered: "2h ago", tab: "sigma" },
  { id: "DM-SPM-041", name: "Bulk Sender Reputation Score", category: "Spam", severity: "low", hits24h: 312, status: "Enabled", lastTriggered: "1 min ago", tab: "custom" },
  { id: "DM-ML-002", name: "NLP Intent Classifier v3", category: "ML Model", severity: "high", hits24h: 56, status: "Enabled", lastTriggered: "30s ago", tab: "ml" },
  { id: "DM-YAR-008", name: "QakBot Payload YARA", category: "Malware", severity: "critical", hits24h: 3, status: "Testing", lastTriggered: "4h ago", tab: "yara" },
];

const SEV_PILL: Record<Severity, string> = {
  critical: "text-danger bg-danger/10 border border-danger/20",
  high: "text-orange bg-orange/10 border border-orange/20",
  medium: "text-warning bg-warning/10 border border-warning/20",
  low: "text-muted bg-fg/5 border border-border",
};

const STATUS_COLOR: Record<string, string> = {
  Enabled: "text-success",
  Testing: "text-muted",
  Disabled: "text-dimmed",
};

const STATS = [
  { value: "847", label: "Total Rules Active" },
  { value: "126", label: "Triggered Today", color: "text-danger" },
  { value: "94.2%", label: "True Positive Rate", color: "text-success" },
  { value: "12", label: "New Rules (7d)" },
];

const columnHelper = createColumnHelper<DetectionRule>();

const columns = [
  columnHelper.accessor("id", {
    header: "Rule ID",
    cell: (info) => <span className="font-mono text-xs text-accent">{info.getValue()}</span>,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="text-[13px] font-medium text-fg">{info.getValue()}</span>,
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => <span className="text-[13px] text-muted">{info.getValue()}</span>,
  }),
  columnHelper.accessor("severity", {
    header: "Severity",
    cell: (info) => (
      <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium capitalize ${SEV_PILL[info.getValue()]}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("hits24h", {
    header: "Hits (24h)",
    cell: (info) => <span className="font-mono text-[13px] text-fg">{info.getValue()}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <span className={`text-[13px] ${STATUS_COLOR[info.getValue()]}`}>{info.getValue()}</span>,
  }),
  columnHelper.accessor("lastTriggered", {
    header: "Last Triggered",
    cell: (info) => <span className="font-mono text-xs text-muted">{info.getValue()}</span>,
    enableSorting: false,
  }),
];

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp className="h-2.5 w-2.5" />;
  if (sorted === "desc") return <ArrowDown className="h-2.5 w-2.5" />;
  return <ArrowUpDown className="h-2.5 w-2.5 opacity-40" />;
}

export default function DetectionsPage() {
  const [activeTab, setActiveTab] = useState<RuleTab>("all");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => {
    if (activeTab === "all") return DEMO_RULES;
    return DEMO_RULES.filter((r) => r.tab === activeTab);
  }, [activeTab]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tabs: { key: RuleTab; label: string }[] = [
    { key: "all", label: "All Rules" },
    { key: "custom", label: "Custom" },
    { key: "yara", label: "YARA" },
    { key: "sigma", label: "Sigma" },
    { key: "ml", label: "ML Models" },
  ];

  return (
    <div className="mx-auto w-full max-w-350 p-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-lg font-medium text-fg">Detection Rules</h1>
        <button className="flex items-center gap-2 rounded-md bg-fg px-4 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-90">
          <Plus className="h-3.5 w-3.5" />
          New Rule
        </button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-4">
            <div className={`font-display text-2xl font-bold ${stat.color ?? "text-fg"}`}>
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 shadow-card">
        <div className="border-b border-border px-5 pt-5">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-t-md px-3 py-2 text-xs transition-colors ${
                  activeTab === tab.key ? "bg-fg/8 text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-border px-5 py-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted" />
            <input
              type="text"
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 bg-transparent text-xs text-fg placeholder:text-muted outline-none"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer bg-fg/2 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted transition-colors select-none hover:bg-fg/4 hover:text-fg"
                  >
                    <span className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <SortIcon sorted={header.column.getIsSorted()} />}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="transition-colors hover:bg-fg/3">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border-b border-fg/3 px-5 py-3.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
