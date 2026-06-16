"use client";

import { useState, useCallback } from "react";
import { X, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface FilterOption {
  value: string;
  label: string;
}

interface ActiveFilter {
  key: string;
  label: string;
  values: string[];
}

interface FilterChipBarProps {
  filters: Record<string, FilterOption[]>; // key → available options
  activeFilters: ActiveFilter[];
  onFilterChange: (key: string, values: string[]) => void;
  onClearAll: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasSelected = selected.length > 0;

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
          hasSelected
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-border bg-surface text-muted hover:border-border-hover hover:text-secondary",
        )}
      >
        {label}
        {hasSelected && (
          <span className="ml-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent/20 px-0.5 text-[9px] font-bold text-accent">
            {selected.length}
          </span>
        )}
        <ChevronDown className={cn("h-2.5 w-2.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute left-0 top-full z-50 mt-1 min-w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
            >
              <div className="border-b border-border px-3 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">{label}</p>
              </div>
              {options.map((opt) => {
                const isChecked = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-[12px] transition-colors",
                      isChecked ? "text-accent bg-accent/5" : "text-secondary hover:bg-surface-hover hover:text-fg",
                    )}
                  >
                    <div
                      className={cn(
                        "h-3.5 w-3.5 rounded border transition-colors",
                        isChecked ? "border-accent bg-accent" : "border-border",
                      )}
                    />
                    {opt.label}
                  </button>
                );
              })}
              {selected.length > 0 && (
                <div className="border-t border-border px-3 py-2">
                  <button
                    onClick={() => onChange([])}
                    className="text-[11px] text-danger hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterChipBar({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  rightSlot,
  className,
}: FilterChipBarProps) {
  const hasAnyActive = activeFilters.some((f) => f.values.length > 0);

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <div className="flex items-center gap-1 text-[11px] text-muted">
        <Filter className="h-3 w-3" />
        <span>Filters</span>
      </div>

      {Object.entries(filters).map(([key, options]) => {
        const active = activeFilters.find((f) => f.key === key);
        return (
          <FilterDropdown
            key={key}
            label={active?.label ?? key}
            options={options}
            selected={active?.values ?? []}
            onChange={(values) => onFilterChange(key, values)}
          />
        );
      })}

      {hasAnyActive && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-danger/40 hover:text-danger"
        >
          <X className="h-2.5 w-2.5" />
          Clear All
        </button>
      )}

      {rightSlot && <div className="ml-auto">{rightSlot}</div>}
    </div>
  );
}
