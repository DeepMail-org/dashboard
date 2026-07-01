import type { ComponentType } from "react";

export type WidgetCategory =
  | "core"
  | "intelligence"
  | "operational"
  | "sandbox"
  | "platform";

export type Breakpoint = "lg" | "md" | "sm" | "xs";

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

export type BreakpointLayouts = Record<Breakpoint, LayoutItem[]>;

export interface WidgetSizeConstraints {
  default: { w: number; h: number };
  min: { w: number; h: number };
  max: { w: number; h: number };
}

interface RestDataSource {
  type: "rest";
  endpoint: string;
  pollInterval: number;
  staleTime?: number;
}

interface WebSocketDataSource {
  type: "websocket";
  channel: string;
  initialFetchEndpoint?: string;
}

interface StaticDataSource {
  type: "static";
}

export type DataSourceConfig =
  | RestDataSource
  | WebSocketDataSource
  | StaticDataSource;

export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: WidgetCategory;
  size: WidgetSizeConstraints;
  dataSource: DataSourceConfig;
  loader: () => Promise<{ default: ComponentType<WidgetProps> }>;
  isDefault: boolean;
  tags: string[];
}

export interface WidgetProps {
  widgetId: string;
  data: unknown;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  containerWidth: number;
  containerHeight: number;
}

