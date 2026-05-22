import { AppShell } from "@/components/layout/app-shell";
import { CommandPalette } from "@/components/dashboard/command-palette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      {children}
      <CommandPalette />
    </AppShell>
  );
}
