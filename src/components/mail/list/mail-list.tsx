import { useMailStore } from "@/stores/mail-store";
import { useMails } from "@/hooks/use-mail";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Severity } from "@/lib/mail/types";

const SEVERITY_STYLES: Record<Severity, { badge: string; avatar: string }> = {
  critical: { badge: "text-danger bg-danger/10 border border-danger/20", avatar: "bg-danger/15 text-danger" },
  high: { badge: "text-orange bg-orange/10 border border-orange/20", avatar: "bg-orange/15 text-orange" },
  medium: { badge: "text-warning bg-warning/10 border border-warning/20", avatar: "bg-warning/15 text-warning" },
  clean: { badge: "text-success bg-success/10 border border-success/20", avatar: "bg-success/15 text-success" },
};

export function MailList() {
  const filters = useMailStore((s) => s.filters);
  const setFilters = useMailStore((s) => s.setFilters);
  const selectedMailId = useMailStore((s) => s.selectedMailId);
  const setSelectedMailId = useMailStore((s) => s.setSelectedMailId);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useMails(filters);

  // Flatten pages
  const allMails = data ? data.pages.flatMap((d) => d.data) : [];

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allMails.length + 1 : allMails.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 110,
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) {
      return;
    }

    if (lastItem.index >= allMails.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, allMails.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()]);

  // Set initial selected item if null
  useEffect(() => {
    if (!selectedMailId && allMails.length > 0) {
      setSelectedMailId(allMails[0].id);
    }
  }, [allMails, selectedMailId, setSelectedMailId]);

  return (
    <div className="flex h-full flex-col border-r border-border">
      {/* List Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/40 transition-all">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search emails, subjects, IP..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full bg-transparent text-[13px] text-fg placeholder:text-muted outline-none"
          />
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilters({ ...filters, unreadOnly: !filters.unreadOnly })}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                filters.unreadOnly ? "bg-accent text-white" : "text-muted hover:bg-surface-hover hover:text-fg"
              )}
            >
              Unread
            </button>
            <button 
              onClick={() => setFilters({ ...filters, hasAttachments: !filters.hasAttachments })}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                filters.hasAttachments ? "bg-accent text-white" : "text-muted hover:bg-surface-hover hover:text-fg"
              )}
            >
              Has attachment
            </button>
          </div>
        </div>
      </div>

      {/* Virtualized List */}
      <div ref={parentRef} className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {status === "pending" ? (
          <div className="p-8 text-center text-sm text-muted">Loading emails...</div>
        ) : status === "error" ? (
          <div className="p-8 text-center text-sm text-danger">Error loading emails</div>
        ) : allMails.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">No emails found.</div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > allMails.length - 1;
              const mail = allMails[virtualRow.index];

              if (isLoaderRow) {
                return (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="flex items-center justify-center border-b border-border text-muted"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                );
              }

              const isSelected = selectedMailId === mail.id;

              return (
                <button
                  key={mail.id}
                  onClick={() => setSelectedMailId(mail.id)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={cn(
                    "flex w-full flex-col border-b border-border px-4 py-3 text-left transition-colors",
                    isSelected ? "bg-accent/10 border-l-2 border-l-accent pl-[14px]" : "hover:bg-fg/5 pl-4"
                  )}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9px] font-bold", SEVERITY_STYLES[mail.severity].avatar)}>
                        {mail.initials}
                      </div>
                      <span className={cn("truncate text-[13px]", mail.unread ? "font-semibold text-fg" : "font-medium text-secondary")}>
                        {mail.sender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {mail.attachments.length > 0 && <span className="text-muted text-[10px]"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></span>}
                      {mail.starred && <span className="text-orange text-[10px]"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>}
                      <span className="shrink-0 font-mono text-[10px] text-muted">{mail.time}</span>
                    </div>
                  </div>

                  <div className="mt-1 flex w-full items-center justify-between gap-2 min-w-0">
                    <span className={cn("truncate text-[13px]", mail.unread ? "font-semibold text-fg" : "text-fg/80")}>
                      {mail.subject}
                    </span>
                  </div>
                  
                  <div className="mt-0.5 truncate text-[11px] text-muted">
                    {mail.preview}
                  </div>

                  <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar">
                    {mail.threat && (
                      <span className={cn("shrink-0 rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider", SEVERITY_STYLES[mail.severity].badge)}>
                        {Math.round(mail.threat.confidence)}% {mail.threat.classification.split(' ')[0]}
                      </span>
                    )}
                    {mail.labels.map(label => (
                      <span key={label} className="shrink-0 rounded-[4px] border border-border bg-surface px-1.5 py-0.5 text-[9px] font-semibold text-muted">
                        {label}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
