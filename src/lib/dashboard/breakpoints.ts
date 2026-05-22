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

    items.push({
      i: widgetId,
      x: 0,
      y: maxY,
      w,
      h: size.default.h,
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
