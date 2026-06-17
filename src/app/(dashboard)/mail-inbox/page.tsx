"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MailSidebar } from "@/components/mail/sidebar/mail-sidebar";
import { MailList } from "@/components/mail/list/mail-list";
import { MailDetail } from "@/components/mail/detail/mail-detail";
import { useMailStore } from "@/stores/mail-store";
import { useEffect, useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useMockWebSocket } from "@/lib/mail/websocket";
import type { PanelSize } from "react-resizable-panels";

export default function MailInboxPage() {
  const layout = useMailStore((s) => s.layout);
  const setLayout = useMailStore((s) => s.setLayout);
  const [mounted, setMounted] = useState(false);

  useKeyboardShortcuts();
  useMockWebSocket();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Wait for hydration to avoid mismatch on layout

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden">
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-full w-full items-stretch"
      >
        <ResizablePanel 
          defaultSize={String(layout?.[0] ?? 15)} minSize="10" maxSize="25"
          onResize={(size: PanelSize) => setLayout([size.asPercentage, layout?.[1] ?? 35, layout?.[2] ?? 50])}
        >
          <MailSidebar />
        </ResizablePanel>
        
        <ResizableHandle className="w-px bg-border hover:w-1 hover:bg-accent/50 active:bg-accent transition-all cursor-col-resize" />
        
        <ResizablePanel 
          defaultSize={String(layout?.[1] ?? 35)} minSize="20" maxSize="45"
          onResize={(size: PanelSize) => setLayout([layout?.[0] ?? 15, size.asPercentage, layout?.[2] ?? 50])}
        >
          <MailList />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-border hover:w-1 hover:bg-accent/50 active:bg-accent transition-all cursor-col-resize" />
        
        <ResizablePanel 
          defaultSize={String(layout?.[2] ?? 50)} minSize="30"
          onResize={(size: PanelSize) => setLayout([layout?.[0] ?? 15, layout?.[1] ?? 35, size.asPercentage])}
        >
          <MailDetail />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
