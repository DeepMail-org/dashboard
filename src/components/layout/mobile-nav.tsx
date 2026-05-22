"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLayoutStore } from "@/stores/layout-store";
import { Sidebar } from "./sidebar";

export function MobileNav() {
  const open = useLayoutStore((s) => s.sidebarMobileOpen);
  const setOpen = useLayoutStore((s) => s.setMobileOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[250px] border-border bg-surface p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
