"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MailSidebar } from "@/components/mail/sidebar/mail-sidebar";
import { MailList } from "@/components/mail/list/mail-list";
import { MailDetail } from "@/components/mail/detail/mail-detail";
import { useMailStore } from "@/stores/mail-store";
import { useEffect, useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useMockWebSocket } from "@/lib/mail/websocket";
import type { PanelSize, Layout } from "react-resizable-panels";
import { X, Send, Paperclip, Mic, Image as ImageIcon, Maximize2, Minus } from "lucide-react";
import { useRef } from "react";

export default function MailInboxPage() {
  const layout = useMailStore((s) => s.layout);
  const setLayout = useMailStore((s) => s.setLayout);
  const composeState = useMailStore((s) => s.composeState);
  const setComposeState = useMailStore((s) => s.setComposeState);
  const composeData = useMailStore((s) => s.composeData);
  const setComposeData = useMailStore((s) => s.setComposeData);
  const [mounted, setMounted] = useState(false);
  const composeRef = useRef<HTMLDivElement>(null);

  useKeyboardShortcuts();
  useMockWebSocket();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (composeState === "open" && composeRef.current && !composeRef.current.contains(event.target as Node)) {
        // Only minimize if they didn't click the compose button in sidebar
        // Hacky way: check if it's a button with compose class, but let's just minimize
        const target = event.target as Element;
        if (!target.closest('button[data-compose="true"]')) {
          setComposeState("minimized");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [composeState, setComposeState]);

  if (!mounted) return null; // Wait for hydration to avoid mismatch on layout

  return (
    <PageWrapper noPadding>
      <div className="flex h-full w-full flex-col overflow-hidden relative">
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-full w-full items-stretch"
        onLayoutChanged={(sizes: Layout) => {
          if (sizes.sidebar && sizes.list && sizes.detail) {
            setLayout([sizes.sidebar, sizes.list, sizes.detail]);
          }
        }}
      >
        <ResizablePanel 
          id="sidebar"
          defaultSize={String(layout?.[0] ?? 15)} minSize="10" maxSize="25"
        >
          <MailSidebar />
        </ResizablePanel>
        
        <ResizableHandle className="w-px bg-border hover:w-1 hover:bg-accent/50 active:bg-accent transition-all cursor-col-resize" />
        
        <ResizablePanel 
          id="list"
          defaultSize={String(layout?.[1] ?? 35)} minSize="20" maxSize="45"
        >
          <MailList />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-border hover:w-1 hover:bg-accent/50 active:bg-accent transition-all cursor-col-resize" />
        
        <ResizablePanel 
          id="detail"
          defaultSize={String(layout?.[2] ?? 50)} minSize="30"
        >
          <MailDetail />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Global Compose Modal */}
      {composeState !== "closed" && (
        <div 
          ref={composeRef}
          className={`fixed bottom-0 right-16 z-50 flex w-[480px] flex-col rounded-t-xl border border-border bg-surface shadow-2xl transition-all duration-300 ease-in-out ${composeState === "minimized" ? "h-12 translate-y-0" : "h-[500px]"}`}
        >
          <div 
            className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-3 rounded-t-xl cursor-pointer"
            onClick={() => setComposeState(composeState === "minimized" ? "open" : "minimized")}
          >
            <span className="text-[13px] font-semibold text-fg">New Message</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setComposeState("minimized"); }} 
                className="text-muted hover:text-fg"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setComposeState("closed"); }} 
                className="text-muted hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {composeState === "open" && (
            <div className="flex flex-col h-full bg-bg">
              <div className="flex flex-col px-4 pt-2 space-y-0">
                <input 
                  type="text" 
                  placeholder="To" 
                  value={composeData.to}
                  onChange={(e) => setComposeData({ to: e.target.value })}
                  className="w-full border-b border-border bg-transparent py-2.5 text-[13px] outline-none placeholder:text-muted focus:border-accent/40" 
                />
                <input 
                  type="text" 
                  placeholder="Subject" 
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ subject: e.target.value })}
                  className="w-full border-b border-border bg-transparent py-2.5 text-[13px] font-semibold outline-none placeholder:text-muted focus:border-accent/40" 
                />
              </div>
              <textarea 
                placeholder="Write something..." 
                value={composeData.body}
                onChange={(e) => setComposeData({ body: e.target.value })}
                className="flex-1 w-full resize-none bg-transparent p-4 text-[13px] outline-none placeholder:text-muted" 
              />
              <div className="flex items-center justify-between border-t border-border bg-surface-2 px-4 py-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button className="text-muted hover:text-fg p-1.5 rounded hover:bg-surface"><Paperclip className="h-4 w-4" /></button>
                  <button className="text-muted hover:text-fg p-1.5 rounded hover:bg-surface"><ImageIcon className="h-4 w-4" /></button>
                  <button className="text-muted hover:text-fg p-1.5 rounded hover:bg-surface"><Mic className="h-4 w-4" /></button>
                </div>
                <button 
                  onClick={() => {
                    setComposeState("closed");
                    setComposeData({ to: "", subject: "", body: "" });
                  }} 
                  className="flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-[12px] font-bold text-white hover:bg-accent/90 transition-colors shadow-sm"
                >
                  Send <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </PageWrapper>
  );
}
