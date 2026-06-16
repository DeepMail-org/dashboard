"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, X, ArrowRight, Shield, Zap, FileText, Globe, Hash } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLayoutStore } from "@/stores/layout-store";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SearchResult {
  id: string;
  type: "page" | "detection" | "ioc" | "cve" | "case";
  title: string;
  subtitle?: string;
  href: string;
}

const TYPE_ICONS: Record<SearchResult["type"], React.ElementType> = {
  page: Hash,
  detection: Shield,
  ioc: Globe,
  cve: Zap,
  case: FileText,
};

const QUICK_LINKS = [
  { label: "Dashboard", href: "/dashboard", type: "page" as const },
  { label: "Detections", href: "/detections", type: "page" as const },
  { label: "Threat Intelligence", href: "/threat-intel", type: "page" as const },
  { label: "MITRE ATT&CK", href: "/mitre-attack", type: "page" as const },
  { label: "Vulnerabilities", href: "/vulnerabilities", type: "page" as const },
  { label: "Log Explorer", href: "/log-explorer", type: "page" as const },
  { label: "Graph Analysis", href: "/graph-analysis", type: "page" as const },
  { label: "Cases", href: "/cases", type: "page" as const },
  { label: "Sandbox", href: "/sandbox", type: "page" as const },
  { label: "Settings → Appearance", href: "/settings", type: "page" as const },
];

const MOCK_RESULTS: SearchResult[] = [
  { id: "d1", type: "detection", title: "BEC Wire Transfer Pattern", subtitle: "Critical · DM-PHI-001", href: "/detections" },
  { id: "d2", type: "detection", title: "Emotet Dropper Signature", subtitle: "Critical · DM-MAL-014", href: "/detections" },
  { id: "i1", type: "ioc", title: "185.220.101.34", subtitle: "IP · C2 · Emotet · APT28", href: "/threat-intel" },
  { id: "i2", type: "ioc", title: "evil-cdn.ru", subtitle: "Domain · Malware Hosting", href: "/threat-intel" },
  { id: "c1", type: "cve", title: "CVE-2024-55956", subtitle: "Critical · 287 affected hosts", href: "/vulnerabilities/CVE-2024-55956" },
  { id: "cs1", type: "case", title: "CASE-2026-0891", subtitle: "BEC Attack · High · Unassigned", href: "/cases" },
];

export function AiSearchModal() {
  const commandOpen = useLayoutStore((s) => s.commandOpen);
  const setCommandOpen = useLayoutStore((s) => s.setCommandOpen);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length >= 2
    ? MOCK_RESULTS.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle?.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const suggestions = query.length === 0 ? QUICK_LINKS : [];
  const items = query.length >= 2 ? results : suggestions;

  const close = useCallback(() => {
    setCommandOpen(false);
    setQuery("");
    setFocused(0);
  }, [setCommandOpen]);

  // Auto-focus input on open
  useEffect(() => {
    if (commandOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!commandOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setFocused((p) => Math.min(p + 1, items.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setFocused((p) => Math.max(p - 1, 0)); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [commandOpen, items.length, close]);

  return (
    <AnimatePresence>
      {commandOpen && (
        <>
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm"
          />

          <motion.div
            key="search-modal"
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-24 z-50 w-full max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
            role="dialog"
            aria-label="Search"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search className="h-4.5 w-4.5 shrink-0 text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setFocused(0); }}
                placeholder="Search detections, IOCs, CVEs, cases, pages…"
                className="flex-1 bg-transparent text-[14px] text-fg outline-none placeholder:text-dimmed"
              />
              <div className="flex items-center gap-2">
                {query && (
                  <button onClick={() => setQuery("")}>
                    <X className="h-4 w-4 text-muted hover:text-fg" />
                  </button>
                )}
                <kbd className="rounded border border-border bg-fg/5 px-1.5 py-0.5 text-[10px] text-muted">Esc</kbd>
              </div>
            </div>

            {/* AI badge */}
            <div className="flex items-center gap-1.5 border-b border-border px-5 py-2">
              <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                <Zap className="h-2.5 w-2.5" />
                DeepMail AI
              </span>
              <span className="text-[11px] text-muted">Powered threat search across all data sources</span>
            </div>

            {/* Results / Quick links */}
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 && query.length >= 2 && (
                <div className="px-5 py-8 text-center text-sm text-muted">
                  No results for &quot;{query}&quot;
                </div>
              )}

              {items.length > 0 && (
                <>
                  <div className="px-5 py-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-dimmed">
                      {query ? "Results" : "Quick Navigation"}
                    </span>
                  </div>
                  {items.map((item, i) => {
                    const isResult = "type" in item && query.length >= 2;
                    const Icon = isResult ? TYPE_ICONS[(item as SearchResult).type] : Hash;
                    const href = (item as SearchResult).href ?? (item as typeof QUICK_LINKS[0]).href;
                    const title = (item as SearchResult).title ?? (item as typeof QUICK_LINKS[0]).label;
                    const subtitle = (item as SearchResult).subtitle;
                    return (
                      <Link
                        key={(item as SearchResult).id ?? title}
                        href={href}
                        onClick={close}
                        className={cn(
                          "flex items-center gap-3 px-5 py-2.5 transition-colors",
                          i === focused ? "bg-fg/8" : "hover:bg-fg/5",
                        )}
                        onMouseEnter={() => setFocused(i)}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
                          <Icon className="h-3.5 w-3.5 text-muted" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] text-fg">{title}</div>
                          {subtitle && (
                            <div className="truncate text-[11px] text-muted">{subtitle}</div>
                          )}
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-dimmed opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 border-t border-border px-5 py-3">
              <span className="flex items-center gap-1.5 text-[10px] text-dimmed">
                <kbd className="rounded border border-border px-1 py-px">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-dimmed">
                <kbd className="rounded border border-border px-1 py-px">Enter</kbd> Open
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-dimmed">
                <kbd className="rounded border border-border px-1 py-px">Esc</kbd> Close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
