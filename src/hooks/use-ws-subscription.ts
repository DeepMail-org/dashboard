"use client";

import { useEffect, useRef, useCallback } from "react";
import { wsManager } from "@/lib/ws/ws-manager";

export function useWsSubscription(
  channel: string | null,
  onMessage: (data: unknown) => void,
): void {
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  const stableHandler = useCallback((data: unknown) => {
    handlerRef.current(data);
  }, []);

  useEffect(() => {
    if (!channel) return;
    return wsManager.subscribe(channel, stableHandler);
  }, [channel, stableHandler]);
}
