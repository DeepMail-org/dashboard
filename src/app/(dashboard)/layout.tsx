"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [token, router]);

  // Don't render dashboard until auth is confirmed
  if (!checked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <AppShell>
      {children}
      <CommandPalette />
    </AppShell>
  );
}
