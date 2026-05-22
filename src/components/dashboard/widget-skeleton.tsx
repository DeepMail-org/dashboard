"use client";

export function WidgetSkeleton() {
  return (
    <div className="h-full w-full animate-pulse rounded-lg bg-surface p-4">
      <div className="mb-3 h-3 w-1/3 rounded bg-border" />
      <div className="space-y-2">
        <div className="h-2 w-full rounded bg-border" />
        <div className="h-2 w-2/3 rounded bg-border" />
      </div>
      <div className="mt-4 h-[60%] w-full rounded-md bg-border/50" />
    </div>
  );
}
