import type { WsConnectionState, WsMessage } from "./types";

type ChannelHandler = (data: unknown) => void;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws";
const HEARTBEAT_INTERVAL = 30_000;
const RECONNECT_BASE = 1_000;
const RECONNECT_MAX = 30_000;

class WsManager {
  private ws: WebSocket | null = null;
  private subscriptions = new Map<string, Set<ChannelHandler>>();
  private state: WsConnectionState = "disconnected";
  private stateListeners = new Set<(state: WsConnectionState) => void>();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;
  private pendingBuffer: WsMessage[] = [];
  private isDestroyed = false;

  getState(): WsConnectionState {
    return this.state;
  }

  onStateChange(listener: (state: WsConnectionState) => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  subscribe(channel: string, handler: ChannelHandler): () => void {
    if (this.isDestroyed) {
      return () => {};
    }

    let handlers = this.subscriptions.get(channel);
    if (!handlers) {
      handlers = new Set();
      this.subscriptions.set(channel, handlers);
    }
    handlers.add(handler);

    if (this.state === "disconnected") {
      this.connect();
    }

    return () => {
      handlers!.delete(handler);
      if (handlers!.size === 0) {
        this.subscriptions.delete(channel);
      }
      if (this.subscriptions.size === 0) {
        this.disconnect();
      }
    };
  }

  private connect(): void {
    if (typeof window === "undefined") return;
    if (this.ws) return;
    if (this.isDestroyed) return;

    this.setState("connecting");

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        if (this.isDestroyed) return;
        this.setState("connected");
        this.reconnectAttempt = 0;
        this.startHeartbeat();
        this.flushBuffer();
        for (const channel of this.subscriptions.keys()) {
          this.send({ type: "subscribe", channel });
        }
      };

      this.ws.onmessage = (event) => {
        if (this.isDestroyed) return;
        try {
          const msg = JSON.parse(event.data) as WsMessage;
          if (msg.channel === "pong") return;
          this.dispatch(msg);
        } catch {
          // ignore malformed messages
        }
      };

      this.ws.onclose = () => {
        if (this.isDestroyed) return;
        this.cleanup();
        if (this.subscriptions.size > 0) {
          this.scheduleReconnect();
        } else {
          this.setState("disconnected");
        }
      };

      this.ws.onerror = () => {
        if (this.isDestroyed) return;
        this.ws?.close();
      };
    } catch {
      if (this.isDestroyed) return;
      this.cleanup();
      this.scheduleReconnect();
    }
  }

  private disconnect(): void {
    this.cleanup();
    this.ws?.close();
    this.ws = null;
    this.setState("disconnected");
  }

  destroy(): void {
    this.isDestroyed = true;
    this.cleanup();
    this.ws?.close();
    this.ws = null;
    this.subscriptions.clear();
    this.stateListeners.clear();
    this.setState("disconnected");
  }

  private dispatch(msg: WsMessage): void {
    const handlers = this.subscriptions.get(msg.channel);
    if (!handlers) return;
    queueMicrotask(() => {
      for (const fn of handlers) fn(msg.data);
    });
  }

  private send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private flushBuffer(): void {
    for (const msg of this.pendingBuffer) {
      this.send(msg);
    }
    this.pendingBuffer = [];
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.isDestroyed) {
        this.stopHeartbeat();
        return;
      }
      this.send({ type: "ping" });
    }, HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    if (this.isDestroyed) return;
    this.setState("reconnecting");
    const delay = Math.min(
      RECONNECT_BASE * Math.pow(2, this.reconnectAttempt),
      RECONNECT_MAX,
    );
    this.reconnectAttempt++;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.isDestroyed) {
        this.connect();
      }
    }, delay);
  }

  private cleanup(): void {
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws = null;
  }

  private setState(state: WsConnectionState): void {
    this.state = state;
    for (const fn of this.stateListeners) fn(state);
  }
}

export const wsManager = new WsManager();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    wsManager.destroy();
  });
}