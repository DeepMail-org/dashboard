import type { Breakpoint, BreakpointLayouts, LayoutItem, WidgetSizeConstraints } from "./types";

export const BREAKPOINTS: Record<Breakpoint, number> = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
};

export const COLS: Record<Breakpoint, number> = {
  lg: 12,
  md: 8,
  sm: 4,
  xs: 2,
};

export const ROW_HEIGHT = 120;
export const MARGIN: [number, number] = [16, 16];

export function generateLayoutForAllBreakpoints(
  widgetId: string,
  size: WidgetSizeConstraints,
  existingLayouts: BreakpointLayouts,
): BreakpointLayouts {
  const result = { ...existingLayouts };

  for (const bp of Object.keys(COLS) as Breakpoint[]) {
    const cols = COLS[bp];
    const items = result[bp] ? [...result[bp]] : [];
    const maxY = items.reduce((max, item) => Math.max(max, item.y + item.h), 0);

    const w = Math.min(size.default.w, cols);
    const minW = Math.min(size.min.w, cols);
    const maxW = Math.min(size.max.w, cols);
    const h = size.default.h;

    let targetX = 0;
    let targetY = 0;
    let found = false;
    for (let y = 0; y <= Math.max(0, maxY); y++) {
      for (let x = 0; x <= cols - w; x++) {
        const overlaps = items.some(item => 
          x < item.x + item.w && x + w > item.x &&
          y < item.y + item.h && y + h > item.y
        );
        if (!overlaps) {
          targetX = x;
          targetY = y;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!found) {
      targetX = 0;
      targetY = maxY;
    }

    items.push({
      i: widgetId,
      x: targetX,
      y: targetY,
      w,
      h,
      minW,
      minH: size.min.h,
      maxW,
      maxH: size.max.h,
    });

    result[bp] = items;
  }

  return result;
}

export function removeFromAllBreakpoints(
  widgetId: string,
  layouts: BreakpointLayouts,
): BreakpointLayouts {
  const result = {} as BreakpointLayouts;
  for (const bp of Object.keys(layouts) as Breakpoint[]) {
    result[bp] = layouts[bp].filter((item) => item.i !== widgetId);
  }
  return result;
}
