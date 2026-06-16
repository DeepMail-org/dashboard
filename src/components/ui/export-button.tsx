"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

type ExportFormat = "csv" | "json" | "ndjson";

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void | Promise<void>;
  formats?: ExportFormat[];
  className?: string;
  disabled?: boolean;
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  csv: "Export as CSV",
  json: "Export as JSON",
  ndjson: "Export as NDJSON",
};

export function ExportButton({
  onExport,
  formats = ["csv", "json"],
  className,
  disabled = false,
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleExport = async (fmt: ExportFormat) => {
    setOpen(false);
    setLoading(true);
    try {
      await onExport(fmt);
      toast.success(`Exported as ${fmt.toUpperCase()}`);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-secondary transition-colors hover:bg-surface-hover hover:text-fg",
          (disabled || loading) && "opacity-50 cursor-not-allowed",
        )}
      >
        <Download className="h-3.5 w-3.5" />
        {loading ? "Exporting…" : "Export"}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1 min-w-40 overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
          >
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleExport(fmt)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-[12px] text-secondary transition-colors hover:bg-surface-hover hover:text-fg"
              >
                {FORMAT_LABELS[fmt]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
