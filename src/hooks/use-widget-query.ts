"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { apiFetch } from "@/lib/api/client";
import { useWsSubscription } from "./use-ws-subscription";
import type { DataSourceConfig } from "@/lib/dashboard/types";

interface WidgetQueryResult {
  data: unknown;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useWidgetQuery(
  widgetId: string,
  dataSource: DataSourceConfig,
): WidgetQueryResult {
  const queryClient = useQueryClient();

  const isRest = dataSource.type === "rest";
  const isWs = dataSource.type === "websocket";

  const restEndpoint = isRest ? dataSource.endpoint : null;
  const pollInterval = isRest ? dataSource.pollInterval : undefined;
  const staleTime = isRest ? dataSource.staleTime : undefined;

  const wsChannel = isWs ? dataSource.channel : null;
  const initialEndpoint = isWs ? dataSource.initialFetchEndpoint : null;

  const queryKey = isRest
    ? ["widgets", "rest", restEndpoint]
    : ["widgets", "ws", wsChannel];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const endpoint = restEndpoint ?? initialEndpoint;
      if (!endpoint) return null;
      return apiFetch(endpoint);
    },
    refetchInterval: pollInterval,
    staleTime: staleTime ?? (isRest ? 30_000 : Infinity),
    enabled: isRest || !!initialEndpoint,
    retry: 2,
  });

  const handleWsMessage = useCallback(
    (wsData: unknown) => {
      queryClient.setQueryData(queryKey, wsData);
    },
    [queryClient, ...queryKey],
  );

  useWsSubscription(wsChannel, handleWsMessage);

  return {
    data: data ?? null,
    isLoading: isWs ? (data === undefined && !initialEndpoint) ? false : isLoading : isLoading,
    error: error as Error | null,
    refetch,
  };
}
