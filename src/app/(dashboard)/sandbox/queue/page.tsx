"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { SandboxTaskTable } from "@/components/ui/sandbox-task-table";

export default function SandboxQueuePage() {
  return (
    <PageWrapper noPadding>
      <SandboxTaskTable className="flex-1 min-h-0" />
    </PageWrapper>
  );
}
