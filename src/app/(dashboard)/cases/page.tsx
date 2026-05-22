"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderOpen, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, LayoutGrid,
} from "lucide-react";
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
type Status = "investigating" | "open" | "resolved" | "closed";

interface CaseItem {
  id: string;
  severity: Severity;
  title: string;
  entity: string;
  status: Status;
  statusLabel: string;
  created: string;
}

const DEMO_CASES: CaseItem[] = [
  { id: "CAS-8821", severity: "critical", title: "BEC Attempt - Wire Transfer Request", entity: "finance@corp.com", status: "investigating", statusLabel: "Investigating", created: "10 min ago" },
  { id: "CAS-8820", severity: "high", title: "Credential Harvesting via Fake Login Page", entity: "sales_team@corp.com", status: "open", statusLabel: "Open", created: "45 min ago" },
  { id: "CAS-8819", severity: "medium", title: "Suspicious Attachment - Macro Enabled Excel", entity: "hr@corp.com", status: "resolved", statusLabel: "Resolved", created: "2 hours ago" },
  { id: "CAS-8818", severity: "medium", title: "Multiple Failed Login Attempts Followed by Success", entity: "j.doe@corp.com", status: "closed", statusLabel: "Closed (False Positive)", created: "5 hours ago" },
  { id: "CAS-8817", severity: "high", title: "Ransomware Signature Detected in ZIP", entity: "ops@corp.com", status: "resolved", statusLabel: "Resolved (Blocked)", created: "1 day ago" },
  { id: "CAS-8816", severity: "critical", title: "Malware Payload in ISO Attachment (Emotet)", entity: "engineering@corp.com", status: "investigating", statusLabel: "Investigating", created: "1 day ago" },
  { id: "CAS-8815", severity: "high", title: "Spearphishing Campaign Targeting C-Suite", entity: "exec@corp.com", status: "investigating", statusLabel: "Investigating", created: "2 days ago" },
  { id: "CAS-8814", severity: "low", title: "Anomalous Mail Forwarding Rule Created", entity: "m.jones@corp.com", status: "open", statusLabel: "Open", created: "2 days ago" },
];

const SEV_PILL: Record<Severity, string> = {
  critical: "text-danger bg-danger/10 border border-danger/20",
  high: "text-orange bg-orange/10 border border-orange/20",
  medium: "text-warning bg-warning/10 border border-warning/20",
  low: "text-muted bg-fg/5 border border-border",
};

const STATUS_COLOR: Record<Status, string> = {
  investigating: "text-accent",
  open: "text-blue-400",
  resolved: "text-success",
  closed: "text-muted",
};

const columnHelper = createColumnHelper<CaseItem>();

const columns = [
  columnHelper.accessor("id", {
    header: "Case ID",
    cell: (info) => <span className="font-mono text-[13px] text-accent">{info.getValue()}</span>,
  }),
  columnHelper.accessor("severity", {
    header: "Severity",
    cell: (info) => (
      <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium capitalize ${SEV_PILL[info.getValue()]}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => <span className="text-[13px] text-fg">{info.getValue()}</span>,
  }),
  columnHelper.accessor("entity", {
    header: "Affected Entity",
    cell: (info) => <span className="text-[13px] text-muted">{info.getValue()}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const row = info.row.original;
      return (
        <span className={`flex items-center gap-1.5 text-[13px] ${STATUS_COLOR[info.getValue()]}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {row.statusLabel}
        </span>
      );
    },
  }),
  columnHelper.accessor("created", {
    header: "Created",
    cell: (info) => <span className="font-mono text-xs text-muted">{info.getValue()}</span>,
    enableSorting: false,
  }),
];

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp className="h-2.5 w-2.5" />;
  if (sorted === "desc") return <ArrowDown className="h-2.5 w-2.5" />;
  return <ArrowUpDown className="h-2.5 w-2.5 opacity-40" />;
}

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [filterSev, setFilterSev] = useState<Severity | "all">("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => {
    let cases = DEMO_CASES;
    if (filterSev !== "all") cases = cases.filter((c) => c.severity === filterSev);
    return cases;
  }, [filterSev]);

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

  return (
    <div className="mx-auto w-full max-w-350 p-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-lg font-medium text-fg">Case Management</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/cases/board"
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-fg"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Board View
          </Link>
          <button className="flex items-center gap-2 rounded-md bg-fg px-4 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-90">
            <Plus className="h-3.5 w-3.5" />
            New Case
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 bg-transparent text-xs text-fg placeholder:text-muted outline-none"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSev(s)}
              className={`rounded px-2.5 py-1 text-[11px] capitalize transition-colors ${
                filterSev === s ? "bg-fg/8 text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 shadow-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer bg-fg/2 px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-muted transition-colors select-none hover:bg-fg/4 hover:text-fg"
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
                  <TableCell key={cell.id} className="border-b border-fg/3 px-6 py-3.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-6 py-12 text-center text-sm text-muted">
                  No cases match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
