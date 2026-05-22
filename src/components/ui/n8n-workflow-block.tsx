"use client";

import { motion, type PanInfo } from "framer-motion";
import type React from "react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Plus } from "lucide-react";

export interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  from: string;
  to: string;
}

export interface N8nWorkflowBlockProps {
  initialNodes: WorkflowNode[];
  initialConnections: WorkflowConnection[];
  nodeTemplates: Omit<WorkflowNode, "id" | "position">[];
  colorClasses: Record<string, string>;
  title?: string;
  statusLabel?: string;
  statusColor?: string;
  readOnly?: boolean;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

function WorkflowConnectionLine({
  from,
  to,
  nodes,
}: {
  from: string;
  to: string;
  nodes: WorkflowNode[];
}) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  const startX = fromNode.position.x + NODE_WIDTH;
  const startY = fromNode.position.y + NODE_HEIGHT / 2;
  const endX = toNode.position.x;
  const endY = toNode.position.y + NODE_HEIGHT / 2;

  const cp1X = startX + (endX - startX) * 0.5;
  const cp2X = endX - (endX - startX) * 0.5;

  const path = `M${startX},${startY} C${cp1X},${startY} ${cp2X},${endY} ${endX},${endY}`;

  return (
    <path
      d={path}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeDasharray="8,6"
      strokeLinecap="round"
      opacity={0.35}
      className="text-fg"
    />
  );
}

export function N8nWorkflowBlock({
  initialNodes: initNodes,
  initialConnections: initConns,
  nodeTemplates,
  colorClasses,
  title = "Workflow Builder",
  statusLabel = "Active",
  statusColor = "emerald",
  readOnly = false,
}: N8nWorkflowBlockProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initNodes);
  const [connections, setConnections] = useState<WorkflowConnection[]>(initConns);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [contentSize, setContentSize] = useState(() => {
    const maxX = Math.max(...initNodes.map((n) => n.position.x + NODE_WIDTH));
    const maxY = Math.max(...initNodes.map((n) => n.position.y + NODE_HEIGHT));
    return { width: maxX + 50, height: maxY + 50 };
  });

  const handleDragStart = (nodeId: string) => {
    setDraggingNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      dragStartPosition.current = { x: node.position.x, y: node.position.y };
    }
  };

  const handleDrag = (nodeId: string, { offset }: PanInfo) => {
    if (draggingNodeId !== nodeId || !dragStartPosition.current) return;

    const newX = Math.max(0, dragStartPosition.current.x + offset.x);
    const newY = Math.max(0, dragStartPosition.current.y + offset.y);

    flushSync(() => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId ? { ...node, position: { x: newX, y: newY } } : node,
        ),
      );
    });

    setContentSize((prev) => ({
      width: Math.max(prev.width, newX + NODE_WIDTH + 50),
      height: Math.max(prev.height, newY + NODE_HEIGHT + 50),
    }));
  };

  const handleDragEnd = () => {
    setDraggingNodeId(null);
    dragStartPosition.current = null;
  };

  const addNode = () => {
    const template = nodeTemplates[Math.floor(Math.random() * nodeTemplates.length)];
    const lastNode = nodes[nodes.length - 1];
    const newPosition = lastNode
      ? { x: lastNode.position.x + 250, y: lastNode.position.y }
      : { x: 50, y: 100 };

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      ...template,
      position: newPosition,
    };

    flushSync(() => {
      setNodes((prev) => [...prev, newNode]);
      if (lastNode) {
        setConnections((prev) => [...prev, { from: lastNode.id, to: newNode.id }]);
      }
    });

    setContentSize((prev) => ({
      width: Math.max(prev.width, newPosition.x + NODE_WIDTH + 50),
      height: Math.max(prev.height, newPosition.y + NODE_HEIGHT + 50),
    }));

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.scrollTo({
        left: newPosition.x + NODE_WIDTH - canvas.clientWidth + 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-surface/60 p-4 backdrop-blur sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${colorClasses[statusColor] ?? ""}`}
          >
            {statusLabel}
          </Badge>
          <span className="text-xs uppercase tracking-widest text-muted sm:text-sm">
            {title}
          </span>
        </div>
        {!readOnly && (
          <Button
            variant="outline"
            size="sm"
            onClick={addNode}
            className="h-8 gap-2 rounded-lg text-xs uppercase tracking-wider text-secondary hover:text-fg"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Node</span>
          </Button>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative h-[500px] w-full overflow-auto rounded-xl border border-border/50 bg-base/40 md:h-[600px]"
        role="region"
        aria-label="Workflow canvas"
        tabIndex={0}
      >
        <div
          className="relative"
          style={{ minWidth: contentSize.width, minHeight: contentSize.height }}
        >
          <svg
            className="pointer-events-none absolute left-0 top-0"
            width={contentSize.width}
            height={contentSize.height}
            style={{ overflow: "visible" }}
          >
            {connections.map((c) => (
              <WorkflowConnectionLine
                key={`${c.from}-${c.to}`}
                from={c.from}
                to={c.to}
                nodes={nodes}
              />
            ))}
          </svg>

          {nodes.map((node) => {
            const Icon = node.icon;
            const isDragging = draggingNodeId === node.id;

            return (
              <motion.div
                key={node.id}
                drag
                dragMomentum={false}
                dragConstraints={{ left: 0, top: 0, right: 100000, bottom: 100000 }}
                onDragStart={() => handleDragStart(node.id)}
                onDrag={(_, info) => handleDrag(node.id, info)}
                onDragEnd={handleDragEnd}
                style={{
                  x: node.position.x,
                  y: node.position.y,
                  width: NODE_WIDTH,
                  transformOrigin: "0 0",
                }}
                className="absolute cursor-grab"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
              >
                <Card
                  className={`group/node relative w-full overflow-hidden rounded-xl border p-3 backdrop-blur transition-all hover:shadow-lg ${colorClasses[node.color] ?? ""} bg-surface/70 ${isDragging ? "shadow-xl ring-2 ring-accent/50" : ""}`}
                >
                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border backdrop-blur ${colorClasses[node.color] ?? ""} bg-surface/80`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className="mb-0.5 rounded-full border-border/40 bg-surface/80 px-1.5 py-0 text-[9px] uppercase tracking-wider text-muted"
                        >
                          {node.type}
                        </Badge>
                        <h3 className="truncate text-xs font-semibold tracking-tight text-fg">
                          {node.title}
                        </h3>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-[10px] leading-relaxed text-secondary">
                      {node.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted">
                      <ArrowRight className="h-2.5 w-2.5" />
                      <span className="uppercase tracking-wider">Connected</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 bg-surface/40 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="uppercase tracking-wider">
              {nodes.length} {nodes.length === 1 ? "Node" : "Nodes"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="uppercase tracking-wider">
              {connections.length} {connections.length === 1 ? "Connection" : "Connections"}
            </span>
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-muted/60">
          Drag nodes to reposition
        </p>
      </div>
    </div>
  );
}
