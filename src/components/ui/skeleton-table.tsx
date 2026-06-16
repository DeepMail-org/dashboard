"use client";

import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function SkeletonTable({ rows = 8, cols = 6, className }: SkeletonTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      {/* Header */}
      <div className="flex gap-4 border-b border-border bg-fg/2 px-5 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="h-3 animate-pulse rounded bg-fg/10"
            style={{ width: `${60 + Math.random() * 80}px` }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex gap-4 border-b border-fg/5 px-5 py-4 last:border-0"
        >
          {Array.from({ length: cols }).map((_, col) => (
            <div
              key={col}
              className="h-3 animate-pulse rounded bg-fg/7"
              style={{
                width: `${50 + Math.random() * 100}px`,
                animationDelay: `${(row * cols + col) * 30}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-border bg-surface",
        className,
      )}
    >
      <div className="p-4">
        <div className="mb-3 h-3 w-24 rounded bg-fg/10" />
        <div className="h-8 w-32 rounded bg-fg/10" />
      </div>
    </div>
  );
}
