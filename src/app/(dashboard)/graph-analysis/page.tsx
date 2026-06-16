"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Plus, ChevronRight, Network } from "lucide-react";
import { cn } from "@/lib/utils";

interface GraphNode {
  id: string;
  label: string;
  type: "ip" | "domain" | "hash" | "email" | "host" | "adversary";
  severity?: "critical" | "high" | "medium" | "low";
  x: number;
  y: number;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

const NODE_COLORS: Record<string, string> = {
  ip:        "#ef4444",  // danger
  domain:    "#3b82f6",  // info
  hash:      "#f59e0b",  // warning
  email:     "#8b5cf6",  // purple
  host:      "#06b6d4",  // accent
  adversary: "#f97316",  // orange
};

const MOCK_NODES: GraphNode[] = [
  { id: "n1", label: "185.220.101.34", type: "ip", severity: "critical", x: 400, y: 200 },
  { id: "n2", label: "evil-cdn.ru", type: "domain", severity: "critical", x: 600, y: 300 },
  { id: "n3", label: "SE-KTH-RDP", type: "host", x: 200, y: 300 },
  { id: "n4", label: "macro_doc.xlsm", type: "hash", severity: "high", x: 400, y: 400 },
  { id: "n5", label: "alice.kim@acme.com", type: "email", x: 200, y: 150 },
  { id: "n6", label: "TA542 (Emotet)", type: "adversary", x: 600, y: 150 },
  { id: "n7", label: "dhl-tracking.info", type: "domain", severity: "medium", x: 700, y: 400 },
];

const MOCK_EDGES: GraphEdge[] = [
  { source: "n1", target: "n2", label: "hosts" },
  { source: "n1", target: "n3", label: "contacted by" },
  { source: "n3", target: "n4", label: "executed" },
  { source: "n5", target: "n4", label: "received" },
  { source: "n6", target: "n1", label: "uses" },
  { source: "n6", target: "n2", label: "uses" },
  { source: "n2", target: "n7", label: "aliases" },
];

function GraphCanvas({ nodes, edges, selected, onSelect }: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.3, Math.min(3, z - e.deltaY * 0.001)));
  };

  return (
    <svg
      ref={svgRef}
      className="w-full h-full cursor-grab"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={(e) => { if (e.target === svgRef.current) onSelect(null); }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#444" />
        </marker>
      </defs>

      <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
        {/* Edges */}
        {edges.map((edge, i) => {
          const s = nodeById[edge.source];
          const t = nodeById[edge.target];
          if (!s || !t) return null;
          const mx = (s.x + t.x) / 2;
          const my = (s.y + t.y) / 2;
          return (
            <g key={i}>
              <line
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke="#333" strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
                strokeDasharray="4 2"
              />
              <text x={mx} y={my - 6} textAnchor="middle" fontSize="9" fill="#666">
                {edge.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isSelected = selected === node.id;
          const color = NODE_COLORS[node.type];
          return (
            <g
              key={node.id}
              onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
              className="cursor-pointer"
            >
              {/* Selection ring */}
              {isSelected && (
                <circle cx={node.x} cy={node.y} r="28" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
              )}
              {/* Node circle */}
              <circle
                cx={node.x} cy={node.y} r="20"
                fill={`${color}22`} stroke={color} strokeWidth={isSelected ? 2.5 : 1.5}
              />
              {/* Label */}
              <text x={node.x} y={node.y + 34} textAnchor="middle" fontSize="10" fill="#aaa">
                {node.label.length > 18 ? node.label.slice(0, 18) + "…" : node.label}
              </text>
              {/* Type icon letter */}
              <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill={color}>
                {node.type.slice(0, 1).toUpperCase()}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default function GraphAnalysisPage() {
  const [nodes] = useState<GraphNode[]>(MOCK_NODES);
  const [edges] = useState<GraphEdge[]>(MOCK_EDGES);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const selectedNode = nodes.find((n) => n.id === selected);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3 bg-surface/80">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-fg">Graph Analysis</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes…"
            className="w-36 bg-transparent text-xs text-fg outline-none placeholder:text-dimmed"
          />
        </div>
        <div className="flex gap-1">
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1 text-[10px] text-muted px-2 py-1 rounded bg-fg/5">
              <span className="h-2 w-2 rounded-full" style={{ background: color }} />
              {type}
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-[11px] text-dimmed">
          <span>Drag to pan · Scroll to zoom · Click node for details</span>
        </div>
      </div>

      {/* Canvas + Detail panel */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-bg relative">
          <GraphCanvas nodes={nodes} edges={edges} selected={selected} onSelect={setSelected} />
          {/* Stats overlay */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl border border-border bg-surface/80 px-4 py-2.5 backdrop-blur-sm">
            <span className="text-[11px] text-muted">{nodes.length} nodes</span>
            <span className="text-dimmed">·</span>
            <span className="text-[11px] text-muted">{edges.length} edges</span>
          </div>
        </div>

        {/* Right panel: Node detail */}
        {selectedNode && (
          <div className="w-72 shrink-0 border-l border-border bg-surface overflow-y-auto">
            <div className="border-b border-border px-5 py-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted">{selectedNode.type}</p>
              <h2 className="mt-1 font-mono text-[13px] font-bold text-fg break-all">{selectedNode.label}</h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-wider text-muted">Connected To</p>
                <div className="space-y-1.5">
                  {edges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((e, i) => {
                      const otherId = e.source === selectedNode.id ? e.target : e.source;
                      const other = nodes.find((n) => n.id === otherId);
                      return (
                        <button
                          key={i}
                          onClick={() => setSelected(otherId)}
                          className="flex w-full items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-left transition-colors hover:border-accent/30 hover:bg-accent/5"
                        >
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: NODE_COLORS[other?.type ?? "ip"] }} />
                          <div className="min-w-0">
                            <p className="truncate font-mono text-[11px] text-fg">{other?.label}</p>
                            <p className="text-[10px] text-dimmed">{e.label}</p>
                          </div>
                          <ChevronRight className="ml-auto h-3 w-3 shrink-0 text-dimmed" />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
