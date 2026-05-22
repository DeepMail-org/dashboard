"use client";

import { useSyncExternalStore } from "react";
import type { Breakpoint } from "@/lib/dashboard/types";
import { BREAKPOINTS } from "@/lib/dashboard/breakpoints";

function getBreakpoint(): Breakpoint {
  if (typeof window === "undefined") return "lg";
  const w = window.innerWidth;
  if (w >= BREAKPOINTS.lg) return "lg";
  if (w >= BREAKPOINTS.md) return "md";
  if (w >= BREAKPOINTS.sm) return "sm";
  return "xs";
}

let currentBreakpoint: Breakpoint = "lg";
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  currentBreakpoint = getBreakpoint();
  window.addEventListener("resize", () => {
    const next = getBreakpoint();
    if (next !== currentBreakpoint) {
      currentBreakpoint = next;
      for (const fn of listeners) fn();
    }
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentBreakpoint;
}

function getServerSnapshot(): Breakpoint {
  return "lg";
}

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
