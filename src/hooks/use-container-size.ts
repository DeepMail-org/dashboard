"use client";

import { useCallback, useRef, useState } from "react";

interface Size {
  width: number;
  height: number;
}

export function useContainerSize(): [React.RefCallback<HTMLElement>, Size] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((prev) => {
        if (prev.width === Math.round(width) && prev.height === Math.round(height)) return prev;
        return { width: Math.round(width), height: Math.round(height) };
      });
    });

    observer.observe(node);
    observerRef.current = observer;
  }, []);

  return [ref, size];
}
