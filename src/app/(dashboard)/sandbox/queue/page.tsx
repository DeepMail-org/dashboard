"use client";

import { useMemo, useState, useRef } from "react";
import { useSandboxStore, SandboxTask } from "@/stores/sandbox-store";
import { useRouter } from "next/navigation";
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  flexRender, 
  createColumnHelper,
  SortingState
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ShieldAlert, CheckCircle, Activity, Clock, MoreHorizontal, PlayCircle, Settings, Download, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<SandboxTask>();

const VERDICT_COLORS = {
  malicious: "text-danger bg-danger/10 border-danger/30",
  suspicious: "text-warning bg-warning/10 border-warning/30",
  clean: "text-success bg-success/10 border-success/30",
  unknown: "text-muted bg-surface border-border",
};

export default function SandboxQueuePage() {
  const tasks = useSandboxStore((s) => s.tasks);
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

  const columns = useMemo(() => [
    columnHelper.accessor('status', {
      header: 'State',
      size: 100,
      cell: (info) => {
        const val = info.getValue();
        return (
          <div className="flex items-center gap-1.5">
            {val === "running" && <Activity className="h-3.5 w-3.5 text-accent animate-pulse" />}
            {val === "pending" && <Clock className="h-3.5 w-3.5 text-muted" />}
            {val === "completed" && <CheckCircle className="h-3.5 w-3.5 text-success" />}
            {val === "failed" && <XCircle className="h-3.5 w-3.5 text-danger" />}
            {val === "cancelled" && <XCircle className="h-3.5 w-3.5 text-muted" />}
            <span className="capitalize text-[11px] font-medium">{val}</span>
          </div>
        );
      }
    }),
    columnHelper.accessor('name', {
      header: 'Sample Name',
      size: 250,
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-200 text-[12px] truncate max-w-[230px] group-hover:text-white transition-colors">{info.getValue()}</span>
          <span className="font-mono text-[9px] text-gray-500">{info.row.original.id}</span>
        </div>
      )
    }),
    columnHelper.accessor('verdict', {
      header: 'Verdict',
      size: 100,
      cell: (info) => {
        const val = info.getValue() || "unknown";
        return (
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border", VERDICT_COLORS[val])}>
            {val}
          </span>
        );
      }
    }),
    columnHelper.accessor('risk', {
      header: 'Risk',
      size: 80,
      cell: (info) => {
        const val = info.getValue();
        if (val === undefined) return <span className="text-muted">-</span>;
        return (
          <div className="flex items-center gap-2">
            <span className={cn("text-[11px] font-mono", val > 75 ? "text-danger" : val > 40 ? "text-warning" : "text-success")}>
              {val}
            </span>
          </div>
        );
      }
    }),
    columnHelper.accessor('worker', {
      header: 'Worker Node',
      size: 120,
      cell: (info) => <span className="font-mono text-[11px] text-muted">{info.getValue() || "Unassigned"}</span>
    }),
    columnHelper.accessor('tenant', {
      header: 'Tenant',
      size: 100,
      cell: (info) => <span className="text-[11px] text-muted truncate max-w-[90px]">{info.getValue()}</span>
    }),
    columnHelper.accessor('createdAt', {
      header: 'Submitted',
      size: 120,
      cell: (info) => <span className="text-[11px] text-muted">{new Date(info.getValue()).toLocaleString()}</span>
    }),
    columnHelper.display({
      id: 'actions',
      size: 60,
      cell: () => (
        <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )
    })
  ], []);

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-white">
      {/* EC2 Style Sub-Header Action Bar */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f1115] shrink-0">
        <h1 className="text-lg font-bold text-white">Sandbox Instances</h1>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0f1115] border border-white/10 text-[11px] font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <PlayCircle className="h-3.5 w-3.5" /> Re-analyze
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-[11px] font-medium text-rose-400 hover:bg-rose-500/20 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Terminate
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0f1115] border border-white/10 text-[11px] font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <Download className="h-3.5 w-3.5" /> Export JSON
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0f1115] border border-white/10 text-[11px] font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Virtualized Data Grid */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        <div style={{ height: `${virtualizer.getTotalSize()}px` }} className="w-full relative">
          <div className="absolute top-0 left-0 w-full sticky z-10 bg-[#0f1115] border-b border-white/5 shadow-sm">
            {table.getHeaderGroups().map(headerGroup => (
              <div key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map(header => (
                  <div
                    key={header.id}
                    className="flex items-center px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 select-none"
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div 
            style={{ 
              transform: `translateY(${virtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <div
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  onClick={() => router.push(`/sandbox/task/${row.original.id}`)}
                  className="flex w-full border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group h-12"
                >
                  {row.getVisibleCells().map(cell => (
                    <div
                      key={cell.id}
                      className="flex items-center px-4 py-2"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
