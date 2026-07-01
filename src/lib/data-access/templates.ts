import type { BreakpointLayouts } from "@/lib/dashboard/types";

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  isLocked: boolean;
  widgets: string[];
  layouts: BreakpointLayouts;
  createdAt: string;
  updatedAt: string;
}

export interface SaveCustomTemplatePayload {
  id?: string; // if provided, update; else create
  name: string;
  description?: string;
  widgets: string[];
  layouts: BreakpointLayouts;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function saveCustomTemplate(
  payload: SaveCustomTemplatePayload,
): Promise<DashboardTemplate> {
  await sleep(400);
  return {
    id: payload.id ?? `custom-${Date.now()}`,
    name: payload.name,
    description: payload.description ?? "",
    isDefault: false,
    isLocked: false,
    widgets: payload.widgets,
    layouts: payload.layouts,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteCustomTemplate(id: string): Promise<void> {
  await sleep(200);
  void id;
}
