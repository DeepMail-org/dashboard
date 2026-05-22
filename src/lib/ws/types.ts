export type WsConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

export interface WsMessage<T = unknown> {
  channel: string;
  event: string;
  data: T;
  timestamp: string;
}
